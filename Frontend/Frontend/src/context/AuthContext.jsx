import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, registerRequest, logoutRequest, profileRequest, verifyTokenRequest } from '../api/auth';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const signUp = async (user) => {
        try {
            const res = await registerRequest(user);
            // console.log(res.data);
            setIsAuthenticated(true);
            setUser(res.data)
        } catch (error) {
            setErrors(error.response.data);
        }
    }

    const signIn = async (user) => {
        try {
            const res = await loginRequest(user);
            // console.log(res.data);
            setIsAuthenticated(true);
            setUser(res.data)
        } catch (error) {
            if(Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const logOut = async () => {
        await logoutRequest();
        setIsAuthenticated(false);
        setUser(null);
    }

    const myProfile = async () => {
            try {
                const res = await profileRequest();
                return res.data;
            } catch (error) {
                setErrors(['Error al obtener la información del usuario']);
            }
        }

    // Limpiar errores después de 5 segundos
    useEffect(() => {
        if(errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        async function checkLogin(){
            try {
                const res = await verifyTokenRequest();
                setIsAuthenticated(true);
                setUser(res.data);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            signUp, signIn, logOut, myProfile,
            user, isAuthenticated, errors, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}