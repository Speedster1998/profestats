import { useState } from "react";
import styles from "./login.module.css";
import SigLogLayout from "./SigLogLayout.jsx"
import { UserService } from "../../Services/user_services.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("email:", email);
        console.log("contraseña:", password);
        // lógica de autenticación aquí
        const response = UserService.login(email,password);
        if (response !== null){
            // Ingresar pagina
            navigate('/filtrogeneral');
            console.log(response)
        } else {
            // Rebotar restriccion  
            setWarning('Usuario o cnotraseña equivocados')
        }
    };

    return (
        <>
            <SigLogLayout
                title="Ingresa tu cuenta"
                subtitle=""
                buttonText="Iniciar sesión"
                footer="¿No tienes cuenta?"
                href="/signin"
                footer2="Regístrate ahora"
                onSubmit={handleLogin}
                emailText={email}
                setEmail={setEmail}
                passwordText={password}
                setPassword={setPassword}
                warningText={warning}
            />
        </>
    );
};
export default Login