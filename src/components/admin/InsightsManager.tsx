import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Pencil, X } from "lucide-react";

const emptyForm = { title: "", summary: "", content: "", category: "", image_url: "", is_published: false };

const InsightsManager = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: insights } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: async () => {
      const { data, error } = await supabase.from("research_insights").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("research_insights").update({
          title: form.title,
          summary: form.summary,
          content: form.content,
          category: form.category,
          image_url: form.image_url,
          is_published: form.is_published,
        }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("research_insights").insert({
          ...form, created_by: userId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      resetForm();
      toast({ title: editingId ? "Insight updated" : "Insight created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("research_insights").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      toast({ title: "Insight deleted" });
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("research_insights").update({ is_published: published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-insights"] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (insight: any) => {
    setEditingId(insight.id);
    setForm({
      title: insight.title || "",
      summary: insight.summary || "",
      content: insight.content || "",
      category: insight.category || "",
      image_url: insight.image_url || "",
      is_published: insight.is_published ?? false,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Research Insights</h2>
        <Button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}>
          {showForm ? <><X size={14} className="mr-2" /> Cancel</> : <><Plus size={14} className="mr-2" /> Add Insight</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? "Edit Insight" : "New Insight"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); upsertMutation.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g., Geophysics, Hydrology" />
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div>
                <Label>Full Content</Label>
                <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={v => setForm({ ...form, is_published: v })} />
                <Label>Publish immediately</Label>
              </div>
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : editingId ? "Update Insight" : "Create Insight"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {insights?.map(insight => (
          <Card key={insight.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{insight.category || "Uncategorized"}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={insight.is_published ?? false}
                    onCheckedChange={v => togglePublish.mutate({ id: insight.id, published: v })}
                  />
                  <span className="text-xs text-muted-foreground">{insight.is_published ? "Published" : "Draft"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => startEdit(insight)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(insight.id)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {(!insights || insights.length === 0) && (
          <p className="text-center text-muted-foreground py-8">No research insights yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
};

export default InsightsManager;
