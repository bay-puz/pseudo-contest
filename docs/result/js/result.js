if (location.search === "") {
    location.replace("/");
} else {
    showResult();
}

function showResult() {
    var searchParams = new URLSearchParams(location.search);
    var countCorrect = searchParams.get("c");
    var gettingScore = searchParams.get("s");
    var perfectScore = searchParams.get("p");

    document.getElementById("count").innerText = countCorrect;
    document.getElementById("score").innerText = gettingScore;
    document.getElementById("scorePerfect").innerText = perfectScore;
}
