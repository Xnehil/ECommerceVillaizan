import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import GoogleDriveService from "@services/Imagenes";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });
/**
 * @swagger
 * tags:
 *   name: Imagenes
 *   description: API para la gestión de imágenes
 */
interface UploadRequest extends MedusaRequest {
    file?: multer.File;
    body: {
      fileName: string;
      folderId: string;
    };
  }
  
/**
 * @swagger
 * /imagenes:
 *   post:
 *     summary: Sube un archivo a Google Drive
 *     tags: [Imagenes]
 *     parameters:
 *       - in: query
 *         name: esArchivo
 *         schema:
 *           type: boolean
 *         required: true
 *         description: Indica si se debe realizar una acción diferente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: Ruta del archivo a subir
 *               fileName:
 *                 type: string
 *                 description: Nombre del archivo a subir
 *               folderId:
 *                 type: string
 *                 enum: [productos, yape, plin, pedidos, mermas, xml]
 *                 description: Carpeta en Google Drive, actualmente solo se soportan esas carpetas
 *     responses:
 *       200:
 *         description: El archivo ha sido subido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileId:
 *                   type: string
 *       400:
 *         description: Petición inválida
 *       500:
 *         description: Error interno del servidor
 */
export const POST = async (req: UploadRequest, res: MedusaResponse) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const googleDriveService: GoogleDriveService = req.scope.resolve("imagenesService");
    const { fileName, folderId } = req.body as { fileName: string; folderId: string };
    const esArchivo = req.query.esArchivo === 'true';
    const filePath = req.file?.path;

    if (!filePath || !fileName || !folderId) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }

    try {
      await googleDriveService.authorize();
      const file = await googleDriveService.uploadFile(filePath, fileName, folderId);
      // Ejemplo https://drive.google.com/uc?export=view&id=1MHmg-xuRiiHPwVcqLqcSuncFyIjtVY0e
      if (esArchivo) {
        res.status(200).json({ fileId: file.id });
        return;
      }else {
        const fileUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w500`;
        res.status(200).json({ fileUrl });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};
  


/**
 * @swagger
 * /imagenes:
 *   post:
 *     summary: Genera una URL pre-firmada para subir un archivo a Google Drive
 *     tags: [Imagenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Nombre del archivo a subir
 *               folderId:
 *                 type: string
 *                 description: ID de la carpeta en Google Drive
 *     responses:
 *       200:
 *         description: La URL pre-firmada ha sido generada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadUrl:
 *                   type: string
 *       400:
 *         description: Petición inválida
 *       500:
 *         description: Error interno del servidor
 */
// export const GET = async (req: UploadRequest, res: MedusaResponse) => {
//   const googleDriveService: GoogleDriveService = req.scope.resolve("imagenesService");

//   const { fileName, folderId } = req.body;

//   if (!fileName || !folderId) {
//     res.status(400).json({ error: "Petición inválida" });
//     return;
//   }

//   try {
//     await googleDriveService.authorize();
//     const uploadUrl = await googleDriveService.generateUploadUrl(fileName, folderId);
//     res.status(200).json({ uploadUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const AUTHENTICATE = false;