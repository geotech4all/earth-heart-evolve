import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Tables, Enums } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Staff = Tables<"staff">;

interface Props {
  userId: string;
  project?: Project | null;
  onSaved: () => void;
  onCancel: () => void;
}

const ProjectForm = ({ userId, project, onSaved, onCancel }: Props) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    project_type: (project?.project_type || "field") as Enums<"project_type">,
    client_name: project?.client_name || "",
    location: project?.location || "",
    status: (project?.status || "planning") as Enums<"project_status">,
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    budget: project?.budget?.toString() || "",
    assigned_manager: project?.assigned_manager || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("staff").select("*").eq("status", "active").then(({ data }) => {
      if (data) setStaff(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      project_type: form.project_type,
      client_name: form.client_name || null,
      location: form.location || null,
      status: form.status,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      budget: form.budget ? parseFloat(form.budget) : null,
      assigned_manager: form.assigned_manager || null,
      created_by: userId,
    };

    const { error } = project
      ? await supabase.from("projects").update(payload).eq("id", project.id)
      : await supabase.from("projects").insert(payload);

    if (error) toast.error(error.message);
    else { toast.success(project ? "Project updated" : "Project created"); onSaved(); }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}><ArrowLeft size={16} /></Button>
          <CardTitle>{project ? "Edit Project" : "New Project"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Project Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={form.project_type} onValueChange={v => setForm(f => ({ ...f, project_type: v as Enums<"project_type"> }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="field">Field</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Enums<"project_status"> }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Client Name</Label>
            <Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
          </div>
          <div>
            <Label>Budget (₦)</Label>
            <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
          </div>
          <div>
            <Label>Assigned Manager</Label>
            <Select value={form.assigned_manager} onValueChange={v => setForm(f => ({ ...f, assigned_manager: v }))}>
              <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
              <SelectContent>
                {staff.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-4">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : project ? "Update" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
