import { useState, useContext, createContext, useEffect } from "react";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load products from localStorage on mount
    useEffect(() => {
        loadProductsFromStorage();
    }, []);

    const loadProductsFromStorage = () => {
        try {
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                setProducts(parsedProducts);
                console.log('Products loaded from localStorage:', parsedProducts.length);
            }
        } catch (error) {
            console.error('Error loading products from localStorage:', error);
        }
    };

    const saveProductsToStorage = (productsToSave) => {
        try {
            localStorage.setItem('products', JSON.stringify(productsToSave));
            console.log('Products saved to localStorage:', productsToSave.length);
        } catch (error) {
            console.error('Error saving products to localStorage:', error);
        }
    };

    const updateProducts = (newProducts) => {
        setProducts(newProducts);
        saveProductsToStorage(newProducts);
    };

    const addProduct = (newProduct) => {
        const updatedProducts = [...products, newProduct];
        updateProducts(updatedProducts);
        console.log('Product added and stored:', newProduct);
    };

    const removeProduct = (productId) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        updateProducts(updatedProducts);
    };

    const value = {
        products,
        setProducts: updateProducts,
        loading,
        setLoading,
        error,
        setError,
        addProduct,
        removeProduct,
        loadProductsFromStorage,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
