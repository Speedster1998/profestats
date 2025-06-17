import { useState } from "react";
import styles from "./login.module.css";
import SigLogLayout from "./SigLogLayout.jsx"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("usuario:", username);
        console.log("contraseña:", password);
        // lógica de autenticación aquí
    };

    return (
        <SigLogLayout
            title="Ingresa tu cuenta"
            subtitle=""
            buttonText="Iniciar sesión"
            footer="¿No tienes cuenta?"
            href="/signin"
            footer2="Regístrate ahora"
            onSubmit={handleLogin}
            emailText={username}
            setEmail={setUsername}
            passwordText={password}
            setPassword={setPassword}
        />
    );
};
export default Login