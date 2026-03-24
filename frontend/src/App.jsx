import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Staff from './pages/Staff';
import Finance from './pages/Finance';
import Library from './pages/Library';
import Timetable from './pages/Timetable';
import Facilities from './pages/Facilities';
import Portals from './pages/Portals';
import Admissions from './pages/Admissions';
import Placements from './pages/Placements';
import Alumni from './pages/Alumni';
import FacultyFeedback from './pages/FacultyFeedback';
import Research from './pages/Research';
import Counseling from './pages/Counseling';
import Assets from './pages/Assets';
import Exams from './pages/Exams';
import Communication from './pages/Communication';
import LMS from './pages/LMS';
import Reports from './pages/Reports';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import RoleManagement from './pages/RoleManagement';
import InstitutionProfile from './pages/InstitutionProfile';
import SaaSAdmin from './pages/SaaSAdmin';
import ExamEngine from './pages/ExamEngine';
import ApplyNow from './pages/ApplyNow';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Hostel from './pages/Hostel';
import Transport from './pages/Transport';
import Results from './pages/Results';
import DigitalEvaluation from './pages/DigitalEvaluation';
import SignupPage from './pages/SignupPage';
import KnowledgeHub from './pages/KnowledgeHub';

// Modules
import AcademicAAA from './pages/AcademicAAA';
import DeanAR from './pages/DeanAR';
import DepartmentHOD from './pages/DepartmentHOD';
import IPMConsole from './pages/IPMConsole';
import IQACMetrics from './pages/IQACMetrics';

// Industry Level Upgrades
import AIAdvisor from './pages/AIAdvisor';
import Workflows from './pages/Workflows';
import DigitalVault from './pages/DigitalVault';
import DeveloperPortal from './pages/DeveloperPortal';
import SystemHealth from './pages/SystemHealth';
import Marketplace from './pages/Marketplace';
import BIWarehouse from './pages/BIWarehouse';
import SmartCampus from './pages/SmartCampus';
import GlobalAnalytics from './pages/GlobalAnalytics';
import SaasBilling from './pages/SaasBilling';
import FacultyPortal from './pages/FacultyPortal';
import ExamCell from './pages/ExamCell';
import AlumniPortal from './pages/AlumniPortal';
import StrategicAnalytics from './pages/StrategicAnalytics';
import StrategicFinance from './pages/StrategicFinance';
import IntegrityCenter from './pages/IntegrityCenter';
import ComplianceHub from './pages/ComplianceHub';
import StudentOnboarding from './pages/StudentOnboarding';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (!token) {
    if (showLogin) {
      return <Login onLoginSuccess={(newToken) => { setToken(newToken); setShowLogin(false); }} onBack={() => setShowLogin(false)} />;
    }
    if (window.location.pathname === '/signup' || showSignup) {
      return <SignupPage onBack={() => setShowSignup(false)} onSignupSuccess={() => { setShowSignup(false); setShowLogin(true); }} />;
    }
    return <LandingPage onNavigateToLogin={() => setShowLogin(true)} onNavigateToSignup={() => setShowSignup(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="academics" element={<Courses />} />
          <Route path="academics/results" element={<Results />} />
          <Route path="staff" element={<Staff />} />
          <Route path="finance" element={<Finance />} />
          <Route path="library" element={<Library />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="facilities/hostel" element={<Hostel />} />
          <Route path="facilities/transport" element={<Transport />} />
          <Route path="portals" element={<Portals />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="placements" element={<Placements />} />
          <Route path="alumni" element={<Alumni />} />
          <Route path="feedback" element={<FacultyFeedback />} />
          <Route path="research" element={<Research />} />
          <Route path="counseling" element={<Counseling />} />
          <Route path="assets" element={<Assets />} />
          <Route path="exams" element={<Exams />} />
          <Route path="communication" element={<Communication />} />
          <Route path="lms" element={<LMS />} />
          <Route path="reports" element={<Reports />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/roles" element={<RoleManagement />} />
          <Route path="institution-profile" element={<InstitutionProfile />} />
          <Route path="saas-admin" element={<SaaSAdmin />} />
          <Route path="exam-hall" element={<ExamEngine />} />
          <Route path="apply" element={<ApplyNow />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="evaluation-scripts" element={<DigitalEvaluation />} />
          
          {/* New Core Modules */}
          <Route path="academic-aaa" element={<AcademicAAA />} />
          <Route path="dean-ar" element={<DeanAR />} />
          <Route path="department-hod" element={<DepartmentHOD />} />
          <Route path="infrastructure-ipm" element={<IPMConsole />} />
          <Route path="iqac" element={<IQACMetrics />} />
          <Route path="faculty-portal" element={<FacultyPortal />} />
          <Route path="exam-cell" element={<ExamCell />} />
          <Route path="alumni" element={<AlumniPortal />} />
          <Route path="analytics/strategic" element={<StrategicAnalytics />} />
          <Route path="finance/strategic" element={<StrategicFinance />} />
          <Route path="exams/integrity" element={<IntegrityCenter />} />
          <Route path="compliance/strategic" element={<ComplianceHub />} />
          <Route path="students/onboarding" element={<StudentOnboarding />} />
          <Route path="knowledge-hub" element={<KnowledgeHub />} />
          
          {/* New Upgrades */}
          <Route path="ai-advisor" element={<AIAdvisor />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="digital-vault" element={<DigitalVault />} />
          <Route path="developer" element={<DeveloperPortal />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="bi-warehouse" element={<BIWarehouse />} />
          <Route path="smart-campus" element={<SmartCampus />} />
          <Route path="predictions" element={<Dashboard />} /> {/* Dashboard handles analytics hub */}
          <Route path="global-analytics" element={<GlobalAnalytics />} />
          <Route path="saas-billing" element={<SaasBilling />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
