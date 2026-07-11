import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import styles from './Registro.module.css';

const Registro = () => {
    const { handleSubmit, register, watch, formState: {errors}} = useForm({
        defaultValues: {
            nombre: '',
            email: '',
            telefono: '',
            password: '',
            confirmPassword: ''
        }
    });

    let navigate = useNavigate();
    const [passwordMatch, setPasswordMatch] = useState(false);
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const { signUp, isAuthenticated, errors: registerErrors } = useAuth();

    useEffect(() =>{
        if (password && confirmPassword){
            setPasswordMatch (password === confirmPassword);
        }
    }, [password, confirmPassword]);

    const handleFormSubmit = async (values) => {
        signUp(values);
    }

    useEffect(() => {
        if (isAuthenticated) navigate ('/');
    }, [isAuthenticated]);

    return(
        <div>
            <div className={styles.containerForm}>
                <h2 className={styles.pageTitle}> Crea tu cuenta </h2>

                {registerErrors.map((error, i) => (
                    <div key={i} className={styles.errorMessage}>
                        {error}
                    </div>
                ))}

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <label className={styles.label}>
                        Nombre 
                        <input type='text' {...register('nombre', { required: 'Nombre requerido'})}/>

                        <p className={styles.errorMessage}> {errors.username?.message} </p>
                    </label>

                    <label className={styles.label}>
                        Apellido paterno
                        <input type='text' {...register('apellido_p', { required: 'Nombre requerido'})}/>

                        <p className={styles.errorMessage}> {errors.username?.message} </p>
                    </label>

                    <label className={styles.label}>
                        Apellido materno
                        <input type='text' {...register('apellido_m')}/>

                        <p className={styles.errorMessage}> {errors.username?.message} </p>
                    </label>
                    
                    <label className={styles.label}>
                        Correo
                        <input type='email' {...register('email', { required: 'Email requerido'})} />

                        <p className={styles.errorMessage}> {errors.email?.message} </p>
                    </label>
                    
                    <label className={styles.label}>
                        Celular
                        <input type='number' {...register('telefono', { required: 'Número requerido', minLength: {value: 10, message: 'Deben ser 10 digítos'}})}/>
                    
                        <p className={styles.errorMessage}> {errors.phoneNumber?.message} </p>
                    </label>
                    
                    <label className={styles.label}>
                        Contraseña
                        <input type='password' {...register('password', { required: 'Contraseña requerida', minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' }})} />

                        <p className={styles.errorMessage}> {errors.password?.message} </p>
                    </label>
                    
                    <label className={styles.label}>
                        Confirmar contraseña
                        <input type='password' {...register('confirmPassword', { required: 'No has confirmado la contraseña', validate: value => value === password || 'Las contraseñas no coinciden'})} />
                    
                        <p className={styles.errorMessage}> {errors.confirmPassword?.message} </p>

                        {passwordMatch && <p className={styles.passMatch}> Las contraseñas coinciden</p>}
                    </label>

                    <p className={styles.aviso}> Dando click al boton Crear cuenta, estás de acuerdo con el <a href={'/AvisoPrivacidad'}> Aviso de privacidad</a></p>
                    
                    <button type="submit" className={styles.submitButton}> Crear cuenta </button>
                </form>
            </div>
        </div>
    )
}

export default Registro;