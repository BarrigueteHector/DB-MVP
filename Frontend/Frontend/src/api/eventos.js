import axios from './axios';

const listEventsRequest = () => axios.get(`/lista_eventos`);
const infoEventRequest = (id) => axios.get(`/info_evento/${id}`);
const buyTicketRequest = (id) => axios.post(`/comprar_boleto/${id}`);
const myTicketsRequest = () => axios.get(`/mis_boletos`);
const createCheckoutSession = (tipo_boleto_id) => axios.post('/create-checkout-session', {tipo_boleto_id});
const confirmPurchaseRequest = (id) => axios.get(`/confirmar_compra/${id}`);
const validateTicketRequest = (contenido_qr) => axios.get(`/validar_boleto/${contenido_qr}`);

export { listEventsRequest, infoEventRequest, buyTicketRequest, myTicketsRequest, createCheckoutSession, confirmPurchaseRequest, validateTicketRequest }