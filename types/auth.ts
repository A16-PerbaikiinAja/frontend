export type Role = 'ADMIN' | 'TECHNICIAN' | 'USER';

export interface BaseUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Admin extends BaseUser {
  role: 'ADMIN';
}

export interface Technician extends BaseUser {
  role: 'TECHNICIAN';
  experience?: number;
  address?: string;
  totalJobsCompleted: number;
  totalEarnings: number;
  profilePhoto: string;
}

export interface NormalUser extends BaseUser {
  role: 'USER';
  address?: string;
  profilePhoto: string;
}

export type User = Admin | Technician | NormalUser;
