import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, FileText, Download } from "lucide-react";

interface StaffDocumentsProps {
  staffId: string;
}

const StaffDocuments = ({ staffId }: StaffDocumentsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["staff_documents", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_documents")
        .select("*")
        .eq("staff_id", staffId)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop();
      const path = `${staffId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("staff-documents")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("staff-documents").getPublicUrl(path);

      const { error: dbError } = await supabase.from("staff_documents").insert({
        staff_id: staffId,
        document_name: file.name,
        document_type: file.type || ext || "unknown",
        file_url: urlData.publicUrl,
      });
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff_documents", staffId] });
      toast({ title: "Document uploaded" });
    },
    onError: (e: any) => toast({ title: "Upload failed", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (doc: any) => {
      // Delete from storage
      const urlParts = doc.file_url.split("/staff-documents/");
      if (urlParts[1]) {
        await supabase.storage.from("staff-documents").remove([urlParts[1]]);
      }
      const { error } = await supabase.from("staff_documents").delete().eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff_documents", staffId] });
      toast({ title: "Document deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Documents ({documents?.length || 0})</p>
        <div>
          <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploadMutation.isPending}>
            <Upload size={14} className="mr-2" /> {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : !documents?.length ? (
        <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 py-2 px-3 rounded border bg-card group">
              <FileText size={16} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.document_name}</p>
                <p className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><Download size={12} /></a>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(doc)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDocuments;
