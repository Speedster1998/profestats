import { useState } from "react";

const LoginTest = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const InputGroup = ({ type, placeholder, icon, value, onChange }) => (
            <div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <i className={`bi bi-${icon}`}></i>
            </div>
        );
    
    return <form>
                    <div>
                <input
                    type="email"
                    placeholder="Correo@universidad.edu"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); console.log({email})}}
                />
                <i className={`bi bi-envelope`}></i>
            </div>
                    <div>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); console.log({password})}}
                />
                <i className={`bi bi-eye`}></i>
            </div>
                    <button type="submit">Iniciar Sesion</button>
                </form>
}

export default LoginTest