// Define types
export interface IAccount {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface IProfile {
  id: number;
  name: string;
  dob: Date | null;
  age: number | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  account: IAccount | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface ProfileDisplayProps {
  profile: IProfile | null;
}

export interface ProfileUpdateFormProps {
  profile: IProfile;
}
