import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import EditCourse from "./pages/EditCourse";
import ProtectedRoute from "./components/ProtectedRoute";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- HALAMAN PUBLIC & STUDENT --- */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/profile" element={<Profile />} />

        {/* --- HALAMAN KHUSUS ADMIN (DILINDUNGI) --- */}
        {/* Hanya Admin yang boleh masuk Dashboard & Edit */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute>
              <EditCourse />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
