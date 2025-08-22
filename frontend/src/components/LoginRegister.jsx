import React, { useState } from "react";

const API_URL = "http://localhost:8000";

export default function LoginRegister() {
  const [registerData, setRegisterData] = useState({
    nombre: "",
    apellidos: "",
    correo_electronico: "",
    profesion: "",
    contrasena: ""
  });
  const [loginData, setLoginData] = useState({
    correo_electronico: "",
    contrasena: ""
  });
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleRegisterChange = e => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async e => {
    e.preventDefault();
    setRegisterSuccess("");
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      });
      if (res.ok) {
        setRegisterSuccess("Usuario creado exitosamente.");
        setRegisterData({ nombre: "", apellidos: "", correo_electronico: "", profesion: "", contrasena: "" });
      } else {
        setRegisterSuccess("Error al crear usuario.");
      }
    } catch {
      setRegisterSuccess("Error de red al crear usuario.");
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoginSuccess("");
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: loginData.correo_electronico,
          password: loginData.contrasena
        })
      });
      if (res.ok) {
        setLoginSuccess("Login exitoso.");
        setLoginData({ correo_electronico: "", contrasena: "" });
      } else {
        setLoginError("Credenciales incorrectas.");
      }
    } catch {
      setLoginError("Error de red al iniciar sesión.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <input name="nombre" placeholder="Nombre" value={registerData.nombre} onChange={handleRegisterChange} required />
        <input name="apellidos" placeholder="Apellidos" value={registerData.apellidos} onChange={handleRegisterChange} required />
        <input name="correo_electronico" placeholder="Correo electrónico" value={registerData.correo_electronico} onChange={handleRegisterChange} required />
        <input name="profesion" placeholder="Profesión" value={registerData.profesion} onChange={handleRegisterChange} />
        <input name="contrasena" type="password" placeholder="Contraseña" value={registerData.contrasena} onChange={handleRegisterChange} required />
        <button type="submit">Crear usuario</button>
      </form>
      {registerSuccess && <p>{registerSuccess}</p>}

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="correo_electronico" placeholder="Correo electrónico" value={loginData.correo_electronico} onChange={handleLoginChange} required />
        <input name="contrasena" type="password" placeholder="Contraseña" value={loginData.contrasena} onChange={handleLoginChange} required />
        <button type="submit">Iniciar sesión</button>
      </form>
      {loginSuccess && <p style={{ color: "green" }}>{loginSuccess}</p>}
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
    </div>
  );
}
    