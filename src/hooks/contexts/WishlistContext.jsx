import React, { useState, useContext, createContext, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children}) => {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    },[wishlist]);

    // add item to wishlist

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(item => item.id === product.id)){
                return prev;
            }
            return [...prev, product];
        });

    };

    // remove

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
    };

    // is in wishlist

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}