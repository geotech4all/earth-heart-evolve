import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import type { Tables, Enums } from "@/integrations/supabase/types";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Project = Tables<"projects">;
type Task = Tables<"project_tasks"> & { staff?: { first_name: string; last_name: string } | null };
type Milestone = Tables<"project_milestones">;
type Update = Tables<"project_updates">;
type Staff = Tables<"staff">;

const TASK_COLORS = { todo: "#94a3b8", in_progress: "#3b82f6", review: "#f59e0b", done: "#22c55e" };
const PRIORITY_COLORS = { low: "bg-slate-100 text-slate-700", medium: "bg-blue-100 text-blue-700", high: "bg-orange-100 text-orange-700", critical: "bg-red-100 text-red-700" };

const ProjectDetail = ({ project, userId, onBack }: { project: Project; userId: string; onBack: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assigned_to: "", priority: "medium" as Enums<"task_priority">, due_date: "" });
  const [newMilestone, setNewMilestone] = useState({ title: "", target_date: "" });
  const [newUpdate, setNewUpdate] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchAll = async () => {
    const [t, m, u, s] = await Promise.all([
      supabase.from("project_tasks").select("*, staff:assigned_to(first_name, last_name)").eq("project_id", project.id).order("created_at"),
      supabase.from("project_milestones").select("*").eq("project_id", project.id).order("target_date"),
      supabase.from("project_updates").select("*").eq("project_id", project.id).order("created_at", { ascending: false }),
      supabase.from("staff").select("*").eq("status", "active"),
    ]);
    if (t.data) setTasks(t.data as Task[]);
    if (m.data) setMilestones(m.data);
    if (u.data) setUpdates(u.data);
    if (s.data) setStaff(s.data);
  };

  useEffect(() => { fetchAll(); }, [project.id]);

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    const { error } = await supabase.from("project_tasks").insert({
      project_id: project.id, title: newTask.title, description: newTask.description || null,
      assigned_to: newTask.assigned_to || null, priority: newTask.priority, due_date: newTask.due_date || null,
    });
    if (error) toast.error(error.message);
    else { setNewTask({ title: "", description: "", assigned_to: "", priority: "medium", due_date: "" }); setShowTaskForm(false); fetchAll(); }
  };

  const updateTaskStatus = async (id: string, status: Enums<"task_status">) => {
    const { error } = await supabase.from("project_tasks").update({
      status, completed_at: status === "done" ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("project_tasks").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addMilestone = async () => {
    if (!newMilestone.title.trim()) return;
    const { error } = await supabase.from("project_milestones").insert({
      project_id: project.id, title: newMilestone.title, target_date: newMilestone.target_date || null,
    });
    if (error) toast.error(error.message);
    else { setNewMilestone({ title: "", target_date: "" }); fetchAll(); }
  };

  const toggleMilestone = async (m: Milestone) => {
    const { error } = await supabase.from("project_milestones").update({
      is_completed: !m.is_completed, completed_at: !m.is_completed ? new Date().toISOString() : null,
    }).eq("id", m.id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addUpdate = async () => {
    if (!newUpdate.trim()) return;
    const { error } = await supabase.from("project_updates").insert({
      project_id: project.id, content: newUpdate, created_by: userId,
    });
    if (error) toast.error(error.message);
    else { setNewUpdate(""); fetchAll(); }
  };

  const taskStatusData = Object.entries(
    tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  const priorityData = Object.entries(
    tasks.reduce((acc, t) => { acc[t.priority] = (acc[t.priority] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft size={16} /></Button>
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-sm text-muted-foreground">{project.project_type} • {project.status.replace("_", " ")}</p>
        </div>
      </div>

      {project.description && (
        <Card><CardContent className="pt-4"><p className="text-sm">{project.description}</p></CardContent></Card>
      )}

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="milestones">Milestones ({milestones.length})</TabsTrigger>
          <TabsTrigger value="updates">Updates ({updates.length})</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowTaskForm(!showTaskForm)}><Plus size={14} className="mr-1" /> Add Task</Button>
          </div>
          {showTaskForm && (
            <Card><CardContent className="pt-4 grid gap-3 md:grid-cols-2">
              <Input placeholder="Task title *" value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))} />
              <Select value={newTask.priority} onValueChange={v => setNewTask(t => ({ ...t, priority: v as Enums<"task_priority"> }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newTask.assigned_to} onValueChange={v => setNewTask(t => ({ ...t, assigned_to: v }))}>
                <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
                <SelectContent>{staff.map(s => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="date" value={newTask.due_date} onChange={e => setNewTask(t => ({ ...t, due_date: e.target.value }))} />
              <div className="md:col-span-2">
                <Textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask(t => ({ ...t, description: e.target.value }))} />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button size="sm" onClick={addTask}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => setShowTaskForm(false)}>Cancel</Button>
              </div>
            </CardContent></Card>
          )}
          <div className="space-y-2">
            {tasks.map(t => (
              <Card key={t.id}>
                <CardContent className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{t.title}</span>
                      <Badge variant="outline" className={PRIORITY_COLORS[t.priority]}>{t.priority}</Badge>
                      {t.staff && <span className="text-xs text-muted-foreground">→ {t.staff.first_name} {t.staff.last_name}</span>}
                      {t.due_date && <span className="text-xs text-muted-foreground">Due: {t.due_date}</span>}
                    </div>
                    {t.description && <p className="text-xs text-muted-foreground mt-1 truncate">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={t.status} onValueChange={v => updateTaskStatus(t.id, v as Enums<"task_status">)}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteTask(t.id)}><Trash2 size={14} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {tasks.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card><CardContent className="pt-4 flex gap-3 items-end">
            <div className="flex-1"><Input placeholder="Milestone title" value={newMilestone.title} onChange={e => setNewMilestone(m => ({ ...m, title: e.target.value }))} /></div>
            <Input type="date" className="w-40" value={newMilestone.target_date} onChange={e => setNewMilestone(m => ({ ...m, target_date: e.target.value }))} />
            <Button size="sm" onClick={addMilestone}><Plus size={14} /></Button>
          </CardContent></Card>
          <div className="space-y-2">
            {milestones.map(m => (
              <Card key={m.id}>
                <CardContent className="py-3 flex items-center gap-3">
                  <Checkbox checked={m.is_completed} onCheckedChange={() => toggleMilestone(m)} />
                  <span className={`flex-1 text-sm ${m.is_completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                  {m.target_date && <span className="text-xs text-muted-foreground">{m.target_date}</span>}
                </CardContent>
              </Card>
            ))}
            {milestones.length === 0 && <p className="text-center text-muted-foreground py-8">No milestones yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card><CardContent className="pt-4 flex gap-3">
            <Textarea placeholder="Post an update..." value={newUpdate} onChange={e => setNewUpdate(e.target.value)} className="flex-1" />
            <Button size="sm" onClick={addUpdate}><Send size={14} /></Button>
          </CardContent></Card>
          <div className="space-y-2">
            {updates.map(u => (
              <Card key={u.id}>
                <CardContent className="py-3">
                  <p className="text-sm">{u.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(u.created_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
            {updates.length === 0 && <p className="text-center text-muted-foreground py-8">No updates yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="charts">
          {tasks.length === 0 ? <p className="text-center text-muted-foreground py-8">Add tasks to see charts.</p> : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Task Status</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {taskStatusData.map((_, i) => <Cell key={i} fill={Object.values(TASK_COLORS)[i % 4]} />)}
                      </Pie>
                      <Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Tasks by Priority</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={priorityData}>
                      <XAxis dataKey="name" /><YAxis /><Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
