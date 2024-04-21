(function () {
    const Answers = {
        rightAnswers: [],
        resultAnswers: [],
        quiz: null,
        init() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('testId');
            this.resultAnswers = JSON.parse(url.searchParams.get('results'));
            if (testId) {
                const xhr = new XMLHttpRequest()
                xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    this.quiz = JSON.parse(xhr.responseText);
                    this.loadRightAnswers(testId)
                    this.showAllQuestion()
                }
            }
        },
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
        },
        loadRightAnswers(testId) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                this.rightAnswers = JSON.parse(xhr.responseText);
            }
        },
        getAllQuestions() {
            return this.quiz.questions;
        },
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
                

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                if (answer.id === rightAnswerId) {
                    optionElement.classList.add('right-answer-color');
                    inputElement.setAttribute('checked', 'checked')
                }

                if (answer.id === userAnswerId && userAnswerId !== rightAnswerId) {
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


    Answers.init()
})();