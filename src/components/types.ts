export enum ApiState {
  unknown,
  success,
  error,
}

export const isValidEmail = (email: string) => {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}
