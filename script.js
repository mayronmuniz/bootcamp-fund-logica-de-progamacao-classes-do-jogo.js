/* --- SISTEMA DE SOM 8-BIT (Web Audio API) --- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;
    document.querySelector('.mute-control').textContent = isMuted ? "[SOM: OFF]" : "[SOM: ON]";
}

function resumeAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type, duration, startTime = 0) {
    if (isMuted) return;
    resumeAudio();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type; 
    oscillator.frequency.value = freq;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime + startTime;
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

function sfxHit() {
    playTone(150, 'sawtooth', 0.1);
    playTone(100, 'square', 0.1, 0.05);
}

function sfxLevelUp() {
    playTone(440, 'square', 0.1, 0);
    playTone(554, 'square', 0.1, 0.1);
    playTone(659, 'square', 0.1, 0.2);
    playTone(880, 'square', 0.4, 0.3);
}

function sfxError() {
    playTone(150, 'sawtooth', 0.3);
    setTimeout(() => playTone(100, 'sawtooth', 0.3), 150);
}

/* --- LÓGICA DO JOGO --- */
function animarPersonagem(tipo) {
    const hero = document.getElementById('heroSvg');
    hero.classList.remove('attack-anim', 'levelup-anim');
    void hero.offsetWidth;

    if (tipo === 'attack') hero.classList.add('attack-anim');
    else if (tipo === 'levelup') hero.classList.add('levelup-anim');
}

/* --- DESAFIO: CLASSE HERO --- */
class Hero {
    constructor(nome, idade, tipo) {
        this.nome = String(nome || 'Herói').trim();
        this.idade = idade;
        this.tipo = String(tipo || 'guerreiro').trim();
    }

    atacar() {
        const tipoLower = this.tipo.toLowerCase();
        let ataque = 'ataque simples';

        if (tipoLower === 'mago') ataque = 'magia';
        else if (tipoLower === 'guerreiro') ataque = 'espada';
        else if (tipoLower === 'monge') ataque = 'artes marciais';
        else if (tipoLower === 'ninja') ataque = 'shuriken';

        const mensagem = `o ${tipoLower} atacou usando ${ataque}`;
        // Feedback sonoro e animação curtos para destacar o ataque
        try { sfxHit(); } catch (e) { /* silencioso se Web Audio não disponível */ }
        try { animarPersonagem('attack'); } catch (e) { /* ignorar */ }

        return mensagem;
    }
}

// Função que cria um herói com os dados do formulário e exibe o ataque
function criarHeroiEAtacar() {
    const nome = document.getElementById('heroiNome').value.trim() || 'Herói';
    const idade = document.getElementById('heroiIdade').value || '—';
    const tipo = document.getElementById('heroiTipo').value || 'guerreiro';

    const heroi = new Hero(nome, idade, tipo);
    const msg = heroi.atacar();
    const out = document.getElementById('resultado-heroi');
    if (out) out.textContent = msg;
}

// Função demo que executa ataques para os 4 tipos pedidos
function demoAtaques() {
    const tipos = ['mago', 'guerreiro', 'monge', 'ninja'];
    const out = document.getElementById('resultado-heroi');
    if (!out) return;
    out.innerHTML = '';
    tipos.forEach((t) => {
        const heroi = new Hero('Demo', '—', t);
        const p = document.createElement('div');
        p.textContent = heroi.atacar();
        out.appendChild(p);
    });
}

/**
 * Recebe vitórias e derrotas e retorna o saldo e o nível.
 * Regras de nível baseadas na quantidade de vitórias.
 */
function calcularSaldoENivel(vitorias, derrotas) {
    // Garantir inteiros e valores não-negativos
    // Função de classificação removida — calculadora de partidas não é mais necessária.
    throw new Error('calcularSaldoENivel removida: funcionalidade de calculadora desativada.');
}
// As funções relacionadas à calculadora (classificarPartidas / limparFormulario)
// foram removidas para manter apenas o Desafio Classe do Herói.
