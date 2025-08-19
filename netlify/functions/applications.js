
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

    // Parse multipart form data using formidable
    const buffer = Buffer.from(event.body, 'base64');
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const form = formidable({ multiples: false });

    // formidable expects a stream, so create one from the buffer
    const stream = require('stream');
    const reqStream = new stream.PassThrough();
    reqStream.end(buffer);
    reqStream.headers = { 'content-type': contentType };

    const formData = await new Promise((resolve, reject) => {
      form.parse(reqStream, (err, fields, files) => {
        if (err) {
          console.error('Formidable parse error:', err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    // Log parsed form data for debugging
    console.log('Parsed formData:', JSON.stringify(formData));

    // Extract fields and file
    const name = formData.fields.name || '';
    const age = formData.fields.age || '';
    const email = formData.fields.email || '';
    const school = formData.fields.school || '';
    const url_links = formData.fields.url_links || '';
    const resumeFile = formData.files.resume;

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
    if (resumeFile && resumeFile.filepath) {
      const fs = require('fs');
      try {
        resumeBytes = fs.readFileSync(resumeFile.filepath);
      } catch (fileErr) {
        console.error('Error reading resume file:', fileErr);
      }
      resumeFilename = resumeFile.originalFilename || null;
      resumeMimetype = resumeFile.mimetype || null;
    }

    let created;
    try {
      created = await prisma.application.create({
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
    } catch (prismaErr) {
      console.error('Prisma create error:', prismaErr);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database error', details: prismaErr.message })
      };
    }

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