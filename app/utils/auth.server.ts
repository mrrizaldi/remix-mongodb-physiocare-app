import { json, redirect } from "@remix-run/node";
import { getSession, commitSession, destroySession } from "./session.server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./db.server";
import {
  createProfile,
  getExistingUser,
  getProfileByEmail,
} from "./profile.server";
import { RoleTypes } from "~/schema/profile";

export async function login({
  email,
  password,
  request,
}: {
  email: string;
  password: string;
  request: Request;
}) {
  const profile = await getProfileByEmail(email);

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

  const existingUser = await getExistingUser(email, username);

  if (existingUser) {
    throw json({ message: "User already exists" }, { status: 400 });
  }

  const defaultValues = {
    name: username,
    account: {
      email,
      password,
      username,
      role: RoleTypes.PATIENT,
    },
  };

  await createProfile(defaultValues);
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
