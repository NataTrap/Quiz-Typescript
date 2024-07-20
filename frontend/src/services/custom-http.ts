import {Auth} from "./auth";
export class CustomHttp {

    public static async request(url: string, method: string = 'GET', body: any = null): Promise<any> {
        // Для GET запросов
        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token: string | null = localStorage.getItem(Auth.accessTokenKey)

        // Если токен у нас есть, То мы будем его добавлять в каждый запрос к заголовку
        if (token) {
            params.headers['x-access-token'] = token;
        }


        if (body) {
            params.body = JSON.stringify(body)
        }


        const response: Response = await fetch(url, params);


            // Проверяем на код ответа
        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
            // Мы запрашиваем refresh токен
                const result: boolean = await Auth.processUnauthorizedResponse(); // Если из этой функции вернулась true И наш токен готов к использованию
                if (result) {
                    return await this.request(url, method, body);
                } else {
                    return null
                }
            }
            throw new Error(response.statusText)
        }
// Возвращаем ответ response.json, Если запрос прошёл успешно
        return await response.json();
    }
}
