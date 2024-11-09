export interface UserData {
  id: string;
  email: string;
  role: string;
  username: string;
  avatar: string;
  iat: number;
  exp: number;
}
export type LoaderData = {
  token: string;
};

export interface IProfile {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  account: {
    username: string;
    email: string;
    password: string;
    role: "STAFF" | "PATIENT";
  };
  staff?: {
    position: {
      name: string;
      maxSalary: number;
      minSalary: number;
    };
    type: "ADMIN" | "DOCTOR" | "OFFICER";
    salary: number;
    joinDate: Date;
    active: boolean;
    schedule: Array<{
      day: string;
      isActive: boolean;
      capacities: Array<{
        session: string;
        maxPatients: number;
      }>;
    }>;
  };
}
