export async function GET() {
  return Response.json({
    status: "ok",
    service: "discourse-middleware",
    timestamp: new Date().toISOString()
  });
}
