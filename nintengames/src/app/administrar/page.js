"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../styles/administrar.module.css";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Swal from "sweetalert2";

// Función para obtener los juegos desde el backend
const getVideojuegos = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Sin token de autenticación");
  }

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
    router.push("/");
    window.location.reload();
  };

  const handleDelete = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el videojuego permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmar.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/api/games/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado", "El videojuego ha sido eliminado", "success");

        // 🔄 Quitar de la lista
        setVideojuegos((prev) => prev.filter((j) => j.id !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire("Error", "No se pudo eliminar el videojuego", "error");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire("Acceso denegado", "Debes iniciar sesión", "warning").then(
          () => router.push("/")
        );
        return;
      }

      try {
        const data = await getVideojuegos();
        setVideojuegos(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        Swal.fire("Error", err.message, "error").then(() => router.push("/"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
                    onClick={() => router.push(`/consultar/${juego.id}`)}
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

                  <button
                    className={styles.eliminar}
                    onClick={() => handleDelete(juego.id)}
                  >
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
