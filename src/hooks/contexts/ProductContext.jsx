import React, { useState, useContext, createContext, useEffect } from "react";
import { productAPI } from "../../api/axios";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [apiProducts, setApiProducts] = useState([]);
    const [localProducts, setLocalProducts] = useState([]); // All products stored locally
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Initialize with data from localStorage
    useEffect(() => {
        loadProducts();
    }, [user?.id]);

    // Load all products from localStorage
    const loadLocalProducts = () => {
        const storedProducts = localStorage.getItem(`all_products_${user?.id}`);
        if (storedProducts) {
            const parsed = JSON.parse(storedProducts);
            // Separate API and local products
            const apiProds = parsed.filter(p => p.source === 'api' || !p.isLocal);
            const localProds = parsed.filter(p => p.source === 'local' || p.isLocal);
            setApiProducts(apiProds);
            setLocalProducts(localProds);
            return parsed;
        }
        return [];
    };

    // Save all products to localStorage
    const saveAllProducts = (products) => {
        localStorage.setItem(`all_products_${user?.id}`, JSON.stringify(products));
    };

    // Load all products
    const loadProducts = async () => {
        try {
            setLoading(true);
            
            // Load from localStorage first
            loadLocalProducts();
            
            // Then fetch fresh API products
            await fetchApiProducts();
            
        } catch (error) {
            console.error('Error loading products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products from API
    const fetchApiProducts = async (params = {}) => {
        try {
            const response = await productAPI.getAll(params);
            
            if (response.data && response.data.products) {
                const products = response.data.products.map(product => ({
                    ...product,
                    isLocal: false,
                    source: 'api',
                    // Ensure we have all required fields
                    price: Number(product.price) || 0,
                    stock: Number(product.stock) || 0,
                    rating: Number(product.rating) || 0,
                    category: product.category || 'uncategorized',
                    brand: product.brand || 'Unknown',
                    thumbnail: product.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'
                }));
                
                setApiProducts(products);
                
                // Save to localStorage
                const allProducts = [...products, ...localProducts];
                saveAllProducts(allProducts);
                
                return products;
            }
            return [];
        } catch (error) {
            console.error('Error fetching API products:', error);
            setError(error.message);
            return apiProducts;
        }
    };

    // Get ALL products (API + Local combined)
    const getAllProducts = () => {
        // Combine API products and local products
        return [...apiProducts, ...localProducts];
    };

    // Get user's local products only
    const getLocalProducts = () => {
        return localProducts;
    };

    // Helper function to check if a product is local
    const isLocalProduct = (productId) => {
        return String(productId).startsWith('local_');
    };

    // Create a new product
    const createProduct = async (productData) => {
        try {
            setLoading(true);
            
            // Always create as local first for immediate display
            const localId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const newProduct = {
                ...productData,
                id: localId,
                userId: user?.id,
                isLocal: true,
                source: 'local',
                createdAt: new Date().toISOString(),
                // Ensure all required fields have values
                price: Number(productData.price) || 0,
                stock: Number(productData.stock) || 0,
                rating: Number(productData.rating) || 0,
                category: productData.category || 'uncategorized',
                brand: productData.brand || 'Unknown',
                thumbnail: productData.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image',
                // Set defaults for optional fields
                description: productData.description || '',
                images: productData.images || []
            };
            
            console.log('Creating new product:', newProduct);
            
            // Add to local products
            const updatedLocalProducts = [...localProducts, newProduct];
            setLocalProducts(updatedLocalProducts);
            
            // Save all products to localStorage
            const allProducts = [...apiProducts, ...updatedLocalProducts];
            saveAllProducts(allProducts);
            
            console.log('Product saved to localStorage with key:', `all_products_${user?.id}`);
            console.log('LocalStorage content:', localStorage.getItem(`all_products_${user?.id}`));
            
            // Try API in background (optional)
            try {
                const apiResponse = await productAPI.create({
                    title: productData.title,
                    description: productData.description || '',
                    price: Number(productData.price) || 0,
                    category: productData.category || 'uncategorized',
                    brand: productData.brand || 'Unknown',
                    thumbnail: productData.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'
                });
                console.log('API response (mock):', apiResponse.data);
            } catch (apiError) {
                console.log('API create failed (expected for DummyJSON):', apiError.message);
            }
            
            return newProduct;
            
        } catch (error) {
            console.error('Error creating product:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete a product
    const deleteProduct = async (productId) => {
        try {
            setLoading(true);
            
            const productIdStr = String(productId);
            const isLocal = isLocalProduct(productIdStr);
            
            if (isLocal) {
                // Remove from local products
                const updatedLocalProducts = localProducts.filter(p => p.id !== productIdStr);
                setLocalProducts(updatedLocalProducts);
            } else {
                // Try API delete for API products
                try {
                    await productAPI.delete(productId);
                    console.log('API delete attempted for:', productId);
                } catch (apiError) {
                    console.log('API delete failed (expected):', apiError.message);
                }
                
                // Remove from API products
                const updatedApiProducts = apiProducts.filter(p => String(p.id) !== productIdStr);
                setApiProducts(updatedApiProducts);
            }
            
            // Save updated products to localStorage
            const allProducts = isLocal ? [...apiProducts, ...localProducts] : [...apiProducts, ...localProducts];
            saveAllProducts(allProducts);
            
            console.log('Product deleted:', productIdStr);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update a product
    const updateProduct = async (productId, productData) => {
        try {
            setLoading(true);
            
            const productIdStr = String(productId);
            const isLocal = isLocalProduct(productIdStr);
            
            let updatedProduct;
            
            if (isLocal) {
                // Update in local products
                const productIndex = localProducts.findIndex(p => p.id === productIdStr);
                if (productIndex === -1) {
                    throw new Error('Local product not found');
                }
                
                updatedProduct = {
                    ...localProducts[productIndex],
                    ...productData,
                    updatedAt: new Date().toISOString()
                };
                
                const updatedLocalProducts = [...localProducts];
                updatedLocalProducts[productIndex] = updatedProduct;
                setLocalProducts(updatedLocalProducts);
                
            } else {
                // Try API update for API products
                try {
                    const apiResponse = await productAPI.update(productId, {
                        title: productData.title,
                        description: productData.description,
                        price: productData.price,
                        category: productData.category,
                        brand: productData.brand,
                        thumbnail: productData.thumbnail
                    });
                    
                    updatedProduct = {
                        ...apiResponse.data,
                        isLocal: false,
                        source: 'api'
                    };
                    
                    console.log('API update attempted:', updatedProduct);
                    
                } catch (apiError) {
                    console.log('API update failed, updating locally:', apiError.message);
                    
                    // Update locally if API fails
                    const productIndex = apiProducts.findIndex(p => String(p.id) === productIdStr);
                    if (productIndex === -1) {
                        throw new Error('API product not found');
                    }
                    
                    updatedProduct = {
                        ...apiProducts[productIndex],
                        ...productData,
                        updatedAt: new Date().toISOString()
                    };
                }
                
                // Update in API products
                const updatedApiProducts = apiProducts.map(p => 
                    String(p.id) === productIdStr ? updatedProduct : p
                );
                setApiProducts(updatedApiProducts);
            }
            
            // Save all products to localStorage
            const allProducts = [...apiProducts, ...localProducts];
            saveAllProducts(allProducts);
            
            console.log('Product updated:', updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get user's products (both local)
    const getUserProducts = () => {
        return localProducts;
    };

    // Search products
    const searchProducts = async (query) => {
        try {
            setLoading(true);
            
            let apiResults = [];
            try {
                const response = await productAPI.search(query);
                apiResults = response.data?.products || [];
            } catch (apiError) {
                console.log('Using local search only:', apiError.message);
            }
            
            // Search in local products
            const localResults = localProducts.filter(product =>
                Object.values(product).some(value =>
                    value && String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
            
            // Combine results
            const allResults = [...apiResults, ...localResults];
            return allResults;
        } catch (error) {
            console.error('Error searching products:', error);
            
            // Fallback to local search
            const localResults = localProducts.filter(product =>
                Object.values(product).some(value =>
                    value && String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
            
            return localResults;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        // State - combined products
        products: getAllProducts(),
        userProducts: getUserProducts(),
        allProducts: getAllProducts(),
        loading,
        error,
        
        // Separate states if needed
        apiProducts,
        localProducts,
        
        // Actions
        fetchProducts: fetchApiProducts,
        createProduct,
        deleteProduct,
        updateProduct,
        searchProducts,
        loadProducts,
        
        // Utilities
        clearError: () => setError(null),
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};