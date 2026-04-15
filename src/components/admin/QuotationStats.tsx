import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Quotation {
  id: string;
  quote_number: string;
  client_name: string;
  project_name: string;
  total_amount: number;
  status: string;
  quotation_date: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  approved: "#22c55e",
  rejected: "#ef4444",
  completed: "#10b981",
};

const QuotationStats = ({ quotations }: { quotations: Quotation[] }) => {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

  const totalSent = quotations.filter(q => q.status !== "draft").length;
  const totalApproved = quotations.filter(q => ["approved", "completed"].includes(q.status)).length;
  const totalRejected = quotations.filter(q => q.status === "rejected").length;
  const totalValue = quotations.reduce((s, q) => s + Number(q.total_amount), 0);
  const approvedValue = quotations
    .filter(q => ["approved", "completed"].includes(q.status))
    .reduce((s, q) => s + Number(q.total_amount), 0);
  const conversionRate = totalSent > 0 ? ((totalApproved / totalSent) * 100).toFixed(1) : "0";

  const statusData = Object.entries(
    quotations.reduce((acc, q) => { acc[q.status] = (acc[q.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const valueByStatus = Object.entries(
    quotations.reduce((acc, q) => { acc[q.status] = (acc[q.status] || 0) + Number(q.total_amount); return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const monthlyData = Object.entries(
    quotations.reduce((acc, q) => {
      const month = new Date(q.quotation_date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!acc[month]) acc[month] = { sent: 0, approved: 0 };
      if (q.status !== "draft") acc[month].sent++;
      if (["approved", "completed"].includes(q.status)) acc[month].approved++;
      return acc;
    }, {} as Record<string, { sent: number; approved: number }>)
  ).map(([month, data]) => ({ month, ...data }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Quotations", value: quotations.length, sub: `${totalSent} sent` },
          { label: "Approved/Completed", value: totalApproved, sub: `${conversionRate}% conversion` },
          { label: "Total Value", value: formatCurrency(totalValue), sub: "All quotations" },
          { label: "Approved Value", value: formatCurrency(approvedValue), sub: `${totalRejected} rejected` },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Quotations by Status</CardTitle></CardHeader>
          <CardContent>
            {statusData.length === 0 ? <p className="text-center text-muted-foreground py-8">No data</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Value by Status (₦)</CardTitle></CardHeader>
          <CardContent>
            {valueByStatus.length === 0 ? <p className="text-center text-muted-foreground py-8">No data</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={valueByStatus}>
                  <XAxis dataKey="name" /><YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} /><Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {valueByStatus.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Sent vs Approved (Monthly)</CardTitle></CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? <p className="text-center text-muted-foreground py-8">No data</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" fill="#22c55e" name="Approved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationStats;
