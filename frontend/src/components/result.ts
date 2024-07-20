import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../type/query-params.type";
import {UserInfoType} from "../type/user-info.type";
import {DefaultResponseType} from "../type/default-response.type";
import {PassTestResponseType} from "../type/pass-test-response.type";

export class Result {
    private routeParams: QueryParamsType;
    private resultButtonElement: HTMLButtonElement | null;
    constructor() {
        this.resultButtonElement = null;
        this.routeParams = UrlManager.getQueryParams();
        this.resultButtonElement = document.querySelector('#results');
        if (this.resultButtonElement) {
            this.resultButtonElement.onclick = this.moveToAnswers.bind(this);
        }
        this.init()

        }

   private async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
            return
        }

        if (this.routeParams.id) {
            try {
                const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    const resultScoreElement: HTMLElement | null =  document.getElementById('result-score')
                    if (resultScoreElement) {
                        resultScoreElement.innerText = (result as PassTestResponseType ).score + '/' + (result as PassTestResponseType).total;

                    }
                    return
                }

            } catch (error) {
                console.log(error)
            }
        }
        location.href = '#/';
    }

   moveToAnswers() {
   location.href  = '#/answers?id=' + this.routeParams.id;
    }
}
