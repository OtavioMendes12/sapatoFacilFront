'use client';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: string;
    exp: number;
}

export interface UserData {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    role: string;
}

export class Session {
    private static readonly TOKEN_KEY = 'sapato-facil-token';
    private static readonly USER_DATA_KEY = 'sapato-facil-user-data';
    private static readonly ROLE_KEY = 'sapato-facil-role';

    private static isClient() {
        return typeof window !== 'undefined';
    }

    static saveToken(token: string) {
        if (this.isClient()) {
            document.cookie = `${this.TOKEN_KEY}=${token}; path=/`;
        }
    }

    static getToken(): string | null {
        if (!this.isClient()) return null;

        const match = document.cookie.match(new RegExp(`(^| )${this.TOKEN_KEY}=([^;]+)`));
        return match ? match[2] : null;
    }

    static isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp > currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }

    static getTokenInfo(): DecodedToken | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    static getUserId(): string | null {
        const tokenInfo = this.getTokenInfo();
        return tokenInfo ? tokenInfo.sub : null;
    }

    static saveUserData(userData: UserData) {
        if (this.isClient()) {
            document.cookie = `${this.USER_DATA_KEY}=${JSON.stringify(userData)}; path=/`;
            document.cookie = `${this.ROLE_KEY}=${userData.role}; path=/`;
        }
    }

    static getUserData(): UserData | null {
        if (!this.isClient()) return null;

        const match = document.cookie.match(new RegExp(`(^| )${this.USER_DATA_KEY}=([^;]+)`));
        if (!match) return null;
        try {
            return JSON.parse(decodeURIComponent(match[2]));
        } catch {
            return null;
        }
    }

    static getRole(): string | null {
        if (!this.isClient()) return null;

        const match = document.cookie.match(new RegExp(`(^| )${this.ROLE_KEY}=([^;]+)`));
        return match ? decodeURIComponent(match[2]) : null;
    }

    static clearSession() {
        if (this.isClient()) {
            document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
            document.cookie = `${this.USER_DATA_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
            document.cookie = `${this.ROLE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        }
    }
}
