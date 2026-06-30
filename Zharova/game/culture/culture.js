// Данные портретов
const portraitsData = [
    { id: 'portrait1', src: './photos/portrait1.jpg', correct: 'garden' },
    { id: 'portrait2', src: './photos/portrait2.jpg', correct: 'apple' },
    { id: 'portrait3', src: './photos/portrait3.jpg', correct: 'pions' },
    { id: 'portrait4', src: './photos/portrait4.jpg', correct: 'artists' },
    { id: 'portrait5', src: './photos/portrait5.jpg', correct: 'terrace' }
];

// Данные названий
const titlesData = [
    { id: 'garden', text: '"In the garden"', color: '#27ae60' },
    { id: 'apple', text: '"The girl with an apple"', color: '#e74c3c' },
    { id: 'pions', text: '"The pions"', color: '#3498db' },
    { id: 'artists', text: '"A portrait of the oldest artists"', color: '#f39c12' },
    { id: 'terrace', text: '"The terrace after the rain"', color: '#1abc9c' }
];

let placedTitles = {};
let isLocked = false;

// Функция перемешивания массива (Fisher-Yates shuffle)
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
    renderPortraits();
    renderTitles();
    initDragAndDrop();
});

// Отрисовка портретов (перемешанных)
function renderPortraits() {
    const grid = document.getElementById('portraitsGrid');
    const shuffledPortraits = shuffleArray(portraitsData);
    
    grid.innerHTML = '';
    shuffledPortraits.forEach((portrait, index) => {
        const portraitItem = document.createElement('div');
        portraitItem.className = 'portrait-item';
        portraitItem.innerHTML = `
            <div class="portrait-frame">
                <img src="${portrait.src}" alt="Portrait ${index + 1}" class="portrait-img" onclick="openLightbox('${portrait.src}')">
                <div class="drop-zone" data-portrait="${portrait.id}" data-correct="${portrait.correct}"></div>
            </div>
        `;
        grid.appendChild(portraitItem);
    });
}

// Отрисовка названий (перемешанных)
function renderTitles() {
    const container = document.getElementById('titlesContainer');
    const shuffledTitles = shuffleArray(titlesData);
    
    container.innerHTML = '';
    shuffledTitles.forEach(title => {
        const titleDraggable = document.createElement('div');
        titleDraggable.className = 'title-draggable';
        titleDraggable.draggable = true;
        titleDraggable.dataset.title = title.id;
        titleDraggable.innerHTML = `
            <div class="pin" style="background: ${title.color};"></div>
            <span class="title-text">${title.text}</span>
        `;
        container.appendChild(titleDraggable);
    });
}

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.title-draggable');
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
        title: e.target.dataset.title,
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
    
    placeTitleInZone(data, zone);
}

function clickToPlace(draggable) {
    if (isLocked) return;
    if (draggable.classList.contains('placed')) return;
    
    const firstEmptyZone = document.querySelector('.drop-zone:not(.filled)');
    if (firstEmptyZone) {
        const data = {
            title: draggable.dataset.title,
            element: draggable
        };
        placeTitleInZone(data, firstEmptyZone);
    }
}

function clickToZone(zone) {
    if (isLocked) return;
    if (!zone.classList.contains('filled')) return;
    
    const titleId = zone.dataset.filledId;
    const draggable = document.querySelector(`.title-draggable[data-title="${titleId}"]`);
    
    if (draggable) {
        draggable.classList.remove('placed');
    }
    
    zone.innerHTML = '';
    zone.classList.remove('filled');
    zone.style.borderColor = '#bdc3c7';
    zone.style.background = 'rgba(255, 255, 255, 0.95)';
    delete zone.dataset.filledId;
}

function placeTitleInZone(data, zone) {
    if (zone.classList.contains('filled')) {
        const oldTitleId = zone.dataset.filledId;
        const oldDraggable = document.querySelector(`.title-draggable[data-title="${oldTitleId}"]`);
        if (oldDraggable) {
            oldDraggable.classList.remove('placed');
        }
    }
    
    const titleText = document.createElement('span');
    titleText.className = 'title-text';
    titleText.textContent = getTitleText(data.title);
    
    zone.innerHTML = '';
    zone.appendChild(titleText);
    zone.classList.add('filled');
    zone.dataset.filledId = data.title;
    
    data.element.classList.add('placed');
}

function getTitleText(titleId) {
    const title = titlesData.find(t => t.id === titleId);
    return title ? title.text : titleId;
}

function checkMatches() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const filledZones = document.querySelectorAll('.drop-zone.filled');
    
    if (filledZones.length < 5) {
        showMessage('⚠️ Please match all portraits!', 'error');
        return;
    }
    
    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const correctAnswer = zone.dataset.correct;
        const userAnswer = zone.dataset.filledId;
        
        if (userAnswer === correctAnswer) {
            zone.classList.add('correct');
            zone.classList.remove('wrong');
            correctCount++;
        } else {
            zone.classList.add('wrong');
            zone.classList.remove('correct');
        }
    });
    
    if (correctCount === 5) {
        showMessage('🎉 Excellent! All correct!', 'success');
        document.querySelector('.check-btn').style.display = 'none';
        
        isLocked = true;
        
        const draggables = document.querySelectorAll('.title-draggable');
        draggables.forEach(d => {
            d.draggable = false;
            d.style.cursor = 'default';
        });
        
        dropZones.forEach(zone => {
            zone.style.cursor = 'default';
        });
        
        document.querySelector('.titles-container').style.opacity = '0.7';
    } else {
        showMessage(`❌ ${correctCount} out of 5 correct. Try again!`, 'error');
        
        setTimeout(() => {
            dropZones.forEach(zone => {
                zone.classList.remove('correct', 'wrong');
            });
        }, 2000);
    }
}

function showMessage(text, type) {
    const messageEl = document.getElementById('resultMessage');
    messageEl.textContent = text;
    messageEl.className = `result-message ${type}`;
}

// Lightbox функции
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