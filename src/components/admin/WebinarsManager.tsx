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
import { format } from "date-fns";

const emptyForm = { title: "", description: "", date: "", registration_link: "", image_url: "", is_published: false };

const WebinarsManager = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: webinars } = useQuery({
    queryKey: ["admin-webinars"],
    queryFn: async () => {
      const { data, error } = await supabase.from("webinars").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("webinars").update({
          title: form.title,
          description: form.description,
          date: form.date,
          registration_link: form.registration_link,
          image_url: form.image_url,
          is_published: form.is_published,
        }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("webinars").insert({
          ...form, created_by: userId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-webinars"] });
      resetForm();
      toast({ title: editingId ? "Webinar updated" : "Webinar created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("webinars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-webinars"] });
      toast({ title: "Webinar deleted" });
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("webinars").update({ is_published: published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-webinars"] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (webinar: any) => {
    setEditingId(webinar.id);
    setForm({
      title: webinar.title || "",
      description: webinar.description || "",
      date: webinar.date ? new Date(webinar.date).toISOString().slice(0, 16) : "",
      registration_link: webinar.registration_link || "",
      image_url: webinar.image_url || "",
      is_published: webinar.is_published ?? false,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Webinars</h2>
        <Button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}>
          {showForm ? <><X size={14} className="mr-2" /> Cancel</> : <><Plus size={14} className="mr-2" /> Add Webinar</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? "Edit Webinar" : "New Webinar"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); upsertMutation.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Registration Link</Label>
                  <Input value={form.registration_link} onChange={e => setForm({ ...form, registration_link: e.target.value })} />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={v => setForm({ ...form, is_published: v })} />
                <Label>Publish immediately</Label>
              </div>
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : editingId ? "Update Webinar" : "Create Webinar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {webinars?.map(webinar => (
          <Card key={webinar.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">{webinar.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{format(new Date(webinar.date), "MMM d, yyyy • h:mm a")}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webinar.is_published ?? false}
                    onCheckedChange={v => togglePublish.mutate({ id: webinar.id, published: v })}
                  />
                  <span className="text-xs text-muted-foreground">{webinar.is_published ? "Published" : "Draft"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => startEdit(webinar)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(webinar.id)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {(!webinars || webinars.length === 0) && (
          <p className="text-center text-muted-foreground py-8">No webinars yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
};

export default WebinarsManager;
