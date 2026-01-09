import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Public route: no token needed for browsing
                const { data } = await axios.get('http://localhost:5000/product');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching shop products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="p-20 text-center text-[#4A4A4A] bg-[#FFFBF7] min-h-screen">Loading Store...</div>;

    return (
        <div className="min-h-screen bg-[#FFFBF7] p-6">
            <div className="max-w-7xl mx-auto">
                
                {/* --- SHOP HEADER --- */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[#4A4A4A]">Pet Store</h1>
                    <p className="text-gray-500 mt-2 italic">Everything your furry friend needs, curated with love.</p>
                </div>

                {/* --- PRODUCT GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.length > 0 ? products.map((product) => (
                        /* CARD: Matches the 'Bruno/Luna' card style */
                        <div 
                            key={product._id} 
                            className="bg-white border border-orange-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                        >
                            {/* Product Image Container */}
                            <div className="relative h-64 w-full bg-[#FDECE7]/20 overflow-hidden">
                                <img 
                                    src={product.image.url} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Category Tag Pill */}
                                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-[#F17852] rounded-full text-xs font-bold shadow-sm">
                                    {product.category}
                                </span>
                            </div>

                            {/* Product Info */}
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-[#4A4A4A] mb-1">{product.name}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-1">{product.description}</p>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-2xl font-black text-[#F17852]">₹{product.price}</span>
                                    
                                    <Link 
                                        to={`/product/${product._id}`}
                                        className="bg-[#F17852] hover:bg-[#d96645] text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-sm"
                                    >
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full p-20 text-center text-gray-400">
                            No products available in the store yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;