const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// In browser, go to following link (replace 123 with the id of the application): /.netlify/functions/applications-resume?id=123



exports.handler = async function(event, context) {
  // Accept ?id=123 as query param
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return {
      statusCode: 400,
      body: 'Missing id parameter',
    };
  }
  const row = await prisma.application.findUnique({ where: { id: Number(id) } });
  if (!row || !row.resumeBytes) {
    return {
      statusCode: 404,
      body: 'Not found',
    };
  }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': row.resumeMimetype || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${row.resumeFilename || 'resume'}"`,
    },
    body: Buffer.from(row.resumeBytes).toString('base64'),
    isBase64Encoded: true,
  };
};
