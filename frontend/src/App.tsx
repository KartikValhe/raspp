import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { StudentLayout } from './layouts/StudentLayout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { MyPerformance } from './pages/student/MyPerformance';
import { PlacementCell } from './pages/student/PlacementCell';
import { InternshipCell } from './pages/student/InternshipCell';
import { Transcript } from './pages/student/Transcript';
import { CheckResults } from './pages/student/CheckResults';
import ResumeBuilder from './pages/student/ResumeBuilder';

// Student Placement Pages
import PlacementDashboard from './pages/student/PlacementDashboard';
import JobListings from './pages/student/JobListings';
import PlacementChecker from './pages/student/PlacementChecker';
import PlacementStats from './pages/student/PlacementStats';


// Admin Pages
import { StudentList } from './pages/admin/StudentList';
import { BranchList } from './pages/admin/BranchList';
import { StudentForm } from './pages/admin/StudentForm';
import { TeacherList } from './pages/admin/TeacherList';
import { TeacherForm } from './pages/admin/TeacherForm';
import { AnalyticsDashboard } from './pages/admin/AnalyticsDashboard';
import { PredictiveAnalytics } from './pages/admin/PredictiveAnalytics';
import SubjectList from './pages/admin/SubjectList';
import StudentResults from './pages/admin/StudentResults';
import { MyStudents } from './pages/teacher/MyStudents';

// Teacher Pages  
import { TeacherProfile } from './pages/teacher/TeacherProfile';
import { MarksEntry } from './pages/teacher/MarksEntry';
import { TeacherAnalytics } from './pages/teacher/TeacherAnalytics';
import { AttendancePage } from './pages/teacher/AttendancePage';
import { StudentPerformance } from './pages/teacher/StudentPerformance';
import { TeacherPredictions } from './pages/teacher/TeacherPredictions';
import BulkPrediction from './pages/teacher/BulkPrediction';

// Placement Coordinator Pages
import CoordinatorDashboard from './pages/placement/CoordinatorDashboard';
import JobManagement from './pages/placement/JobManagement';
import PlacementBulkPrediction from './pages/placement/BulkPrediction';
import PlacementRecords from './pages/placement/PlacementRecords';

const ProtectedRoute: React.FC<{ children: React.ReactNode; layout?: 'standard' | 'student' }> = ({ children, layout = 'standard' }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  // Simple role-based redirect for root path if needed, 
  // but for now we rely on explicit navigation or sidebar links.

  if (layout === 'student') {
    return <StudentLayout>{children}</StudentLayout>;
  }

  return <Layout>{children}</Layout>;
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* ... routes ... */}
            {/* Keeping existing structure but simplified for diff */}

            {/* Default/Admin Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ... other routes omitted for brevity in replace block if I can't match all. 
                Wait, replacing the whole return block is safer or just the wrapping?
                Multi-replace is safer for large files. 
                
                Actually, simpler: Just wrap AuthProvider.
            */}


            {/* Student Portal Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute layout="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute layout="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/results"
              element={
                <ProtectedRoute layout="student">
                  <MyPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/transcript"
              element={
                <ProtectedRoute layout="student">
                  <Transcript />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/check-result"
              element={
                <ProtectedRoute layout="student">
                  <CheckResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/placements"
              element={
                <ProtectedRoute layout="student">
                  <PlacementCell />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/internships"
              element={
                <ProtectedRoute layout="student">
                  <InternshipCell />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resume"
              element={
                <ProtectedRoute layout="student">
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            {/* Student Placement Routes */}
            <Route
              path="/student/placement"
              element={
                <ProtectedRoute layout="student">
                  <PlacementDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/placement/jobs"
              element={
                <ProtectedRoute layout="student">
                  <JobListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/placement/prediction"
              element={
                <ProtectedRoute layout="student">
                  <PlacementChecker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/placement/stats"
              element={
                <ProtectedRoute layout="student">
                  <PlacementStats />
                </ProtectedRoute>
              }
            />

            {/* Student Management */}
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branches"
              element={
                <ProtectedRoute>
                  <BranchList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/new"
              element={
                <ProtectedRoute>
                  <StudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <ProtectedRoute>
                  <StudentForm />
                </ProtectedRoute>
              }
            />

            {/* Teacher Management */}
            <Route
              path="/teachers"
              element={
                <ProtectedRoute>
                  <TeacherList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers/new"
              element={
                <ProtectedRoute>
                  <TeacherForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers/:id"
              element={
                <ProtectedRoute>
                  <TeacherForm />
                </ProtectedRoute>
              }
            />

            {/* Analytics & ML */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predictions"
              element={
                <ProtectedRoute>
                  <PredictiveAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Results Management */}
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <StudentResults />
                </ProtectedRoute>
              }
            />

            {/* Subject Management */}
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <SubjectList />
                </ProtectedRoute>
              }
            />

            {/* Teacher Module */}
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute>
                  <TeacherProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/marks"
              element={
                <ProtectedRoute>
                  <MarksEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute>
                  <MyStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students/:studentId/performance"
              element={
                <ProtectedRoute>
                  <StudentPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/merit"
              element={
                <ProtectedRoute>
                  <StudentResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/analytics"
              element={
                <ProtectedRoute>
                  <TeacherAnalytics />
                </ProtectedRoute>
              }
            />
            {/* Added Prediction Route for Teachers using Admin Component */}
            <Route
              path="/teacher/predictions"
              element={
                <ProtectedRoute>
                  <TeacherPredictions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/bulk-prediction"
              element={
                <ProtectedRoute>
                  <BulkPrediction />
                </ProtectedRoute>
              }
            />

            {/* Placement Coordinator Module */}
            <Route
              path="/placement/dashboard"
              element={
                <ProtectedRoute>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/placement/jobs"
              element={
                <ProtectedRoute>
                  <JobManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/placement/bulk-prediction"
              element={
                <ProtectedRoute>
                  <PlacementBulkPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/placement/records"
              element={
                <ProtectedRoute>
                  <PlacementRecords />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
