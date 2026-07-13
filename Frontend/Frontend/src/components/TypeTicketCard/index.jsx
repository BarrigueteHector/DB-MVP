import { memo } from 'react';

import styles from './TypeTicketCard.module.css'

const TypeTicketCard = ({tipo, precio, boletosDisponibles, onComprar, isAuth}) => {
    return (
        <div className = {styles.container}> 
            <div className = {styles.content}>
                <p className = {styles.text}> { tipo } </p>
                <p className = {styles.text}> ${ precio } MXN </p>
            </div>

            <div className = {styles.boton}>
                <button onClick = { onComprar } disabled = { boletosDisponibles === 0 || !isAuth}> 
                    { boletosDisponibles === 0 ? 'Boletos agotados' : 'Comprar' } 
                </button>
            </div>
        </div>
    );
}

export default memo(TypeTicketCard);