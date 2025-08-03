"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import styles from "../../styles/consultar.module.css";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function ConsultaJuego() {
  const { id } = useParams();
  const router = useRouter();

  const [juego, setJuego] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Acceso denegado", "Debes iniciar sesión", "warning").then(
          () => router.push("/")
        );
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/api/games/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const game = res.data;
        if (!isMounted) return;
        setJuego(game);

        const [platRes, catRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/platforms/${game.platform_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `http://localhost:3000/api/categories/${game.category_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (!isMounted) return;
        setPlatform(platRes.data?.name || "N/A");
        setCategory(catRes.data?.name || "N/A");
      } catch (error) {
        console.error("Error al obtener datos:", error);
        Swal.fire("Error", "No se pudo cargar el videojuego", "error").then(
          () => router.push("/administrar")
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

  if (loading || !juego) return null;

  return (
    <ProtectedRoute>
      <div className={styles.consulta}>
        <div className={styles.topBar}>
          <h1 className={styles.titulo}>
            <span className={styles.tituloParte1}>Consultar</span>{" "}
            <span className={styles.tituloParte2}>VideoJuego</span>
          </h1>
          <button
            className={styles.closeBtn}
            onClick={() => router.push("/administrar")}
          >
            ✕
          </button>
        </div>

        <Image
          src={juego.cover || "/image.png"}
          alt={juego.title}
          width={180}
          height={180}
          className={styles.juegoImagen}
        />

        <div className={styles.inputGroup}>
          <div className={styles.campo}>
            <div className={styles.label}>Título:</div>
            <div className={styles.valor}>{juego.title}</div>
          </div>
          <div className={styles.campo}>
            <div className={styles.label}>Consola:</div>
            <div className={styles.valor}>{platform}</div>
          </div>
          <div className={styles.campo}>
            <div className={styles.label}>Categoría:</div>
            <div className={styles.valor}>{category}</div>
          </div>
          <div className={styles.campo}>
            <div className={styles.label}>Año:</div>
            <div className={styles.valor}>
              {juego.year
                ? new Date(juego.year).getFullYear()
                : "No disponible"}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
