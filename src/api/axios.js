import axios from "axios";

const apiInstance = axios.create({
    baseURL: "https://dummyjson.com",
    headers: {
        "Content-Type": "application/json"
    }
})
export default apiInstance;
// interceptors

apiInstance.interceptors.request.use((config) => {
    // run before request is sent
    console.log("Request sent:", config);
    const token = localStorage.getItem("token");
    if(token){
        config.header.Authorization = `Bearer ${token}`;
    }
    return config;

}, (error) => {
    // Runs if request error happens
    return Promise.reject(error);
})


