"use client"; // Componente se ejecuta en el cliente

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./styles/login.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el inicio de sesión");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Inicio de sesión exitoso:", data);
        router.push("/dashboard");
      } else {
        throw new Error("Token no recibido");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.titulo}>
        <span className={styles.ninten}>ninten</span>
        <span className={styles.games}>games</span>
      </h1>

      <Image
        src="/Mario.png"
        className={styles.img}
        alt="Mario"
        width={200}
        height={200}
      />

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <input
          className={styles.email}
          placeholder="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.password}
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.boton} type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
