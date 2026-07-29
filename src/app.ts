import express, { Application } from "express";
import clientRoutes from "./routes/clientRequests";

const app: Application = express();

// Middleware: parsea el body de requests JSON
app.use(express.json());

// Rutas: todo lo que llegue a /clients lo maneja clientRoutes
app.use("/clients", clientRoutes);

export default app;
