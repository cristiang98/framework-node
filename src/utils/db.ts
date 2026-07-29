import { Sequelize } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";

const db = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    logging: isProduction ? false : console.log,
  },
);

export default db;
