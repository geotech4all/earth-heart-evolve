import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar } from "lucide-react";
import OnboardingChecklist from "./OnboardingChecklist";
import StaffDocuments from "./StaffDocuments";
import type { Tables } from "@/integrations/supabase/types";

type Staff = Tables<"staff">;

const statusColors: Record<string, string> = {
  onboarding: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-600",
};

interface StaffProfileProps {
  staff: any; // includes joined departments and staff_roles
  onBack: () => void;
}

const StaffProfile = ({ staff, onBack }: StaffProfileProps) => {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft size={14} className="mr-2" /> Back to Staff List
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {staff.first_name} {staff.last_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {staff.staff_roles?.name || "No role assigned"}
              </p>
            </div>
            <Badge variant="secondary" className={statusColors[staff.status] || ""}>
              {staff.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={14} /> {staff.email}
            </div>
            {staff.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={14} /> {staff.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 size={14} /> {staff.departments?.name || "No department"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} /> Hired: {new Date(staff.hire_date).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="onboarding">
        <TabsList>
          <TabsTrigger value="onboarding">Onboarding Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="onboarding">
          <Card>
            <CardContent className="pt-6">
              <OnboardingChecklist staffId={staff.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              <StaffDocuments staffId={staff.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffProfile;
