import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../type/query-params.type";
import {QuizAnswerType, QuizQuestionType, QuizType} from "../type/quiz.type";
import {UserInfoType} from "../type/user-info.type";
import {DefaultResponseType} from "../type/default-response.type";


export class Answers {
    public quiz: QuizType | null;
    private routeParams: QueryParamsType;
    readonly rightAnswers: number[];
    readonly resultAnswers: number[];


    constructor() {
        this.rightAnswers = [];
        this.resultAnswers = [];
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams()
        this.init()
    }

    public async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (userInfo) {
            if (!userInfo) {
                location.href = '#/'
                return
            }

            if (this.routeParams.id) {
                try {
                    const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                    if (result) {
                        if ((result as DefaultResponseType).error !== undefined) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                        const answerInfo = document.getElementById('answer-info')
                            if(answerInfo) {
                                answerInfo.innerText = userInfo.fullName + ', ' + userInfo.email;
                            }

                        this.quiz = result.test;

                        this.showAllQuestion();
                        return;
                    }
                } catch (error) {
                    console.log(error);
                }
            }

        }
        location.href = "#/";
    }


    private showAllQuestion(): void {
        const questions = this.getAllQuestions();
        const container: HTMLElement | null = document.querySelector('.question-container');

        questions.forEach((questionItem, questionIndex) => {
            const questionContainer = document.createElement('div')
            questionContainer.className = 'test-question'
            questionContainer.innerHTML = `<div class="test-question-title" id="question-title">
                    <span>Вопрос ${questionIndex + 1}:</span> ${questionItem.question}
                </div>`
            if (container) {
                container.appendChild(questionContainer);
            }
            const answersContainer = this.getAnswers(questionItem.answers, questionIndex)
            questionContainer.appendChild(answersContainer)
        })
    }


    private getAllQuestions(): QuizQuestionType[] {
        return this.quiz?.questions || [];
    }

    private getAnswers(answers: QuizAnswerType[], questionIndex: number): HTMLElement {
        const answersContainer = document.createElement('div');
        answersContainer.className = 'test-question-options'
        answersContainer.id = 'options'

        const rightAnswerId: number = this.rightAnswers[questionIndex]
        const userAnswerId: number = this.resultAnswers[questionIndex]

        answers.forEach((answer) => {
            const optionElement: HTMLElement | null = document.createElement('div');
            optionElement.className = 'test-question-option';
            const inputId = 'answer-' + answer.id
            const inputElement: HTMLInputElement | null = document.createElement('input');
            inputElement.className = 'option-answer';

            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('value', answer.id.toString());
            inputElement.setAttribute('disabled', 'disabled');
            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;
            if (answer.correct === true) {
                optionElement.classList.add('right-answer-color');
                inputElement.setAttribute('checked', 'checked')
            }
            if (answer.correct === false) {
                optionElement.classList.add('wrong-answer-color');
                inputElement.setAttribute('checked', 'checked')
            }
            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);
            answersContainer.appendChild(optionElement);
        });

        return answersContainer;
    }
}

