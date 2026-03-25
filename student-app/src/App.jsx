import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Academics from './pages/Academics';
import Finance from './pages/Finance';
import Settings from './pages/Settings';
import Planner from './pages/Planner';
import Resources from './pages/Resources';
import Identity from './pages/Identity';
import Attendance from './pages/Attendance';
import Syllabus from './pages/Syllabus';
import Support from './pages/Support';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="academics" element={<Academics />} />
          <Route path="finance" element={<Finance />} />
          <Route path="planner" element={<Planner />} />
          <Route path="resources" element={<Resources />} />
          <Route path="identity" element={<Identity />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
