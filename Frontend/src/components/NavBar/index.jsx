import { useLocation, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { useAuth } from '../../context/AuthContext';

import styles from "./NavBar.module.css";

const NavBar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logOut, isAuthenticated, user } = useAuth();

    const handleTabClick = (path) => {
        navigate(`${path}`);
    };

    const handleLogout = () => {
        logOut();
        navigate('/');
    };

    // console.log('user:', user, 'rol:', user?.rol);

    return(
        <nav className = {styles.navbar}>
            {isAuthenticated ? (
                <>
                    <div className = {styles.container_button}>
                        <div className={styles.nav_button}>
                            <button
                            onClick={() => handleTabClick('/')} 
                            className={`${pathname === '/' ? styles.active: ''}`}> 
                                Inicio 
                            </button>        
                        </div>

                        {
                            user?.rol === 'staff' ? (
                                <>
                                    <div className={styles.nav_button}>
                                        <button
                                        onClick={() => handleTabClick('/escaner')} 
                                        className={`${pathname.includes('escaner') ? styles.active: ''}`}> 
                                            Escáner
                                        </button>    
                                    </div>
                                </>
                            ):(
                                <>
                                    <div className={styles.nav_button}>
                                        <button
                                        onClick={() => handleTabClick('/mis-boletos')} 
                                        className={`${pathname.includes('mis-boletos') ? styles.active: ''}`}> 
                                            Mis boletos 
                                        </button>    
                                    </div>
                                </>
                            )
                        }

                        {/* <div className={styles.nav_button}>
                            <button
                            onClick={() => handleTabClick('/mis-boletos')} 
                            className={`${pathname.includes('mis-boletos') ? styles.active: ''}`}> 
                                Mis boletos 
                            </button>    
                        </div> */}
                    
                        <div className = {styles.nav_button}>
                            <button
                            onClick={() => handleTabClick('/mi-perfil')} 
                            className={`${pathname.includes('mi-perfil') ? styles.active: ''}`}> 
                                Mi perfil 
                            </button>
                        </div>
                        
                        <div className = {styles.nav_button}>
                            <button onClick = { handleLogout }> Cerrar sesión </button>
                        </div>
                    </div>
                </>
            ):(
                <>
                    <div className={styles.container_button}>
                        <div className = {styles.nav_button}>
                            <button 
                            onClick={() => handleTabClick('/')} 
                            className={`${pathname === '/' ? styles.active: ''}`}>     
                                Inicio 
                            </button>
                        </div>
                        
                        <div className = {styles.nav_button}>
                            <button 
                            onClick={() => handleTabClick('/inicio-sesion')} 
                            className={`${pathname.includes('inicio-sesion') ? styles.active: ''}`}> 
                                Inicio de sesión
                            </button>
                        </div>
                        
                        <div className = {styles.nav_button}> 
                            <button 
                            onClick={() => handleTabClick('/registro')} 
                            className={`${pathname.includes('registro') ? styles.active: ''}`}> 
                                Registro 
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}

export default memo(NavBar);