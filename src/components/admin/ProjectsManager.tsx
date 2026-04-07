import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import ProjectForm from "./ProjectForm";
import ProjectDetail from "./ProjectDetail";

type Project = Tables<"projects"> & {
  staff?: { first_name: string; last_name: string } | null;
};

const statusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const ProjectsManager = ({ userId }: { userId: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*, staff:assigned_manager(first_name, last_name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Project deleted"); fetchProjects(); }
  };

  const filtered = projects.filter(p =>
    `${p.name} ${p.client_name || ""} ${p.location || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  if (viewProject) return <ProjectDetail project={viewProject} userId={userId} onBack={() => { setViewProject(null); fetchProjects(); }} />;

  if (showForm || editProject) return (
    <ProjectForm
      userId={userId}
      project={editProject}
      onSaved={() => { setShowForm(false); setEditProject(null); fetchProjects(); }}
      onCancel={() => { setShowForm(false); setEditProject(null); }}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button onClick={() => setShowForm(true)}><Plus size={16} className="mr-2" /> New Project</Button>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No projects found.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{p.name}</CardTitle>
                  <Badge variant="outline" className={statusColors[p.status]}>{p.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium">Type:</span> {p.project_type}</p>
                  {p.client_name && <p><span className="font-medium">Client:</span> {p.client_name}</p>}
                  {p.location && <p><span className="font-medium">Location:</span> {p.location}</p>}
                  {p.staff && <p><span className="font-medium">Manager:</span> {p.staff.first_name} {p.staff.last_name}</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setViewProject(p)}><Eye size={14} className="mr-1" /> View</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditProject(p)}><Edit size={14} className="mr-1" /> Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
