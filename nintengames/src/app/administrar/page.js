"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../styles/administrar.module.css";
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Función para obtener los juegos desde el backend
const getVideojuegos = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/games", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al obtener videojuegos");
  }

  return res.json();
};

export default function Dashboard() {
  const router = useRouter();
  const [videojuegos, setVideojuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/administrar");
    window.location.reload();
  };

  useEffect(() => {
    getVideojuegos()
      .then(setVideojuegos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className={styles.pageWrapper}>
        <div className={styles.topBar}>
          <h1 className={styles.titulo}>Administrar videoJuegos</h1>
          <button className={styles.closeBtn} onClick={handleLogout}>
            ✕
          </button>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => router.push("/adicionar")}
        >
          + Adicionar
        </button>

        {loading ? (
          <p style={{ textAlign: "center" }}>Cargando videojuegos...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : (
          <div className={styles.juegoLista}>
            {videojuegos.map((juego) => (
              <div key={juego.id} className={styles.juegoItem}>
                <Image
                  src={juego.cover || "/image.png"}
                  alt={juego.title}
                  width={80}
                  height={80}
                  className={styles.juegoImagen}
                  unoptimized
                />

                <div className={styles.juegoTexto}>
                  <span className={styles.plataforma}>Nintendo Switch</span>
                  <span className={styles.nombreJuego}>{juego.title}</span>
                </div>

                <div className={styles.acciones}>
                  <button
                    className={`${styles.iconButton} ${styles.ver}`}
                    onClick={() => router.push(`/consulta/${juego.id}`)}
                  >
                    <Image src="/buscar.png" alt="Ver" width={16} height={16} />
                  </button>

                  <button
                    className={`${styles.iconButton} ${styles.editar}`}
                    onClick={() => router.push(`/modificar/${juego.id}`)}
                  >
                    <Image
                      src="/edit.png"
                      alt="Editar"
                      width={16}
                      height={16}
                    />
                  </button>

                  <button className={styles.eliminar}>
                    <Image
                      src="/delete.png"
                      alt="Eliminar"
                      width={25}
                      height={20}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
