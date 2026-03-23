// Audio player functionality
document.addEventListener("DOMContentLoaded", () => {
  const PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE_ICON = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  const samplePaths = {
    giggle: 'coralline/samples/giggle.wav',
    yearning: 'coralline/samples/yearning.wav',
    homecoming: 'coralline/samples/homecoming.wav',
    recognition: 'coralline/samples/recognition.wav',
    wublub: 'coralline/samples/wublub.wav',
    smallestcreature: 'coralline/samples/smallestcreature.wav',
    hellobell: 'coralline/samples/hellobell.wav',
    rupture: 'coralline/samples/rupture.wav',
    kalimbakiss: 'coralline/samples/kalimbakiss.wav',
  };

  let currentAudio = null;
  let currentBtn = null;

  function resetButton(btn, card) {
    if (!btn || !card) return;

    const fill = card.querySelector('.waveform-fill');
    const timeEl = card.querySelector('.audio-time');

    if (fill) fill.style.width = '0%';
    if (timeEl?.dataset.defaultTime) timeEl.textContent = timeEl.dataset.defaultTime;

    btn.innerHTML = PLAY_ICON;
    btn.classList.remove('playing');
  }

  function stopCurrentAudio() {
    if (!currentAudio || !currentBtn) return;

    currentAudio.pause();
    currentAudio.currentTime = 0;
    resetButton(currentBtn, currentBtn.closest('.sample-card'));
    currentAudio = null;
    currentBtn = null;
  }

  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sample = btn.dataset.sample;
      const samplePath = samplePaths[sample];
      const card = btn.closest('.sample-card');
      if (!samplePath || !card) return;

      const fill = card.querySelector('.waveform-fill');
      const timeEl = card.querySelector('.audio-time');
      if (!fill || !timeEl) return;

      timeEl.dataset.defaultTime = timeEl.dataset.defaultTime || timeEl.textContent;

      if (currentAudio && currentBtn === btn) {
        stopCurrentAudio();
        return;
      }

      stopCurrentAudio();

      const audio = new Audio(samplePath);
      currentAudio = audio;
      currentBtn = btn;

      btn.innerHTML = PAUSE_ICON;
      btn.classList.add('playing');

      audio.addEventListener('timeupdate', () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + '%';
        const remaining = audio.duration - audio.currentTime;
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        timeEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
      });

      audio.addEventListener('ended', () => {
        resetButton(btn, card);
        currentAudio = null;
        currentBtn = null;
      });

      audio.play().catch(() => {
        resetButton(btn, card);
        currentAudio = null;
        currentBtn = null;
      });
    });
  });

  const body = document.body;
  const CHARS = "⑆⑇⑈⑉";

  function jitterText(el) {
    const final = el.dataset.jitterText || el.textContent;
    el.dataset.jitterText = final;

    let frame = 0;

    const update = () => {
      let output = "";

      for (let i = 0; i < final.length; i += 1) {
        output += i < frame
          ? final[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      el.textContent = output;
      frame += 0.6;

      if (frame < final.length) {
        requestAnimationFrame(update);
      } else {
        el.textContent = final;
      }
    };

    update();
  }

  const jitterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      jitterText(entry.target);
      jitterObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -25px 0px'
  });

  document.querySelectorAll('.jitter').forEach(el => {
    jitterObserver.observe(el);
  });

  window.addEventListener("load", () => {
    const duration = 20 + Math.random() * 412;

    window.setTimeout(() => {
      body.classList.remove("unstable");
    }, duration);
  });
});
