import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ClipboardCheck } from "lucide-react";

const DEFAULT_ITEMS = [
  "Equipment allocation",
  "Office/workspace setup",
  "Safety training completed",
  "ID card issued",
  "Introduction to team",
  "Company policies reviewed",
  "Software & tools access granted",
];

interface OnboardingChecklistProps {
  staffId: string;
}

const OnboardingChecklist = ({ staffId }: OnboardingChecklistProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["onboarding", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_checklists")
        .select("*")
        .eq("staff_id", staffId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const initMutation = useMutation({
    mutationFn: async () => {
      const rows = DEFAULT_ITEMS.map((item) => ({ staff_id: staffId, item_name: item }));
      const { error } = await supabase.from("onboarding_checklists").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding", staffId] }),
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async (itemName: string) => {
      const { error } = await supabase.from("onboarding_checklists").insert({ staff_id: staffId, item_name: itemName });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", staffId] });
      setNewItem("");
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("onboarding_checklists")
        .update({ is_completed: completed, completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding", staffId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("onboarding_checklists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding", staffId] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  if (!items?.length) {
    return (
      <div className="text-center py-6">
        <ClipboardCheck className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p className="text-sm text-muted-foreground mb-3">No checklist items yet.</p>
        <Button size="sm" onClick={() => initMutation.mutate()} disabled={initMutation.isPending}>
          Initialize Default Checklist
        </Button>
      </div>
    );
  }

  const completed = items.filter((i) => i.is_completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{completed}/{items.length} completed</p>
        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completed / items.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-muted/50 group">
            <Checkbox
              checked={item.is_completed}
              onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, completed: !!checked })}
            />
            <span className={`text-sm flex-1 ${item.is_completed ? "line-through text-muted-foreground" : ""}`}>
              {item.item_name}
            </span>
            <Button
              variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
              onClick={() => deleteMutation.mutate(item.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (newItem.trim()) addMutation.mutate(newItem.trim()); }}
        className="flex gap-2"
      >
        <Input placeholder="Add checklist item..." value={newItem} onChange={(e) => setNewItem(e.target.value)} className="text-sm" />
        <Button type="submit" size="sm" disabled={!newItem.trim()}>
          <Plus size={14} />
        </Button>
      </form>
    </div>
  );
};

export default OnboardingChecklist;
