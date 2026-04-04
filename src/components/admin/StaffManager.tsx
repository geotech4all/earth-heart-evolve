import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, UserPlus, Eye, Pencil, Trash2, Users } from "lucide-react";
import StaffForm from "./StaffForm";
import StaffProfile from "./StaffProfile";
import type { Tables } from "@/integrations/supabase/types";

type Staff = Tables<"staff">;

const statusColors: Record<string, string> = {
  onboarding: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-600",
};

const StaffManager = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*, departments(name), staff_roles(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (editingStaff) {
        const { error } = await supabase.from("staff").update(formData).eq("id", editingStaff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("staff").insert({ ...formData, created_by: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: editingStaff ? "Staff updated" : "Staff registered successfully" });
      setFormOpen(false);
      setEditingStaff(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff removed" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = staffList?.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  if (viewingStaff) {
    return <StaffProfile staff={viewingStaff} onBack={() => setViewingStaff(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search staff..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditingStaff(null); setFormOpen(true); }}>
          <UserPlus size={14} className="mr-2" /> Register Staff
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading staff...</p>
      ) : !filtered?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p className="text-lg font-medium">No staff found</p>
            <p className="text-sm mt-1">Register your first staff member to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Department</th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{s.first_name} {s.last_name}</td>
                    <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">{s.email}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{s.departments?.name || "—"}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{s.staff_roles?.name || "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className={statusColors[s.status] || ""}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewingStaff(s)}>
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingStaff(s); setFormOpen(true); }}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(s.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <StaffForm
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditingStaff(null); }}
        staff={editingStaff}
        onSave={(data) => saveMutation.mutate(data)}
        saving={saveMutation.isPending}
      />
    </div>
  );
};

export default StaffManager;
