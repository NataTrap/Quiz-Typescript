import config from "../../config/config";
import {UserInfoType} from "../type/user-info.type";
import {RefreshResponseType} from "../type/refresh-response.type";
import {LogoutResponseType} from "../type/logout-response.type";

// работает с авторизацией
export class Auth {
    public static accessTokenKey: string = 'accessToken';
    private static refreshTokenKey: string = 'refreshToken';
    private static userInfoKey: string = 'userInfo';

    // Обработать неавторизованный ответ
    public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey); // Получаем refresh токен
        if (refreshToken) { // Если токен существует, То мы будем делать запрос на обновление токена
            const response: Response = await fetch(config.host + 'refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                // Берём json в ответе, так как нам надо обновить пару токенов получить её, и изменить эти данные в Local storage.
                const result: RefreshResponseType | null = await response.json();
                if (result && !result.error && result.accessToken && result.refreshToken) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true // Если токены обновились возвращаем true
                }
            }
        }
        this.removeTokens();
        location.href = '#/'
        return false;
    }

    public static async logout(): Promise<boolean> {

        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: LogoutResponseType | null = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(this.userInfoKey);
                    return true
                }
            }
        }
        return false

    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
    }

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
    }

    public static setUserInfo(info: UserInfoType): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info))
    }

    public static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo)
        }

        return null
    }

}