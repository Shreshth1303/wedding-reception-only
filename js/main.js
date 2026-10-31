/**
 * Nocturnal Luxury & Golden Hour Experience
 * The Wedding Reception of Jassim Hashim & Shifa Anis Khan
 * Sunday, 17th January 2027 — Welcome Lawns and Banquet, Thane
 */

(function () {
  'use strict';

  // Target Reception Event Date: Sunday, 17th January 2027, 19:00:00 IST (UTC+05:30)
  const RECEPTION_DATE_MS = new Date('2027-01-17T19:00:00+05:30').getTime();

  /* ==========================================================================
     1. NOCTURNAL CANVAS STARFIELD & GOLDEN AMBIENT PARTICLES
     ========================================================================== */
  function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = window.innerWidth < 768 ? 60 : 120;
    const particles = [];

    const goldHues = ['#E5C378', '#FFF2D1', '#F7E5B5', '#C59E4E', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        color: goldHues[Math.floor(Math.random() * goldHues.length)],
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15 - 0.05 // Gentle upward drift
      });
    }

    let animationId = null;

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.alpha += p.twinkleSpeed * p.twinkleDirection;
          if (p.alpha >= 0.9) {
            p.alpha = 0.9;
            p.twinkleDirection = -1;
          } else if (p.alpha <= 0.15) {
            p.alpha = 0.15;
            p.twinkleDirection = 1;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) render();
    });

    render();

    // Pause animation when tab is not active to optimize CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationId) cancelAnimationFrame(animationId);
      } else if (!prefersReducedMotion) {
        render();
      }
    });
  }

  /* ==========================================================================
     2. DYNAMIC LIVE COUNTDOWN TIMER
     ========================================================================== */
  function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const headingEl = document.getElementById('countdown-status-heading');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function update() {
      const now = Date.now();
      const distance = RECEPTION_DATE_MS - now;

      if (distance <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        if (headingEl) {
          headingEl.textContent = 'Tonight We Celebrate Under The Stars!';
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     3. SAVE TO CALENDAR (.ICS FILE GENERATION & DOWNLOAD)
     ========================================================================== */
  function initCalendarActions() {
    const saveIcsBtn = document.getElementById('btn-save-ics');
    if (!saveIcsBtn) return;

    saveIcsBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const eventTitle = "Wedding Reception | Jassim Hashim & Shifa Anis Khan";
      const eventLocation = "Welcome Lawns and Banquet, Ghodbunder Road, Thane, Maharashtra, India";
      const eventDescription = [
        "In the Name of Allah, the Most Gracious, the Most Merciful.",
        "Wedding Reception & Dinner celebrating Jassim Hashim & Shifa Anis Khan.",
        "Groom: Jassim Hashim (S/o Mr. Muhamed Hashim & Mrs. Mumtaz Muhamed Hashim)",
        "Bride: Shifa Anis Khan (D/o Mr. Anis Asgar Khan & Mrs. Shabana Anis Khan)",
        "Quran: 'And We created you in pairs' (Surah An-Naba 78:8)",
        "Venue: Welcome Lawns and Banquet, Ghodbunder Road, Thane",
        "Date: Sunday, 17th January 2027 at 7:00 PM IST."
      ].join('\\n');

      // Date in UTC: 2027-01-17 19:00 IST = 2027-01-17 13:30 UTC
      // End time: 2027-01-17 23:30 IST = 2027-01-17 18:00 UTC
      const dtStart = "20270117T133000Z";
      const dtEnd = "20270117T180000Z";
      const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Jassim & Shifa Wedding Reception//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:reception-jassim-shifa-20270117@welcome-lawns-thane`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${eventTitle}`,
        `DESCRIPTION:${eventDescription}`,
        `LOCATION:${eventLocation}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "BEGIN:VALARM",
        "TRIGGER:-PT24H",
        "ACTION:DISPLAY",
        "DESCRIPTION:Reminder: Wedding Reception of Jassim & Shifa Tomorrow Evening",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'wedding-reception-jassim-and-shifa.ics');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    });
  }

  /* ==========================================================================
     4. HEADER SCROLL EFFECT & MOBILE NAVIGATION DRAWER
     ========================================================================== */
  function initNavigation() {
    const header = document.querySelector('.ambient-header');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer .nav-cta-btn');

    // Sticky header shadow & border transition
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    // Mobile Drawer Toggle
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
          mobileDrawer.classList.add('open');
          mobileToggle.setAttribute('aria-expanded', 'true');
        }
      });

      drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close on outside tap
      document.addEventListener('click', (e) => {
        if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ==========================================================================
     6. CELESTIAL AMBIENT GALA AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  function initAmbientAudio() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!audioBtn) return;

    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let oscillators = [];

    // Frequencies of a warm nocturnal major 9th chord: F3, C4, E4, G4, A4
    const chordFrequencies = [174.61, 261.63, 329.63, 392.00, 440.00];

    function startAmbience() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        masterGain.connect(filter);
        filter.connect(audioCtx.destination);

        oscillators = chordFrequencies.map((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          // Subtle slow detune vibrato
          const lfo = audioCtx.createOscillator();
          const lfoGain = audioCtx.createGain();
          lfo.frequency.value = 0.15 + idx * 0.05;
          lfoGain.gain.value = 1.2;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          if (panner) {
            panner.pan.value = (idx % 2 === 0 ? 0.35 : -0.35);
            osc.connect(panner);
            panner.connect(masterGain);
          } else {
            osc.connect(masterGain);
          }

          osc.start();
          return osc;
        });

        isPlaying = true;
        audioBtn.classList.add('playing');
        audioBtn.setAttribute('aria-label', 'Pause nocturnal gala soundscape');
        audioBtn.setAttribute('title', 'Pause nocturnal gala soundscape');
        updateAudioBtnIcon(true);
      } catch (err) {
        console.warn('AudioContext not supported or blocked:', err);
      }
    }

    function stopAmbience() {
      if (masterGain && audioCtx) {
        masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
        setTimeout(() => {
          oscillators.forEach(osc => osc.stop());
          oscillators = [];
          if (audioCtx && audioCtx.state !== 'closed') {
            audioCtx.close();
          }
          audioCtx = null;
        }, 1600);
      }
      isPlaying = false;
      audioBtn.classList.remove('playing');
      audioBtn.setAttribute('aria-label', 'Play nocturnal gala soundscape');
      audioBtn.setAttribute('title', 'Play nocturnal gala soundscape');
      updateAudioBtnIcon(false);
    }

    function updateAudioBtnIcon(playing) {
      if (playing) {
        audioBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      } else {
        audioBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
      }
    }

    audioBtn.addEventListener('click', () => {
      if (!isPlaying) {
        startAmbience();
      } else {
        stopAmbience();
      }
    });
  }

  /* ==========================================================================
     INITIALIZATION ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initCountdown();
    initCalendarActions();
    initNavigation();
    initAmbientAudio();
  });
})();

