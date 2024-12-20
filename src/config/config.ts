import { config as conf } from "dotenv";
import cloudinary from "./cloudinary";
conf();
const _config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV || "production",
  jwtSecret: process.env.JWT_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
