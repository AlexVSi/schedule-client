import { IUserLogin, IUserReg } from "@entities/user/model/IUser";
import AuthService from "@entities/auth/api/auth.service";
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AuthResponse } from "@entities/auth/models/AuthResponse";
import { jwtDecode } from "jwt-decode";

export default class AuthStore {
    user = {} as IUserLogin
    isAuth: boolean = false
    isLoading: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUser(user: IUserLogin) {
        this.user = user
    }

    setLoading(bool: boolean) {
        this.isLoading = bool
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password)
            const token = response.data.accessToken
            const tokenDecode = jwtDecode<IUserLogin>(token)
            localStorage.setItem('token', token)
            this.setAuth(true)
            this.setUser(tokenDecode)
            return true
        } catch (e: any) {
            console.log(e.response?.data?.message);
            console.log(e);
            return
        }
    }

    async registration(userData: IUserReg) {
        try {
            const response = await AuthService.registration(userData)
            const token = response.data.accessToken
            const tokenDecode = jwtDecode<IUserLogin>(token)
            localStorage.setItem('token', token)
            this.setAuth(true)
            this.setUser(tokenDecode)
            return true
        } catch (e: any) {
            console.log(e.response?.data?.message);
            return
        }
    }

    async logout() {
        try {
            await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUserLogin)
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        try {
            this.setLoading(true)
            const response = await axios.get<AuthResponse>('http://127.0.0.1:8888/api/auth/refresh', { withCredentials: true })
            const token = response.data.accessToken
            const tokenDecode = jwtDecode<IUserLogin>(token)
            localStorage.setItem('token', token)
            this.setAuth(true)
            this.setUser(tokenDecode)
        } catch (e) {

        } finally {
            this.setLoading(false)
        }
    }
}
