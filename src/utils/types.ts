
export type CreateUserParams = {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  password: string;
  fcmToken: string;
}

export type VerifyOtpParams = {
  email: string;
  otp: string;
}


export type ChangePasswordParams = {
  currentPassword: string;
  newPassword: string;
}
