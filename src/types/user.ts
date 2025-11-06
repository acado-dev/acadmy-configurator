export type UserType = 'Learner' | 'Faculty' | 'Staff';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  organization?: string;
  mobileNo?: string;
  studentIdStaffId?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  createdAt: string;
  updatedAt: string;
}
