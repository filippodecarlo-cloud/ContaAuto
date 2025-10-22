// Inizializza i contatori per ogni marca di auto
let counters = new Array(35).fill(0);

// Carica i dati salvati al caricamento della pagina
window.addEventListener('DOMContentLoaded', () => {
  loadCounters();
  updateBrandTable();
  updateButtonOrder();
  
  // Setup del toggle per effetti e suoni
  const toggle = document.getElementById('effects-toggle');
  toggle.addEventListener('change', (e) => {
    localStorage.setItem('effectsEnabled', e.target.checked);
  });
  
  // Carica lo stato precedente del toggle
  const effectsEnabled = localStorage.getItem('effectsEnabled');
  if (effectsEnabled !== null) {
    toggle.checked = effectsEnabled === 'true';
  }
});

// Crea un AudioContext condiviso
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Mappa delle frequenze per ogni brand (note musicali diverse)
const brandFrequencies = {
  1: 262,    // Tesla - Do
  2: 294,    // Mercedes - Re
  3: 330,    // BMW - Mi
  4: 349,    // Audi - Fa
  5: 392,    // FIAT - Sol
  6: 440,    // Porsche - La
  7: 494,    // Land Rover - Si
  8: 523,    // Jeep - Do alto
  9: 587,    // Renault - Re alto
  10: 659,   // Peugeot - Mi alto
  11: 698,   // Citroen - Fa alto
  12: 784,   // Alfa Romeo - Sol alto
  13: 880,   // Ferrari - La alto
  14: 988,   // Jaguar - Si alto
  15: 1047,  // Lamborghini - Do 2 ottave
  16: 1175,  // Maserati - Re 2 ottave
  17: 1319,  // Mini - Mi 2 ottave
  18: 1397,  // Toyota - Fa 2 ottave
  19: 1568,  // Volvo - Sol 2 ottave
  20: 1760,  // Volkswagen - La 2 ottave
  21: 1976,  // Smart - Si 2 ottave
  22: 277,   // Ford - Do#
  23: 311,   // Honda - Re#
  24: 370,   // Dacia - Fa#
  25: 415,   // Hyundai - Sol#
  26: 466,   // Kia - La#
  27: 554,   // Opel - Do# alto
  28: 622,   // Skoda - Re# alto
  29: 740,   // Suzuki - Fa# alto
  30: 831,   // Nissan - Sol# alto
  31: 932,   // Seat - La# alto
  32: 440,   // Lancia - La
  33: 330,   // BYD - Mi
  34: 392,   // MG - Sol
  35: 220    // Altro - La basso
};

// Funzione per riprodurre un suono
const playSound = (index) => {
  const effectsEnabled = document.getElementById('effects-toggle').checked;
  if (!effectsEnabled) return;
  
  try {
    const ctx = getAudioContext();
    const frequency = brandFrequencies[index] || 800;
    
    // Crea oscillatore
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.type = 'sine';
    
    // Envelope ADSR semplice
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.log('Audio non disponibile:', e);
  }
};

// Funzione per aggiungere effetto di pulsazione
const addPulseEffect = (buttonElement) => {
  const effectsEnabled = document.getElementById('effects-toggle').checked;
  if (!effectsEnabled) return;
  
  buttonElement.classList.add('pulse');
  setTimeout(() => {
    buttonElement.classList.remove('pulse');
  }, 300);
};

// Funzione per incrementare il contatore
const incrementCounter = index => {
  counters[index - 1]++;
  updateDisplay(index, counters[index - 1]);
  updateBrandTable();
  updateButtonOrder();
  
  // Effetti visivi e audio
  const button = document.getElementById(`btn${index}`);
  addPulseEffect(button);
  playSound(index);
  
  // Salva i dati
  saveCounters();
};

// Funzione per resettare i contatori
const resetCounters = () => {
  counters.fill(0);
  updateBrandTable();
  updateButtonOrder();
  for (let i = 1; i <= 35; i++) {
    updateDisplay(i, 0);
  }
  
  // Salva i dati
  saveCounters();
};

// Funzione per aggiornare il display del contatore
const updateDisplay = (index, count) => {
  document.getElementById(`count${index}`).textContent = count;
};

// Funzione per aggiornare la tabella dei marchi
const updateBrandTable = () => {
  const brandTable = document.getElementById('brand-table');
  const tbody = brandTable.getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  const brands = [
    'Tesla', 'Mercedes', 'BMW', 'Audi', 'FIAT', 'Porsche', 'Land Rover', 'Jeep',
    'Renault', 'Peugeot', 'Citroen', 'Alfa Romeo', 'Ferrari', 'Jaguar', 'Lamborghini',
    'Maserati', 'Mini', 'Toyota', 'Volvo', 'Volkswagen', 'Smart', 'Ford', 'Honda',
    'Dacia', 'Hyundai', 'Kia', 'Opel', 'Skoda', 'Suzuki', 'Nissan', 'Seat', 'Lancia', 'BYD', 'MG', 'Altro'
  ];

  brands.forEach((brand, index) => {
    const row = document.createElement('tr');
    const brandCell = document.createElement('td');
    const countCell = document.createElement('td');

    brandCell.textContent = brand;
    countCell.textContent = counters[index];
    row.appendChild(brandCell);
    row.appendChild(countCell);
    tbody.appendChild(row);
  });

  sortTableRows(tbody);
};

// Funzione per riordinare i pulsanti in base al numero di click
const updateButtonOrder = () => {
  const container = document.getElementById('container');
  const buttons = Array.from(container.getElementsByClassName('car-btn'));

  buttons.sort((a, b) => {
    const countA = parseInt(a.getElementsByTagName('span')[0].textContent);
    const countB = parseInt(b.getElementsByTagName('span')[0].textContent);
    return countB - countA;
  });

  clearContainer(container);
  buttons.forEach(button => {
    container.appendChild(button);
  });
};

// Funzione per ordinare le righe della tabella in base al numero di click
const sortTableRows = tbody => {
  const rows = Array.from(tbody.getElementsByTagName('tr'));
  rows.sort((a, b) => {
    const countA = parseInt(b.lastElementChild.textContent);
    const countB = parseInt(a.lastElementChild.textContent);
    return countA - countB;
  });
  clearContainer(tbody);
  rows.forEach(row => {
    tbody.appendChild(row);
  });
};

// Funzione per svuotare un contenitore
const clearContainer = container => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// Funzione per salvare i contatori nel localStorage
const saveCounters = () => {
  localStorage.setItem('carCounters', JSON.stringify(counters));
};

// Funzione per caricare i contatori dal localStorage
const loadCounters = () => {
  const saved = localStorage.getItem('carCounters');
  if (saved) {
    counters = JSON.parse(saved);
    for (let i = 0; i < counters.length; i++) {
      updateDisplay(i + 1, counters[i]);
    }
  }
};
