import config from "../../config/config.js";

// работает с авторизацией


export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    // Обработать неавторизованный ответ
    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey); // Получаем refresh токен
        if (refreshToken) { // Если токен существует, То мы будем делать запрос на обновление токена
            const response = await fetch(config.host + 'refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                // Берём json в ответе, так как нам надо обновить пару токенов получить её, и изменить эти данные в Local storage.
                const result = await response.json();

                if (result && !response.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true // Если токены обновились возвращаем true
                }
            }
        }
        this.removeTokens();
        location.href = '#/'
        return false;
    }

    static async logout () {

        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !response.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true
                }
            }
        }


    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info))
    }

    static getUserInfo () {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo)
        }

        return null
    }

}