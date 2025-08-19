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
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid form data', details: parsed.error.flatten() })
      };
    }

    // Save to database, handle file as needed
    const created = await prisma.application.create({
      data: {
        name,
        age: age ?? null,
        email,
        school,
        url_links,
        // You may need to store resume metadata or upload to storage
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: created.id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unhandled error', details: err.message, stack: err.stack })
    };
  }
};