// Define types
export interface IAccount {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface IProfile {
  name: string;
  dob?: Date;
  age?: number;
  gender?: string;
  address?: string;
  phone?: string;
  account: IAccount;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileDisplayProps {
  profile: IProfile | null;
}

export interface ProfileUpdateFormProps {
  profile: IProfile;
}
