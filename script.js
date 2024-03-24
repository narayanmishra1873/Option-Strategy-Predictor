const questions = [
    {
        question: "What is your view on the market?",
        answers: [
            {text: "Bullish"},
            {text: "Bearish"},
            {text: "Neutral"}
        ]
    },
    {
        question: "What degree of movement do you expect in the market?",
        answers: [
            {text: "Moderate"},
            {text: "Drastic"},
        ]
    },
    {
        question: "What sounds better to you?",
        answers: [
            {text: "Net debit"},
            {text: "Net credit"},
        ]
    }
];

// (Bullish, Moderate, Net debit) = Bull Call Spread
// (Bullish, Moderate, Net credit) = Bull Put Spread
// (Bullish, Drastic, Net debit) = No strategy
// (Bullish, Drastic, Net credit) = Call Ratio Back Spread / Bear Call Ladder
// (Bearish, Moderate, Net debit) = Bear Put Spread
// (Bearish, Moderate, Net credit) = Bear Call Spread
// (Bearish, Drastic, Net debit) = No strategy
// (Bearish, Drastic, Net credit) = Put Ratio Back Spread
// (Neutral, Moderate, Net debit) = No Strategy
// (Neutral, Moderate, Net credit) = Short Straddle / Short Strangle
// (Neutral, Drastic, Net debit) = Long Straddle / Long Strangle
// (Neutral, Drastic, Net credit) = No Strategy

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let selectedAnswers = [];

function startQuiz(){
    currentQuestionIndex = 0;
    selectedAnswers = [];
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);

        button.addEventListener("click", selectAnswer);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const selectedAnswer = {
        //question: questions[currentQuestionIndex].question,
        answer: selectedBtn.innerHTML
    };
    selectedAnswers.push(selectedAnswer);

    // Change color of selected button
    selectedBtn.style.backgroundColor = "#9aeabc";

    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    const combinationResult = getCombinationResult(selectedAnswers);
    questionElement.innerHTML = "";
    /*const resultElement = document.createElement("p");
    resultElement.textContent = combinationResult;
    questionElement.appendChild(resultElement);*/
    const resultDescription = document.createElement("div");
    resultDescription.classList.add("strategy-description");
    resultDescription.innerHTML = combinationResult;
    questionElement.appendChild(resultDescription);
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function getCombinationResult(selectedAnswers) {
    const selectedAnswersText = selectedAnswers.map(answer => answer.answer).join(",");
    switch(selectedAnswersText) {
        case "Bullish,Moderate,Net debit":
            return bullCallSpread();
        case "Bullish,Moderate,Net credit":
            return bullPutSpread();
        case "Bullish,Drastic,Net debit":
            return '<span style="color: black; font-size: smaller; text-align: justify">There is no strategy that involves net debit for a drastically bullish outlook. Below is a similar strategy but with a net credit instead. <br></span><br>' + callRatioBackSpread();
        case "Bullish,Drastic,Net credit":
            return callRatioBackSpread();
        case "Bearish,Moderate,Net debit":
            return bearPutSpread();
        case "Bearish,Moderate,Net credit":
            return bearCallSpread();
        case "Bearish,Drastic,Net debit":
            return '<span style="color: black; font-size: smaller; text-align: justify">There is no strategy that involves net debit for a drastically bearish outlook. Below is a similar strategy but with a net credit instead. <br></span><br>' + putRatioBackSpread();
        case "Bearish,Drastic,Net credit":
            return putRatioBackSpread();
        case "Neutral,Moderate,Net debit":
            return '<span style="color: black; font-size: smaller; text-align: justify">There is no strategy that involves net debit for a neutral and moderate outlook. Below is a similar strategy but with a net credit instead. <br></span><br>' + shortStraddle();
        case "Neutral,Moderate,Net credit":
            return shortStraddle();
        case "Neutral,Drastic,Net debit":
            return longStraddle();
        case "Neutral,Drastic,Net credit":
            return '<span style="color: black; font-size: smaller; text-align: justify">There is no strategy that involves net credit for a neutral and drastic outlook. Below is a similar strategy but with a net debit instead. <br></span><br>' + longStraddle();
        default:
            return "Result not found for the selected combination.";
    }
}

function bullCallSpread() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Bull Call Spread:</span><br>' +
               '<span style="color: black; font-size: smaller;">If you have a moderate amount of bullishness in a stock, a bull call spread is a great starting point. One OTM call option is sold and one ATM call option is purchased in this transaction. There are caps on the maximum loss and profit.<br><br> Say the NIFTY 50 is trading at 22,000, for example. If you purchase a 22,000 ATM Call option at a premium of Rs. 110 and sell one 22,200 OTM Call option at a premium of Rs. 70, you stand to lose a maximum of Rs. 40 (110 - 70) in the event that the market declines and a maximum of Rs. 90 ((22,200 - 22,000) - (40)) in the event that the market rises.</span>' +
           '</div>';
}

