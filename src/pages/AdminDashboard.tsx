import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, LogOut, CalendarDays, BookOpen } from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id, _role: "admin",
      });
      if (!isAdmin) { navigate("/admin/login"); return; }
      setUserId(session.user.id);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin/login");
    });

    checkAdmin();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container-wide flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-geotech-red rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <h1 className="text-xl font-bold">R&D Admin</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container-wide py-8">
        <Tabs defaultValue="webinars">
          <TabsList className="mb-8">
            <TabsTrigger value="webinars" className="gap-2">
              <CalendarDays size={14} /> Webinars
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <BookOpen size={14} /> Research Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webinars">
            <WebinarsManager userId={userId} />
          </TabsContent>
          <TabsContent value="insights">
            <InsightsManager userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ---- Webinars Manager ----
const WebinarsManager = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", registration_link: "", image_url: "", is_published: false });

  const { data: webinars } = useQuery({
    queryKey: ["admin-webinars"],
    queryFn: async () => {
      const { data, error } = await supabase.from("webinars").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("webinars").insert({
        ...form, created_by: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-webinars"] });
      setShowForm(false);
      setForm({ title: "", description: "", date: "", registration_link: "", image_url: "", is_published: false });
      toast({ title: "Webinar created" });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Webinars</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={14} className="mr-2" /> Add Webinar
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4">
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Webinar"}
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

// ---- Insights Manager ----
const InsightsManager = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", content: "", category: "", image_url: "", is_published: false });

  const { data: insights } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: async () => {
      const { data, error } = await supabase.from("research_insights").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("research_insights").insert({
        ...form, created_by: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      setShowForm(false);
      setForm({ title: "", summary: "", content: "", category: "", image_url: "", is_published: false });
      toast({ title: "Insight created" });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Research Insights</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={14} className="mr-2" /> Add Insight
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4">
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Insight"}
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

export default AdminDashboard;
