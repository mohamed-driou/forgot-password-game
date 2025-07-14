import { passwordRules, getRuleById } from './rules.js';

// Game state
let currentRuleId = 1;
let chancesLeft = 2;
let score = 0;
let highestScore = localStorage.getItem('highestScore') || 0;
let timer;
let isGameRunning = false;
let currentPassword = '';

// DOM elements
let ruleDisplay;
let timerDisplay;
let attemptsDisplay;
let passwordInput;
let submitBtn;
let scoreDisplay;
let highScoreDisplay;

// Initialize game (exported for auth integration)
export function initGame() {
    // Get DOM elements
    ruleDisplay = document.getElementById('rule-text');
    timerDisplay = document.getElementById('timer');
    attemptsDisplay = document.getElementById('attempts');
    passwordInput = document.getElementById('password-input');
    submitBtn = document.getElementById('submit-btn');
    scoreDisplay = document.getElementById('score');
    highScoreDisplay = document.getElementById('high-score');

    // Reset game state
    currentRuleId = 1;
    chancesLeft = 2;
    score = 0;
    currentPassword = '';
    isGameRunning = false;

    // Initialize displays
    scoreDisplay.textContent = score;
    attemptsDisplay.textContent = chancesLeft;
    updateHighScoreDisplay();

    // Setup event listeners
    setupEventListeners();

    // Load first rule
    loadRule(currentRuleId);
}

function setupEventListeners() {
    // Clear existing listeners
    submitBtn.replaceWith(submitBtn.cloneNode(true));
    passwordInput.replaceWith(passwordInput.cloneNode(true));
    
    // Re-get elements
    submitBtn = document.getElementById('submit-btn');
    passwordInput = document.getElementById('password-input');

    // Add new listeners
    submitBtn.addEventListener('click', validatePassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validatePassword();
    });
}

function updateHighScoreDisplay() {
    highScoreDisplay.textContent = `Highest Score: ${highestScore}`;
}

function loadRule(ruleId) {
    const rule = getRuleById(ruleId);
    if (!rule) {
        endGame(true);
        return;
    }

    ruleDisplay.innerHTML = `Rule ${rule.id}: <strong>${rule.text}</strong>`;
    passwordInput.value = currentPassword; // Maintain current password
    passwordInput.focus();
    startTimer(rule.timeLimit);
    isGameRunning = true;
}

function startTimer(seconds) {
    clearInterval(timer);
    let timeLeft = seconds;
    updateTimerDisplay(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerDisplay(time) {
    timerDisplay.textContent = time;
    
    // Visual feedback when time is running low
    if (time <= 5) {
        timerDisplay.style.color = '#fd79a8';
        timerDisplay.classList.add('pulse');
    } else {
        timerDisplay.style.color = '#fdcb6e';
        timerDisplay.classList.remove('pulse');
    }
}

function handleTimeOut() {
    clearInterval(timer);
    chancesLeft--;
    attemptsDisplay.textContent = chancesLeft;

    // Shake animation for wrong answer
    triggerWrongAnswerFeedback();

    if (chancesLeft <= 0) {
        endGame(false);
    } else {
        const rule = getRuleById(currentRuleId);
        ruleDisplay.innerHTML = `Rule ${currentRuleId}: <strong>${rule.text}</strong><br>
                               <span class="error-message">Your password doesn't meet this requirement!</span>`;
        startTimer(10); // Reset with default time
    }
}

function validatePassword() {
    if (!isGameRunning) return;

    const input = passwordInput.value;
    const rule = getRuleById(currentRuleId);

    // Update the current password with latest input
    currentPassword = input;

    // Validate against ALL rules up to current one
    let isValid = true;
    for (let i = 1; i <= currentRuleId; i++) {
        const ruleToCheck = getRuleById(i);
        if (!ruleToCheck.validator(currentPassword)) {
            isValid = false;
            break;
        }
    }

    if (isValid) {
        // Correct - move to next rule
        score += rule.points;
        scoreDisplay.textContent = score;
        currentRuleId++;
        
        // Visual feedback for correct answer
        triggerCorrectAnswerFeedback();
        loadRule(currentRuleId);
    } else {
        // Incorrect
        triggerWrongAnswerFeedback();
        handleTimeOut();
    }
}

function triggerWrongAnswerFeedback() {
    // Shake animation
    passwordInput.classList.add('shake');
    passwordInput.addEventListener('animationend', () => {
        passwordInput.classList.remove('shake');
    }, { once: true });

    // Red border flash
    passwordInput.classList.add('input-error');
    setTimeout(() => {
        passwordInput.classList.remove('input-error');
    }, 500);
}

function triggerCorrectAnswerFeedback() {
    // Green flash effect
    passwordInput.classList.add('input-success');
    setTimeout(() => {
        passwordInput.classList.remove('input-success');
    }, 500);

    // Score pulse animation
    scoreDisplay.classList.add('pulse');
    setTimeout(() => {
        scoreDisplay.classList.remove('pulse');
    }, 1000);
}

function endGame(hasWon) {
    clearInterval(timer);
    isGameRunning = false;
    
    // Update high score if needed
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore);
        updateHighScoreDisplay();
    }
    
    // Display appropriate end message
    if (hasWon) {
        ruleDisplay.innerHTML = "<strong class='success-message'>Congratulations! You've completed all rules!</strong>";
    } else {
        ruleDisplay.innerHTML = `<strong class='error-message'>Game Over! Your score: ${score}. Try again?</strong>`;
    }
    
    // Change button to play again
    submitBtn.textContent = "Play Again";
    submitBtn.onclick = resetGame;
}

function resetGame() {
    // Clear the accumulated password
    currentPassword = '';
    // Re-initialize the game
    initGame();
}