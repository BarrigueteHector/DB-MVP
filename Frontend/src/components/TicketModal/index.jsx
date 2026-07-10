import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import styles from './TicketModal.module.css';

const TicketModal = ({ event, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

          <button className={styles.closeBtn} onClick={onClose}>✕</button>

          <h2 className={styles.artista}>{event.artista}</h2>

          <div className={styles.info}>
            <p><span>Lugar:</span> {event.lugar}</p>
            <p><span>Fecha:</span> {event.fecha}</p>
            <p><span>Hora:</span> {event.hora_inicio}</p>
            <p><span>Tipo:</span> {event.tipo}</p>
            <p><span>Sección:</span> {event.seccion || 'N/A'}</p>
            <p><span>Asiento:</span> {event.asiento || 'N/A'}</p>
          </div>

          <div className={styles.qr}>
            <QRCodeSVG value={String(event.contenido_qr)} size={180} />
          </div>
        </div>
      </div>

    )
}

export default TicketModal;