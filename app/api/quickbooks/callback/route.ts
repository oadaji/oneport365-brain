import { setTokens } from "@/lib/quickbooks";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const realmId = url.searchParams.get("realmId");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
  const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || "https://oneport365-brain.vercel.app/api/quickbooks/callback";

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenResp = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
  });

  if (!tokenResp.ok) {
    const err = await tokenResp.text();
    return new Response(`Token exchange failed: ${err}`, { status: 500 });
  }

  const data = await tokenResp.json();
  setTokens(data.access_token, data.refresh_token, data.expires_in);

  // Store realmId if different from env
  if (realmId) {
    console.log(`QuickBooks connected. Realm ID: ${realmId}`);
  }

  // Redirect back to the app
  return Response.redirect(new URL("/", req.url).origin + "/?qb=connected");
}
