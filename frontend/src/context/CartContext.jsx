import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    
    useEffect(() => {
        const savedCart = localStorage.getItem('petUnityCart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    
    useEffect(() => {
        localStorage.setItem('petUnityCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x._id === product._id);
            if (existItem) {
                return prevItems.map((x) =>
                    x._id === product._id ? { ...existItem, qty: existItem.qty + quantity } : x
                );
            }
            return [...prevItems, { ...product, qty: quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
    };

    const updateQuantity = (id, qty) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => (item._id === id ? { ...item, qty: Number(qty) } : item))
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);