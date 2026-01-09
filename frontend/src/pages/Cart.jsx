import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <div className="min-h-screen bg-[#FFFBF7] p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-[#4A4A4A] mb-10">Your Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Items List */}
                    <div className="lg:w-2/3 space-y-6">
                        {cartItems.length === 0 ? (
                            <div className="bg-white p-10 rounded-3xl text-center border border-orange-50">
                                <p className="text-gray-400 mb-4">Your cart is empty!</p>
                                <Link to="/user/shop" className="text-[#F17852] font-bold underline">Go Shopping</Link>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item._id} className="bg-white p-6 rounded-3xl flex items-center gap-6 shadow-sm border border-orange-50">
                                    <img src={item.image.url} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#4A4A4A]">{item.name}</h3>
                                        <p className="text-[#F17852] font-bold">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={item.qty} 
                                            onChange={(e) => updateQuantity(item._id, e.target.value)}
                                            className="bg-[#FFFBF7] border border-orange-100 rounded-lg p-1 outline-none"
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 transition">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/*Summary Card */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-[32px] shadow-md border border-orange-50 sticky top-10">
                            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold">Free</span>
                                </div>
                                <div className="border-t border-orange-50 pt-4 flex justify-between text-xl font-bold text-[#4A4A4A]">
                                    <span>Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-[#F17852] hover:bg-[#d96645] text-white rounded-full font-bold shadow-lg transition-all active:scale-95">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;