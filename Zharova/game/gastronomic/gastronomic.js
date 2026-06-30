// Данные продуктов
const foodData = [
    { id: 'food1', image: './photos/food1.jpg', name: 'Tambov bread', correctLabel: 'bread' },
    { id: 'food2', image: './photos/food2.jpg', name: 'scallions', correctLabel: 'scallions' },
    { id: 'food3', image: './photos/food3.jpg', name: 'sturgeon', correctLabel: 'sturgeon' },
    { id: 'food4', image: './photos/food4.jpg', name: 'tomatoes', correctLabel: 'tomatoes' },
    { id: 'food5', image: './photos/food5.jpg', name: 'cucumbers', correctLabel: 'cucumbers' },
    { id: 'food6', image: './photos/food6.jpg', name: 'lettuce leaves', correctLabel: 'lettuce' },
    { id: 'food7', image: './photos/food7.jpg', name: 'sweets', correctLabel: 'sweets' },
    { id: 'food8', image: './photos/food8.jpg', name: 'honey', correctLabel: 'honey' }
];

// Названия
const labelsData = [
    { id: 'bread', text: 'Tambov bread' },
    { id: 'scallions', text: 'scallions' },
    { id: 'sturgeon', text: 'sturgeon' },
    { id: 'tomatoes', text: 'tomatoes' },
    { id: 'cucumbers', text: 'cucumbers' },
    { id: 'lettuce', text: 'lettuce leaves' },
    { id: 'sweets', text: 'sweets' },
    { id: 'honey', text: 'honey' }
];

let isLocked = false;

// Функция перемешивания
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
    renderLabels();
    renderFood();
    initDragAndDrop();
});

// Отрисовка названий (перемешанных)
function renderLabels() {
    const container = document.getElementById('labelsContainer');
    const shuffledLabels = shuffleArray(labelsData);
    
    container.innerHTML = '';
    shuffledLabels.forEach(label => {
        const labelDraggable = document.createElement('div');
        labelDraggable.className = 'label-draggable';
        labelDraggable.draggable = true;
        labelDraggable.dataset.label = label.id;
        labelDraggable.innerHTML = `<span class="label-text">${label.text}</span>`;
        container.appendChild(labelDraggable);
    });
}

// Отрисовка продуктов (перемешанных)
function renderFood() {
    const grid = document.getElementById('foodGrid');
    const shuffledFood = shuffleArray(foodData);
    
    grid.innerHTML = '';
    shuffledFood.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <div class="food-frame" data-food="${food.id}" data-correct="${food.correctLabel}">
                <img src="${food.image}" alt="${food.name}" class="food-img" onclick="openLightbox('${food.image}')">
            </div>
            <div class="drop-zone" data-food="${food.id}" data-correct="${food.correctLabel}"></div>
        `;
        grid.appendChild(foodItem);
    });
}

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.label-draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
        draggable.addEventListener('click', () => clickToPlace(draggable));
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragleave', dragLeave);
        zone.addEventListener('drop', drop);
        zone.addEventListener('click', () => clickToZone(zone));
    });
}

function dragStart(e) {
    if (isLocked) {
        e.preventDefault();
        return;
    }
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', JSON.stringify({
        label: e.target.dataset.label,
        element: e.target
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
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const zone = e.target;
    
    placeLabelInZone(data, zone);
}

function clickToPlace(draggable) {
    if (isLocked) return;
    if (draggable.classList.contains('placed')) return;
    
    const firstEmptyZone = document.querySelector('.drop-zone:not(.filled)');
    if (firstEmptyZone) {
        const data = {
            label: draggable.dataset.label,
            element: draggable
        };
        placeLabelInZone(data, firstEmptyZone);
    }
}

function clickToZone(zone) {
    if (isLocked) return;
    if (!zone.classList.contains('filled')) return;
    
    const labelId = zone.dataset.filledId;
    const draggable = document.querySelector(`.label-draggable[data-label="${labelId}"]`);
    
    if (draggable) {
        draggable.classList.remove('placed');
    }
    
    zone.innerHTML = '';
    zone.classList.remove('filled');
    zone.style.borderColor = '#bdc3c7';
    zone.style.background = 'rgba(255, 255, 255, 0.95)';
    delete zone.dataset.filledId;
}

function placeLabelInZone(data, zone) {
    if (zone.classList.contains('filled')) {
        const oldLabelId = zone.dataset.filledId;
        const oldDraggable = document.querySelector(`.label-draggable[data-label="${oldLabelId}"]`);
        if (oldDraggable) {
            oldDraggable.classList.remove('placed');
        }
    }
    
    const labelText = document.createElement('span');
    labelText.className = 'label-text';
    labelText.textContent = getLabelText(data.label);
    
    zone.innerHTML = '';
    zone.appendChild(labelText);
    zone.classList.add('filled');
    zone.dataset.filledId = data.label;
    
    data.element.classList.add('placed');
}

function getLabelText(labelId) {
    const label = labelsData.find(l => l.id === labelId);
    return label ? label.text : labelId;
}

function checkMatches() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const foodFrames = document.querySelectorAll('.food-frame');
    const filledZones = document.querySelectorAll('.drop-zone.filled');
    
    if (filledZones.length < 8) {
        showMessage('⚠️ Please match all products!', 'error');
        return;
    }
    
    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const correctAnswer = zone.dataset.correct;
        const userAnswer = zone.dataset.filledId;
        const foodFrame = zone.previousElementSibling;
        
        if (userAnswer === correctAnswer) {
            zone.style.borderColor = '#27ae60';
            zone.style.background = '#d5f5e3';
            foodFrame.classList.add('correct');
            foodFrame.classList.remove('wrong');
            correctCount++;
        } else {
            zone.style.borderColor = '#e74c3c';
            zone.style.background = '#fadbd8';
            foodFrame.classList.add('wrong');
            foodFrame.classList.remove('correct');
            
            setTimeout(() => {
                zone.style.borderColor = '#bdc3c7';
                zone.style.background = 'rgba(255, 255, 255, 0.95)';
                foodFrame.classList.remove('wrong');
            }, 1000);
        }
    });
    
    if (correctCount === 8) {
        showMessage('🎉 Excellent! All correct!', 'success');
        document.querySelector('.check-btn').style.display = 'none';
        
        isLocked = true;
        
        const draggables = document.querySelectorAll('.label-draggable');
        draggables.forEach(d => {
            d.draggable = false;
            d.style.cursor = 'default';
        });
        
        dropZones.forEach(zone => {
            zone.style.cursor = 'default';
        });
        
        foodFrames.forEach(frame => {
            frame.style.cursor = 'default';
        });
        
        document.querySelector('.labels-container').style.opacity = '0.7';
        
        setTimeout(() => {
            showFinalPopup();
        }, 1500);
    } else {
        showMessage(`❌ ${correctCount} out of 8 correct. Try again!`, 'error');
    }
}

function showMessage(text, type) {
    const messageEl = document.getElementById('resultMessage');
    messageEl.textContent = text;
    messageEl.className = `result-message ${type}`;
}

// Lightbox
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightboxImg.src = src;
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