import dotenv from "dotenv";
dotenv.config();

import logger from "./config/logger";
import app from "./app";
import db from "./utils/db";

const port: number = Number(process.env.PORT) || 3000;

// Conexion a DB y arranque del servidor
const startServer = async (): Promise<void> => {
  try {
    await db.authenticate();
    logger.info("Conexion a la base de datos establecida");

    await db.sync();
    logger.info("Modelos sincronizados con la base de datos");

    app.listen(port, () => {
      logger.info(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (err: unknown) {
    console.error("Error completo:", err);
    process.exit(1);
  }
};

startServer();

export default app;
