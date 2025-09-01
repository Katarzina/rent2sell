export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export function validateSignIn(input: any): SignInInput {
  if (!input.email || typeof input.email !== 'string') {
    throw new Error('Invalid email');
  }
  if (!input.password || typeof input.password !== 'string') {
    throw new Error('Invalid password');
  }
  if (input.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  return input as SignInInput;
}

export function validateSignUp(input: any): SignUpInput {
  if (!input.name || typeof input.name !== 'string') {
    throw new Error('Invalid name');
  }
  if (!input.email || typeof input.email !== 'string') {
    throw new Error('Invalid email');
  }
  if (!input.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  if (!input.password || typeof input.password !== 'string') {
    throw new Error('Invalid password');
  }
  if (input.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  return input as SignUpInput;
}