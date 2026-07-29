import request from "supertest";
import app from "../src/app";
import Client from "../src/models/client";

// Mockear el modelo Client para no depender de la DB real
jest.mock("../src/models/client");
jest.mock("../src/config/logger");

const mockedClient = Client as jest.Mocked<typeof Client>;

describe("Client Requests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /clients", () => {
    test("should return a list of clients", async () => {
      const mockClients = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockedClient.findAll as jest.Mock).mockResolvedValue(mockClients);

      const response = await request(app).get("/clients");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("John Doe");
    });

    test("should return 500 if database fails", async () => {
      (mockedClient.findAll as jest.Mock).mockRejectedValue(
        new Error("DB connection lost"),
      );

      const response = await request(app).get("/clients");

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Error interno del servidor");
    });
  });

  describe("POST /clients", () => {
    test("should create a new client", async () => {
      const newClient = {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedClient.create as jest.Mock).mockResolvedValue(newClient);

      const response = await request(app)
        .post("/clients")
        .send({ name: "Jane Doe", email: "jane@example.com" });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe("Jane Doe");
    });

    test("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/clients")
        .send({ email: "jane@example.com" });

      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/clients")
        .send({ name: "Jane Doe" });

      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if email format is invalid", async () => {
      const response = await request(app)
        .post("/clients")
        .send({ name: "Jane Doe", email: "not-an-email" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("formato valido");
    });

    test("should return 500 if database fails on create", async () => {
      (mockedClient.create as jest.Mock).mockRejectedValue(
        new Error("DB write failed"),
      );

      const response = await request(app)
        .post("/clients")
        .send({ name: "Jane Doe", email: "jane@example.com" });

      expect(response.statusCode).toBe(500);
    });
  });
});