function bullPutSpread() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Bull Call Spread:</span><br>' +
               '<span style="color: black; font-size: smaller;">A great starting strategy if you are slightly bullish on a stock is the bull put spread. One OTM Put option is purchased and one ITM Put option is sold in this transaction. There are caps on the maximum profit and maximum loss.<br><br> Suppose the NIFTY 50 is trading at 22,000 at this point. If you purchase a 21,900 OTM Put option at a premium of Rs. 40 and sell one 22,100 ITM Put option at a premium of Rs. 150, you stand to lose a maximum of Rs. 90 ((22,100 - 21,900) - (150 - 40)) in the event that the market declines and a maximum of Rs. 110 (150 - 40) in the event that the market rises.</span>' +
           '</div>';
}

function callRatioBackSpread() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Call Ratio Back Spread:</span><br>' +
               '<span style="color: black; font-size: smaller;">The three-leg Call Ratio Back Spread technique is selling one slightly ITM call option and purchasing two slightly OTM call options. The maximum loss is the only fixed amount.<br><br> Let\'s say that the Nifty 50 is trading at 22,000. You will sell one 21,900 ITM call option for a premium of Rs. 120 and purchase two Rs. 22,100 OTM call options at a premium of Rs. 40 each. If the market falls below 21,900, the highest profit possibility is Rs. 40 (120 - 2*40). If the market rises over 22,100, there is an unlimited profit potential; if it falls between 21,900 and 22,100, there is a maximum loss potential of Rs. 160 ((22,100 - 21,900) - 40).</span>' +
           '</div>';
}

function bearPutSpread() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Bear Put Spread:</span><br>' +
               '<span style="color: black; font-size: smaller;">When you have a reasonable amount of bearishness on a stock, you use a bear put spread. One ITM put option is purchased, and one OTM put option is sold. This has a cap on both profit and loss.<br><br> In the event that the Nifty 50 is trading at 22,000 and you purchase one 22,100 ITM put option at a premium of Rs. 150 and sell one 21,900 OTM put option at a premium of Rs. 70, you could potentially lose up to Rs. 80 (150 - 70) in the event that the market rises and profit up to Rs. 120 ((22,100 - 21,900) - 80) in the event that the market falls.</span>' +
           '</div>';
}

function bearCallSpread() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Bear Call Spread:</span><br>' +
               '<span style="color: black; font-size: smaller;">When you have a reasonable amount of bearishness on a stock, you use the Bear Call Spread. One OTM call option is purchased, and one ITM call option is sold.<br><br> This has a cap on both profit and loss. With the Nifty 50 trading at 22,000 and you selling one 21,900 ITM call option for a premium of Rs. 150 and buying one 22,100 OTM call option for a premium of Rs. 30, you stand to gain a maximum of Rs. 120 (150 - 30) in the event that the market declines and a maximum loss of Rs. 80 ((22,100 - 21,900) - 120) in the event that the market rises.</span>' +
           '</div>';
}

function putRatioBackSpread() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Put Ratio Back Spread:</span><br>' +
               '<span style="color: black; font-size: smaller;">When you have a strong pessimistic view on a stock, you use the Put Ratio Back Spread strategy. It entails selling one ITM put option and purchasing two OTM put options. There is only a loss cap.<br><br> You would purchase two 22,100 OTM put options at a premium of Rs. 40 each and sell one 21,900 ITM put option at a price of Rs. 120 if the Nifty 50 was trading at 22,000 at that time. There is a maximum profit possibility of Rs. 40 (120 - 2*40) if the market rises over 22,100. In the event that the market closes below 21,900, profit potential is infinite. The highest loss that might occur if the market stays between 21,900 and 22,100 is Rs. 160 ((22,100 - 21,900) - 40).</span>' +
           '</div>';
}

function shortStraddle() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Short Straddle:</span><br>' +
               '<span style="color: black; font-size: smaller;">A short straddle is a tactic you can use if you believe the stock price will move moderately in either direction. One ATM call option and one ATM put option are being sold.<br><br> Consider that the Nifty 50 is trading around 22,000 right now. One 22,000 ATM call option will be sold for Rs. 70 premium, and one 22,000 put option would be sold for Rs. 80 premium. The maximum profit potential will be Rs. 150 (70 + 80) when the market is between 21,850 (22,000 - (70 + 80)) and 22,150 (22,000 + (70 + 80)); while it is outside of this range, the maximum loss potential will be infinite.</span>' +
           '</div>';
}

function longStraddle() {
    return '<div style="text-align: justify;">' +
               '<span style="color: red; font-weight: bold; text-align: center; display: block;">Long Straddle:</span><br>' +
               '<span style="color: black; font-size: smaller;">When you believe there will be a significant shift in the stock\'s price in either direction, you might use the long straddle approach. One ATM call option and one ATM put option must be purchased.<br><br> Consider that the Nifty 50 is trading around 22,000 right now. One 22,000 ATM call option and one 22,000 put option would be purchased for a premium of Rs. 70 and Rs. 80, respectively. The maximum loss potential will be Rs. 150 (70 + 80) when the market is between 21,850 (22,000 - (70 + 80)) and 22,150 (22,000 + (70 + 80)); when it is outside of this range, the maximum profit potential will be infinite.</span>' +
           '</div>';
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }

});

startQuiz();
