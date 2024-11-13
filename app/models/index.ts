import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Schemas for enums as objects for better maintainability
export const RoleTypes = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  OFFICER: "OFFICER",

  PATIENT: "PATIENT",
};

export const SessionTypes = {
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  EVENING: "EVENING",
};

export const SchedulingStatus = {
  WAITING: "WAITING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
};

export const Days = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
};

export const InventoryTypes = {
  MEDICINE: "MEDICINE",
  AIDS: "AIDS",
  EQUIPMENT: "EQUIPMENT",
  SUPPLY: "SUPPLY",
};

// Profile Schema (Base for both Staff and Patients)
const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    dob: Date,
    age: Number,
    gender: String,
    address: String,
    phone: String,
    account: {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: Object.values(RoleTypes), required: true },
    },
  },
  { timestamps: true }
);

// Staff Schema (Embedded in Profile when role is STAFF)
const staffSchema = new Schema(
  {
    position: {
      name: { type: String, required: true },
      maxSalary: Number,
      minSalary: Number,
    },

    salary: { type: Number, default: 0 },
    joinDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    specialties: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
        startDate: { type: Date, required: true },
        endDate: Date,
        active: { type: Boolean, default: true },
      },
    ],
    schedule: [
      {
        day: { type: String, enum: Object.values(Days) },
        isActive: { type: Boolean, default: true },
        capacities: [
          {
            session: { type: String, enum: Object.values(SessionTypes) },
            maxPatients: { type: Number, default: 5 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Service Schema
const serviceSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// Medical Inventory Schema
const medicalInventorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    type: { type: String, enum: Object.values(InventoryTypes), required: true },
  },
  { timestamps: true }
);

// Prescription Schema
const prescriptionSchema = new Schema(
  {
    details: [
      {
        medicalInventory: {
          type: Schema.Types.ObjectId,
          ref: "MedicalInventory",
          required: true,
        },
        quantity: { type: Number, required: true },
        dosageInstructions: String,
      },
    ],
  },
  { timestamps: true }
);

// Medical Record Schema
const medicalRecordSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    complaint: String,
    medicalHistory: String,
    physicalExamination: String,
    vitals: {
      systolic: Number,
      diastolic: Number,
      heartRate: Number,
      respiratoryRate: Number,
      temperature: Number,
    },
    serviceNotes: [
      {
        additionalNotes: String,
        prescription: prescriptionSchema,
      },
    ],
  },
  { timestamps: true }
);

// Appointment/Scheduling Schema
const schedulingSchema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    session: {
      type: String,
      enum: Object.values(SessionTypes),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SchedulingStatus),
      default: SchedulingStatus.WAITING,
    },
    payment: {
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },
      paymentMethod: String,
    },
    medicalRecordId: { type: Schema.Types.ObjectId, ref: "MedicalRecord" },
  },
  { timestamps: true }
);

// Create compound indexes for commonly queried fields
profileSchema.index({ "account.email": 1 });
profileSchema.index({ "account.username": 1 });
schedulingSchema.index({ staffId: 1, date: 1, session: 1 }, { unique: true });
schedulingSchema.index({ patientId: 1, date: 1 });
medicalRecordSchema.index({ patientId: 1 });

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
export const Staff =
  mongoose.models.Staff || mongoose.model("Staff", staffSchema);
export const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
export const MedicalInventory =
  mongoose.models.MedicalInventory ||
  mongoose.model("MedicalInventory", medicalInventorySchema);
export const MedicalRecord =
  mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", medicalRecordSchema);
export const Scheduling =
  mongoose.models.Scheduling || mongoose.model("Scheduling", schedulingSchema);
