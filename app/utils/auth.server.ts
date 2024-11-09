import { json, redirect } from "@remix-run/node";
import { Profile } from "../models"; // Import model Profile yang sudah kita buat
import { getSession, commitSession, destroySession } from "./session.server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./db.server";
import { IProfile } from "~/types/auth";

export async function login({
  email,
  password,
  request,
}: {
  email: string;
  password: string;
  request: Request;
}) {
  await connectDB();

  // Mencari profile berdasarkan email di embedded account
  const profile = (await Profile.findOne({
    "account.email": email,
  }).lean()) as IProfile | null;

  if (!profile || !(await bcrypt.compare(password, profile.account.password))) {
    throw json({ message: "Invalid email or password" }, { status: 401 });
  }

  const payload = {
    id: profile._id,
    email: profile.account.email,
    role: profile.account.role,
    username: profile.account.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", token);

  // Remove password from response
  const { account, ...profileData } = profile;
  const { password: _, ...accountWithoutPassword } = account;

  return {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
    profile: {
      ...profileData,
      account: accountWithoutPassword,
    },
  };
}

export async function register({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  await connectDB();

  // Check existing user by email or username in account
  const existingUser = await Profile.findOne({
    $or: [{ "account.email": email }, { "account.username": username }],
  });

  if (existingUser) {
    throw json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new profile with embedded account
  await Profile.create({
    name: username,
    account: {
      email,
      password: hashedPassword,
      username,
      role: "PATIENT",
    },
  });
}

// export async function registerStaff({
//   username,
//   email,
//   password,
//   name,
//   position,
//   type,
//   salary,
// }: {
//   username: string;
//   email: string;
//   password: string;
//   name: string;
//   position: {
//     name: string;
//     maxSalary: number;
//     minSalary: number;
//   };
//   type: "ADMIN" | "DOCTOR" | "OFFICER";
//   salary: number;
// }) {
//   await connectDB();
//
//   // Check existing user
//   const existingUser = await Profile.findOne({
//     $or: [{ "account.email": email }, { "account.username": username }],
//   });
//
//   if (existingUser) {
//     throw json({ message: "User already exists" }, { status: 400 });
//   }
//
//   const hashedPassword = await bcrypt.hash(password, 10);
//
//   // Create new profile with staff data
//   const profile = await Profile.create({
//     name,
//     account: {
//       email,
//       password: hashedPassword,
//       username,
//       role: "STAFF",
//     },
//     staff: {
//       position,
//       type,
//       salary,
//       joinDate: new Date(),
//       active: true,
//       schedule: [], // Empty schedule initially
//     },
//   });
//
//   // Convert to plain object and remove password
//   const profileObject = profile.toObject();
//   const { account, ...profileData } = profileObject;
//   const { password: _, ...accountWithoutPassword } = account;
//
//   return {
//     ...profileData,
//     account: accountWithoutPassword,
//   };
// }
//
export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
