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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-orange-600 mb-6">List New Pet Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
          <input type="text" name="name" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" placeholder="e.g. Organic Puppy Food" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Price (₹)</label>
            <input type="number" name="price" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" placeholder="500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Stock Quantity</label>
            <input type="number" name="countInStock" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" placeholder="10" required />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Category</label>
          <select name="category" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" required>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Toys">Toys</option>
            <option value="Medicine">Medicine</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea name="description" onChange={handleChange} rows="3" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Details about the product..."></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Product Image</label>
          <input type="file" onChange={handleFileChange} className="w-full text-gray-600" accept="image/*" required />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {loading ? 'Uploading to Cloudinary...' : 'Add Product to Store'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;