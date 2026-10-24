import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { StudentLayout } from './layouts/StudentLayout';
import { SystemChatbot } from './components/SystemChatbot';

// ── Lazy-loaded pages (code-split per route for fast mobile first load) ──────
const LandingPage      = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage        = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const Dashboard        = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const StudentProfile   = lazy(() => import('./pages/student/StudentProfile').then(m => ({ default: m.StudentProfile })));
const MyPerformance    = lazy(() => import('./pages/student/MyPerformance').then(m => ({ default: m.MyPerformance })));
const PlacementCell    = lazy(() => import('./pages/student/PlacementCell').then(m => ({ default: m.PlacementCell })));
const InternshipCell   = lazy(() => import('./pages/student/InternshipCell').then(m => ({ default: m.InternshipCell })));
const Transcript       = lazy(() => import('./pages/student/Transcript').then(m => ({ default: m.Transcript })));
const CheckResults     = lazy(() => import('./pages/student/CheckResults').then(m => ({ default: m.CheckResults })));
const ResumeBuilder    = lazy(() => import('./pages/student/ResumeBuilder'));

// Student Placement Pages
const PlacementDashboard = lazy(() => import('./pages/student/PlacementDashboard'));
const JobListings        = lazy(() => import('./pages/student/JobListings'));
const PlacementChecker   = lazy(() => import('./pages/student/PlacementChecker'));
const PlacementStats     = lazy(() => import('./pages/student/PlacementStats'));

// Admin Pages
const StudentList         = lazy(() => import('./pages/admin/StudentList').then(m => ({ default: m.StudentList })));
const BranchList          = lazy(() => import('./pages/admin/BranchList').then(m => ({ default: m.BranchList })));
const StudentForm         = lazy(() => import('./pages/admin/StudentForm').then(m => ({ default: m.StudentForm })));
const TeacherList         = lazy(() => import('./pages/admin/TeacherList').then(m => ({ default: m.TeacherList })));
const TeacherForm         = lazy(() => import('./pages/admin/TeacherForm').then(m => ({ default: m.TeacherForm })));
const AnalyticsDashboard  = lazy(() => import('./pages/admin/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const PredictiveAnalytics = lazy(() => import('./pages/admin/PredictiveAnalytics').then(m => ({ default: m.PredictiveAnalytics })));
const SubjectList         = lazy(() => import('./pages/admin/SubjectList'));
const StudentResults      = lazy(() => import('./pages/admin/StudentResults'));
const MyStudents          = lazy(() => import('./pages/teacher/MyStudents').then(m => ({ default: m.MyStudents })));

// Teacher Pages
const TeacherProfile      = lazy(() => import('./pages/teacher/TeacherProfile').then(m => ({ default: m.TeacherProfile })));
const MarksEntry          = lazy(() => import('./pages/teacher/MarksEntry').then(m => ({ default: m.MarksEntry })));
const TeacherAnalytics    = lazy(() => import('./pages/teacher/TeacherAnalytics').then(m => ({ default: m.TeacherAnalytics })));
const AttendancePage      = lazy(() => import('./pages/teacher/AttendancePage').then(m => ({ default: m.AttendancePage })));
const StudentPerformance  = lazy(() => import('./pages/teacher/StudentPerformance').then(m => ({ default: m.StudentPerformance })));
const TeacherPredictions  = lazy(() => import('./pages/teacher/TeacherPredictions').then(m => ({ default: m.TeacherPredictions })));
const BulkPrediction      = lazy(() => import('./pages/teacher/BulkPrediction'));

// Placement Coordinator Pages
const CoordinatorDashboard = lazy(() => import('./pages/placement/CoordinatorDashboard'));
const JobManagement        = lazy(() => import('./pages/placement/JobManagement'));
const PlacementRecords     = lazy(() => import('./pages/placement/PlacementRecords'));

// Superadmin Portal (hidden — not linked from public UI)
const SuperAdminLogin     = lazy(() => import('./pages/superadmin/SuperAdminLogin'));
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));

// Minimal route-transition loading indicator (no heavy spinner component)
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400 font-medium">Loading…</span>
        </div>
    </div>
);

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
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/get-started" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Default/Admin Dashboard */}
            <Route
              path="/dashboard"
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
              element={<Navigate to="/placement/dashboard" replace />}
            />
            <Route path="/placement/records" element={<ProtectedRoute><PlacementRecords /></ProtectedRoute>} />

            {/* ── Superadmin Portal (hidden from public UI) ──────────────────── */}
            {/* Access: /superadmin-portal  |  Dashboard: /superadmin/dashboard   */}
            <Route path="/superadmin-portal" element={<SuperAdminLogin />} />
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          </Routes>
          </Suspense>
          <SystemChatbot />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
