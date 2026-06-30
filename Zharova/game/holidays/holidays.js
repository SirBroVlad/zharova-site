// Вопросы и правильные ответы
const questions = [
    {
        text: "Vishnevarovo is a holiday that is held exclusively in large cities.",
        correct: false
    },
    {
        text: "The central part of the celebration is the tasting of fresh cherries and products from them.",
        correct: true
    },
    {
        text: "Only modern forms of entertainment are presented on Vishnevarov.",
        correct: false
    },
    {
        text: "The holiday includes folk games, dances and performances by folklore groups.",
        correct: true
    },
    {
        text: "The main purpose of the holiday is to promote local traditions and culture.",
        correct: true
    },
    {
        text: "The holiday does not attract the attention of children, as there are no children's activities.",
        correct: false
    },
    {
        text: "The holiday is dedicated exclusively to cooking and gastronomic traditions.",
        correct: false
    }
];

let currentQuestion = 0;
let answeredQuestions = new Array(questions.length).fill(false);

// Начать тест
function startQuiz() {
    document.getElementById('introSlide').style.display = 'none';
    document.getElementById('quizSlides').style.display = 'block';
    showQuestion();
}

// Показать текущий вопрос
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionCounter').textContent = `${currentQuestion + 1}/${questions.length}`;
    document.getElementById('questionText').textContent = question.text;
    
    // Сбросить эмодзи на нейтральный
    updateEmoji('neutral');
    
    // Сбросить кнопки
    resetButtons();
    
    // Скрыть кнопку следующего вопроса
    document.getElementById('nextBtn').style.display = 'none';
    
    // Если вопрос уже отвечен правильно
    if (answeredQuestions[currentQuestion]) {
        document.getElementById('nextBtn').style.display = 'block';
        updateEmoji('happy');
    }
}

// Обновить эмодзи
function updateEmoji(type) {
    const emojiElement = document.querySelector('.emoji');
    if (type === 'happy') {
        emojiElement.textContent = '😊';
    } else if (type === 'sad') {
        emojiElement.textContent = '😢';
    } else {
        emojiElement.textContent = '😊';
    }
}

// Сбросить кнопки
function resetButtons() {
    const trueBtn = document.getElementById('trueBtn');
    const falseBtn = document.getElementById('falseBtn');
    
    trueBtn.className = 'answer-btn';
    falseBtn.className = 'answer-btn';
    trueBtn.style.pointerEvents = 'auto';
    falseBtn.style.pointerEvents = 'auto';
}

// Проверить ответ
function checkAnswer(userAnswer) {
    const question = questions[currentQuestion];
    const trueBtn = document.getElementById('trueBtn');
    const falseBtn = document.getElementById('falseBtn');
    
    if (userAnswer === question.correct) {
        // Правильный ответ - веселый эмодзи
        updateEmoji('happy');
        
        if (userAnswer) {
            trueBtn.classList.add('correct');
            trueBtn.classList.remove('wrong');
        } else {
            falseBtn.classList.add('correct');
            falseBtn.classList.remove('wrong');
        }
        
        // Блокировать кнопки
        trueBtn.style.pointerEvents = 'none';
        falseBtn.style.pointerEvents = 'none';
        
        // Отметить как отвеченный
        answeredQuestions[currentQuestion] = true;
        
        // Показать кнопку следующего вопроса
        setTimeout(() => {
            document.getElementById('nextBtn').style.display = 'block';
        }, 500);
    } else {
        // Неправильный ответ - грустный эмодзи
        updateEmoji('sad');
        
        if (userAnswer) {
            trueBtn.classList.add('wrong');
            trueBtn.classList.remove('correct');
        } else {
            falseBtn.classList.add('wrong');
            falseBtn.classList.remove('correct');
        }
        
        // Вернуть нейтральный эмодзи через 1 секунду
        setTimeout(() => {
            updateEmoji('neutral');
            // Убрать красный цвет
            if (userAnswer) {
                trueBtn.classList.remove('wrong');
            } else {
                falseBtn.classList.remove('wrong');
            }
        }, 1000);
    }
}

// Следующий вопрос
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        // Все вопросы отвечены
        showFinalPopup();
    }
}

// Вернуться к тексту
function backToText() {
    document.getElementById('quizSlides').style.display = 'none';
    document.getElementById('introSlide').style.display = 'block';
}

// Показать финальное popup
function showFinalPopup() {
    document.getElementById('finalPopup').classList.add('show');
}

// Вернуться в главное меню
function goToMenu() {
    window.location.href = '../index.html';
}

// Анимация появления
document.addEventListener('DOMContentLoaded', () => {
    const introContent = document.querySelector('.intro-content');
    if (introContent) {
        introContent.style.opacity = '0';
        introContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            introContent.style.transition = 'all 0.8s ease';
            introContent.style.opacity = '1';
            introContent.style.transform = 'translateY(0)';
        }, 300);
    }
});