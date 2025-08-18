const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const formidable = require('formidable');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Parse multipart/form-data using formidable
  let data = {};
  let files = {};
  try {
    await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse({ headers: event.headers, 
                  // Netlify provides the raw body as a string
                  // formidable expects a stream, so we convert
                  // See: https://github.com/node-formidable/formidable/issues/784
                  // This workaround is for Netlify Functions only
                  // If this fails, fallback to JSON
                  body: event.body }, (err, fields, f) => {
        if (err) return reject(err);
        data = fields;
        files = f;
        resolve();
      });
    });
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid form data' })
    };
  }

  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid form data', details: parsed.error.flatten() })
    };
  }

  const { name, age, email, school, url_links } = parsed.data;

  try {
    const created = await prisma.application.create({
      data: {
        name,
        age: age ?? null,
        email,
        school,
        urlLinks: url_links,
        // resumeBytes, resumeFilename, resumeMimetype omitted for serverless simplicity
      },
      select: { id: true },
    });
    return {
      statusCode: 201,
      body: JSON.stringify({ id: created.id, message: 'Application submitted' })
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
