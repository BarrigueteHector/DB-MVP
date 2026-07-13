import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext'
import { useAuth } from '../../context/AuthContext'
import { FaArrowLeft } from "react-icons/fa";
import TypeTicketCard from '../../components/TypeTicketCard'

import toast from 'react-hot-toast';

import styles from './Evento.module.css'

const Evento = () => {
    const { event, infoEvent, payment } = useEvent();
    const { isAuthenticated } = useAuth(); 
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        infoEvent(id);
    }, [id]);

    function handleBack(){
        navigate('/');
    }

    const handleComprar = async (tipo_boleto_id) => {
        try {
            await payment(tipo_boleto_id);
        } catch (error) {
            toast.error('No se pudo procesar la compra. Actualiza la página e intenta nuevamente.');
        }
    }

    if(!event) return <p> Cargando evento... </p>

    return(
        <div className = {styles.container}>
            <div className = {styles.arrowBack}>
                <FaArrowLeft onClick = { handleBack }/>
            </div>
                
            <div className = {styles.containerInfo}>
                <div className = {styles.performer}>
                    <h2> {event.artista} </h2>
                </div>
                <div className = {styles.details}>
                    <p> Lugar: {event.lugar} </p>
                    <p> Fecha: {event.fecha} </p>
                    <p> Hora de inicio: {event.hora_inicio} </p>
                </div>
            </div>

            <div className = {styles.containerBoletos}>
                <div className = {styles.caption}>
                    Boletos
                </div>

                {
                    !isAuthenticated && (
                        <p> Inicia sesión para comprar boletos </p>
                    )
                }
                
                {
                    event.tipos_boleto?.map((tipoBoleto) => (
                        <TypeTicketCard 
                            key = {tipoBoleto.id}
                            tipo = {tipoBoleto.tipo}
                            precio = {tipoBoleto.precio}
                            boletosDisponibles = {tipoBoleto.boletos_disponibles}
                            onComprar = {() => handleComprar(tipoBoleto.id)}
                            isAuth = {isAuthenticated}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Evento;