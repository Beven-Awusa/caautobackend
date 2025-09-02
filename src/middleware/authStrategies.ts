// Auth strategies for local and Google authentication
// This file shows how to implement the actual authentication logic

import bcrypt from 'bcrypt';
import { generateToken, createUserPayload, type JwtPayload } from './auth';

// Mock user database - replace with actual database
interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Only for local auth
  googleId?: string; // Only for Google auth
  role: string;
  provider: 'local' | 'google';
}

const users: User[] = []; // Mock database

// Local authentication strategy
export const authenticateLocal = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  // Find user by email
  const user = users.find(u => u.email === email && u.provider === 'local');
  
  if (!user || !user.password) {
    return null;
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return null;
  }
  
  // Create JWT payload and generate token
  const payload = createUserPayload(user, 'local');
  const token = generateToken(payload);
  
  return { user, token };
};

// Local registration
export const registerLocal = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
    role: 'user',
    provider: 'local',
  };
  
  // Save to database (mock)
  users.push(newUser);
  
  // Create JWT payload and generate token
  const payload = createUserPayload(newUser, 'local');
  const token = generateToken(payload);
  
  return { user: newUser, token };
};

// Google authentication strategy
export const authenticateGoogle = async (googleProfile: {
  id: string;
  email: string;
  name: string;
}): Promise<{ user: User; token: string }> => {
  // Check if user already exists
  let user = users.find(u => u.googleId === googleProfile.id || (u.email === googleProfile.email && u.provider === 'google'));
  
  if (!user) {
    // Create new user from Google profile
    user = {
      id: crypto.randomUUID(),
      email: googleProfile.email,
      name: googleProfile.name,
      googleId: googleProfile.id,
      role: 'user',
      provider: 'google',
    };
    
    // Save to database (mock)
    users.push(user);
  }
  
  // Create JWT payload and generate token
  const payload = createUserPayload(user, 'google');
  const token = generateToken(payload);
  
  return { user, token };
};

// Example usage in auth controller:
/*
// Local login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authenticateLocal(email, password);
  
  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    user: result.user,
    token: result.token
  });
});

// Google callback endpoint
app.post('/api/auth/google', async (req, res) => {
  const { googleProfile } = req.body; // This would come from Google OAuth
  
  const result = await authenticateGoogle(googleProfile);
  
  res.json({
    user: result.user,
    token: result.token
  });
});
*/
