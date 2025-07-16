export interface UserRegistrationRequest {

  phoneNumber: string;
  password: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  upazilaId: number;

}
