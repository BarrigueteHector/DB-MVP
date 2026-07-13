import { useEffect } from "react";
import { useEvent } from "../../context/EventContext";
import { EventCard } from "../../components/EventCard";

import styles from "./Inicio.module.css";

const Inicio = () => {
    const { listEvents, events } = useEvent();

    useEffect(() => {
        listEvents();
    }, []);

    if (events.length === 0)
        return (<h2> No hay eventos </h2>)

    return(
        <div className = { styles.container}>
            <div className = {styles.pageTitle}>
                    <h1> Bienvenido a Distrito Boletos </h1>
            </div>

            <div className = {styles.contentContainer}>
                <div className = {styles.contentSubtitle}>
                    <h2> Próximos eventos </h2>
                </div>

                <div className = {styles.eventCard}>
                    {
                        events.map((event) => (
                            <EventCard 
                                key = {event.id}    
                                event = {event}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Inicio;