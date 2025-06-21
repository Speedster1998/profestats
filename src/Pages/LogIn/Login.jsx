import { useState } from "react";
import SigLogLayout from "./SigLogLayout.jsx"

const Login = ({logFunc}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("email:", email);
        console.log("contraseña:", password);
        
         const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

        if (
            usuarioGuardado &&
            usuarioGuardado.email === email &&
            usuarioGuardado.password === password
        ) {
            console.log("Inicio de sesión exitoso");
            /*localStorage.setItem("logged", "true");
            navigate("/perfil");*/
            logFunc()
        } else {
            console.log("Credenciales incorrectas");
            setWarning("Correo o contraseña incorrectos");
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
