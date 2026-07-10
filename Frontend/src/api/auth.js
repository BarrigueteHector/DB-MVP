import axios from './axios';

const registerRequest = user => axios.post(`/register`, user);
const loginRequest = user => axios.post(`/login`, user);
const logoutRequest = () => axios.post(`/logout`);
const profileRequest = () => axios.get(`/profile`);
const verifyTokenRequest = () => axios.get(`/verify`);

export { registerRequest, loginRequest, logoutRequest, profileRequest, verifyTokenRequest }