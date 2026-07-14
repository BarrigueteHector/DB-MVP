import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEvent } from '../../context/EventContext'

import toast from 'react-hot-toast';

const Escaner = () => {
    // const scannerRef = useRef(null);
    const { validateTicket } = useEvent(); 
    const [resultado, setResultado] = useState(null);
    const[escaneando, setEscaneando] = useState(true);
    const scannerRef = useRef(null);
    const procesandoRef = useRef(false);

    useEffect(() => {
        if(!escaneando) return;

        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250},
            fps: 10,
        });
        scannerRef.current = scanner;

        scanner.render(
            async (decodedText) => {
                if (procesandoRef.current) return;
                
                procesandoRef.current = true;

                try {
                    await scanner.clear();
                } catch (e) {
                    console.warn('Error al limpiar el escaner:', e);
                }

                setEscaneando(false);
                
                try {
                    const res = await validateTicket(decodedText);
                    if (res.data.valido) {
                        toast.success('Boleto válido');
                        setResultado({ valido: true, info: res.data });
                    } else {
                        toast.error('Boleto inválido');
                        setResultado({ valido: false });
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Error al validar el boleto');
                    setResultado({ valido: false });
                } 
            }, 
            () => {}
        );

        return () => {
            scannerRef.current?.clear().catch(() => {});
        }
    }, [escaneando]);

    const reiniciarEscaneo = () => {
        procesandoRef.current = false;
        setResultado(null);
        setEscaneando(true);
    }
 
    return(
        <div>
            {escaneando && <div id = 'reader' />}


        {
            resultado && (
                <div>
                    {resultado.valido ? (
                        <div>
                            <p> Boleto válido</p>
                        </div>
                    ) : (
                        <p> Boleto inválido</p>
                    )}
                    
                    <button onClick={reiniciarEscaneo}>Escanear otro</button>
                </div>
            )
        }
        </div>
    );
};

export default Escaner;