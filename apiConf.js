// src/api.js

import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTc1ODMwOGNiZmVmMmNiYTcyNmRmMTA4ZDk1NjNmYSIsIm5iZiI6MTcyODQ1NTg0MC4xNzkwODcsInN1YiI6IjY3MDViZDcxMDAwMDAwMDAwMDU4NjY0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CpL1ptC4xa-wkLu8tKocnnrLZu_USeV-Ff3AxK_yVJw';
const BASE_URL = 'https://api.themoviedb.org/3/';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY
    }
});

export default api;
