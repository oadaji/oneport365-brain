import { isConnected, getInvoices, getBills, getProfitAndLoss, getBalanceSheet, getCustomers, getVendors } from "@/lib/quickbooks";

export async function GET(req: Request) {
  if (!isConnected()) {
    return Response.json({ connected: false, error: "QuickBooks not connected. Visit /api/quickbooks/connect to authorize." });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "summary";

  try {
    switch (type) {
      case "invoices":
        return Response.json({ connected: true, data: await getInvoices({ limit: 20 }) });
      case "invoices-overdue":
        return Response.json({ connected: true, data: await getInvoices({ overdue: true }) });
      case "bills":
        return Response.json({ connected: true, data: await getBills({ limit: 20 }) });
      case "bills-overdue":
        return Response.json({ connected: true, data: await getBills({ overdue: true }) });
      case "pnl": {
        const start = url.searchParams.get("start") || new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
        const end = url.searchParams.get("end") || new Date().toISOString().split("T")[0];
        return Response.json({ connected: true, data: await getProfitAndLoss(start, end) });
      }
      case "balance-sheet":
        return Response.json({ connected: true, data: await getBalanceSheet() });
      case "customers":
        return Response.json({ connected: true, data: await getCustomers() });
      case "vendors":
        return Response.json({ connected: true, data: await getVendors() });
      case "summary":
      default: {
        const [invoices, overdueInvoices, bills, overdueBills] = await Promise.all([
          getInvoices({ limit: 10 }),
          getInvoices({ overdue: true }),
          getBills({ limit: 10 }),
          getBills({ overdue: true }),
        ]);
        return Response.json({
          connected: true,
          data: { invoices, overdueInvoices, bills, overdueBills },
        });
      }
    }
  } catch (err: any) {
    return Response.json({ connected: true, error: err.message }, { status: 500 });
  }
}
