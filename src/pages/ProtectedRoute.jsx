import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  if (isLoggedIn.isLoggedIn) {
    return children;
  } else {
    return <Navigate to='/users/login' replace />;
  }
}
