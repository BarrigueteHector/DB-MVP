import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

import styles from './InicioSesion.module.css'

const Inicio = () => {
    const { handleSubmit, register, formState: {errors}} = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    let navigate = useNavigate();
    const { signIn, isAuthenticated, errors: signInErrors} = useAuth();

    const handleFormSubmit = (data) => {
        signIn(data);
    }

    useEffect(() => {
        if(isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    return(
        <div>
            <div className={styles.containerForm}>
                <h2 className={styles.pageTitle}> Iniciar sesión </h2>

                {signInErrors.map((error, i) => (
                    <div key={i} className={styles.errorMessage}>
                        {error}
                    </div>
                ))}

                <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
                    <label className={styles.label}>
                        Email
                        <input type='email' {...register('email', { required: 'Email requerido'})}/>

                        <p className={styles.errorMessage}> {errors.email?.message} </p>
                    </label>
                    
                    <label className={styles.label}>
                        Contraseña
                        <input type='password' {...register('password', { required: 'Contraseña requerida'})}/>

                        <p className={styles.errorMessage}> {errors.password?.message} </p> 
                    </label>
            
                    <button type="submit" className={styles.button}> Iniciar sesión </button>            
                </form>

                {/* <Link to="../RecuperarCuenta" className={styles.forgotPassword}> ¿Olvidaste tu contraseña? </Link>
                <Link to="../Registro" className={styles.signUp}> ¿No tienes cuenta? Registrate ahora </Link> */}
            </div>
        </div>
    );
};

export default Inicio;