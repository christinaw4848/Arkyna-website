
const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const Busboy = require('busboy');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // Parse multipart form data using busboy
    const buffer = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body);
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (!contentType) {
      console.error('Missing content-type header:', event.headers);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing content-type header' })
      };
    }

    const fields = {};
    let resumeBytes = null, resumeFilename = null, resumeMimetype = null;

    // Busboy expects a stream
    const stream = require('stream');
    const reqStream = new stream.PassThrough();
    reqStream.end(buffer);

    await new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: { 'content-type': contentType } });
      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (fieldname === 'resume') {
          const chunks = [];
          file.on('data', chunk => chunks.push(chunk));
          file.on('end', () => {
            resumeBytes = Buffer.concat(chunks);
            resumeFilename = filename;
            resumeMimetype = mimetype;
          });
        } else {
          file.resume();
        }
      });
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      reqStream.pipe(busboy);
    });

    // Extract fields
  const name = fields.name || '';
  const email = fields.email || '';
  const school = fields.school || '';
    const urlLinks = fields.url_links
      ? Array.isArray(fields.url_links)
        ? fields.url_links
        : fields.url_links.split(',').map(x => x.trim()).filter(Boolean)
      : [];

    // Validate fields
  const parsed = applicationSchema.safeParse({ name, email, school, urlLinks });
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
          email,
          school,
          urlLinks,
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