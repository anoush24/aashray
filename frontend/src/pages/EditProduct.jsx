import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
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
    const [preview, setPreview] = useState(''); // To show current or new image
    const [loading, setLoading] = useState(false);

    // 1. Fetch existing product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/product/${id}`);
                setProductData({
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    category: data.category,
                    countInStock: data.countInStock
                });
                setPreview(data.image.url);
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Could not load product data.");
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Show preview of new image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('description', productData.description);
        formData.append('category', productData.category);
        formData.append('countInStock', productData.countInStock);
        
        // Only append image if a new one was selected
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.put(`http://localhost:5000/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            });
            alert('Product updated successfully!');
            navigate('/seller/inventory');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Error updating product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-sm border border-orange-50 rounded-2xl mt-10">
            <h2 className="text-3xl font-bold text-[#4A4A4A] mb-6">Edit Product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                    <label className="block text-[#4A4A4A] font-semibold mb-1">Product Name</label>
                    <input type="text" name="name" value={productData.name} onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label className="bblock text-[#4A4A4A] font-semibold mb-1">Price (₹)</label>
                        <input type="number" name="price" value={productData.price} onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" required />
                    </div>
                    {/* Stock */}
                    <div>
                        <label className="block text-[#4A4A4A] font-semibold mb-1">Stock Quantity</label>
                        <input type="number" name="countInStock" value={productData.countInStock} onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" required />
                    </div>
                </div>

                {/* Category Dropdown */}
                <div>
                    <label className="block text-[#4A4A4A] font-semibold mb-1">Category</label>
                    <select name="category" value={productData.category} onChange={handleChange} className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" required>
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Toys">Toys</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                {/* Description Textarea */}
                <div>
                    <label className="block text-[#4A4A4A] font-semibold mb-1">Description</label>
                    <textarea name="description" value={productData.description} onChange={handleChange} rows="3" className="w-full p-3 bg-[#FFFBF7] border border-orange-100 rounded-xl focus:ring-2 focus:ring-[#F17852] focus:border-transparent outline-none transition" placeholder="Details about the product..."></textarea>
                </div>

                {/* Image Preview & Input */}
                <div className="bg-[#FDECE7]/30 p-4 rounded-xl border border-dashed border-orange-200">
                    <label className="block text-[#4A4A4A] font-semibold mb-2">Product Image</label>
                    {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-3 border-2 border-white shadow-sm" />}
                    <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FDECE7] file:text-[#F17852] hover:file:bg-[#FDECE7]/80" accept="image/*" />
                </div>

                {/* BUTTON CHANGE: Rounded-full and Brand Orange (#F17852) */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 rounded-full font-bold text-white shadow-md transition-all active:scale-95 ${loading ? 'bg-gray-300' : 'bg-[#F17852] hover:bg-[#d96645]'}`}
                >
                    {loading ? 'Updating Store...' : 'Update Product Details'}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;