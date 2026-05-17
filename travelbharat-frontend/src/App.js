import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import StatePage from "./pages/StatePage";
import PlaceDetails from "./pages/PlaceDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPortal from "./pages/AdminPortal";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./AuthContext";
import "./App.css";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const PrivateRoute = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />;

  const handleAddContent = () => {
    setShowAddModal(true);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar onAddContent={isAuthenticated ? handleAddContent : null} />
        <main className="container">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/state/:id"
              element={
                <PrivateRoute>
                  <StatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/place/:id"
              element={
                <PrivateRoute>
                  <PlaceDetails />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route
              path="*"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
