import {Auth} from "./auth.js";
export class CustomHttp {

    static async request(url, method = 'GET', body = null) {
        // Для GET запросов
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token = localStorage.getItem(Auth.accessTokenKey)

        // Если токен у нас есть, То мы будем его добавлять в каждый запрос к заголовку
        if (token) {
            params.headers['x-access-token'] = token;
        }


        if (body) {
            params.body = JSON.stringify(body)
        }


        const response = await fetch(url, params);


            // Проверяем на код ответа
        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
            // Мы запрашиваем refresh токен
                const result = await Auth.processUnauthorizedResponse(); // Если из этой функции вернулась true И наш токен готов к использованию
                if (result) {
                    return await this.request(url, method, body);
                } else {
                    return null
                }
            }
            throw new Error(response.message)
        }
// Возвращаем ответ response.json, Если запрос прошёл успешно
        return await response.json();
    }
}
