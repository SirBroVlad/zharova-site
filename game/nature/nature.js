// Правильный порядок слов
const correctOrder = ['Wolves', 'and', 'foxes', 'hide', 'between', 'birches', 'and', 'pines'];

let currentOrder = [];
let isLocked = false; // Флаг блокировки

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
});

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.word-draggable');
    const slots = document.querySelectorAll('.word-slot');
    
    // Настраиваем перетаскиваемые элементы
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
        draggable.addEventListener('click', () => clickToPlace(draggable));
    });
    
    // Настраиваем слоты
    slots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', drop);
        slot.addEventListener('click', () => clickToSlot(slot));
    });
}

function dragStart(e) {
    if (isLocked) {
        e.preventDefault();
        return;
    }
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', JSON.stringify({
        word: e.target.dataset.word,
        id: e.target.dataset.id
    }));
    e.dataTransfer.effectAllowed = 'move';
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    if (isLocked) {
        e.preventDefault();
        return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!e.target.classList.contains('filled')) {
        e.target.classList.add('drag-over');
    }
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    if (isLocked) {
        e.preventDefault();
        return;
    }
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    if (e.target.classList.contains('filled')) return;
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const slot = e.target;
    
    placeWordInSlot(data, slot);
}

function clickToPlace(draggable) {
    if (isLocked) return;
    if (draggable.classList.contains('placed')) return;
    
    const firstEmptySlot = document.querySelector('.word-slot:not(.filled)');
    if (firstEmptySlot) {
        const data = {
            word: draggable.dataset.word,
            id: draggable.dataset.id
        };
        placeWordInSlot(data, firstEmptySlot);
        
        // Скрываем оригинал
        draggable.classList.add('placed');
    }
}

function clickToSlot(slot) {
    if (isLocked) return;
    if (!slot.classList.contains('filled')) return;
    
    // Удаляем слово из слота
    const wordId = slot.dataset.filledId;
    const draggable = document.querySelector(`.word-draggable[data-id="${wordId}"]`);
    
    if (draggable) {
        draggable.classList.remove('placed');
    }
    
    slot.textContent = '';
    slot.classList.remove('filled');
    slot.style.borderColor = '#bdc3c7';
    slot.style.background = 'rgba(255, 255, 255, 0.6)';
    delete slot.dataset.filledId;
    
    updateCurrentOrder();
}

function placeWordInSlot(data, slot) {
    slot.textContent = data.word;
    slot.classList.add('filled');
    slot.dataset.filledId = data.id;
    
    updateCurrentOrder();
}

function updateCurrentOrder() {
    const slots = document.querySelectorAll('.word-slot');
    currentOrder = [];
    
    slots.forEach(slot => {
        if (slot.classList.contains('filled')) {
            currentOrder.push(slot.textContent);
        }
    });
}

function checkSentence() {
    const slots = document.querySelectorAll('.word-slot');
    const filledSlots = document.querySelectorAll('.word-slot.filled');
    
    // Проверяем, все ли слоты заполнены
    if (filledSlots.length < correctOrder.length) {
        showMessage('⚠️ Please fill all slots!', 'error');
        return;
    }
    
    // Проверяем правильность порядка
    let isCorrect = true;
    
    slots.forEach((slot, index) => {
        const word = slot.textContent;
        if (word === correctOrder[index]) {
            slot.classList.add('correct');
            slot.classList.remove('wrong');
        } else {
            slot.classList.add('wrong');
            slot.classList.remove('correct');
            isCorrect = false;
        }
    });
    
    if (isCorrect) {
        showMessage('🎉 Excellent! Correct sentence!', 'success');
        document.querySelector('.check-btn').style.display = 'none';
        
        // БЛОКИРУЕМ ВСЁ
        isLocked = true;
        
        // Убираем возможность перетаскивания
        const draggables = document.querySelectorAll('.word-draggable');
        draggables.forEach(d => {
            d.draggable = false;
            d.style.cursor = 'default';
        });
        
        // Убираем возможность клика по слотам
        slots.forEach(slot => {
            slot.style.cursor = 'default';
        });
        
        // Визуально показываем что всё заблокировано
        document.getElementById('wordsContainer').style.opacity = '0.7';
        document.getElementById('sentenceContainer').style.opacity = '1';
        
    } else {
        showMessage('❌ Not quite right. Try again!', 'error');
        
        // Сбрасываем цвета через 2 секунды
        setTimeout(() => {
            slots.forEach(slot => {
                slot.classList.remove('correct', 'wrong');
            });
        }, 2000);
    }
}

function showMessage(text, type) {
    const messageEl = document.getElementById('resultMessage');
    messageEl.textContent = text;
    messageEl.className = `result-message ${type}`;
}