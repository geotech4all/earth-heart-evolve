import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import QuotationForm from "./QuotationForm";
import QuotationDetail from "./QuotationDetail";
import QuotationStats from "./QuotationStats";

type Quotation = {
  id: string;
  quote_number: string;
  client_name: string;
  client_address: string | null;
  client_phone: string | null;
  project_name: string;
  project_description: string | null;
  quotation_date: string;
  total_amount: number;
  status: "draft" | "sent" | "approved" | "rejected" | "completed";
  project_id: string | null;
  prepared_by: string | null;
  terms_and_conditions: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const QuotationsManager = ({ userId }: { userId: string }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editQuotation, setEditQuotation] = useState<Quotation | null>(null);
  const [viewQuotation, setViewQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quotations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setQuotations((data as Quotation[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuotations(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quotation?")) return;
    const { error } = await supabase.from("quotations").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Quotation deleted"); fetchQuotations(); }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const filtered = quotations.filter(q =>
    `${q.quote_number} ${q.client_name} ${q.project_name}`.toLowerCase().includes(search.toLowerCase())
  );

  if (viewQuotation) return <QuotationDetail quotation={viewQuotation} onBack={() => { setViewQuotation(null); fetchQuotations(); }} />;

  if (showForm || editQuotation) return (
    <QuotationForm
      userId={userId}
      quotation={editQuotation}
      onSaved={() => { setShowForm(false); setEditQuotation(null); fetchQuotations(); }}
      onCancel={() => { setShowForm(false); setEditQuotation(null); }}
    />
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list" className="gap-2"><FileText size={14} /> Quotations</TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">📊 Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search quotations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Button onClick={() => setShowForm(true)}><Plus size={16} className="mr-2" /> New Quotation</Button>
          </div>

          {loading ? <p className="text-muted-foreground">Loading...</p> : filtered.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No quotations found.</CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(q => (
                <Card key={q.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{q.quote_number}</p>
                        <CardTitle className="text-lg leading-tight mt-1">{q.project_name}</CardTitle>
                      </div>
                      <Badge variant="outline" className={statusColors[q.status]}>{q.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Client:</span> {q.client_name}</p>
                      <p><span className="font-medium">Date:</span> {new Date(q.quotation_date).toLocaleDateString()}</p>
                      <p className="text-base font-semibold text-foreground">{formatCurrency(q.total_amount)}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => setViewQuotation(q)}><Eye size={14} className="mr-1" /> View</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditQuotation(q)}><Edit size={14} className="mr-1" /> Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}><Trash2 size={14} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats">
          <QuotationStats quotations={quotations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuotationsManager;
