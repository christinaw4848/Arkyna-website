

const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const Busboy = require('busboy');
const nodemailer = require('nodemailer');

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
  let resumeBytes = null, resumeFilename = null, resumeMimetype = null, resumeEncoding = null;

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
              // Ensure only strings are assigned, never an object
              resumeFilename = typeof filename === 'string' ? filename : (filename && filename.filename ? filename.filename : null);
              resumeMimetype = typeof mimetype === 'string' ? mimetype : null;
              resumeEncoding = typeof encoding === 'string' ? encoding : null;
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
          resumeEncoding,
        },
      });
    } catch (prismaErr) {
      console.error('Prisma create error:', prismaErr);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database error', details: prismaErr.message })
      };
    }

    // Send notification email after successful insert
    try {
      const userEmail = 'christinaw4848@gmail.com';
      const appPassword = process.env.GMAIL_APP_PASSWORD;
      if (!appPassword) {
        throw new Error('GMAIL_APP_PASSWORD environment variable not set.');
      }
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: userEmail,
          pass: appPassword,
        },
      });
      const subject = 'New Application Submitted';
      const text = `A new application was submitted on the Arkyna site. Here's a preview:\n\nName: ${name}\nEmail: ${email}\nSchool: ${school}\n\nCheck Neon for more details.`;
      await transporter.sendMail({
        from: userEmail,
        to: userEmail,
        subject,
        text,
      });
    } catch (mailErr) {
      console.error('Email notification error:', mailErr);
      // Optionally, you can return a warning but not fail the request
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