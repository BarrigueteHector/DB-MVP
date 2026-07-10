import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../views/Layout";
import Inicio from "../views/Inicio";
import InicioSesion from "../views/InicioSesion";
import Registro from "../views/Registro";
import ComprarBoleto from "../views/ComprarBoleto";
import MisBoletos from "../views/MisBoletos";
import Evento from "../views/Evento";
import Error404 from "../views/Error404";
import MiPerfil from '../views/MiPerfil';
import Escaner from "../views/Escaner";

import ProtectedRoute from "../ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children:[
            {
                path: '',
                element: <Inicio />,
                errorElement: <Error404 />
            },
            {
                path: 'inicio-sesion',
                element: <InicioSesion />,
                errorElement: <Error404 />
            },
            {
                path: 'registro',
                element: <Registro />,
                errorElement: <Error404 />
            },
            {
                path: 'mis-boletos',
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '',
                        element: <MisBoletos />,
                    }
                ],
                errorElement: <Error404 />
            },
            {
                path: 'mi-perfil',
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '',
                        element: <MiPerfil />,
                    }
                ],
                errorElement: <Error404 />
            },        
        ]
    },
    {
        path: "/comprar-boleto/:eventoId",
        element: <ComprarBoleto />,
        errorElement: <Error404 />
    },
    {
        path: '/evento/:id',
        element: <Evento />,
        errorElement: <Error404 />
    },
    {
        path: '/escaner',
        element: <ProtectedRoute />,
        children: [
            {
                path:'',
                element: <Escaner />
            }
        ],
        errorElement: <Error404 />
    }
]);

const MyRoutes = () => <RouterProvider router={router} />;

export default MyRoutes;