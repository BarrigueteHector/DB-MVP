import { createContext, useContext, useState } from "react";
import { listEventsRequest, infoEventRequest, buyTicketRequest, myTicketsRequest, createCheckoutSession, confirmPurchaseRequest, validateTicketRequest } from '../api/eventos';

const EventsContext = createContext();

export const useEvent = () => {
    const context = useContext(EventsContext);

    if (!context) {
        throw new Error('useEvent must be used within a EventProvider');
    }

    return context;
}

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null)
    const [tickets, setTickets] = useState([]);
    const [errors, setErrors] = useState([]);

    const listEvents = async () => {
        try{
            const res = await listEventsRequest();
            setEvents(res.data);
        }catch (error){
            setErrors(['Error al listar eventos']);
        }
    }

    const infoEvent = async (id) => {
        setEvent(null);

        try{
            const res = await infoEventRequest(id);
            setEvent(res.data);
        }catch (error){
            setErrors(['Error al obtener información del evento']);
        }
    }

    const buyTicket = async (id) => {
        try{
            const res = await buyTicketRequest(id);
            return res.data;
        }catch (error){
            setErrors(['Error al comprar ticket']);
        }
    }

    const myTickets = async () => {
        try{
            const res = await myTicketsRequest();
            setTickets(res.data);
        }catch (error){
            setErrors(['Error al obtener información de los tickets']);
        }
    }

    const payment = async (tipo_boleto_id) => {
        try {
            const res = await createCheckoutSession(tipo_boleto_id);
            window.location.href = res.data.url;
        } catch (error) {
            setErrors(['Error al pagar'])
        }
    }

    const confirmPurchase = async (id) => {
        try {
            const res = await confirmPurchaseRequest(id);
            return res.data;
        } catch (error) {
            setErrors(['Error al confirmar compra']);
        }
    }

    const validateTicket = async (result) => {
        try {
            const res = await validateTicketRequest(result);
            return res.data;
        } catch (error) {
            setErrors(['Error al validar el ticket']);
        }
    }

    return(
        <EventsContext.Provider value ={{
            listEvents, infoEvent, buyTicket, myTickets, payment, confirmPurchase, validateTicket,
            events, event, tickets, errors
        }}>
            {children}
        </EventsContext.Provider>
    )
}