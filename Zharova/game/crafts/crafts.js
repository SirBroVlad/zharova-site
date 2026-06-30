// Правильные ответы
const correctAnswers = {
    blank1: 'process',
    blank2: 'clay',
    blank3: 'temperatures',
    blank4: 'pottery',
    blank5: 'objects'
};

// Проверка ответов
function checkAnswers() {
    let correctCount = 0;
    let allFilled = true;
    
    // Проверяем все поля
    for (let i = 1; i <= 5; i++) {
        const select = document.getElementById(`blank${i}`);
        const userAnswer = select.value;
        
        // Проверяем, заполнено ли поле
        if (!userAnswer) {
            allFilled = false;
            select.classList.remove('correct', 'wrong');
        } else if (userAnswer === correctAnswers[`blank${i}`]) {
            // Правильный ответ
            select.classList.add('correct');
            select.classList.remove('wrong');
            correctCount++;
        } else {
            // Неправильный ответ
            select.classList.add('wrong');
            select.classList.remove('correct');
        }
    }
    
    // Показываем результат
    const resultMessage = document.getElementById('resultMessage');
    
    if (!allFilled) {
        resultMessage.textContent = '⚠️ Please fill in all blanks!';
        resultMessage.className = 'result-message error';
        return;
    }
    
    if (correctCount === 5) {
        resultMessage.textContent = '🎉 Excellent! All correct!';
        resultMessage.className = 'result-message success';
        
        // Блокируем все select'ы
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`blank${i}`).disabled = true;
        }
        
        // Показываем кнопку проверки через 2 секунды
        setTimeout(() => {
            document.querySelector('.check-btn').style.display = 'none';
        }, 2000);
    } else {
        resultMessage.textContent = `❌ ${correctCount} out of 5 correct. Try again!`;
        resultMessage.className = 'result-message error';
    }
}

// Анимация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const craftsContainer = document.querySelector('.crafts-container');
    if (craftsContainer) {
        craftsContainer.style.opacity = '0';
        craftsContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            craftsContainer.style.transition = 'all 0.8s ease';
            craftsContainer.style.opacity = '1';
            craftsContainer.style.transform = 'translateY(0)';
        }, 300);
    }
});