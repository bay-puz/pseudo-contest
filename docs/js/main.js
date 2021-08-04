var startButton = document.getElementById("startContest");
startButton.addEventListener("click", startContest());

var endButton = document.getElementById("endContest");
endButton.addEventListener("click", endContest());

function startContest(event) {
    console.log("start...");
};

function endContest(event) {
    console.log("finish!");
}
