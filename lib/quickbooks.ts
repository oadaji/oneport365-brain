// QuickBooks API helper — uses OAuth2 tokens stored in memory
// In production, store tokens in a database

let tokens: {
  access_token: string;
  refresh_token: string;
  expires_at: number;
} | null = null;

const QB_BASE = "https://sandbox-quickbooks.api.intuit.com"; // Change to https://quickbooks.api.intuit.com for production
const COMPANY_ID = process.env.QUICKBOOKS_COMPANY_ID || "";

export function setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
  tokens = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Date.now() + expiresIn * 1000,
  };
}

export function getTokens() {
  return tokens;
}

export function isConnected(): boolean {
  return tokens !== null && tokens.expires_at > Date.now();
}

async function refreshAccessToken(): Promise<void> {
  if (!tokens?.refresh_token) throw new Error("No refresh token available");

  const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const resp = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: `grant_type=refresh_token&refresh_token=${tokens.refresh_token}`,
  });

  if (!resp.ok) throw new Error(`Token refresh failed: ${resp.status}`);

  const data = await resp.json();
  setTokens(data.access_token, data.refresh_token, data.expires_in);
}

async function getAccessToken(): Promise<string> {
  if (!tokens) throw new Error("QuickBooks not connected. Visit /api/quickbooks/connect first.");
  if (tokens.expires_at < Date.now() + 60000) {
    await refreshAccessToken();
  }
  return tokens!.access_token;
}

export async function qbQuery(query: string): Promise<any> {
  const token = await getAccessToken();
  const url = `${QB_BASE}/v3/company/${COMPANY_ID}/query?query=${encodeURIComponent(query)}&minorversion=65`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`QuickBooks query failed (${resp.status}): ${err}`);
  }

  return resp.json();
}

export async function qbGet(endpoint: string): Promise<any> {
  const token = await getAccessToken();
  const url = `${QB_BASE}/v3/company/${COMPANY_ID}/${endpoint}?minorversion=65`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`QuickBooks GET failed (${resp.status}): ${err}`);
  }

  return resp.json();
}

// Pre-built queries for common financial data
export async function getInvoices(options?: { overdue?: boolean; limit?: number }): Promise<any> {
  let query = "SELECT * FROM Invoice";
  if (options?.overdue) {
    const today = new Date().toISOString().split("T")[0];
    query += ` WHERE DueDate < '${today}' AND Balance > '0'`;
  }
  query += ` ORDERBY MetaData.CreateTime DESC MAXRESULTS ${options?.limit || 20}`;
  return qbQuery(query);
}

export async function getBills(options?: { overdue?: boolean; limit?: number }): Promise<any> {
  let query = "SELECT * FROM Bill";
  if (options?.overdue) {
    const today = new Date().toISOString().split("T")[0];
    query += ` WHERE DueDate < '${today}' AND Balance > '0'`;
  }
  query += ` ORDERBY MetaData.CreateTime DESC MAXRESULTS ${options?.limit || 20}`;
  return qbQuery(query);
}

export async function getProfitAndLoss(startDate: string, endDate: string): Promise<any> {
  return qbGet(`reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}`);
}

export async function getBalanceSheet(): Promise<any> {
  return qbGet("reports/BalanceSheet");
}

export async function getCustomers(limit: number = 50): Promise<any> {
  return qbQuery(`SELECT * FROM Customer MAXRESULTS ${limit}`);
}

export async function getVendors(limit: number = 50): Promise<any> {
  return qbQuery(`SELECT * FROM Vendor MAXRESULTS ${limit}`);
}

export async function getAccounts(): Promise<any> {
  return qbQuery("SELECT * FROM Account MAXRESULTS 100");
}
