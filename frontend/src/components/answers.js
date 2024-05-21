import {UrlManager} from "./utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth.js";


export class Answers {
    constructor() {
        this.rightAnswers = [];
        this.resultAnswers = [];
        this.quiz = null;
        this.test = []

        this.routeParams = UrlManager.getQueryParams()

        this.init()
    }

    async init () {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/'
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('answer-info').innerText = userInfo.fullName + ', ' + userInfo.email;
                    this.quiz = result
                    this.test = result.test

                    this.showAllQuestion();
                    // this.loadRightAnswer()

                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = "#/";
    }


    showAllQuestion() {
        const questions = this.getAllQuestions();
        const container = document.querySelector('.question-container');

        questions.forEach((questionItem, questionIndex) => {
            const questionContainer = document.createElement('div')
            questionContainer.className = 'test-question'
            questionContainer.innerHTML = `<div class="test-question-title" id="question-title">
                    <span>Вопрос ${questionIndex + 1}:</span> ${questionItem.question}
                </div>`
            container.appendChild(questionContainer);
            const answersContainer = this.getAnswers(questionItem.answers, questionIndex)
            questionContainer.appendChild(answersContainer)
        })
    }

    // loadRightAnswer() {
        // questions.forEach(question => {
        //     question.answers.forEach(answer => {
        //         if (answer.correct)
        //             this.resultAnswers.push(answer);
        //     });
        // });
        // return this.resultAnswers;
    // }

    getAllQuestions() {
        return this.quiz.test.questions;
    }

    getAnswers(answers, questionIndex) {
        const answersContainer = document.createElement('div');
        answersContainer.className = 'test-question-options'
        answersContainer.id = 'options'

        const rightAnswerId = this.rightAnswers[questionIndex]
        const userAnswerId = this.resultAnswers[questionIndex]



        answers.forEach((answer) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';


            const inputId = 'answer-' + answer.id
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';

            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('value', answer.id);
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

