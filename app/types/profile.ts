export interface IProfile {
  _id: string;
  name: string;
  dob?: Date;
  age?: number;
  gender?: string;
  address?: string;
  phone?: string;
  account: {
    username: string;
    email: string;
    password: string;
    role: string;
  };
  staff?: {
    position: {
      name: string;
      maxSalary?: number;
      minSalary?: number;
    };
    salary: number;
    joinDate: Date;
    active: boolean;
    specialties?: Array<{
      serviceId: string;
      startDate: Date;
      endDate?: Date;
      active: boolean;
    }>;
    schedule?: Array<{
      day: string;
      isActive: boolean;
      capacities: Array<{
        session: string;
        maxPatients: number;
      }>;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}
