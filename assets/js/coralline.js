// Audio player functionality
document.addEventListener("DOMContentLoaded", () => {
  const samplePaths = {
    giggle: 'coralline/samples/giggle.wav',
    yearning: 'coralline/samples/yearning.wav',
    homecoming: 'coralline/samples/homecoming.wav',
    recognition: 'coralline/samples/recognition.wav',
    wublub: 'coralline/samples/wublub.wav',
    smallestcreature: 'coralline/samples/smallestcreature.wav',
    shelterpad: 'coralline/samples/shelterpad.wav',
    hellobell: 'coralline/samples/hellobell.wav',
    rupture: 'coralline/samples/rupture.wav',
    kalimbakiss: 'coralline/samples/kalimbakiss.wav',
  };

  let currentAudio = null;
  let currentBtn = null;

  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sample = btn.dataset.sample;
      const card = btn.closest('.sample-card');
      const fill = card.querySelector('.waveform-fill');
      const timeEl = card.querySelector('.audio-time');

      // Stop current if playing
      if (currentAudio && currentBtn === btn) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        fill.style.width = '0%';
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        btn.classList.remove('playing');
        currentAudio = null;
        currentBtn = null;
        return;
      }

      // Stop any other playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        const prevCard = currentBtn.closest('.sample-card');
        prevCard.querySelector('.waveform-fill').style.width = '0%';
        currentBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        currentBtn.classList.remove('playing');
      }

      const audio = new Audio(samplePaths[sample]);
      currentAudio = audio;
      currentBtn = btn;

      btn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      btn.classList.add('playing');

      audio.addEventListener('timeupdate', () => {
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + '%';
        const remaining = audio.duration - audio.currentTime;
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        timeEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
      });

      audio.addEventListener('ended', () => {
        fill.style.width = '0%';
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        btn.classList.remove('playing');
        currentAudio = null;
        currentBtn = null;
      });

      audio.play().catch(() => {
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        btn.classList.remove('playing');
      });
    });
  });
});