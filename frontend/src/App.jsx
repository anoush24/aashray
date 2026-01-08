import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import MainLayout from "./components/MainLayout"

// --- UPDATED IMPORTS (Pointing directly to pages folder) ---
import AdoptPage from './pages/AdoptPage'; 
// import PetDetailsPage from './pages/PetDetailsPage'; // Assuming you put this here too

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/hospital/dashboard" element={<Dashboard />} />
          <Route path="/user/adopt" element={<AdoptPage />} />

          
          {/* --- ROUTES --- */}
          {/* <Route path="/adopt/:id" element={<PetDetailsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;