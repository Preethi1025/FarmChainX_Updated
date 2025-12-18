// frontend/src/api.js
import axios from "axios";

// Replace this URL with your Spring Boot backend URL
const API = axios.create({
  baseURL: "http://localhost:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
