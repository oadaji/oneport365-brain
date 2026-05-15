import Anthropic from "@anthropic-ai/sdk";
import { isConnected, getInvoices, getBills, getCustomers, getVendors } from "@/lib/quickbooks";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FINANCE_KEYWORDS = ["invoice", "bill", "payment", "overdue", "payable", "receivable", "revenue", "cash flow", "balance", "profit", "loss", "vendor", "customer list", "accounts", "quickbooks", "qb", "financial", "expense", "income"];

function isFinanceQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  return FINANCE_KEYWORDS.some((kw) => lower.includes(kw));
}

async function getQuickBooksContext(): Promise<string> {
  if (!isConnected()) {
    return "\n\n[QuickBooks is not connected. To connect, the user should visit /api/quickbooks/connect. For now, use the demo financial data below.]\n\n";
  }

  try {
    const [invoices, overdueInvoices, bills, overdueBills, customers, vendors] = await Promise.all([
      getInvoices({ limit: 10 }),
      getInvoices({ overdue: true }),
      getBills({ limit: 10 }),
      getBills({ overdue: true }),
      getCustomers(20),
      getVendors(20),
    ]);

    const invoiceList = invoices?.QueryResponse?.Invoice || [];
    const overdueList = overdueInvoices?.QueryResponse?.Invoice || [];
    const billList = bills?.QueryResponse?.Bill || [];
    const overdueBillList = overdueBills?.QueryResponse?.Bill || [];
    const customerList = customers?.QueryResponse?.Customer || [];
    const vendorList = vendors?.QueryResponse?.Vendor || [];

    let context = "\n\n## LIVE QUICKBOOKS DATA\n\n";

    // Invoices (Accounts Receivable)
    if (invoiceList.length) {
      context += "### Recent Invoices (AR)\n| Customer | Invoice # | Amount | Due Date | Balance | Status |\n|---|---|---|---|---|---|\n";
      invoiceList.forEach((inv: any) => {
        const status = inv.Balance > 0 ? (new Date(inv.DueDate) < new Date() ? "Overdue" : "Open") : "Paid";
        context += `| ${inv.CustomerRef?.name || "—"} | ${inv.DocNumber || "—"} | $${inv.TotalAmt?.toLocaleString() || "0"} | ${inv.DueDate || "—"} | $${inv.Balance?.toLocaleString() || "0"} | ${status} |\n`;
      });
      const totalAR = invoiceList.reduce((s: number, i: any) => s + (i.Balance || 0), 0);
      const totalOverdueAR = overdueList.reduce((s: number, i: any) => s + (i.Balance || 0), 0);
      context += `\n**Total AR Outstanding: $${totalAR.toLocaleString()}**\n`;
      context += `**Overdue AR: $${totalOverdueAR.toLocaleString()} (${overdueList.length} invoices)**\n\n`;
    }

    // Bills (Accounts Payable)
    if (billList.length) {
      context += "### Recent Bills (AP)\n| Vendor | Bill # | Amount | Due Date | Balance | Status |\n|---|---|---|---|---|---|\n";
      billList.forEach((bill: any) => {
        const status = bill.Balance > 0 ? (new Date(bill.DueDate) < new Date() ? "Overdue" : "Open") : "Paid";
        context += `| ${bill.VendorRef?.name || "—"} | ${bill.DocNumber || "—"} | $${bill.TotalAmt?.toLocaleString() || "0"} | ${bill.DueDate || "—"} | $${bill.Balance?.toLocaleString() || "0"} | ${status} |\n`;
      });
      const totalAP = billList.reduce((s: number, b: any) => s + (b.Balance || 0), 0);
      const totalOverdueAP = overdueBillList.reduce((s: number, b: any) => s + (b.Balance || 0), 0);
      context += `\n**Total AP Outstanding: $${totalAP.toLocaleString()}**\n`;
      context += `**Overdue AP: $${totalOverdueAP.toLocaleString()} (${overdueBillList.length} bills)**\n\n`;
    }

    // Customers
    if (customerList.length) {
      context += `### Customers (${customerList.length})\n`;
      customerList.slice(0, 10).forEach((c: any) => {
        context += `- ${c.DisplayName} (Balance: $${c.Balance?.toLocaleString() || "0"})\n`;
      });
      context += "\n";
    }

    // Vendors
    if (vendorList.length) {
      context += `### Vendors (${vendorList.length})\n`;
      vendorList.slice(0, 10).forEach((v: any) => {
        context += `- ${v.DisplayName} (Balance: $${v.Balance?.toLocaleString() || "0"})\n`;
      });
      context += "\n";
    }

    return context;
  } catch (err: any) {
    return `\n\n[QuickBooks data fetch error: ${err.message}]\n\n`;
  }
}

const BASE_SYSTEM_PROMPT = `You are OnePort 365 Brain, an intelligent AI assistant for OnePort 365 — a Nigerian freight forwarding and logistics company. You specialise in ocean freight (FCL, LCL), air freight, customs clearance, freight rates, RFQs, Nigeria import/export regulations, ports (Apapa, Tin Can, Lagos), Incoterms, HS codes, and cargo classification. Be concise and professional. Always frame answers in the context of Nigerian logistics.

When presenting financial data, always use markdown tables. Present the data clearly with tables and formatting.`;

// Demo financial data used when QuickBooks is not connected
const DEMO_FINANCIAL_DATA = `
## Demo Financial Data (QuickBooks not connected)

### Accounts Payable — Top 10 Outstanding
| Vendor | Invoice # | Amount (USD) | Due Date | Status |
|--------|-----------|-------------|----------|--------|
| MSC Mediterranean | INV-MSC-4821 | $45,200 | 2026-05-18 | Overdue |
| Maersk Line | INV-MAE-1193 | $38,750 | 2026-05-22 | Due Soon |
| CMA CGM | INV-CMA-7744 | $32,100 | 2026-05-15 | Overdue |
| Hapag-Lloyd | INV-HAP-2281 | $28,400 | 2026-06-01 | Open |
| APM Terminals Apapa | INV-APM-0093 | $22,600 | 2026-05-20 | Due Soon |

**Total AP Outstanding: $239,000**

### Accounts Receivable — Top Overdue
| Customer | Invoice # | Amount (USD) | Days Overdue |
|----------|-----------|-------------|-------------|
| Dangote Industries | INV-2026-0341 | $67,500 | 12 days |
| BUA Cement | INV-2026-0298 | $43,200 | 8 days |
| Flour Mills Nigeria | INV-2026-0315 | $31,800 | 15 days |

**Total AR Overdue: $186,000**

### Cash Flow Summary
- Cash on hand: $312,400
- Expected inflows (30 days): $186,000
- Expected outflows (30 days): $148,900
- Projected balance: $349,500`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if the latest message is about finance
    const lastMessage = messages[messages.length - 1]?.content || "";
    let systemPrompt = BASE_SYSTEM_PROMPT;

    if (isFinanceQuestion(lastMessage)) {
      if (isConnected()) {
        const qbData = await getQuickBooksContext();
        systemPrompt += qbData;
      } else {
        systemPrompt += DEMO_FINANCIAL_DATA;
      }
    }

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
