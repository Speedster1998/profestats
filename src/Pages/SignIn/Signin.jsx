import { useState } from "react";
import styles from "../Login/login.module.css";
import SigLogLayout from "../LogIn/SigLogLayout.jsx";
import { useNavigate } from "react-router-dom";

const Signin = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [warning, setWarning] = useState("");
    const navigate = useNavigate()

    const handleSignin = (e) => {
        e.preventDefault();
        console.log("usuario:", username);
        console.log("email:", email);
        console.log("contraseña:", password);
        console.log("contraseña repetida:", repeat);
        if(username === ""){
            setWarning("Se necesita un usuario")
        }
        else if (email === "") {
            setWarning("Se necesita un correo")
        }else if (password === "") {
            setWarning("Se necesita una contraseña")
        }else if(password !== repeat){
            setWarning("Las contraseñas no coiciden")
        }else{
            setWarning("")

            const nuevoUsuario = {
                username,
                email,
                password
            };

            localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));

            // Opcional: limpiar el formulario
            setUsername("");
            setEmail("");
            setPassword("");
            setRepeat("");

            // Redirigir si quieres
            navigate("/login");
        }
    }
    
    return (
    <SigLogLayout title="Crea una cuenta" subtitle="Ingresa tu correo y contraseña" buttonText="Registrarse" footer="¿Ya tienes una cuenta?" href="/login" footer2="Inicia sesión" onSubmit={handleSignin} emailText={email}
            setEmail={setEmail}
            passwordText={password}
            setPassword={setPassword} repeatPassword={repeat} setRepeat={setRepeat} username={username} setUsername={setUsername} warningText={warning}/>
    )
}

export default Signin