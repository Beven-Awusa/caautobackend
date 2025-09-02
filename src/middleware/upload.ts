import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";
import { BadRequestError } from "../utils/errors";

const uploadsDir = path.join(process.cwd(), "uploads");
const imagesDir = path.join(uploadsDir, "images");

[uploadsDir, imagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imagesDir);
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const allowedTypes = [...allowedImageTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `File type ${
          file.mimetype
        } is not allowed. Allowed types: ${allowedTypes.join(", ")}`
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export const uploadSingleImage = upload.single("image");

export const uploadMultipleImages = upload.array("images", 10);

export const uploadMixed = upload.fields([{ name: "images", maxCount: 10 }]);

export const getFileUrl = (
  req: Request,
  filename: string,
  type: "images" = "images"
): string => {
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/uploads/${type}/${filename}`;
};

export const deleteUploadedFile = (
  filename: string,
  type: "images" = "images"
): void => {
  const filePath = path.join(uploadsDir, type, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
