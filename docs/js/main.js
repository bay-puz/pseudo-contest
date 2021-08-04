const NUM_PROBLEM = 2;

var startButton = document.getElementById("startContest");
startButton.addEventListener("click", startContest);

var endButton = document.getElementById("endContest");
endButton.addEventListener("click", endContest);

function startContest(event) {
    startButton.disabled = true;
    setProblem();
    while (true) {
        var hiddenProblems = document.getElementsByClassName("hiddenProblem");
        if (hiddenProblems) {
            hiddenProblems[0].classList.remove("hiddenProblem");
        } else {
            break;
        }
    }
};

function endContest(event) {
    var countCorrect = 0;
    for (let num = 1; num < NUM_PROBLEM + 1; num++) {
        var inputAnswerKey = document.getElementById("answerKey" + num).value;
        var problemAnswerKey = document.getElementById("problemAnswerKey" + num).innerText;
        if (inputAnswerKey === problemAnswerKey) {
            countCorrect++;
        }
    }
    alert("正解数は" + countCorrect + "問です");
}

function setProblem() {
    var listFile = "problems/list.json";
    $.getJSON(listFile, (data) => {
        var nums = [0, 1];
        var problems = [];
        for (let index = 0; index < NUM_PROBLEM; index++) {
            problems[index] = data[nums[index]];
        }
        for (let index = 0; index < NUM_PROBLEM; index++) {
            var problem = problems[index];
            var imagePath = "problems/image/" + problem.image;
            const num = index + 1
            document.getElementById("problemImage" + num).src = imagePath;
            document.getElementById("problemLink" + num).href = problem.url;
            document.getElementById("problemAnswerKey" + num).innerText = problem.answerKey;                
        }
    });
}