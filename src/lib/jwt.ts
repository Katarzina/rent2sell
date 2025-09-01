import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function signJwtAccessToken(payload: any) {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h' // Token expires in 1 hour
  });
  return token;
}

export function verifyJwtAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}