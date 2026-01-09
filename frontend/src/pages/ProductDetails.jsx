import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                
                const { data } = await axios.get(`http://localhost:5000/product/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const { addToCart } = useCart();

const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
};




    if (loading) return <div className="p-20 text-center bg-[#FFFBF7] min-h-screen">Loading details...</div>;
    if (!product) return <div className="p-20 text-center bg-[#FFFBF7] min-h-screen">Product not found.</div>;

    return (
        <div className="min-h-screen bg-[#FFFBF7] p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link to="/user/shop" className="text-[#F17852] font-bold flex items-center gap-2 mb-8 hover:underline">
                    ← Back to Shop
                </Link>

                <div className="bg-white rounded-[40px] shadow-sm border border-orange-50 overflow-hidden flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="md:w-1/2 bg-[#FDECE7]/20 p-8 flex items-center justify-center">
                        <img 
                            src={product.image?.url} 
                            alt={product.name} 
                            className="max-h-[500px] w-full object-contain rounded-3xl transition-transform hover:scale-105 duration-500"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="md:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                        <span className="px-4 py-1 bg-[#FDECE7] text-[#F17852] rounded-full text-sm font-bold w-fit mb-4">
                            {product.category}
                        </span>
                        
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#4A4A4A] mb-4">
                            {product.name}
                        </h1>
                        
                        <p className="text-3xl font-black text-[#F17852] mb-6">
                            ₹{product.price}
                        </p>

                        <div className="border-t border-orange-50 pt-6 mb-8">
                            <h3 className="text-[#4A4A4A] font-bold mb-2">Description</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <span className={`font-bold ${product.countInStock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className={`flex-1 py-4 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 ${product.countInStock > 0 ? 'bg-[#F17852] hover:bg-[#d96645]' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                Add to Cart
                            </button>
                            <button className="flex-1 py-4 rounded-full font-bold text-[#F17852] border-2 border-[#F17852] hover:bg-[#FDECE7] transition-all">
                                Save to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;