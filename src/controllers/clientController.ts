import { Request, Response } from "express";
import Client from "../models/client";
import logger from "../config/logger";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida que un string tenga formato de email basico.
 * No cubre todos los edge cases del RFC 5322, pero filtra inputs claramente invalidos.
 */
const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * GET /clients
 * Retorna la lista completa de clientes
 */
export const getClients = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error: unknown) {
    logger.error("Error al obtener clientes", { error });
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * POST /clients
 * Crea un nuevo cliente. Requiere name y email en el body.
 */
export const createClient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res
        .status(400)
        .json({ message: "Los campos name y email son obligatorios" });
      return;
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      res
        .status(400)
        .json({ message: "El campo name debe ser un texto no vacio" });
      return;
    }

    if (typeof email !== "string" || !isValidEmail(email)) {
      res
        .status(400)
        .json({
          message:
            "El campo email debe tener un formato valido (ej: usuario@dominio.com)",
        });
      return;
    }

    const client = await Client.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    res.status(201).json(client);
  } catch (error: unknown) {
    logger.error("Error al crear cliente", { error });
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
