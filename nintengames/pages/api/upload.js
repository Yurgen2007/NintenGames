// pages/api/upload.js
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";

// 1. Crear carpeta de destino si no existe
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configurar Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 3. Configurar ruta con nextConnect
const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(" Error en upload:", error); //  para ver detalles en consola
    res.status(500).json({ error: `Error al subir imagen: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
});

apiRoute.use(upload.single("cover"));

apiRoute.post((req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
