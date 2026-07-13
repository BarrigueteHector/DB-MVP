import { useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { MyTicket } from "../../components/MyTicket";
import { useEvent } from "../../context/EventContext";

import toast from 'react-hot-toast';

import styles from "./MisBoletos.module.css";

const MisBoletos = () => {
    const { myTickets, tickets, confirmPurchase } = useEvent();
    const [ searchParams ] = useSearchParams();
    
    useEffect(() => {
        myTickets();
    }, []); 

    // useEffect(() => {
    //     if (searchParams.get('success'))
    //         setMessage('¡Compra realizada! Tu boleto ya está disponible')
    // }, [searchParams])

    useEffect(() => {
        const verificarCompra = async () => {
            if(searchParams.get('success') && searchParams.get('id')){
                const res = await confirmPurchase(searchParams.get('id'));
    
                if (res.compraExitosa){
                    toast.success('¡Compra realizada! Tu boleto ya está disponible');
                } else {
                    toast.error('La compra no se pudo confirmar');
                }
            }
        }

        verificarCompra();
    }, [searchParams]);

    if (tickets.length === 0) return (<h2> No has comprado boletos </h2>)

    return(
        <div className = {styles.container}>
            <div className = {styles.pageTitle}>
                <h2> Mis boletos </h2>
            </div>

            <div className = {styles.ticket}>
                {
                    tickets.map((ticket) => (
                        <MyTicket
                            key = { ticket.id }
                            event = { ticket }
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default MisBoletos;