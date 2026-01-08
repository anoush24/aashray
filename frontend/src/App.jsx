import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import MainLayout from "./components/MainLayout";
import SellerInventory from './pages/SellerInventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Shop from './pages/Shop';

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
          <Route path="/user/shop" element={<Shop />} />
          <Route path="/hospital/dashboard" element={<Dashboard />} />   

          <Route path="/seller/inventory" element={<SellerInventory />} />
          <Route path="/seller/add-product" element={<AddProduct />} />
          <Route path="/seller/edit-product/:id" element={<EditProduct />} />
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