import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { analyzeSymptoms } from "./ai";
import { insertHealthRecordSchema, insertAppointmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/diagnose", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { category, symptoms } = req.body;
    if (!category || !symptoms) {
      return res.status(400).json({ message: "Category and symptoms are required" });
    }

    try {
      const analysis = await analyzeSymptoms(category, symptoms);
      res.json(analysis);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message: errorMessage });
    }
  });

  app.get("/api/health-records", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const records = await storage.getHealthRecords(req.user.id);
    res.json(records);
  });

  app.post("/api/health-records", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertHealthRecordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid health record data" });
    }

    const record = await storage.createHealthRecord(req.user.id, result.data);
    res.status(201).json(record);
  });

  app.get("/api/appointments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const appointments = await storage.getAppointments(req.user.id);
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }

    // Ensure notes is not undefined before passing to storage
    const appointmentData = {
      ...result.data,
      notes: result.data.notes ?? null
    };

    const appointment = await storage.createAppointment(req.user.id, appointmentData);
    res.status(201).json(appointment);
  });

  const httpServer = createServer(app);
  return httpServer;
}