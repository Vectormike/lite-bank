import axios from 'axios';

const apiRequest: any = axios.create({
    baseURL: 'https://swapi.dev/api/'
});

export default apiRequest;

