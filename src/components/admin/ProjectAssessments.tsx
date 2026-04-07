import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Assessment = Tables<"project_assessments"> & {
  projects?: { name: string } | null;
};
type Project = Tables<"projects">;

const ProjectAssessments = ({ userId }: { userId: string }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    project_id: "", report_quality_score: 5, field_safety_score: 5,
    timeline_adherence_score: 5, comments: "",
  });

  const fetchData = async () => {
    const [a, p] = await Promise.all([
      supabase.from("project_assessments").select("*, projects:project_id(name)").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("name"),
    ]);
    if (a.data) setAssessments(a.data as Assessment[]);
    if (p.data) setProjects(p.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!form.project_id) { toast.error("Select a project"); return; }
    const overall = ((form.report_quality_score + form.field_safety_score + form.timeline_adherence_score) / 3).toFixed(1);
    const { error } = await supabase.from("project_assessments").insert({
      project_id: form.project_id, assessor_id: userId,
      report_quality_score: form.report_quality_score,
      field_safety_score: form.field_safety_score,
      timeline_adherence_score: form.timeline_adherence_score,
      overall_score: parseFloat(overall),
      comments: form.comments || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Assessment created"); setOpen(false); fetchData(); }
  };

  const deleteAssessment = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("project_assessments").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchData();
  };

  const ScoreBar = ({ label, score }: { label: string; score: number | null }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs w-28">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${(score || 0) * 10}%` }} /></div>
      <span className="text-xs font-medium w-6">{score}/10</span>
    </div>
  );

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={14} className="mr-1" /> New Assessment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Project Assessment</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Project *</Label>
                <Select value={form.project_id} onValueChange={v => setForm(f => ({ ...f, project_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Report Quality ({form.report_quality_score}/10)</Label>
                <Slider value={[form.report_quality_score]} onValueChange={([v]) => setForm(f => ({ ...f, report_quality_score: v }))} min={0} max={10} step={1} />
              </div>
              <div>
                <Label>Field Safety ({form.field_safety_score}/10)</Label>
                <Slider value={[form.field_safety_score]} onValueChange={([v]) => setForm(f => ({ ...f, field_safety_score: v }))} min={0} max={10} step={1} />
              </div>
              <div>
                <Label>Timeline Adherence ({form.timeline_adherence_score}/10)</Label>
                <Slider value={[form.timeline_adherence_score]} onValueChange={([v]) => setForm(f => ({ ...f, timeline_adherence_score: v }))} min={0} max={10} step={1} />
              </div>
              <div><Label>Comments</Label><Textarea value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} /></div>
              <Button onClick={handleSubmit}>Submit Assessment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {assessments.length === 0 ? <p className="text-center text-muted-foreground py-8">No assessments yet.</p> : (
        <div className="space-y-3">
          {assessments.map(a => (
            <Card key={a.id}>
              <CardContent className="py-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{a.projects?.name}</p>
                    <p className="text-xs text-muted-foreground">Overall: {a.overall_score}/10 • {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => deleteAssessment(a.id)}><Trash2 size={14} /></Button>
                </div>
                <ScoreBar label="Report Quality" score={a.report_quality_score} />
                <ScoreBar label="Field Safety" score={a.field_safety_score} />
                <ScoreBar label="Timeline" score={a.timeline_adherence_score} />
                {a.comments && <p className="text-xs text-muted-foreground mt-2">{a.comments}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectAssessments;
