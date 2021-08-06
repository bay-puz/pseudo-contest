const NUM_PROBLEM = 2;

var startButton = document.getElementById("startButton");
startButton.addEventListener("click", startContest);

var finishButton = document.getElementById("finishButton");
finishButton.addEventListener("click", finishContest);

var passSecond;

function startContest(event) {
    startButton.disabled = true;
    startButton.innerText = parseTime(0);
    startButton.classList.add("solving");
    document.getElementById("inputAnswerKeys").classList.remove("hidden");

    startTime();
    setProblem();
}

function startTime() {
    passSecond = 0;
    timerId = setInterval(showTime, 1000);
}

function parseTime(timeSec) {
    hour = Math.floor(timeSec/60/60);
    minute = Math.floor(timeSec/60) % 60;
    second = timeSec % 60;
    minute = minute < 10 ? '0' + minute: minute;
    second = second < 10 ? '0' + second: second;
    return hour + ':' + minute + ':' + second;
}

function showTime() {
    passSecond++;
    startButton.innerText = parseTime(passSecond);
}

function stopTime() {
    clearInterval(timerId);
}

function finishContest(event) {
    stopTime();
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

    var resultElements = document.getElementsByClassName("result");
    var newBody = document.createElement("body");
    for (const resultElement of resultElements) {
        resultElement.classList.remove("hidden");
        newBody.innerHTML += resultElement.outerHTML;
    }
    document.body = newBody;

    document.getElementById("count").innerText = countCorrect;
    document.getElementById("score").innerText = gettingScore;
    document.getElementById("scorePerfect").innerText = perfectScore;
    document.getElementById("time").innerText = parseTime(passSecond);
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