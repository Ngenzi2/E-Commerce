import axios from "axios";

const apiInstance = axios.create({
    baseURL: "https://dummyjson.com",
    headers: {
        "Content-Type": "application/json"
    }
})

// interceptors

apiInstance.interceptors.request.use((config) => {
    // run before request is sent
    console.log("Request sent:", config);
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

}, (error) => {
    // Runs if request error happens
    return Promise.reject(error);
});

export const productAPI = {
    getAll: (params = {}) => apiInstance.get('/products', {params}),
    getById: (id) => apiInstance.get(`/products/${id}`),
    getCategories: () => apiInstance.get('/products/categories'),
    getByCategory: (category) => apiInstance.get(`/products/categories/${category}`),

    // Crud

    create: (product) => apiInstance.post('/product/add', product),
    update: (id, product) => apiInstance.put(`/products/${id}`, product),
    delete: (id) => apiInstance.delete(`/products/${id}`),
};

export const AuthAPI = {
    login: (credential) => apiInstance.post('/auth/login', credential),
    getUser: () => apiInstance.get('/auth/me')
};

export default apiInstance;


