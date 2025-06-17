import styles from "./login.module.css";
import SigLogLayout from "./SigLogLayout.jsx"

const Login = () => {
    
    const handleLogin = () => {
        console.log("d")
    }
    
    return (
    <SigLogLayout title="Ingresa tu cuenta" subtitle="" buttonText="Iniciar sesión" footer="¿No tienes cuenta?" href="/signin" footer2="Regístrate ahora" onSubmit={handleLogin} />
    )
}

export default Login