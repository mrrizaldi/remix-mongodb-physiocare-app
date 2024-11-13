export interface UserData {
  id: string;
  email: string;
  role: string;
  username: string;
  avatar: string;
}

export interface SessionLoaderData {
  user: UserData | null;
}

export interface AuthResult {
  tokenPayload: UserData;
}
