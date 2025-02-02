class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedOption = null;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.welcomeScreen = document.querySelector('.welcome-screen');
        this.quizScreen = document.querySelector('.quiz-screen');
        this.resultScreen = document.querySelector('.result-screen');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.nextButton = document.getElementById('next-btn');
        this.progressBar = document.querySelector('.progress');
    }

    attachEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartQuiz());
        this.nextButton.addEventListener('click', () => this.handleNextQuestion());
    }

    async fetchQuizData() {
        try {
            const response = await fetch('https://api.jsonserve.com/Uw5CrX');
            const data = await response.json();
            this.questions = data.questions;
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            // Fallback questions in case API fails
            this.questions = [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correctAnswer: "Paris"
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correctAnswer: "Mars"
                },
                {
                    question: "What is 2 + 2?",
                    options: ["3", "4", "5", "6"],
                    correctAnswer: "4"
                }
            ];
        }
    }

    async startQuiz() {
        await this.fetchQuizData();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.welcomeScreen.classList.add('hidden');
        this.quizScreen.classList.remove('hidden');
        this.loadQuestion();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.optionsContainer.innerHTML = '';
        this.selectedOption = null;
        this.nextButton.style.display = 'none';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option', 'fade-in');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(optionElement, option));
            this.optionsContainer.appendChild(optionElement);
        });

        this.updateProgress();
    }

    selectOption(optionElement, selectedAnswer) {
        const question = this.questions[this.currentQuestionIndex];
        
        this.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        optionElement.classList.add('selected');
        this.selectedOption = selectedAnswer;
        this.nextButton.style.display = 'block';

        if (selectedAnswer === question.correctAnswer) {
            this.score++;
        }
    }

    handleNextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    showResults() {
        this.quizScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');
        
        const scorePercentage = (this.score / this.questions.length) * 100;
        const incorrectAnswers = this.questions.length - this.score;

        document.querySelector('.score-fraction').textContent = `${this.score}/${this.questions.length}`;
        document.querySelector('.score-percentage').textContent = `${scorePercentage.toFixed(1)}%`;

        document.getElementById('total-questions').textContent = this.questions.length;
        document.getElementById('correct-answers').textContent = this.score;
        document.getElementById('incorrect-answers').textContent = incorrectAnswers;
        document.getElementById('total-score').textContent = `${this.score}/${this.questions.length}`;

        const achievementsContainer = document.querySelector('.achievements');
        achievementsContainer.innerHTML = '';

        if (scorePercentage === 100) {
            this.addAchievement('🏆 Perfect Score!', `You got all ${this.questions.length} questions correct!`);
        } else if (scorePercentage >= 80) {
            this.addAchievement('🌟 Excellent!', `You got ${this.score} out of ${this.questions.length} correct!`);
        } else if (scorePercentage >= 50) {
            this.addAchievement('📚 Good Effort!', `You got ${this.score} out of ${this.questions.length} correct!`);
        } else {
            this.addAchievement('🌱 Keep Practicing!', `You got ${this.score} out of ${this.questions.length} correct!`);
        }
    }

    addAchievement(title, description) {
        const achievement = document.createElement('div');
        achievement.classList.add('achievement', 'fade-in');
        achievement.innerHTML = `
            <div class="achievement-icon">${title.split(' ')[0]}</div>
            <div>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
        document.querySelector('.achievements').appendChild(achievement);
    }

    restartQuiz() {
        this.resultScreen.classList.add('hidden');
        this.startQuiz();
    }
}

// Initialize the quiz app
const quizApp = new QuizApp();