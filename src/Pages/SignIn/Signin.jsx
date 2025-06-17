import { useState } from "react";
import styles from "../Login/login.module.css";
import SigLogLayout from "../LogIn/SigLogLayout.jsx";

const Signin = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");

    const handleSignin = (e) => {
        e.preventDefault();
        console.log("usuario:", username);
        console.log("contraseña:", password);
        console.log("contraseña repetida:", repeat);
    }
    
    return (
    <SigLogLayout title="Crea una cuenta" subtitle="Ingresa tu correo y contraseña" buttonText="Registrarse" footer="¿Ya tienes una cuenta?" href="/login" footer2="Inicia sesión" onSubmit={handleSignin} emailText={username}
            setEmail={setUsername}
            passwordText={password}
            setPassword={setPassword} repeatPassword={repeat} setRepeat={setRepeat}/>
    )
}

export default Signin