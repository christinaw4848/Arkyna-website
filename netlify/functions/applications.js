const { PrismaClient } = require('@prisma/client');
const { applicationSchema } = require('../../shared/validators');

const prisma = new PrismaClient();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Parse form data (assume JSON for serverless simplicity)
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
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
