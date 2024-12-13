import { AuthResponse } from '../models/AuthResponse'
import { $apiAuth } from '@shared/http'
import { AxiosResponse } from 'axios'
import { IUserReg } from '@entities/user/model/IUser'

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $apiAuth.post<AuthResponse>('login', { email, password })
    }

    static async registration(userData: IUserReg): Promise<AxiosResponse<AuthResponse>> {
        return $apiAuth.post<AuthResponse>('registration', userData)
    }

    static async logout(): Promise<void> {
        return $apiAuth.post('logout')
    }
}
