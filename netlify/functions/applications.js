const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const formidable = require('formidable');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  try {
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
        form.parse({ headers: event.headers, body: event.body }, (err, fields, f) => {
          if (err) return reject(err);
          data = fields;
          files = f;
          resolve();
        });
      });
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid form data', details: e.message, stack: e.stack })
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
          url_links,
        },
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ id: created.id })
      };
    } catch (dbErr) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database error', details: dbErr.message, stack: dbErr.stack })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unhandled error', details: err.message, stack: err.stack })
    };
  }
};