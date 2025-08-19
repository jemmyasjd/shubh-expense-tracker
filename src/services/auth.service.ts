import { z } from 'zod';
import api from './api';

// -----------------------------
// Core User + Auth types
// -----------------------------
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthData {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// -----------------------------
// Auth Service
// -----------------------------
class AuthService {
    async signUp(name: string, email: string, password: string): Promise<AuthData> {
        try {
            const response = await api.post<ApiResponse<AuthData>>('/auth/signup', {
                name,
                email,
                password,
            });

            // unwrap `data`
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async signIn(email: string, password: string): Promise<AuthData> {
        try {
            const response = await api.post<ApiResponse<AuthData>>('/auth/signin', {
                email,
                password,
            });

            // unwrap `data`
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
}

// -----------------------------
// Validation Schemas
// -----------------------------
export const signUpSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signInSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const authService = new AuthService();
