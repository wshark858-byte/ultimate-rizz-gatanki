const ui = {
      mk: {
        tagline: "Најглатките, најсмешните и најдобрите линии за да го кренеш нивото.",
        genLabel: "Случаен Риз",
        randomPlaceholder: "Кликни за нова линија",
        hit: "Удри",
        copy: "Копирај",
        copied: "Копирано!",
        cats: { all: "Сите", smooth: "Глатки", funny: "Смешни", cheesy: "Кичеви", modern: "Модерни", text: "За пораки" },
        footer: "Направено со <span>♥</span> за максимален риз · Користи одговорно",
        riddlesTag: "Класични македонски народни гатанки. Кликни за да го видиш одговорот.",
        reveal: "Покажи одговор",
        answerLabel: "Одговор:"
      },
      en: {
        tagline: "The smoothest, funniest, and most effective lines to level up your game.",
        genLabel: "Random Rizz Drop",
        randomPlaceholder: "Click for a fresh line",
        hit: "Hit Me",
        copy: "Copy",
        copied: "Copied!",
        cats: { all: "All", smooth: "Smooth", funny: "Funny", cheesy: "Cheesy", modern: "Modern", text: "Text Openers" },
        footer: "Built with <span>♥</span> for maximum rizz · Use responsibly",
        riddlesTag: "Classic Macedonian folk riddles. Click to reveal the answer.",
        reveal: "Show answer",
        answerLabel: "Answer:"
      }
    };

    let lang = "mk";
    let currentCat = "all";
    let currentRandom = null;
    let currentSection = "rizz";

    function getLines() { return lang === "mk" ? linesMK : linesEN; }
    function t() { return ui[lang]; }

    function applyUI() {
      const u = t();
      document.getElementById("tagline").textContent = u.tagline;
      document.getElementById("gen-label").textContent = u.genLabel;
      document.getElementById("btn-hit").textContent = u.hit;
      document.getElementById("btn-copy-rand").textContent = u.copy;
      document.getElementById("footer-text").innerHTML = u.footer;
      document.getElementById("riddles-tagline").textContent = u.riddlesTag;
      document.getElementById("toast").textContent = u.copied;
      document.getElementById("cat-all").textContent = u.cats.all;
      document.getElementById("cat-smooth").textContent = u.cats.smooth;
      document.getElementById("cat-funny").textContent = u.cats.funny;
      document.getElementById("cat-cheesy").textContent = u.cats.cheesy;
      document.getElementById("cat-modern").textContent = u.cats.modern;
      document.getElementById("cat-text").textContent = u.cats.text;
      const rl = document.getElementById("random-line");
      if (!currentRandom) rl.textContent = u.randomPlaceholder;
    }

    function renderLines() {
      const grid = document.getElementById("lines-grid");
      const lines = getLines();
      const filtered = currentCat === "all" ? lines : lines.filter(l => l.cat === currentCat);
      const copyLabel = t().copy;
      grid.innerHTML = filtered.map((line, i) => `
        <div class="line-card" style="animation-delay: ${i * 0.03}s">
          <div class="line-text">${line.text}</div>
          <button class="btn-copy" onclick="copyText(this, \`${line.text.replace(/`/g, "\\`").replace(/\\\\/g, "\\\\\\\\")}\`)">${copyLabel}</button>
        </div>
      `).join("");
    }

    function renderRiddles() {
      const grid = document.getElementById("riddles-grid");
      const u = t();
      grid.innerHTML = riddles.map((r, i) => `
        <div class="riddle-card" id="riddle-${i}" style="animation-delay: ${i * 0.04}s">
          <div class="riddle-q">${r.q}</div>
          <button class="btn-reveal" onclick="toggleRiddle(${i})">${u.reveal}</button>
          <div class="riddle-answer-wrap">
            <div class="riddle-answer">${u.answerLabel} ${r.a}</div>
          </div>
        </div>
      `).join("");
    }

    function toggleRiddle(i) {
      document.getElementById("riddle-" + i).classList.toggle("open");
    }

    function generateRandom() {
      const el = document.getElementById("random-line");
      el.style.opacity = "0";
      setTimeout(() => {
        const pool = currentCat === "all" ? getLines() : getLines().filter(l => l.cat === currentCat);
        currentRandom = pool[Math.floor(Math.random() * pool.length)].text;
        el.textContent = currentRandom;
        el.style.opacity = "1";
      }, 150);
    }

    function copyText(btn, text) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = t().copied;
        btn.classList.add("copied");
        showToast();
        setTimeout(() => {
          btn.textContent = t().copy;
          btn.classList.remove("copied");
        }, 1800);
      });
    }

    function copyRandom() {
      if (!currentRandom) {
        generateRandom();
        setTimeout(copyRandom, 200);
        return;
      }
      navigator.clipboard.writeText(currentRandom).then(showToast);
    }

    function showToast() {
      const toast = document.getElementById("toast");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }

    document.querySelectorAll(".main-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".main-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSection = btn.dataset.section;
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        document.getElementById("section-" + currentSection).classList.add("active");
      });
    });

    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        lang = btn.dataset.lang;
        currentRandom = null;
        applyUI();
        renderLines();
        renderRiddles();
        generateRandom();
      });
    });

    document.getElementById("tabs").addEventListener("click", (e) => {
      if (!e.target.classList.contains("tab")) return;
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      currentCat = e.target.dataset.cat;
      renderLines();
    });

    applyUI();
    renderLines();
    renderRiddles();
    generateRandom();
