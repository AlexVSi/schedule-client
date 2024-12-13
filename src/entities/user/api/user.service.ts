import { AxiosResponse } from 'axios'
import { $apiAuth } from '@shared/http'
import { IUserLogin } from '../model/IUser'

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUserLogin>> {
        return $apiAuth.get<IUserLogin>('auth/users')
    }
}
