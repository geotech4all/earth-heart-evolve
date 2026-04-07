import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables, Enums } from "@/integrations/supabase/types";

type Review = Tables<"performance_reviews"> & {
  staff?: { first_name: string; last_name: string } | null;
};
type Staff = Tables<"staff">;

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  submitted: "bg-blue-100 text-blue-800",
  acknowledged: "bg-green-100 text-green-800",
};

const PerformanceReviews = ({ userId }: { userId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    staff_id: "", review_period: "", rating: 3,
    strengths: "", areas_for_improvement: "", goals: "",
    status: "draft" as Enums<"review_status">,
  });

  const fetch = async () => {
    const [r, s] = await Promise.all([
      supabase.from("performance_reviews").select("*, staff:staff_id(first_name, last_name)").order("created_at", { ascending: false }),
      supabase.from("staff").select("*"),
    ]);
    if (r.data) setReviews(r.data as Review[]);
    if (s.data) setStaff(s.data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (!form.staff_id || !form.review_period) { toast.error("Staff and period required"); return; }
    const { error } = await supabase.from("performance_reviews").insert({
      ...form, reviewer_id: userId,
    });
    if (error) toast.error(error.message);
    else { toast.success("Review created"); setOpen(false); setForm({ staff_id: "", review_period: "", rating: 3, strengths: "", areas_for_improvement: "", goals: "", status: "draft" }); fetch(); }
  };

  const updateStatus = async (id: string, status: Enums<"review_status">) => {
    const { error } = await supabase.from("performance_reviews").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else fetch();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("performance_reviews").delete().eq("id", id);
    if (error) toast.error(error.message); else fetch();
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={14} className="mr-1" /> New Review</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Performance Review</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>Staff Member *</Label>
                <Select value={form.staff_id} onValueChange={v => setForm(f => ({ ...f, staff_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{staff.map(s => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Review Period *</Label>
                <Input placeholder="e.g. Q1 2026" value={form.review_period} onChange={e => setForm(f => ({ ...f, review_period: e.target.value }))} />
              </div>
              <div>
                <Label>Rating (1-5): {form.rating}</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                      <Star size={20} className={n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} />
                    </button>
                  ))}
                </div>
              </div>
              <div><Label>Strengths</Label><Textarea value={form.strengths} onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))} /></div>
              <div><Label>Areas for Improvement</Label><Textarea value={form.areas_for_improvement} onChange={e => setForm(f => ({ ...f, areas_for_improvement: e.target.value }))} /></div>
              <div><Label>Goals</Label><Textarea value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} /></div>
              <Button onClick={handleSubmit}>Create Review</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length === 0 ? <p className="text-center text-muted-foreground py-8">No reviews yet.</p> : (
        <div className="space-y-3">
          {reviews.map(r => (
            <Card key={r.id}>
              <CardContent className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.staff?.first_name} {r.staff?.last_name}</span>
                    <Badge variant="outline" className={statusColors[r.status]}>{r.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.review_period}</p>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} />)}</div>
                  {r.strengths && <p className="text-xs"><span className="font-medium">Strengths:</span> {r.strengths}</p>}
                  {r.goals && <p className="text-xs"><span className="font-medium">Goals:</span> {r.goals}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Select value={r.status} onValueChange={v => updateStatus(r.id, v as Enums<"review_status">)}>
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost" onClick={() => deleteReview(r.id)}><Trash2 size={14} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceReviews;
