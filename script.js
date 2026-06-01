const questions = [
    {
        q: "1. ¿Cuál es el objetivo principal de la planificación y programación de la producción, según el documento?",
        options: [
            "Reducir la cantidad de materia prima en almacén.",
            "Realizar el proceso de fabricación con la máxima eficiencia.",
            "Aumentar el número de clientes semanalmente.",
            "Eliminar por completo los tiempos muertos en todas las áreas."
        ],
        correct: 1 
    },
    {
        q: "2. ¿Qué dos softwares se utilizan en el proceso de impresión data?",
        options: [
            "Word y Excel.",
            "Photoshop e Illustrator.",
            "AutoCAD y SolidWorks.",
            "Modelo generador de base de datos y Label Matrix."
        ],
        correct: 3 
    },
    {
        q: "3. ¿Cuál es el tiempo de secado obligatorio en rack para el proceso de serigrafía?",
        options: [
            "2 horas.",
            "30 minutos.",
            "4 horas.",
            "1 hora."
        ],
        correct: 0 
    },
    {
        q: "4. ¿Cómo se organiza el trabajo en Serigrafía para optimizar los tiempos?",
        options: [
            "Se inicia con los pedidos que tienen menos colores.",
            "Se imprime solo lo de Hutchinson el lunes.",
            "Se asignan primero las tareas más difíciles con más colores.",
            "Se asignan primero las tareas más sencillas para más rápido."
        ],
        correct: 2 
    },
    {
        q: "5. ¿Qué función cumple la rasqueta en el proceso de rotograbado?",
        options: [
            "Mezclar el pigmento con el Xilol de la charola.",
            "Limpiar el exceso de tinta del rodillo cromado.",
            "Ajustar la tensión de la película transfer.",
            "Evita que la mica se pegue al cromado."
        ],
        correct: 1 
    },
    {
        q: "6. ¿Qué máquina se utiliza en el último paso del proceso de data para realizar el corte de la mica?",
        options: [
            "Suajadora.",
            "Sierra.",
            "Un raspador.",
            "Slitter."
        ],
        correct: 3 
    },
    {
        q: "7. ¿Qué cliente envía un preprograma los viernes de cada semana a través de Gmail?",
        options: [
            "Hutchinson.",
            "Continental.",
            "Dayco.",
            "Nutrileche."
        ],
        correct: 0 
    },
    {
        q: "8. El formato R-12 se utiliza en Rotograbado para revisar el grabado del rodillo.",
        options: ["Verdadero.", "Falso."],
        correct: 1 
    },
    {
        q: "9. En el proceso de rotograbado, ¿cada cuántos metros lineales impresos se realiza un cambio de la canastilla?",
        options: [
            "Cada 50 ML.",
            "Cada 200 ML.",
            "Cada 120 ML.",
            "Cada 60 ML."
        ],
        correct: 2 
    },
    {
        q: "10. ¿Qué información contiene el formato R-10 utilizado en las áreas de serigrafía, rotograbado y data?",
        options: [
            "Únicamente la cantidad total de números de parte solicitados por el cliente.",
            "La cantidad solicitada e impresa, el día que se realizó, quién la realizó, la tinta utilizada.",
            "Los pasos a seguir para la revisión del marco o del grabado antes de la impresión.",
            "La verificación de los insumos necesarios como trapo, xilol y palitas."
        ],
        correct: 1 
    }
];

let currentQuestionIndex = 0;
let score = 0;
let mainTimerInterval;
let readTimerInterval;
let timeLeft = 30; 
let readTimeLeft = 5; 
let participantName = "";
let userResults = []; 

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timerDisplay = document.getElementById('timer-display');
const questionCounter = document.getElementById('question-counter');
const feedbackMessage = document.getElementById('feedback-message');
const readingMessage = document.getElementById('reading-message');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const restartBtn = document.getElementById('restart-btn');
const nameInput = document.getElementById('username');

// Audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
}

function playSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); 
        oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); 
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(120, audioCtx.currentTime); 
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime + 0.2); 
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }
}

// Lógica de Emojis inyectados en el botón
function createEmojis(emojiArray, animationName, count, targetButton) {
    if (!targetButton) return; 

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.classList.add('emoji-anim');
        el.innerText = emojiArray[Math.floor(Math.random() * emojiArray.length)];
        
        // Variable CSS para darle una dirección horizontal aleatoria al emoji
        el.style.setProperty('--x-dir', (Math.random() * 120 - 60) + 'px');
        
        el.style.animationName = animationName;
        el.style.animationDuration = (Math.random() * 1 + 1) + 's'; // Más rápido: de 1s a 2s
        el.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem'; 
        
        // Agregamos el emoji DENTRO del botón
        targetButton.appendChild(el);
        
        // Lo borramos del DOM después de animar
        setTimeout(() => el.remove(), 2500);
    }
}

function showBalloons(targetButton) {
    const balloons = ['🎈', '🎈', '🎈', '🎉', '🎊'];
    createEmojis(balloons, 'floatUpBtn', 20, targetButton);
}

