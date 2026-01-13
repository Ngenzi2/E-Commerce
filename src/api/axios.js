import axios from "axios";

const apiInstance = axios.create({
    baseURL: "https://dummyjson.com",
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptors
apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// In your axios.js, add better error handling for DummyJSON
export const productAPI = {
    getAll: (params = {}) => apiInstance.get('/products', { params }),
    getById: (id) => apiInstance.get(`/products/${id}`),
    getCategories: () => apiInstance.get('/products/categories'),
    getByCategory: (category) => apiInstance.get(`/products/category/${category}`),
    search: (query) => apiInstance.get(`/products/search`, { params: { q: query } }),
    create: (product) => {
        // DummyJSON expects specific structure
        const dummyProduct = {
            title: product.title,
            price: product.price,
            description: product.description || '',
            category: product.category || 'uncategorized',
            brand: product.brand || 'Unknown',
            thumbnail: product.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'
        };
        return apiInstance.post('/products/add', dummyProduct);
    },
    update: (id, product) => {
        // DummyJSON is read-only but returns mock response
        const dummyProduct = {
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            brand: product.brand,
            thumbnail: product.thumbnail
        };
        return apiInstance.put(`/products/${id}`, dummyProduct);
    },
    delete: (id) => {
        // DummyJSON is read-only but returns mock response
        return apiInstance.delete(`/products/${id}`);
    },
};

export const authAPI = {
    login: (credentials) => apiInstance.post('/auth/login', credentials),
    getUser: () => apiInstance.get('/auth/me'),
    getAllUsers: () => apiInstance.get('/users'),
    register: (userData) => apiInstance.post('/users/add', userData)
};

export default apiInstance;