import PropTypes from 'prop-types';
import { useState } from 'react';
import { IoMdClose } from "react-icons/io";

import TicketModal  from '../TicketModal';

import styles from './MyTicket.module.css'

export function MyTicket({ event }){
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div className = {styles.container}> 
            {/* <div className = {styles.closeIcon}>
                <IoMdClose />
            </div>
             */}
            <div className = {styles.content}>
                <h2 className = {styles.title}> {event.artista} </h2>
                <p className = {styles.text}> Lugar: {event.lugar} </p>
                <p className = {styles.text}> Fecha: {event.fecha} </p>
                <p className = {styles.text}> Hora de inicio: {event.hora_inicio} </p>
            </div>

            <button
            onClick={() => setShowModal(true)}>
                Ver boleto 
            </button>

            {
                showModal && (
                    <TicketModal
                        event = { event }
                        onClose = {() => setShowModal(false)}
                    />
                )
            }
        </div>
    );
}

MyTicket.propTypes = {
    event: PropTypes.object.isRequired
};