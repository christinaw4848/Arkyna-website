const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('./shared/validators');
const { parseMultipartFormData } = require('@netlify/functions');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // Parse multipart form data using Netlify's utility
    const formData = await parseMultipartFormData(event);

    // Extract fields and file
    const { name, age, email, school, url_links, resume } = formData;

    // Validate fields (adjust as needed for file handling)
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
    if (resume && resume.data) {
      resumeBytes = resume.data;
      resumeFilename = resume.filename || null;
      resumeMimetype = resume.contentType || null;
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