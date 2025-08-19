const { parseMultipartFormData } = require('@netlify/functions');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  // Parse multipart form data
  const formData = await parseMultipartFormData(event);
  const file = formData.resume;

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No file uploaded" })
    };
  }

  // Example: Just return file info
  const fileInfo = {
    name: file.filename,
    type: file.contentType,
    size: file.data.length,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, file: fileInfo }),
    headers: { "Content-Type": "application/json" }
  };
};