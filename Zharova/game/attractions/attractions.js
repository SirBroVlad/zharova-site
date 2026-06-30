// Данные вопросов
const questions = [
    {
        image: './photos/attraction1.jpg',
        leftText: 'The monument to the Tambov Peasant is a sculptural monument dedicated to the rebellious peasants who took part in the Tambov Uprising of 1920 – 1921.',
        rightText: 'The Transfiguration Cathedral is an Orthodox church in Tambov. The first stone temple of the city and the oldest temple of the Tambov region.',
        correct: 'left'
    },
    {
        image: './photos/attraction2.jpg',
        leftText: 'The Zoya Kosmodemyanskaya Monument is a monument to the first female Hero of the Soviet Union, installed in the park of the same name on Sovetskaya street in Tambov.',
        rightText: 'The Tambov Regional Museum of Local Lore is a museum in Tambov. It is located on Derzhavinskaya Street in the former building of the House of Political Education, which is an architectural monument.',
        correct: 'left'
    },
    {
        image: './photos/attraction3.jpg',
        leftText: 'Tambov Voznesensky Monastery is a convent of the Tambov Diocese of the Russian Orthodox Church, located in the city of Tambov.',
        rightText: 'The Aseev Estate is a museum complex located in the city of Tambov on the Embankment Street of the Tsna River. The estate includes the main building, a fountain and a park.',
        correct: 'right'
    },
    {
        image: './photos/attraction4.jpg',
        leftText: 'The Znamya Truda House of Culture is a stone building built in 1929 on Mezhdunarodnaya Street in Tambov, now the Tambov Region. An architectural monument of regional importance. Currently, the building is used as a cultural institution.',
        rightText: 'The Monument to Sergei Rachmaninov is a monument dedicated to the famous Russian composer and pianist Sergei Rachmaninov, which is installed in the city of Tambov on the Embankment Street.',
        correct: 'right'
    },
    {
        image: './photos/attraction5.jpg',
        leftText: 'The Eternal Flame complex is the one of cultural heritage sites as a monument of regional significance. This complex is a place where there are various events dedicated to Victory Day.',
        rightText: 'Tambov Drama Theatre is a drama theatre in the city of Tambov. It was founded by Gavriil Derzhavin at the end of the XVIII century.',
        correct: 'left'
    }
];

let currentQuestion = 0;
let isLocked = false;
let shuffledQuestions = [];

// Функция перемешивания массива
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    shuffledQuestions = shuffleArray(questions);
    showQuestion();
});

// Показать текущий вопрос
function showQuestion() {
    const question = shuffledQuestions[currentQuestion];
    
    // Обновляем счётчик
    document.getElementById('questionCounter').textContent = `${currentQuestion + 1}/${shuffledQuestions.length}`;
    
    // Устанавливаем фото
    document.getElementById('attractionPhoto').src = question.image;
    
    // Устанавливаем тексты
    document.getElementById('leftText').textContent = question.leftText;
    document.getElementById('rightText').textContent = question.rightText;
    
    // Сбрасываем стили
    document.getElementById('leftDesc').className = 'description-card left';
    document.getElementById('rightDesc').className = 'description-card right';
    
    // Сбрасываем сообщение
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('resultMessage').className = 'result-message';
    
    isLocked = false;
}

// Выбор ответа
function selectAnswer(side) {
    if (isLocked) return;
    
    const question = shuffledQuestions[currentQuestion];
    const leftCard = document.getElementById('leftDesc');
    const rightCard = document.getElementById('rightDesc');
    
    if (side === question.correct) {
        // Правильный ответ
        if (side === 'left') {
            leftCard.classList.add('correct');
        } else {
            rightCard.classList.add('correct');
        }
        
        isLocked = true;
        
        // Показываем сообщение
        document.getElementById('resultMessage').textContent = '😊 Correct!';
        document.getElementById('resultMessage').className = 'result-message success';
        
        // Переход к следующему вопросу через 1.5 секунды
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    } else {
        // Неправильный ответ
        if (side === 'left') {
            leftCard.classList.add('wrong');
            setTimeout(() => {
                leftCard.classList.remove('wrong');
            }, 1000);
        } else {
            rightCard.classList.add('wrong');
            setTimeout(() => {
                rightCard.classList.remove('wrong');
            }, 1000);
        }
        
        // Показываем сообщение
        document.getElementById('resultMessage').textContent = '😢 Try again!';
        document.getElementById('resultMessage').className = 'result-message error';
        
        setTimeout(() => {
            document.getElementById('resultMessage').textContent = '';
        }, 1000);
    }
}

// Следующий вопрос
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < shuffledQuestions.length) {
        showQuestion();
    } else {
        // Все вопросы отвечены
        showFinalPopup();
    }
}

// Lightbox
function openLightbox() {
    const photo = document.getElementById('attractionPhoto');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightboxImg.src = photo.src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Финальное popup
function showFinalPopup() {
    document.getElementById('finalPopup').classList.add('show');
}

function goToMenu() {
    window.location.href = '../index.html';
}