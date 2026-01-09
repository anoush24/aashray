import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const SellerInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const token = user?.accessToken; 

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get('http://localhost:5000/product/myproducts', config);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching inventory", error);
                setLoading(false);
            }
        };

        if (token) fetchInventory();
    }, [token]);

    const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        try {
            await axios.delete(`http://localhost:5000/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state to remove the item from UI immediately
            setProducts(products.filter(item => item._id !== productId));
            alert("Product deleted successfully");
        } catch (error) {
            console.error("Delete failed:", error.response?.data || error.message);
            alert("Failed to delete product.");
        }
    }
};


    if (loading) return <div className="p-10 text-center">Loading Inventory...</div>;


    return (
        <div className="min-h-screen bg-[#FFFBF7] p-6">
            <div className="max-w-6xl mx-auto">
                
                {/* HEADER SECTION */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                <h2 className="text-3xl font-bold text-[#4A4A4A]">My Product Inventory</h2>
                <p className="text-gray-500 mt-1">Manage and track your listed pet essentials</p>
                    </div>
                <Link 
                    to="/seller/add-product" 
                    className="bg-[#F17852] hover:bg-[#d96645] text-white px-8 py-3 rounded-full transition shadow-md font-bold text-sm"
                >
                    + Add New Product
                </Link>
            </div>

            <div className="bg-white shadow-sm border border-orange-50 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FDECE7] border-b border-orange-100">
                        <tr>
                            <th className="p-5 font-bold text-[#4A4A4A] text-sm tracking-wide">Product</th>
                            <th className="p-5 font-bold text-[#4A4A4A] text-sm tracking-wide">Category</th>
                            <th className="p-5 font-bold text-[#4A4A4A] text-sm tracking-wide">Price</th>
                            <th className="p-5 font-bold text-[#4A4A4A] text-sm tracking-wide">Stock</th>
                            <th className="p-5 font-bold text-[#4A4A4A] text-sm tracking-wide text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50">
                        {products.length > 0 ? products.map((item) => (
                            <tr key={item._id} className="hover:bg-[#FFFBF7]/50 transition">
                                <td className="p-5 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-orange-100 shadow-sm">
                                    <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-[#4A4A4A]">{item.name}</span>
                                </td>
                                <td className="p-5">
                                        <span className="px-3 py-1 bg-[#FDECE7] text-[#F17852] rounded-full text-xs font-bold uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </td>
                                <td className="p-5 text-[#4A4A4A] font-bold text-lg">₹{item.price}</td>
                                <td className="p-5 text-gray-500 font-medium">
                                        {item.countInStock > 0 ? (
                                            `${item.countInStock} units`
                                        ) : (
                                            <span className="text-red-400">Out of Stock</span>
                                        )}
                                    </td>
                                <td className="p-5 text-center">
                                        <div className="flex justify-center items-center gap-4">
                                            <Link 
                                                to={`/seller/edit-product/${item._id}`} 
                                                className="text-[#F17852] font-bold hover:text-[#d96645] transition text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(item._id)} 
                                                className="text-[#F17852] font-bold hover:text-red-500 transition text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-lg mb-4">Your inventory is currently empty.</p>
                                            <Link to="/seller/add-product" className="text-[#F17852] font-bold underline">
                                                Add your first product now
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
};

export default SellerInventory;