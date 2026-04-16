import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

interface QuotationDetailProps {
  quotation: any;
  onBack: () => void;
}

type LineItem = {
  id: string;
  phase_name: string | null;
  item_number: number;
  description: string;
  unit: string | null;
  quantity: number;
  unit_rate: number;
  amount: number;
  sort_order: number;
};

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const QuotationDetail = ({ quotation, onBack }: QuotationDetailProps) => {
  const [items, setItems] = useState<LineItem[]>([]);
  const [status, setStatus] = useState(quotation.status);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("quotation_items").select("*").eq("quotation_id", quotation.id).order("sort_order")
      .then(({ data }) => { if (data) setItems(data as LineItem[]); });
  }, [quotation.id]);

  const updateStatus = async (newStatus: "draft" | "sent" | "approved" | "rejected" | "completed") => {
    const { error } = await supabase.from("quotations").update({ status: newStatus }).eq("id", quotation.id);
    if (error) { toast.error(error.message); return; }
    setStatus(newStatus);
    toast.success("Status updated");

    // Auto-create project when quotation is approved
    if (newStatus === "approved" && !quotation.project_id) {
      const { data: project, error: projError } = await supabase.from("projects").insert({
        name: quotation.project_name,
        description: quotation.project_description || `Project from quotation ${quotation.quote_number}`,
        client_name: quotation.client_name,
        project_type: "field" as const,
        status: "planning" as const,
        budget: quotation.total_amount,
      }).select("id").single();

      if (projError) {
        toast.error("Failed to create project: " + projError.message);
      } else if (project) {
        await supabase.from("quotations").update({ project_id: project.id }).eq("id", quotation.id);
        quotation.project_id = project.id;
        toast.success("Project automatically created from this quotation!");
      }
    }
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  const groupedItems = items.reduce((acc, item) => {
    const phase = item.phase_name || "Items";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(item);
    return acc;
  }, {} as Record<string, LineItem[]>);

  const exportPDF = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) { toast.error("Please allow popups"); return; }
    win.document.write(`<!DOCTYPE html><html><head><title>${quotation.quote_number} - Quotation</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; font-size: 12px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #c0392b; padding-bottom: 20px; }
      .logo-section h1 { color: #c0392b; font-size: 28px; margin-bottom: 4px; }
      .logo-section p { font-size: 10px; color: #666; }
      .company-info { text-align: right; font-size: 11px; line-height: 1.6; }
      .quote-meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
      .meta-box { background: #f9f9f9; padding: 12px 16px; border-radius: 4px; }
      .meta-box label { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #666; }
      .meta-box p { font-size: 13px; margin-top: 2px; }
      .client-info { margin-bottom: 20px; }
      .client-info h3 { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 6px; }
      h2.title { font-size: 18px; text-align: center; margin: 20px 0; color: #c0392b; }
      .phase-title { background: #c0392b; color: white; padding: 6px 12px; font-size: 12px; font-weight: bold; margin-top: 16px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th { background: #f0f0f0; text-align: left; padding: 8px; font-size: 11px; border: 1px solid #ddd; }
      td { padding: 8px; border: 1px solid #ddd; font-size: 11px; }
      .amount-col { text-align: right; }
      .subtotal-row { background: #fee; font-weight: bold; }
      .grand-total { text-align: right; font-size: 16px; font-weight: bold; margin: 20px 0; padding: 10px; background: #c0392b; color: white; }
      .terms { margin-top: 30px; padding: 16px; background: #f9f9f9; border-left: 3px solid #c0392b; }
      .terms h3 { font-size: 12px; margin-bottom: 8px; }
      .terms p { font-size: 11px; line-height: 1.6; }
      .payment { margin-top: 20px; }
      .payment p { font-size: 11px; line-height: 1.6; }
      .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
      @media print { body { padding: 20px; } }
    </style></head><body>`);

    win.document.write(`
      <div class="header">
        <div class="logo-section">
          <h1>GEOTECH4ALL</h1>
          <p>ACQUISITION | ANALYSIS | VISUALIZATION | MANAGEMENT</p>
          <p>Everything Geoscience</p>
        </div>
        <div class="company-info">
          <p><strong>RC: 8852817</strong></p>
          <p>5 Disu Babajide Close, Warewa, Ogun State</p>
          <p>support@geotech4all.com</p>
          <p>+234-8165789103, +234-9129292666</p>
          <p>www.geotech4all.com</p>
        </div>
      </div>

      <div class="quote-meta">
        <div class="meta-box"><label>Quote Number</label><p>${quotation.quote_number}</p></div>
        <div class="meta-box"><label>Date</label><p>${new Date(quotation.quotation_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p></div>
        <div class="meta-box"><label>Status</label><p>${status.toUpperCase()}</p></div>
      </div>

      <div class="client-info">
        <h3>Prepared For</h3>
        <p><strong>${quotation.client_name}</strong></p>
        ${quotation.client_address ? `<p>${quotation.client_address}</p>` : ""}
        ${quotation.client_phone ? `<p>Phone: ${quotation.client_phone}</p>` : ""}
      </div>

      <h2 class="title">QUOTATION</h2>
      ${quotation.project_description ? `<p style="margin-bottom:16px;">${quotation.project_description}</p>` : ""}
    `);

    Object.entries(groupedItems).forEach(([phase, phaseItems]) => {
      win!.document.write(`<div class="phase-title">${phase}</div>`);
      win!.document.write(`<table><thead><tr>
        <th>S/No</th><th>Description</th><th>Unit</th><th>Qty</th><th class="amount-col">Rate (₦)</th><th class="amount-col">Amount (₦)</th>
      </tr></thead><tbody>`);
      let phaseTotal = 0;
      (phaseItems as LineItem[]).forEach((item) => {
        phaseTotal += Number(item.amount);
        win!.document.write(`<tr>
          <td>${item.item_number}</td>
          <td>${item.description}</td>
          <td>${item.unit || "-"}</td>
          <td>${item.quantity}</td>
          <td class="amount-col">${Number(item.unit_rate).toLocaleString()}</td>
          <td class="amount-col">${Number(item.amount).toLocaleString()}</td>
        </tr>`);
      });
      win!.document.write(`<tr class="subtotal-row">
        <td colspan="5" style="text-align:right">Sub-total</td>
        <td class="amount-col">${phaseTotal.toLocaleString()}</td>
      </tr></tbody></table>`);
    });

    win.document.write(`
      <div class="grand-total">Total Contract Sum: ${formatCurrency(quotation.total_amount)}</div>

      <div class="terms">
        <h3>Terms & Conditions</h3>
        <p>${quotation.terms_and_conditions || ""}</p>
      </div>

      <div class="payment">
        <p><strong>Account Name:</strong> GEOTECH4ALL LIMITED</p>
        <p><strong>Account No:</strong> 2007178996</p>
        <p><strong>Bank:</strong> First City Monument Bank (FCMB)</p>
      </div>

      <div style="margin-top:40px;">
        <p><strong>Signed,</strong></p>
        <p>Geotech4All Management</p>
      </div>

      <div class="footer">Copyright ©Geotech4All</div>
    </body></html>`);

    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft size={16} /></Button>
          <div>
            <p className="text-xs font-mono text-muted-foreground">{quotation.quote_number}</p>
            <h2 className="text-2xl font-bold">{quotation.project_name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={updateStatus}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportPDF}><Download size={14} className="mr-2" /> Export PDF</Button>
        </div>
      </div>

      <div ref={printRef}>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-medium">{quotation.client_name}</p>
              {quotation.client_address && <p className="text-sm text-muted-foreground">{quotation.client_address}</p>}
              {quotation.client_phone && <p className="text-sm text-muted-foreground">{quotation.client_phone}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(quotation.quotation_date).toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Status</p>
              <Badge variant="outline" className={statusColors[status]}>{status}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(quotation.total_amount)}</p>
            </CardContent>
          </Card>
        </div>

        {quotation.project_description && (
          <Card className="mb-6"><CardContent className="pt-4"><p className="text-sm">{quotation.project_description}</p></CardContent></Card>
        )}

        {Object.entries(groupedItems).map(([phase, phaseItems]) => (
          <Card key={phase} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{phase}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 w-12">S/No</th>
                      <th className="text-left py-2 px-3">Description</th>
                      <th className="text-left py-2 px-3 w-20">Unit</th>
                      <th className="text-right py-2 px-3 w-16">Qty</th>
                      <th className="text-right py-2 px-3 w-28">Rate (₦)</th>
                      <th className="text-right py-2 px-3 w-32">Amount (₦)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(phaseItems as LineItem[]).map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-3">{item.item_number}</td>
                        <td className="py-2 px-3">{item.description}</td>
                        <td className="py-2 px-3">{item.unit || "-"}</td>
                        <td className="py-2 px-3 text-right">{item.quantity}</td>
                        <td className="py-2 px-3 text-right">{Number(item.unit_rate).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-medium">{Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/50 font-semibold">
                      <td colSpan={5} className="py-2 px-3 text-right">Sub-total</td>
                      <td className="py-2 px-3 text-right">
                        {(phaseItems as LineItem[]).reduce((s, i) => s + Number(i.amount), 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Grand Total</span>
            <span className="text-2xl font-bold">{formatCurrency(quotation.total_amount)}</span>
          </CardContent>
        </Card>
      </div>

      {quotation.terms_and_conditions && (
        <Card>
          <CardHeader><CardTitle className="text-base">Terms & Conditions</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{quotation.terms_and_conditions}</p></CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuotationDetail;
