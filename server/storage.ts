import { IStorage } from "./types";
import { User, InsertUser, HealthRecord, Appointment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthRecords: Map<number, HealthRecord>;
  private appointments: Map<number, Appointment>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.healthRecords = new Map();
    this.appointments = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHealthRecords(userId: number): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values()).filter(
      (record) => record.userId === userId,
    );
  }

  async createHealthRecord(userId: number, record: Omit<HealthRecord, "id" | "userId">): Promise<HealthRecord> {
    const id = this.currentId++;
    const healthRecord: HealthRecord = { ...record, id, userId };
    this.healthRecords.set(id, healthRecord);
    return healthRecord;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId,
    );
  }

  async createAppointment(userId: number, appointment: Omit<Appointment, "id" | "userId">): Promise<Appointment> {
    const id = this.currentId++;
    const newAppointment: Appointment = { ...appointment, id, userId };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }
}

export const storage = new MemStorage();
