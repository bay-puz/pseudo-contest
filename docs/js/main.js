const NUM_PROBLEM = 2;
const MIN_SUM_SCORE = 100;
const MAX_SUM_SCORE = 160;

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

async function finishContest(event) {
    stopTime();
    var countCorrect = 0;
    var perfectScore = 0;
    var gettingScore = 0;
    for (let num = 1; num < NUM_PROBLEM + 1; num++) {
        const inputAnswerKey = document.getElementById("answerKey" + num).value;
        const inputAnswerKeyHash = await hashAnswerKey(inputAnswerKey);
        const problemAnswerKeyHash = document.getElementById("problemAnswerKey" + num).innerText;
        var problemScore = document.getElementById("problemScore" + num).innerText;
        if (inputAnswerKeyHash === problemAnswerKeyHash) {
            countCorrect++;
            gettingScore += parseInt(problemScore);
        }
        perfectScore += parseInt(problemScore);
    }
    const rank = generateRank(countCorrect);

    var resultElements = document.getElementsByClassName("result");
    var newBody = document.createElement("body");
    for (const resultElement of resultElements) {
        resultElement.classList.remove("hidden");
        newBody.innerHTML += resultElement.outerHTML;
    }
    document.body = newBody;
    document.getElementById("rank").innerText = rank;
    document.getElementById("count").innerText = countCorrect;
    document.getElementById("score").innerText = gettingScore;
    document.getElementById("scorePerfect").innerText = perfectScore;
    document.getElementById("time").innerText = parseTime(passSecond);
    document.getElementById("tweetButton").href = getTweetUrl(rank);
}

async function setProblem() {
    var problems = [];
    while (true) {
        problems = await getProblems();
        const sum_score = problems.reduce(function(sum, p) {
            return sum + p.score;
        }, 0);
        if(MIN_SUM_SCORE <= sum_score  && sum_score <= MAX_SUM_SCORE) {
            break;
        }
    }
    problems.sort(function(a,b) {
        return a.score -b.score;
    });
    for (let index = 0; index < problems.length; index++) {
        var problem = problems[index];
        const num = index + 1
        document.getElementById("problemScoreText" + num).innerText = problem.score;
        document.getElementById("problemAuthor" + num).innerText = problem.author;
        const imagePath = "problems/image/" + problem.image;
        document.getElementById("problemImage" + num).src = imagePath;
        document.getElementById("problemLink" + num).href = problem.url;
        const hash = await hashAnswerKey(problem.answerKey);
        document.getElementById("problemAnswerKey" + num).innerText = hash;
        document.getElementById("problemScore" + num).innerText = problem.score;
    }
}

function getProblems() {
    return new Promise(resolve => {
        var ret = [];
        var listFile = "problems/list.json";
        fetch(listFile).then(Response=>Response.json()).then(function(data){
            while (ret.length < NUM_PROBLEM) {
                const rand = Math.floor(Math.random()*data.length);
                const d = data[rand];
                ret.push(d);
                data.splice(rand, 1);
            }
            resolve(ret);
        });
    });
}

function generateRank(count) {
    const range = 33;
    var offset = (2-count) * range;
    return Math.floor(Math.random() * range) + 1 + offset;
}

async function hashAnswerKey(num, key) {
    const message = "sgnp13ka" + num + key + "ll1wo";
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function getTweetUrl(rank) {
    var url = new URL("https://twitter.com/intent/tweet");
    var params = new URLSearchParams();
    params.append("hashtags", "YajilinPseudoContest");
    params.append("url", location.href);
    const tweetText = "YPCの順位は" + rank + "位でした！";
    params.append("text", tweetText);
    url.search = params.toString();
    return url.toString();
}