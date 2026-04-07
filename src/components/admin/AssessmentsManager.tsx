import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceReviews from "./PerformanceReviews";
import ProjectAssessments from "./ProjectAssessments";
import StaffCompetencies from "./StaffCompetencies";

const AssessmentsManager = ({ userId }: { userId: string }) => {
  return (
    <Tabs defaultValue="performance">
      <TabsList>
        <TabsTrigger value="performance">Performance Reviews</TabsTrigger>
        <TabsTrigger value="project">Project Assessments</TabsTrigger>
        <TabsTrigger value="competencies">Competencies</TabsTrigger>
      </TabsList>
      <TabsContent value="performance"><PerformanceReviews userId={userId} /></TabsContent>
      <TabsContent value="project"><ProjectAssessments userId={userId} /></TabsContent>
      <TabsContent value="competencies"><StaffCompetencies /></TabsContent>
    </Tabs>
  );
};

export default AssessmentsManager;
