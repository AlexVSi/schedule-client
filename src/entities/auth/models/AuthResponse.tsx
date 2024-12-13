import { IUserLogin, IUserReg } from "@entities/user/model/IUser";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}
