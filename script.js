// ==========================================
// IFSABER — LÓGICA INTERATIVA (MOCK DINÂMICO)
// ==========================================

// BANCO DE DADOS DE QUESTÕES (MOCK LOCAL)
const BANCO_QUESTOES = [
  { id: 1, pergunta: "1) Qual a solução da equação 2x + 4 = 10?", opcoes: ["a) x = 2", "b) x = 3", "c) x = 4", "d) x = 5"], correta: 1 },
  { id: 2, pergunta: "2) Resolva: 3x - 5 = 10", opcoes: ["a) x = 3", "b) x = 5", "c) x = 7", "d) x = 15"], correta: 1 },
  { id: 3, pergunta: "3) Se x/2 = 8, qual o valor de x?", opcoes: ["a) x = 4", "b) x = 10", "c) x = 16", "d) x = 64"], correta: 2 },
  { id: 4, pergunta: "4) Qual o valor de x em: 5x = 25?", opcoes: ["a) x = 1", "b) x = 5", "c) x = 10", "d) x = 20"], correta: 1 }
];

// ESTADO DA APLICAÇÃO
let usuarioLogado = null;
let respostasUsuario = {};

document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos();
});

function inicializarEventos() {
  // 1. LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userVal = document.getElementById("usuario").value.trim();
      const senhaVal = document.getElementById("senha").value.trim();

      if (userVal && senhaVal) {
        usuarioLogado = userVal;
        localStorage.setItem("ifsaber_user", userVal);
        exibirPainel();
      } else {
        document.getElementById("mensagemLogin").innerText = "Preencha todos os campos.";
      }
    });
  }

  // TOGGLE SENHA
  const toggleBtn = document.getElementById("togglePassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const inputSenha = document.getElementById("senha");
      if (inputSenha.type === "password") {
        inputSenha.type = "text";
      } else {
        inputSenha.type = "password";
      }
    });
  }

  // 2. NAV
  const navButtons = document.querySelectorAll("[data-screen], [data-goto]");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-screen") || btn.getAttribute("data-goto");
      if (target) navegarPara(target);
    });
  });

  // LOGOUT
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("ifsaber_user");
      location.reload();
    });
  }
}

// TROCA DE TELAS
function navegarPara(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((s) => s.classList.add("hidden"));

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
  }

  // Renderização dinâmica conforme a tela
  if (screenId === "resultado") renderizarQuizOuResultado();
  if (screenId === "gabarito") renderizarGabarito();
  if (screenId === "ranking") renderizarRanking();
}

function exibirPainel() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("painel").classList.remove("hidden");
  navegarPara("inicio");
}

// RENDERIZAR QUIZ E PROCESSAR RESPOSTAS
function renderizarQuizOuResultado() {
  const container = document.getElementById("questionsGrid");
  if (!container) return;

  container.innerHTML = "";

  BANCO_QUESTOES.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.style.marginBottom = "16px";
    qDiv.style.textAlign = "left";

    let htmlOpcoes = "";
    q.opcoes.forEach((opt, optIndex) => {
      const checked = respostasUsuario[q.id] === optIndex ? "checked" : "";
      htmlOpcoes += `
        <label style="display:block; margin: 4px 0; cursor:pointer;">
          <input type="radio" name="q_${q.id}" value="${optIndex}" ${checked} onchange="salvarResposta(${q.id}, ${optIndex})">
          ${opt}
        </label>
      `;
    });

    qDiv.innerHTML = `<strong>${q.pergunta}</strong><div>${htmlOpcoes}</div>`;
    container.appendChild(qDiv);
  });

  // Botão de Finalizar
  const btnFinalizar = document.createElement("button");
  btnFinalizar.className = "primary";
  btnFinalizar.style.marginTop = "10px";
  btnFinalizar.innerText = "Finalizar e Calcular Resultado";
  btnFinalizar.onclick = calcularResultado;
  container.appendChild(btnFinalizar);
}

window.salvarResposta = function (qId, optIndex) {
  respostasUsuario[qId] = optIndex;
};

// CALCULAR DESEMPENHO REAL
function calcularResultado() {
  let acertos = 0;
  let erros = 0;

  BANCO_QUESTOES.forEach((q) => {
    if (respostasUsuario[q.id] !== undefined) {
      if (respostasUsuario[q.id] === q.correta) {
        acertos++;
      } else {
        erros++;
      }
    }
  });

  const total = BANCO_QUESTOES.length;
  const percentual = Math.round((acertos / total) * 100);

  // Atualiza os dados na tela
  const statsDiv = document.querySelector(".stats");
  if (statsDiv) {
    statsDiv.innerHTML = `
      <div class="stat main-stat"><div class="donut"><span>${percentual}%</span></div><div><h2>${percentual}%</h2><p>de acertos</p></div></div>
      <div class="stat"><span class="icon correct">✓</span><div><h3>${acertos}</h3><p>acertos</p></div></div>
      <div class="stat"><span class="icon wrong">×</span><div><h3>${erros}</h3><p>erros</p></div></div>
      <div class="stat"><span class="icon unanswered">−</span><div><h3>${total - (acertos + erros)}</h3><p>não respondidas</p></div></div>
    `;
  }

  alert(`Quiz Finalizado! Você acertou ${acertos} de ${total} questões (${percentual}%).`);
};

// GABARITO DINÂMICO
function renderizarGabarito() {
  const tbody = document.getElementById("answerBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  BANCO_QUESTOES.forEach((q) => {
    const respUser = respostasUsuario[q.id] !== undefined ? q.opcoes[respostasUsuario[q.id]] : "Não respondida";
    const respCorreta = q.opcoes[q.correta];
    const acertou = respostasUsuario[q.id] === q.correta;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>Questão ${q.id}</td>
      <td>${respUser}</td>
      <td>${respCorreta}</td>
      <td class="status ${acertou ? "ok" : "no"}">${acertou ? "✓ Correta" : "× Incorreta"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// RANKING DINÂMICO
function renderizarRanking() {
  const tbody = document.getElementById("rankingBody");
  if (!tbody) return;

  const usuario = localStorage.getItem("ifsaber_user") || "Aluno IFMA";

  tbody.innerHTML = `
    <tr><td>1º</td><td>Ana Clara</td><td>2º ano - B</td><td>4/4</td><td>100%</td></tr>
    <tr><td>2º</td><td>Carlos Eduardo</td><td>2º ano - A</td><td>4/4</td><td>100%</td></tr>
    <tr style="background: var(--green-light); font-weight: bold;">
      <td>3º</td><td>${usuario} (Você)</td><td>2º ano - B</td><td>Calculado</td><td>Dinamico</td>
    </tr>
    <tr><td>4º</td><td>João Pedro</td><td>2º ano - C</td><td>2/4</td><td>50%</td></tr>
  `;
}
