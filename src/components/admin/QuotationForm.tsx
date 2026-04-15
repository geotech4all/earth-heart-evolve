import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type QuotationStatus = "draft" | "sent" | "approved" | "rejected" | "completed";

interface LineItem {
  id?: string;
  phase_name: string;
  item_number: number;
  description: string;
  unit: string;
  quantity: number;
  unit_rate: number;
  amount: number;
  sort_order: number;
}

interface QuotationFormProps {
  userId: string;
  quotation?: any;
  onSaved: () => void;
  onCancel: () => void;
}

const QuotationForm = ({ userId, quotation, onSaved, onCancel }: QuotationFormProps) => {
  const isEdit = !!quotation;
  const [form, setForm] = useState({
    quote_number: quotation?.quote_number || "",
    client_name: quotation?.client_name || "",
    client_address: quotation?.client_address || "",
    client_phone: quotation?.client_phone || "",
    project_name: quotation?.project_name || "",
    project_description: quotation?.project_description || "",
    quotation_date: quotation?.quotation_date || new Date().toISOString().split("T")[0],
    status: (quotation?.status || "draft") as QuotationStatus,
    terms_and_conditions: quotation?.terms_and_conditions || "The client will be billed upon accepting this quote. 80% payment required before rendering services. Full payment is due upon notification of report.",
    notes: quotation?.notes || "",
  });
  const [items, setItems] = useState<LineItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase.from("quotation_items").select("*").eq("quotation_id", quotation.id).order("sort_order")
        .then(({ data }) => { if (data) setItems(data as LineItem[]); });
    }
  }, [quotation?.id]);

  const addItem = () => {
    setItems([...items, { phase_name: "", item_number: items.length + 1, description: "", unit: "", quantity: 1, unit_rate: 0, amount: 0, sort_order: items.length }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_rate") {
      updated[index].amount = Number(updated[index].quantity) * Number(updated[index].unit_rate);
    }
    setItems(updated);
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleSave = async () => {
    if (!form.quote_number.trim() || !form.client_name.trim() || !form.project_name.trim()) {
      toast.error("Quote number, client name, and project name are required"); return;
    }
    setSaving(true);
    try {
      let quotationId = quotation?.id;
      if (isEdit) {
        const { error } = await supabase.from("quotations").update({
          ...form, total_amount: totalAmount, prepared_by: userId,
        }).eq("id", quotation.id);
        if (error) throw error;
        await supabase.from("quotation_items").delete().eq("quotation_id", quotation.id);
      } else {
        const { data, error } = await supabase.from("quotations").insert({
          ...form, total_amount: totalAmount, prepared_by: userId,
        }).select("id").single();
        if (error) throw error;
        quotationId = data.id;
      }
      if (items.length > 0) {
        const { error } = await supabase.from("quotation_items").insert(
          items.map((item, i) => ({
            quotation_id: quotationId,
            phase_name: item.phase_name || null,
            item_number: item.item_number,
            description: item.description,
            unit: item.unit || null,
            quantity: item.quantity,
            unit_rate: item.unit_rate,
            amount: item.amount,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }
      toast.success(isEdit ? "Quotation updated" : "Quotation created");
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}><ArrowLeft size={16} /></Button>
        <h2 className="text-2xl font-bold">{isEdit ? "Edit" : "New"} Quotation</h2>
      </div>

      <Card>
        <CardHeader><CardTitle>Quotation Details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Quote Number (e.g. S-26-0006) *" value={form.quote_number} onChange={e => setForm(f => ({ ...f, quote_number: e.target.value }))} />
          <Input type="date" value={form.quotation_date} onChange={e => setForm(f => ({ ...f, quotation_date: e.target.value }))} />
          <Input placeholder="Client Name *" value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
          <Input placeholder="Client Phone" value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))} />
          <div className="md:col-span-2">
            <Input placeholder="Client Address" value={form.client_address} onChange={e => setForm(f => ({ ...f, client_address: e.target.value }))} />
          </div>
          <Input placeholder="Project Name *" value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} />
          <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as QuotationStatus }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="md:col-span-2">
            <Textarea placeholder="Project Description" value={form.project_description} onChange={e => setForm(f => ({ ...f, project_description: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Textarea placeholder="Terms & Conditions" value={form.terms_and_conditions} onChange={e => setForm(f => ({ ...f, terms_and_conditions: e.target.value }))} rows={3} />
          </div>
          <div className="md:col-span-2">
            <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button size="sm" onClick={addItem}><Plus size={14} className="mr-1" /> Add Item</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-7 items-end border-b pb-3">
              <Input placeholder="Phase (optional)" value={item.phase_name} onChange={e => updateItem(i, "phase_name", e.target.value)} className="md:col-span-2" />
              <Input placeholder="Description *" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} className="md:col-span-2" />
              <Input placeholder="Unit" value={item.unit} onChange={e => updateItem(i, "unit", e.target.value)} />
              <div className="flex gap-2">
                <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, "quantity", Number(e.target.value))} />
                <Input type="number" placeholder="Rate" value={item.unit_rate} onChange={e => updateItem(i, "unit_rate", Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">{formatCurrency(item.amount)}</span>
                <Button size="icon" variant="ghost" onClick={() => removeItem(i)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground py-4">No items yet. Click "Add Item" to start.</p>}
          {items.length > 0 && (
            <div className="flex justify-end pt-3 border-t">
              <p className="text-lg font-bold">Total: {formatCurrency(totalAmount)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : isEdit ? "Update Quotation" : "Create Quotation"}</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default QuotationForm;
