// Netlify Edge Function: File Upload Example
export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get("resume"); // 'resume' is the field name from your frontend

  if (!file || typeof file === "string") {
    return new Response("No file uploaded", { status: 400 });
  }

  // Example: Save file to a third-party storage or process it
  // For demonstration, just return file info
  const fileInfo = {
    name: file.name,
    type: file.type,
    size: file.size,
  };

  return new Response(JSON.stringify({ success: true, file: fileInfo }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
