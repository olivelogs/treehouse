// Intersection Observer for fade-in sections
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


  //play on threads in main. idk about all this
  const threads = document.querySelectorAll('.thread');

  threads.forEach(thread => {
    thread.addEventListener('mousemove', (e) => {
      const rect = thread.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const center = rect.width / 4;
      const offset = (x - center) / center;

      thread.style.transform = `translateX(${offset * -12}px)`;
    });

    thread.addEventListener('mouseleave', () => {
      thread.style.transform = 'translateX(0)';
    });
  });
});