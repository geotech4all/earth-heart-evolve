import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, CalendarDays, BookOpen, Users, Building2, UserCog } from "lucide-react";
import WebinarsManager from "@/components/admin/WebinarsManager";
import InsightsManager from "@/components/admin/InsightsManager";
import StaffManager from "@/components/admin/StaffManager";
import DepartmentsManager from "@/components/admin/DepartmentsManager";
import StaffRolesManager from "@/components/admin/StaffRolesManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id, _role: "admin",
      });
      const { data: isHr } = await supabase.rpc("has_role", {
        _user_id: session.user.id, _role: "hr",
      });

      if (!isAdmin && !isHr) { navigate("/admin/login"); return; }
      setUserId(session.user.id);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin/login");
    });

    checkAccess();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container-wide flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-geotech-red rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container-wide py-8">
        <Tabs defaultValue="staff">
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="staff" className="gap-2">
              <Users size={14} /> Staff
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Building2 size={14} /> Departments
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <UserCog size={14} /> Job Roles
            </TabsTrigger>
            <TabsTrigger value="webinars" className="gap-2">
              <CalendarDays size={14} /> Webinars
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <BookOpen size={14} /> Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff">
            <StaffManager userId={userId} />
          </TabsContent>
          <TabsContent value="departments">
            <DepartmentsManager />
          </TabsContent>
          <TabsContent value="roles">
            <StaffRolesManager />
          </TabsContent>
          <TabsContent value="webinars">
            <WebinarsManager userId={userId} />
          </TabsContent>
          <TabsContent value="insights">
            <InsightsManager userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
