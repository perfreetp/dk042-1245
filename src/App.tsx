import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { Documents } from "@/pages/Documents";
import { Calculation } from "@/pages/Calculation";
import { Milestones } from "@/pages/Milestones";
import { Communications } from "@/pages/Communications";
import { Submission } from "@/pages/Submission";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:id/documents" element={<Documents />} />
          <Route path="projects/:id/calculation" element={<Calculation />} />
          <Route path="projects/:id/milestones" element={<Milestones />} />
          <Route path="projects/:id/communications" element={<Communications />} />
          <Route path="projects/:id/submission" element={<Submission />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
