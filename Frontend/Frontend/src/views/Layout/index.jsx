import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
// import styles from "./Inicio.module.css";

const Layout = () => {
    return(
        <div>
            <NavBar />
            <Outlet />
        </div>
    )
}

export default Layout;