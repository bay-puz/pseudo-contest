const NUM_PROBLEM = 2;

var startButton = document.getElementById("startContest");
startButton.addEventListener("click", startContest);

var endButton = document.getElementById("endContest");
endButton.addEventListener("click", endContest);

function startContest(event) {
    startButton.disabled = true;
    startButton.innerText = "…解いています…"
    startButton.classList.add("solving");
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
    var perfectScore = 0;
    var gettingScore = 0;
    for (let num = 1; num < NUM_PROBLEM + 1; num++) {
        var inputAnswerKey = document.getElementById("answerKey" + num).value;
        var problemAnswerKey = document.getElementById("problemAnswerKey" + num).innerText;
        var problemScore = document.getElementById("problemScore" + num).innerText;
        if (inputAnswerKey === problemAnswerKey) {
            countCorrect++;
            gettingScore += parseInt(problemScore);
        }
        perfectScore += parseInt(problemScore);
    }
    alert(gettingScore + "/" + perfectScore + "点（" + countCorrect + "問正解）");
}

function setProblem() {
    var listFile = "problems/list.json";
    fetch(listFile).then(Response=>Response.json()).then(function(data){
        var nums = [0, 1];
        var problems = [];
        for (let index = 0; index < NUM_PROBLEM; index++) {
            problems[index] = data[nums[index]];
        }
        for (let index = 0; index < NUM_PROBLEM; index++) {
            var problem = problems[index];
            const num = index + 1
            var scoreString = "配点：" + problem.score + "点";
            document.getElementById("problemScoreText" + num).innerText = scoreString;
            var imagePath = "problems/image/" + problem.image;
            document.getElementById("problemImage" + num).src = imagePath;
            document.getElementById("problemLink" + num).href = problem.url;
            document.getElementById("problemAnswerKey" + num).innerText = problem.answerKey;
            document.getElementById("problemScore" + num).innerText = problem.score;               
        }
    });
}