import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEvent } from '../../context/EventContext'

import toast from 'react-hot-toast';

const Escaner = () => {
    // const scannerRef = useRef(null);
    const { validateTicket } = useEvent(); 

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250},
            fps: 10,
        });

        scanner.render(
            async (result) => {
                scanner.clear();
                const res = await validateTicket(result);
                if (res.data.valido) {
                    toast.success('Boleto válido');
                } else {
                    toast.error('Boleto inválido');
                }
            },
            (error) => toast.error('Error al escanear el QR')
        );

        return () => scanner.clear();
    }, []);

    return(
        <div id = "reader"/>
    );
};

export default Escaner;