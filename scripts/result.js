(function () {
    const Result = {
        resultButtonElement: null,

        init() {
            const url = new URL(location.href);
            document.getElementById('result-score').innerText = url.searchParams.get('score') + '/'
                + url.searchParams.get('total')

            this.resultButtonElement = document.querySelector('#results');
            this.resultButtonElement.onclick = this.moveToAnswers.bind(this);
        },
        moveToAnswers() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('testId')
            const results = url.searchParams.get('results')
            location.href  = 'answers.html?testId=' + testId + '&results=' + results;
        }
    }

    Result.init()
})();