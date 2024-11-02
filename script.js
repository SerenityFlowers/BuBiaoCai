let data = []; // 用於存儲從 JSON 載入的數據
let currentGameType = ''; // 用來存儲當前的遊戲類型
let currentEntry = null; // 用來存儲當前問題的條目

// 初始化遊戲
function startGame(gameType) {
    currentGameType = gameType; // 設置當前遊戲類型
    const mainMenu = document.getElementById("main-menu");
    const gameArea = document.getElementById("game");
    mainMenu.style.display = "none"; // 隱藏主界面
    gameArea.style.display = "block"; // 顯示遊戲區域
    initializeGame(); // 初始化遊戲
}

function initializeGame() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");

    optionsElement.innerHTML = ""; // 清除上一次的選項

    // 隨機選擇一個字
    currentEntry = getRandomEntry(); // 保存當前條目
    const correctAnswers = getCorrectAnswers(currentEntry);

    // 顯示問題
    questionElement.innerText = `${currentGameType}：「${currentEntry.字}」的答案是？`;

    // 準備選項
    const options = prepareOptions(correctAnswers);
    displayOptions(options);
}

// 隨機獲取一個字的數據
function getRandomEntry() {
    return data[Math.floor(Math.random() * data.length)];
}

// 獲取該字的所有正確答案
function getCorrectAnswers(entry) {
    switch (currentGameType) {
        case "聲符":
            return data.filter(e => e.字 === entry.字).map(e => e.聲符);
        case "中古音":
            return data.filter(e => e.字 === entry.字).map(e => e.中古音);
        case "聲域":
            return data.filter(e => e.字 === entry.字).map(e => e.聲域);
        default:
            return [];
    }
}

// 準備選項，包括正確答案和隨機選項，並確保選項唯一
function prepareOptions(correctAnswers) {
    const allOptions = new Set([...correctAnswers]); // 使用 Set 去重
    const wrongAnswers = getWrongAnswers(); // 獲取錯誤答案

    // 隨機選擇錯誤答案，直到選項數量達到 4
    while (allOptions.size < 4 && wrongAnswers.length > 0) {
        const randomOption = wrongAnswers.splice(Math.floor(Math.random() * wrongAnswers.length), 1)[0];
        allOptions.add(randomOption); // 將選項添加到 Set 中，自動去重
    }

    return Array.from(allOptions); // 返回唯一選項的數組
}

// 獲取其他對象的錯誤答案
function getWrongAnswers() {
    const wrongAnswersSet = new Set();

    data.forEach(entry => {
        if (entry.字 !== currentEntry.字) {
            switch (currentGameType) {
                case "聲符":
                    wrongAnswersSet.add(entry.聲符);
                    break;
                case "中古音":
                    wrongAnswersSet.add(entry.中古音);
                    break;
                case "聲域":
                    wrongAnswersSet.add(entry.聲域);
                    break;
            }
        }
    });

    return Array.from(wrongAnswersSet);
}

// 隨機打亂選項順序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 顯示選項在網頁上
function displayOptions(options) {
    const optionsElement = document.getElementById("options");
    options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(option);
        optionsElement.appendChild(button);
    });
}

// 檢查用戶的答案
function checkAnswer(selectedOption) {
    const questionElement = document.getElementById("question");
    const correctAnswers = getCorrectAnswers(currentEntry);
    
    if (correctAnswers.includes(selectedOption)) {
        questionElement.innerText = `恭喜你，回答正確！所有正確答案是：${correctAnswers.join(', ')}`;
    } else {
        questionElement.innerText = `很遺憾，回答錯誤~ 正確答案是：${correctAnswers.join(', ')}`;
    }
}

// 載入數據
function loadData(jsonData) {
    data = jsonData;
}

// 設置遊戲按鈕的事件處理器
document.getElementById("play-sound-symbol").onclick = () => startGame("聲符");
document.getElementById("play-middle-sound").onclick = () => startGame("中古音");
document.getElementById("play-sound-domain").onclick = () => startGame("聲域");

// 設置「下一題」按鈕的事件處理器
document.getElementById("next-button").onclick = () => {
    initializeGame();
};

// 設置「返回主頁」按鈕的事件處理器
document.getElementById("back-button").onclick = () => {
    const mainMenu = document.getElementById("main-menu");
    const gameArea = document.getElementById("game");
    mainMenu.style.display = "block"; // 顯示主界面
    gameArea.style.display = "none"; // 隱藏遊戲區域
};

// 初始調用，載入數據後開始遊戲
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(loadData)
        .then(initializeGame);
});
