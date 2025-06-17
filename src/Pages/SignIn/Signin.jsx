import styles from "../Login/login.module.css";
import SigLogLayout from "../LogIn/SigLogLayout.jsx";

const Signin = () => {
    
    const handleSignin = () => {
        console.log("d")
    }
    
    return (
    <SigLogLayout title="Crea una cuenta" subtitle="Ingresa tu correo y contraseña" buttonText="Registrarse" footer="¿Ya tienes una cuenta?" href="/login" footer2="Inicia sesión" onSubmit={handleSignin} />
    )
}

export default Signin