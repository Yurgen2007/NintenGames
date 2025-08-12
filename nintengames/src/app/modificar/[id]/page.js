"use client";

import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../../styles/modificar.module.css";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import Swal from "sweetalert2";
import { apiFetch } from "../../../lib/api.js";

export default function Modificar() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [juego, setJuego] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [plataformas, setPlataformas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Obtener el juego
        const data = await apiFetch(`/api/games/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const parsedYear = data.year ? new Date(data.year).getFullYear() : "";

        setJuego({ ...data, year: parsedYear });
        setImagePreview(data.cover);
      } catch (err) {
        console.error("Error al obtener videojuego:", err);
        Swal.fire("Error", "No se pudo cargar el videojuego", "error").then(
          () => router.push("/")
        );
        return;
      }

      try {
        // Obtener plataformas y categorías
        const [platData, catData] = await Promise.all([
          apiFetch("/api/platforms", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiFetch("/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setPlataformas(platData);
        setCategorias(catData);
      } catch (err) {
        console.error("Error al obtener plataformas/categorías:", err);
        Swal.fire(
          "Error",
          "No se pudieron cargar plataformas o categorías",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleInputChange = (e) => {
    setJuego({ ...juego, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJuego({ ...juego, cover: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (
      !juego.title ||
      !juego.platform_id ||
      !juego.category_id ||
      !juego.year
    ) {
      Swal.fire(
        "Campos incompletos",
        "Todos los campos son obligatorios",
        "warning"
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", juego.title);
      formData.append("platform_id", juego.platform_id);
      formData.append("category_id", juego.category_id);
      formData.append("year", juego.year);

      if (juego.cover instanceof File) {
        formData.append("cover", juego.cover);
      }

      await apiFetch(`/api/games/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // No pongas Content-Type aquí porque fetch lo asigna automáticamente cuando usas FormData
        },
        body: formData,
      });

      Swal.fire(
        "¡Éxito!",
        "Videojuego modificado correctamente",
        "success"
      ).then(() => router.push("/administrar"));
    } catch (err) {
      console.error("Error al modificar:", err);
      Swal.fire("Error", "No se pudo modificar el videojuego", "error");
    }
  };

  if (loading || !juego) return null;

  return (
    <ProtectedRoute>
      <div className={styles.modificar}>
        <div className={styles.topBar}>
          <h1 className={styles.titulo}>
            <span className={styles.tituloParte1}>Modificar</span>{" "}
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
          src={imagePreview || "/image.png"}
          alt="Portada"
          width={180}
          height={180}
          className={styles.juegoImagen}
        />

        <form className={styles.inputGroup} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            name="title"
            value={juego.title}
            onChange={handleInputChange}
          />

          <select
            className={styles.select}
            name="platform_id"
            value={juego.platform_id}
            onChange={handleInputChange}
          >
            {plataformas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            name="category_id"
            value={juego.category_id}
            onChange={handleInputChange}
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label htmlFor="cover" className={styles.fileInputLabel}>
            Cambiar Portada
            <FiCamera className={styles.iconoCamaraDerecha} />
            <input
              type="file"
              id="cover"
              name="cover"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
          </label>

          <input
            type="number"
            className={styles.input}
            name="year"
            value={juego.year}
            onChange={handleInputChange}
            placeholder="Año de lanzamiento"
          />

          <button type="submit" className={styles.boton}>
            Modificar
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
