
const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const parseMultipart = require('parse-multipart');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // Parse multipart form data using parse-multipart
  const buffer = Buffer.from(event.body, 'base64');
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];
  console.log('Received content-type:', contentType);
  console.log('First 100 bytes of body:', buffer.slice(0, 100).toString('hex'));
    if (!contentType) {
      console.error('Missing content-type header:', event.headers);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing content-type header' })
      };
    }
    let boundary;
    try {
      boundary = parseMultipart.getBoundary(contentType);
    } catch (bErr) {
      console.error('Error extracting boundary from content-type:', contentType, bErr);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid content-type header', details: bErr.message })
      };
    }
    let parts;
    try {
      parts = parseMultipart.Parse(buffer, boundary);
    } catch (pErr) {
      console.error('Error parsing multipart form data:', pErr);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Malformed multipart form data', details: pErr.message })
      };
    }

    // Log parsed parts for debugging
    console.log('Parsed parts:', JSON.stringify(parts));

    // Extract fields and file
    let name = '', age = '', email = '', school = '', url_links = '';
    let resumeBytes = null, resumeFilename = null, resumeMimetype = null;
    for (const part of parts) {
      if (part.filename) {
        resumeBytes = part.data;
        resumeFilename = part.filename;
        resumeMimetype = part.type;
      } else {
        if (part.name === 'name') name = part.data.toString();
        if (part.name === 'age') age = part.data.toString();
        if (part.name === 'email') email = part.data.toString();
        if (part.name === 'school') school = part.data.toString();
        if (part.name === 'url_links') url_links = part.data.toString();
      }
    }

    // Validate fields
    const parsed = applicationSchema.safeParse({ name, age, email, school, url_links });
    if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten());
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid form data', details: parsed.error.flatten() })
      };
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