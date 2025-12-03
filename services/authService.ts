
import { User, UserRole } from '../types';

// Mock DB
const USERS: User[] = [
  {
    id: 'u1',
    name: 'Saad Ali',
    email: 'saad@glowhub.pk',
    role: UserRole.CUSTOMER,
    location: 'Lahore',
    avatar: 'https://ui-avatars.com/api/?name=Saad+Ali&background=0D8ABC&color=fff',
    password: 'password'
  },
  {
    id: 'b1',
    name: 'Kamran Akmal',
    email: 'kamran@luxecuts.pk',
    role: UserRole.BARBER,
    location: 'DHA, Lahore',
    avatar: 'https://ui-avatars.com/api/?name=Kamran+Akmal&background=7B3FE4&color=fff',
    password: 'password',
    isVerified: true
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@glowhub.pk',
    role: UserRole.ADMIN,
    location: 'HQ',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=1F1F1F&color=fff',
    password: 'admin'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // Simulate JWT token return (in real app, store in localStorage)
    localStorage.setItem('glowhub_token', `mock_token_${user.id}`);
    localStorage.setItem('glowhub_user', JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    await delay(800);
    if (USERS.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role,
      location: 'Lahore', // Default for MVP
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`
    };
    USERS.push(newUser);
    localStorage.setItem('glowhub_token', `mock_token_${newUser.id}`);
    localStorage.setItem('glowhub_user', JSON.stringify(newUser));
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    // In a real app, this would validate the token with the backend
    const storedUser = localStorage.getItem('glowhub_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  },

  logout: async () => {
    localStorage.removeItem('glowhub_token');
    localStorage.removeItem('glowhub_user');
  }
};
