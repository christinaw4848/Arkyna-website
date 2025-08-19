
const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const multiparty = require('multiparty');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // Parse multipart form data using multiparty
    const form = new multiparty.Form();
    const buffer = Buffer.from(event.body, 'base64');
    // multiparty expects a stream, so we create one from the buffer
    const stream = require('stream');
    const reqStream = new stream.PassThrough();
    reqStream.end(buffer);
    // Build a fake req object for multiparty
    const fakeReq = {
      headers: event.headers,
      method: event.httpMethod,
      pipe: reqStream.pipe.bind(reqStream),
      on: reqStream.on.bind(reqStream),
    };

    // Parse the form
    const formData = await new Promise((resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // Extract fields and file
    const name = formData.fields.name?.[0] || '';
    const age = formData.fields.age?.[0] || '';
    const email = formData.fields.email?.[0] || '';
    const school = formData.fields.school?.[0] || '';
    const url_links = formData.fields.url_links?.[0] || '';
    const resumeFile = formData.files.resume?.[0];

    // Validate fields
    const parsed = applicationSchema.safeParse({ name, age, email, school, url_links });
    if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten());
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid form data', details: parsed.error.flatten() })
      };
    }

    // Save to database, including resume file if present
    let resumeBytes = null, resumeFilename = null, resumeMimetype = null;
    if (resumeFile) {
      resumeBytes = resumeFile.buffer;
      resumeFilename = resumeFile.originalFilename || null;
      resumeMimetype = resumeFile.headers['content-type'] || null;
    }

    const created = await prisma.application.create({
      data: {
        name,
        age: age ?? null,
        email,
        school,
        url_links,
        resumeBytes,
        resumeFilename,
        resumeMimetype,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: created.id })
    };
  } catch (err) {
    console.error('Netlify applications error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unhandled error', details: err.message, stack: err.stack })
    };
  }
};