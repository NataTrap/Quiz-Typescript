import {UrlManager} from "./utils/url-manager.js";

export class Result {
    constructor() {
        this.resultButtonElement = null;
        this.routeParams = UrlManager.getQueryParams()

        document.getElementById('result-score').innerText = this.routeParams.score + '/'
            + this.routeParams.total

        this.resultButtonElement = document.querySelector('#results');
        this.resultButtonElement.onclick = this.moveToAnswers.bind(this);
    }

    moveToAnswers() {
        const searchStr = new URLSearchParams({
            id: this.routeParams.id,
            results: this.routeParams.results
        }).toString();

        console.log(searchStr)

        location.href  = '#/answers?' + searchStr;
    }
}
