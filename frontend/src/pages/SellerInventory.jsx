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

    if (loading) return <div className="p-10 text-center">Loading Inventory...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">My Product Inventory</h2>
                <Link 
                    to="/seller/add-product" 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                >
                    + Add New Product
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Product</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Price</th>
                            <th className="p-4 font-semibold text-gray-600">Stock</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map((item) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={item.image.url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{item.category}</td>
                                <td className="p-4 text-gray-700 font-bold">₹{item.price}</td>
                                <td className="p-4 text-gray-600">{item.countInStock} units</td>
                                <td className="p-4 text-center">
                                    <button className="text-blue-500 hover:underline mr-4">Edit</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-500">
                                    No products found. Start by adding your first product!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerInventory;