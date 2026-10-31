document.addEventListener("DOMContentLoaded", () => {
  const form        = document.getElementById("access-form");
  const idInput     = document.getElementById("quiz-id");
  const pwdInput    = document.getElementById("quiz-password");
  const idError     = document.getElementById("error-quiz-id");
  const toggleBtn   = document.getElementById("toggle-password"); // toggle-password-signup ???
  const eyeIcon     = document.getElementById("eyeIcon");
  let quizData = {};

  // 1. Carica quiz.json
  fetch('quiz.json')
    .then(res => res.json())
    .then(data => quizData = data)
    .catch(console.error);
  
  // 2. Toggle mostra/nascondi password
  toggleBtn.addEventListener("click", () => {
    const isPwd = pwdInput.type === "password";
    pwdInput.type = isPwd ? "text" : "password";
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");
  });

  const idInput2 = document.getElementById("new-id");

  // 3. Controllo ID già esistente al blur
  idInput2.addEventListener("blur", () => {
    const id = idInput2.value.trim();
    if (quizData[id]) {
      idError.textContent = "ID non disponibile, scegli un altro nickname.";
      idInput.focus();
    } else {
      idError.textContent = "";
    }
  });

  // 4. Submit form
  form.addEventListener("submit", e => {
    e.preventDefault();
    const id  = idInput.value.trim();
    const pwd = pwdInput.value;

    // Verifica ID/password
    if (!quizData[id]) {
      idError.textContent = "ID non registrato. Crealo prima!";
      idInput.focus();
      return;
    }
    // TODO: non funziona, risolvere
    // const idError2 = document.getElementById("error-quiz-id2");
    // if (quizData[id].password !== pwd) {
    //   idError2.textContent = "Password errata. Riprova!";
    //   pwdInput.focus();
    //   return;
    // }

    // Se tutto ok: mostra dashboard
    document.getElementById("access-card").classList.add("hidden");
    const dashboard = document.getElementById("quiz-dashboard");
    dashboard.classList.add("visible");

    // Popola quiz-list con più quiz per utente
    const list = document.getElementById("quiz-list");
    quizData[id].quizzes.forEach(q => {
      const a = document.createElement("a");
      a.href = `crea/${q.id}.html`;
      a.className = "quiz-card";
      a.textContent = q.title;
      list.appendChild(a);
    });
  });

  const signInBtnLink = document.querySelector('.switch-signin');
  const signUpBtnLink = document.querySelector('.switch-signup');
  const wrapper = document.querySelector('.auth-wrapper');
  signUpBtnLink.addEventListener('click', () => {
      wrapper.classList.toggle('active');
  });
  signInBtnLink.addEventListener('click', () => {
      wrapper.classList.toggle('active');
  });
});