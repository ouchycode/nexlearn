import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />; // Belum login, lempar ke Home
  }

  // Jika token ada, tapi bukan admin, dan mencoba akses Dashboard
  // (Asumsi komponen ini hanya membungkus Dashboard dan EditCourse)
  if (role !== "admin") {
    alert("Maaf, area ini khusus Instruktur/Admin!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
