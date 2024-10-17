export async function POST(req: Request) {
  try {
    const notification = await req.json();
    console.log("Webhook received:", notification);

    return new Response("Notification received", { status: 200 });
  } catch (error) {
    console.error("Error processing notification:", error);

    return new Response("Error processing notification", { status: 500 });
  }
}
