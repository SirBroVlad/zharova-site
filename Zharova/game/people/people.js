// Данные людей и их профессий
const peopleData = [
    { id: 'person1', image: './photos/person1.jpg', profession: 'a musician', correctLabel: 'musician' },
    { id: 'person2', image: './photos/person2.jpg', profession: 'a sportsman', correctLabel: 'sportsman' },
    { id: 'person3', image: './photos/person3.jpg', profession: 'a military man', correctLabel: 'military' },
    { id: 'person4', image: './photos/person4.jpg', profession: 'a cosmonaut', correctLabel: 'cosmonaut' },
    { id: 'person5', image: './photos/person5.jpg', profession: 'an artist', correctLabel: 'artist' },
    { id: 'person6', image: './photos/person6.jpg', profession: 'a writer and a poet', correctLabel: 'writer' }
];

// Подписи
const labelsData = [
    { id: 'military', text: 'a military man' },
    { id: 'writer', text: 'a writer and a poet' },
    { id: 'sportsman', text: 'a sportsman' },
    { id: 'musician', text: 'a musician' },
    { id: 'cosmonaut', text: 'a cosmonaut' },
    { id: 'artist', text: 'an artist' }
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
    renderPhotos();
    initDragAndDrop();
});

// Отрисовка подписей (перемешанных)
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

// Отрисовка фотографий (перемешанных)
function renderPhotos() {
    const grid = document.getElementById('photosGrid');
    const shuffledPhotos = shuffleArray(peopleData);
    
    grid.innerHTML = '';
    shuffledPhotos.forEach(person => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <div class="photo-frame" data-person="${person.id}" data-correct="${person.correctLabel}">
                <img src="${person.image}" alt="${person.profession}" class="photo-img" onclick="openLightbox('${person.image}')">
            </div>
            <div class="drop-zone" data-person="${person.id}" data-correct="${person.correctLabel}"></div>
        `;
        grid.appendChild(photoItem);
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
    const photoFrames = document.querySelectorAll('.photo-frame');
    const filledZones = document.querySelectorAll('.drop-zone.filled');
    
    if (filledZones.length < 6) {
        showMessage('⚠️ Please match all portraits!', 'error');
        return;
    }
    
    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const correctAnswer = zone.dataset.correct;
        const userAnswer = zone.dataset.filledId;
        const photoFrame = zone.previousElementSibling;
        
        if (userAnswer === correctAnswer) {
            zone.style.borderColor = '#27ae60';
            zone.style.background = '#d5f5e3';
            photoFrame.classList.add('correct');
            photoFrame.classList.remove('wrong');
            correctCount++;
        } else {
            zone.style.borderColor = '#e74c3c';
            zone.style.background = '#fadbd8';
            photoFrame.classList.add('wrong');
            photoFrame.classList.remove('correct');
            
            setTimeout(() => {
                zone.style.borderColor = '#bdc3c7';
                zone.style.background = 'rgba(255, 255, 255, 0.95)';
                photoFrame.classList.remove('wrong');
            }, 1000);
        }
    });
    
    if (correctCount === 6) {
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
        
        photoFrames.forEach(frame => {
            frame.style.cursor = 'default';
        });
        
        document.querySelector('.labels-container').style.opacity = '0.7';
        
        setTimeout(() => {
            showFinalPopup();
        }, 1500);
    } else {
        showMessage(`❌ ${correctCount} out of 6 correct. Try again!`, 'error');
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