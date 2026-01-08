import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    countInStock: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use FormData for multipart/form-data (required for files)
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('countInStock', productData.countInStock);
    formData.append('image', image); // Must match upload.single('image') in backend

    try {
      await axios.post('http://localhost:5000/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user?.accessToken}`
        }
      });
      alert('Product added successfully!');
      navigate('/seller/inventory');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error adding product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-sm border border-orange-50 rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-[#4A4A4A] mb-6">List New Pet Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[#4A4A4A] font-semibold mb-1">Product Name</label>
          <input type="text" name="name" onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" placeholder="e.g. Organic Puppy Food" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#4A4A4A] font-semibold mb-1">Price (₹)</label>
            <input type="number" name="price" onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" placeholder="500" required />
          </div>
          <div>
            <label className="block text-[#4A4A4A] font-semibold mb-1">Stock Quantity</label>
            <input type="number" name="countInStock" onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" placeholder="10" required />
          </div>
        </div>

        <div>
          <label className="block text-[#4A4A4A] font-semibold mb-1">Category</label>
          <select name="category" onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition appearance-none" required>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Toys">Toys</option>
            <option value="Medicine">Medicine</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label className="block text-[#4A4A4A] font-semibold mb-1">Description</label>
          <textarea name="description" onChange={handleChange} rows="3" className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" placeholder="Details about the product..."></textarea>
        </div>

        <div className="bg-[#FDECE7]/30 p-4 rounded-xl border border-dashed border-orange-200">
          <label className="block text-[#4A4A4A] font-semibold mb-2">Product Image</label>
          <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FDECE7] file:text-[#F17852] hover:file:bg-[#FDECE7]/80 cursor-pointer" accept="image/*" required />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-full font-bold text-white shadow-md transition-all active:scale-95 ${loading ? 'bg-gray-300' : 'bg-[#F17852] hover:bg-[#d96645]'}`}
        >
          {loading ? 'Uploading to Cloudinary...' : 'Add Product to Store'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;