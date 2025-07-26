"use client";

import { FiCamera } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../styles/adicionar.module.css";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [year, setYear] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [platformsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:3000/api/platforms", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPlatforms(platformsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !platformId || !categoryId || !year || !cover) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // 1. Subir imagen primero
      const imgForm = new FormData();
      imgForm.append("cover", cover);

      const imgRes = await axios.post("/api/upload", imgForm);
      const imageUrl = imgRes.data.imageUrl; // "/uploads/archivo.png"

      // 2. Enviar datos del videojuego
      await axios.post(
        "http://localhost:3000/api/games",
        {
          title,
          platform_id: platformId,
          category_id: categoryId,
          year,
          cover: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/administrar");
    } catch (error) {
      console.error("Error al guardar el videojuego:", error);
      alert("Error al guardar el videojuego. Revisa la consola.");
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.adiccionar}>
        <div className={styles.topBar}>
          <h1 className={styles.titulo}>
            <span className={styles.tituloParte1}>Adicionar</span>{" "}
            <span className={styles.tituloParte2}>VideoJuego</span>
          </h1>
          <button
            className={styles.closeBtn}
            onClick={() => router.push("/administrar")}
          >
            ✕
          </button>
        </div>

        <img
          src={preview || "/image.png"}
          alt="Preview"
          width={180}
          height={180}
          className={styles.juegoImagen}
        />

        <form className={styles.inputGroup} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className={styles.select}
            value={platformId}
            onChange={(e) => setPlatformId(e.target.value)}
          >
            <option value="" disabled>
              Selecciona Plataforma...
            </option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="" disabled>
              Selecciona Categoría...
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label htmlFor="cover" className={styles.fileInputLabel}>
            Subir Portada
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
            placeholder="Año"
            className={styles.input}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <button type="submit" className={styles.boton}>
            Guardar
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
