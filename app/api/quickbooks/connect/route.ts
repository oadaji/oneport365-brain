export async function GET() {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || "https://oneport365-brain.vercel.app/api/quickbooks/callback";

  if (!clientId) {
    return new Response("QUICKBOOKS_CLIENT_ID not configured", { status: 500 });
  }

  const authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=com.intuit.quickbooks.accounting` +
    `&state=oneport365`;

  return Response.redirect(authUrl);
}
