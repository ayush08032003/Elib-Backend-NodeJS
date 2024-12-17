import { config as conf } from "dotenv";
conf();
const _config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || "",
  node_env: process.env.NODE_ENV || "production",
};

export const config = Object.freeze(_config);