function showSadFaces(targetButton) {
    const sadFaces = ['😢', '😭', '😞', '☹️', '👎'];
    createEmojis(sadFaces, 'fallDownBtn', 20, targetButton);
}

startBtn.addEventListener('click', () => {
    participantName = nameInput.value.trim();
    if (!participantName) {
        alert("Por favor, ingresa tu nombre completo para comenzar.");
        return;
    }
    initAudio(); 
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    startQuestionCycle();
});

function startQuestionCycle() {
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.q;
    questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
    
    optionsContainer.innerHTML = '';
    optionsContainer.classList.add('hidden');
    feedbackMessage.classList.add('hidden');
    readingMessage.classList.remove('hidden');
    
    readTimeLeft = 5;
    timerDisplay.className = 'reading-mode';
    timerDisplay.textContent = `Lectura: ${readTimeLeft}s`;
    
    clearInterval(mainTimerInterval);
    clearInterval(readTimerInterval);
    
    readTimerInterval = setInterval(() => {
        readTimeLeft--;
        timerDisplay.textContent = `Lectura: ${readTimeLeft}s`;
        
        if (readTimeLeft <= 0) {
            clearInterval(readTimerInterval);
            showOptionsAndStartTimer(currentQ);
        }
    }, 1000);
}

function showOptionsAndStartTimer(currentQ) {
    readingMessage.classList.add('hidden');
    optionsContainer.classList.remove('hidden');
    
    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => handleAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    timeLeft = 30;
    timerDisplay.className = 'answering-mode';
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
    
    mainTimerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(mainTimerInterval);
            handleAnswer(-1, null); 
        }
    }, 1000);
}

function handleAnswer(selectedIndex, selectedButton) {
    clearInterval(mainTimerInterval); 
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correct;
    
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    
    // Todos a gris
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled-option');
    });

    userResults.push({
        pregunta: currentQ.q,
        respuestaUsuario: selectedIndex >= 0 ? currentQ.options[selectedIndex] : "Tiempo Agotado",
        respuestaCorrecta: currentQ.options[currentQ.correct],
        esCorrecto: isCorrect
    });

    feedbackMessage.classList.remove('hidden');
    feedbackMessage.className = 'feedback'; 

    // La correcta siempre verde
    const correctBtn = allButtons[currentQ.correct];
    correctBtn.classList.remove('disabled-option');
    correctBtn.classList.add('correct-answer');

    if (isCorrect) {
        playSound('correct'); 
        // Lanzamos globos desde el botón que cliqueó (que es el correcto)
        showBalloons(selectedButton || correctBtn); 
        
        feedbackMessage.textContent = "¡Correcto! Excelente trabajo.";
        feedbackMessage.classList.add('success');
        score++;
    } else {
        playSound('incorrect'); 
        
        // Lanzamos caritas tristes SOLO desde el botón equivocado que eligió
        if(selectedButton) {
            showSadFaces(selectedButton);
            selectedButton.classList.remove('disabled-option');
            selectedButton.classList.add('wrong-answer'); 
        }
        
        feedbackMessage.textContent = "Incorrecto. Revisa la respuesta marcada en verde.";
        feedbackMessage.classList.add('error');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            startQuestionCycle(); 
        } else {
            showResults();
        }
    }, 4500); 
}

function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    document.getElementById('final-score-text').textContent = 
        `${participantName}, has obtenido ${score} aciertos de ${questions.length} preguntas.`;
}

// Generación de PDF
downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Reporte: Planeación y Programación de la Producción", 15, 20);
    
    doc.setFontSize(12);
    doc.text(`Participante: ${participantName}`, 15, 30);
    doc.text(`Puntuación Final: ${score} / ${questions.length}`, 15, 38);
    
    let yPos = 50;
    
    userResults.forEach((result, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFont("helvetica", "bold");
        const splitTitle = doc.splitTextToSize(`${index + 1}. ${result.pregunta}`, 180);
        doc.text(splitTitle, 15, yPos);
        yPos += (splitTitle.length * 6);
        
        doc.setFont("helvetica", "normal");
        const status = result.esCorrecto ? "CORRECTO" : "INCORRECTO";
        doc.setTextColor(result.esCorrecto ? 0 : 255, result.esCorrecto ? 128 : 0, 0); 
        doc.text(`Resultado: ${status}`, 15, yPos);
        doc.setTextColor(0, 0, 0); 
        yPos += 7;
        
        const splitUserAns = doc.splitTextToSize(`Tu respuesta: ${result.respuestaUsuario}`, 180);
        doc.text(splitUserAns, 15, yPos);
        yPos += (splitUserAns.length * 6);

        if (!result.esCorrecto) {
            const splitCorrAns = doc.splitTextToSize(`Respuesta Correcta: ${result.respuestaCorrecta}`, 180);
            doc.text(splitCorrAns, 15, yPos);
            yPos += (splitCorrAns.length * 6);
        }
        yPos += 7; 
    });

    doc.save(`Examen_Planeacion_${participantName.replace(/\s+/g, '_')}.pdf`);
});

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    userResults = [];
    nameInput.value = '';
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
});