import { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

import styles from './MiPerfil.module.css';

const MiPerfil = () => {
    const { register, setValue } = useForm();
    // const params = useParams();
    // const navigate = useNavigate();
    const { myProfile } = useAuth();
    
    useEffect(() => {
        async function loadUser(){
            const user = await myProfile();
            
            setValue('nombre', user.nombre);
            setValue('apellido_p', user.apellido_p);
            setValue('apellido_m,', user.apellido_m);
            setValue('email', user.email);
            setValue('telefono', user.telefono);
        }

        loadUser();
    }, [])
    
    return(
        <div className = {styles.container}>
            <div className = {styles.titlePage}>
                <h2> Mi perfil </h2>
            </div>

            <div className = {styles.form}>
                <form className={styles.form}>
                    <label className={styles.label}>
                        Nombre
                        <input type="text" {...register('nombre')} readOnly/>
                    </label>
                    <label className={styles.label}>
                        Apellido paterno
                        <input type="text" {...register('apellido_p')} readOnly/>
                    </label>
                    <label className={styles.label}>
                        Apellido materno
                        <input type="text" {...register('apellido_m')} readOnly/>
                    </label>
                    <label className={styles.label}>
                        Correo
                        <input type="email" {...register('email')} readOnly/>
                    </label>
                    <label className={styles.label}>
                        Teléfono  
                        <input type="text" {...register('telefono')} readOnly/>
                    </label>
                </form>
            </div>
        </div>
    )
}

export default MiPerfil;