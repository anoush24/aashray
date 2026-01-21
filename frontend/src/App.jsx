import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import MainLayout from "./components/MainLayout";
import SellerInventory from './pages/SellerInventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import HospitalAppointments from './pages/Hospital/HospitalAppointments';
import UserAppointments from './pages/UserAppointment';
import UserBlogs from './pages/UserBlogs';
import CreateBlog from './pages/CreateBlog';
import BlogPage from './pages/BlogPage';

import PetRescue  from './pages/PetRescue';
import MyRescueRequests from './pages/MyRescueRequests';
// --- UPDATED IMPORTS (Pointing directly to pages folder) ---
import AdoptPage from './pages/AdoptPage'; 
import PetDetailsPage from './pages/PetDetailsPage'
// import PetDetailsPage from './pages/PetDetailsPage'; // Assuming you put this here too


function App() {

  const {user} = useAuth()
  useEffect(()=>{
    const root = document.documentElement;
    root.classList.remove('theme-user');
    if (user?.role === 'user') {
      root.classList.add('theme-user');
    }
  },[user])
  return (
    <>
    <Toaster position="top-right" />
    <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/shop" element={<Shop />} />
          <Route path="/seller/inventory" element={<SellerInventory />} />
          <Route path="/seller/add-product" element={<AddProduct />} />
          <Route path="/seller/edit-product/:id" element={<EditProduct />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/user/adopt" element={<AdoptPage />} />
          <Route path="/user/adopt/pet/:id" element={<PetDetailsPage />} />
          <Route path="/user/appointment" element={<UserAppointments />} />


          <Route path="/hospital/dashboard" element={<HospitalAppointments />} />
          <Route path="/hospital/appointments" element={<HospitalAppointments />} />

          <Route path="/hospital/blogs" element={<UserBlogs />} />
          <Route path="/hospital/blogs/:id" element={<BlogPage />} />
          <Route path="/user/adopt" element={<AdoptPage />} />
          <Route path="/user/adopt/:id" element={<PetDetailsPage />} />
          <Route path="/user/rescue" element={<PetRescue />} />
          <Route path="/user/my-requests" element={<MyRescueRequests />} />
          <Route path="/user/blogs" element={<UserBlogs />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/user/blogs/:id" element={<BlogPage />} />

          
          {/* --- ROUTES --- */}
          {/* <Route path="/adopt/:id" element={<PetDetailsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    </CartProvider>
    </>
  );
}

export default App;