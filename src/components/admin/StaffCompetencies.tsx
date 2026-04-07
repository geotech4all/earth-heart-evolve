import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Award } from "lucide-react";
import { toast } from "sonner";
import type { Tables, Enums } from "@/integrations/supabase/types";

type Competency = Tables<"staff_competencies"> & {
  staff?: { first_name: string; last_name: string } | null;
};
type Staff = Tables<"staff">;

const levelColors: Record<string, string> = {
  beginner: "bg-slate-100 text-slate-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
  expert: "bg-green-100 text-green-700",
};

const StaffCompetencies = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    staff_id: "", skill_name: "",
    proficiency_level: "beginner" as Enums<"proficiency_level">,
    certification_name: "", certification_date: "", expiry_date: "",
  });

  const fetchData = async () => {
    const [c, s] = await Promise.all([
      supabase.from("staff_competencies").select("*, staff:staff_id(first_name, last_name)").order("created_at", { ascending: false }),
      supabase.from("staff").select("*"),
    ]);
    if (c.data) setCompetencies(c.data as Competency[]);
    if (s.data) setStaff(s.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!form.staff_id || !form.skill_name) { toast.error("Staff and skill required"); return; }
    const { error } = await supabase.from("staff_competencies").insert({
      staff_id: form.staff_id, skill_name: form.skill_name,
      proficiency_level: form.proficiency_level,
      certification_name: form.certification_name || null,
      certification_date: form.certification_date || null,
      expiry_date: form.expiry_date || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Competency added"); setOpen(false); setForm({ staff_id: "", skill_name: "", proficiency_level: "beginner", certification_name: "", certification_date: "", expiry_date: "" }); fetchData(); }
  };

  const deleteComp = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("staff_competencies").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchData();
  };

  // Group by staff
  const grouped = competencies.reduce((acc, c) => {
    const key = c.staff_id;
    if (!acc[key]) acc[key] = { name: `${c.staff?.first_name || ""} ${c.staff?.last_name || ""}`, items: [] };
    acc[key].items.push(c);
    return acc;
  }, {} as Record<string, { name: string; items: Competency[] }>);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={14} className="mr-1" /> Add Competency</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Staff Competency</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>Staff Member *</Label>
                <Select value={form.staff_id} onValueChange={v => setForm(f => ({ ...f, staff_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{staff.map(s => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Skill Name *</Label><Input value={form.skill_name} onChange={e => setForm(f => ({ ...f, skill_name: e.target.value }))} placeholder="e.g. Geophysical Surveying" /></div>
              <div>
                <Label>Proficiency Level</Label>
                <Select value={form.proficiency_level} onValueChange={v => setForm(f => ({ ...f, proficiency_level: v as Enums<"proficiency_level"> }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Certification Name</Label><Input value={form.certification_name} onChange={e => setForm(f => ({ ...f, certification_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Cert. Date</Label><Input type="date" value={form.certification_date} onChange={e => setForm(f => ({ ...f, certification_date: e.target.value }))} /></div>
                <div><Label>Expiry Date</Label><Input type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} /></div>
              </div>
              <Button onClick={handleSubmit}>Add Competency</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(grouped).length === 0 ? <p className="text-center text-muted-foreground py-8">No competencies recorded yet.</p> : (
        Object.entries(grouped).map(([staffId, { name, items }]) => (
          <Card key={staffId}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{name}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {items.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Award size={14} className="text-primary" />
                    <span className="text-sm font-medium">{c.skill_name}</span>
                    <Badge variant="outline" className={levelColors[c.proficiency_level]}>{c.proficiency_level}</Badge>
                    {c.certification_name && <span className="text-xs text-muted-foreground">({c.certification_name})</span>}
                    {c.expiry_date && <span className="text-xs text-muted-foreground">Expires: {c.expiry_date}</span>}
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteComp(c.id)}><Trash2 size={12} /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StaffCompetencies;
