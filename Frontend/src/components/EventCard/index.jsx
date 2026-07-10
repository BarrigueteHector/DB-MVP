import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import styles from './EventCard.module.css'

export function EventCard({ event }){
    const navigate = useNavigate();

    const handleDetalles = (id) => {
        navigate(`/evento/${id}`);
    }
    
    return (
        <div className = {styles.container}> 
            <div className = {styles.content}>
                <h2 className = {styles.title}> {event.artista} </h2>
                <p className = {styles.text}> Lugar: {event.lugar} </p>
                <p className = {styles.text}> Fecha: {event.fecha} </p>
                <p className = {styles.text}> Hora de inicio: {event.hora_inicio} </p>
            </div>

            <button
            onClick={() => handleDetalles(event.id)}>
                { event.total_boletos === 0 ? 'Sin boletos' : 'Detalles' } 
            </button>
        </div>
    );
}

EventCard.propTypes = {
    event: PropTypes.object.isRequired
};