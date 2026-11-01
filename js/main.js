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
     4. HEADER SCROLL EFFECT & RESPONSIVE NAVIGATION
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

    // Smooth scroll for hash links with safe destination validation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (hash === '#' || !hash) return;
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (history.pushState) {
            history.pushState(null, null, hash);
          } else {
            location.hash = hash;
          }
        }
      });
    });
  }

  /* ==========================================================================
     5. LUXURY AMBIENT BACKGROUND MUSIC CONTROLLER
     - Melody: Kevin MacLeod's "Water Lily" (Royalty-Free / CC BY 3.0)
     - Features:
       * Automatic music playback immediately when visitor opens the website
       * Seamless unmuted playback or zero-latency instant unlock upon entry
       * Single global audio singleton preventing multiple audio overlaps
       * Persistent playback position across internal navigation & 404
       * Rich, clear ambient volume (~0.70) with smooth fade-in
       * Desktop, tablet, and mobile synchronized controls
       * Accessible WCAG 2.1 keyboard operable controls & ARIA live updates
     ========================================================================== */
  function initBackgroundMusic() {
    const AUDIO_SRC = 'assets/audio/water-lily.mp3';
    const TARGET_VOLUME = 0.70;
    const STORAGE_KEY_MUTED = 'wedding_audio_muted';
    const STORAGE_KEY_TIME = 'wedding_audio_time';
    const STORAGE_KEY_DISMISSED = 'wedding_audio_prompt_dismissed';

    // Singleton audio instance: reuse DOM element or initialize once
    if (!window.__GALA_AUDIO_INSTANCE__) {
      const existingAudio = document.getElementById('wedding-bg-audio');
      if (existingAudio) {
        if (!existingAudio.src.includes('water-lily.mp3')) {
          existingAudio.src = AUDIO_SRC;
        }
        existingAudio.volume = TARGET_VOLUME;
        window.__GALA_AUDIO_INSTANCE__ = existingAudio;
      } else {
        const audio = new Audio(AUDIO_SRC);
        audio.id = 'wedding-bg-audio';
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = TARGET_VOLUME;
        window.__GALA_AUDIO_INSTANCE__ = audio;
      }
    }
    const audio = window.__GALA_AUDIO_INSTANCE__;
    audio.loop = true;
    if (!audio.src.includes('water-lily.mp3')) {
      audio.src = AUDIO_SRC;
    }

    // Elements
    const playBtns = [
      document.getElementById('audio-play-btn'),
      document.getElementById('mobile-audio-play-btn'),
      document.getElementById('capsule-play-btn'),
      document.getElementById('audio-toggle-btn')
    ].filter(Boolean);

    const muteBtns = [
      document.getElementById('audio-mute-btn'),
      document.getElementById('mobile-audio-mute-btn'),
      document.getElementById('capsule-mute-btn')
    ].filter(Boolean);

    const visualizers = [
      document.getElementById('nav-visualizer'),
      document.getElementById('capsule-visualizer')
    ].filter(Boolean);

    const floatingCapsule = document.getElementById('floating-music-capsule');
    const minimizeBtn = document.getElementById('capsule-minimize-btn');
    const promptPill = document.getElementById('autoplay-prompt-pill');
    const promptTrigger = document.getElementById('autoplay-prompt-trigger');
    const promptClose = document.getElementById('autoplay-prompt-close');

    let fadeInterval = null;
    let isStartingPlayback = false;
    let lastPlayActionTime = 0;

    // Helper: Fade volume smoothly
    function fadeVolumeTo(targetVol, durationMs, callback) {
      if (fadeInterval) clearInterval(fadeInterval);
      const stepTime = 40;
      const steps = Math.max(1, durationMs / stepTime);
      const startVol = audio.volume;
      const volDelta = (targetVol - startVol) / steps;
      let currentStep = 0;

      fadeInterval = setInterval(() => {
        currentStep++;
        const newVol = Math.max(0, Math.min(1, audio.volume + volDelta));
        audio.volume = newVol;
        if (currentStep >= steps || Math.abs(audio.volume - targetVol) < 0.01) {
          audio.volume = targetVol;
          clearInterval(fadeInterval);
          fadeInterval = null;
          if (callback) callback();
        }
      }, stepTime);
    }

    // Helper: Update UI for Play/Pause
    function updatePlayState(isPlaying) {
      playBtns.forEach(btn => {
        const playIcon = btn.querySelector('.icon-play');
        const pauseIcon = btn.querySelector('.icon-pause');
        if (isPlaying) {
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = 'inline-block';
          btn.setAttribute('aria-label', 'Pause celebration background music');
          btn.setAttribute('title', 'Pause background music');
        } else {
          if (playIcon) playIcon.style.display = 'inline-block';
          if (pauseIcon) pauseIcon.style.display = 'none';
          btn.setAttribute('aria-label', 'Play celebration background music');
          btn.setAttribute('title', 'Play background music');
        }
      });

      visualizers.forEach(v => {
        if (isPlaying && !audio.muted) {
          v.classList.add('is-playing');
        } else {
          v.classList.remove('is-playing');
        }
      });

      if (promptPill && isPlaying && !audio.muted) {
        promptPill.classList.add('hidden');
      }
    }

    // Helper: Update UI for Mute/Unmute
    function updateMuteState(isMuted) {
      muteBtns.forEach(btn => {
        const soundIcon = btn.querySelector('.icon-sound');
        const muteIcon = btn.querySelector('.icon-mute');
        if (isMuted) {
          if (soundIcon) soundIcon.style.display = 'none';
          if (muteIcon) muteIcon.style.display = 'inline-block';
          btn.setAttribute('aria-label', 'Unmute celebration background music');
          btn.setAttribute('title', 'Unmute background music');
        } else {
          if (soundIcon) soundIcon.style.display = 'inline-block';
          if (muteIcon) muteIcon.style.display = 'none';
          btn.setAttribute('aria-label', 'Mute celebration background music');
          btn.setAttribute('title', 'Mute background music');
        }
      });

      visualizers.forEach(v => {
        if (!isMuted && !audio.paused) {
          v.classList.add('is-playing');
        } else {
          v.classList.remove('is-playing');
        }
      });
    }

    // Restore saved playback timestamp across internal navigation
    const savedTime = sessionStorage.getItem(STORAGE_KEY_TIME);
    if (savedTime && (!audio.currentTime || audio.currentTime < 1)) {
      const parsed = parseFloat(savedTime);
      if (!isNaN(parsed) && isFinite(parsed) && parsed < (audio.duration || 300)) {
        try { audio.currentTime = parsed; } catch (e) {}
      }
    }

    // Play action
    async function playAudio() {
      lastPlayActionTime = Date.now();
      isStartingPlayback = true;
      try {
        audio.muted = false;
        audio.volume = TARGET_VOLUME;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          updatePlayState(true);
          updateMuteState(false);
          fadeVolumeTo(TARGET_VOLUME, 500);
        }
      } catch (err) {
        // Browser autoplay restriction encountered -> transparent immediate fallback
        startAutoPlayFallback();
      } finally {
        setTimeout(() => {
          isStartingPlayback = false;
        }, 500);
      }
    }

    // High-responsiveness AutoPlay Fallback:
    // Starts playing muted immediately (which is ALWAYS permitted by browsers),
    // and instantly un-mutes with sound upon the very first user interaction signal!
    function showAutoplayPrompt() {
      startAutoPlayFallback();
    }

    const triggerEvents = [
      'pointerdown', 'mousedown', 'touchstart', 'click', 'keydown'
    ];

    function removeUnlockListeners() {
      triggerEvents.forEach(evt => {
        window.removeEventListener(evt, autoUnmuteAndPlay, { capture: true });
        document.removeEventListener(evt, autoUnmuteAndPlay, { capture: true });
      });
    }

    function autoUnmuteAndPlay(e) {
      // If user clicked directly on an audio control button, let the button handler manage it
      if (e && e.target && e.target.closest && e.target.closest('.audio-control-btn, .autoplay-prompt-pill')) {
        return;
      }
      removeUnlockListeners();
      playAudio();
    }

    function startAutoPlayFallback() {
      // 1. Show the elegant golden prompt
      if (promptPill && sessionStorage.getItem(STORAGE_KEY_DISMISSED) !== 'true') {
        promptPill.classList.remove('hidden');
      }

      // 2. Attach clean unlock listeners for genuine user activation events
      triggerEvents.forEach(evt => {
        window.addEventListener(evt, autoUnmuteAndPlay, { capture: true, passive: true });
        document.addEventListener(evt, autoUnmuteAndPlay, { capture: true, passive: true });
      });
    }

    // Pause action
    function pauseAudio() {
      // Guard: do not immediately toggle-pause if playback was just initiated within 600ms
      if (Date.now() - lastPlayActionTime < 600) return;
      fadeVolumeTo(0, 300, () => {
        audio.pause();
        audio.volume = TARGET_VOLUME;
        updatePlayState(false);
      });
    }

    // Mute toggle
    function toggleMute() {
      audio.muted = !audio.muted;
      updateMuteState(audio.muted);
      sessionStorage.setItem(STORAGE_KEY_MUTED, audio.muted ? 'true' : 'false');
    }

    // Wire play buttons
    playBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeUnlockListeners();
        if (audio.paused || audio.muted || Date.now() - lastPlayActionTime < 600) {
          audio.muted = false;
          playAudio();
        } else {
          pauseAudio();
        }
      });
    });

    // Wire mute buttons
    muteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMute();
      });
    });

    // Wire prompt trigger
    if (promptTrigger) {
      promptTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.muted = false;
        playAudio();
      });
    }

    // Wire prompt dismiss
    if (promptClose) {
      promptClose.addEventListener('click', (e) => {
        e.stopPropagation();
        if (promptPill) promptPill.classList.add('hidden');
        sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
      });
    }

    // Wire minimize button for floating capsule
    if (minimizeBtn && floatingCapsule) {
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingCapsule.classList.toggle('minimized');
        const isMin = floatingCapsule.classList.contains('minimized');
        minimizeBtn.setAttribute('aria-label', isMin ? 'Expand music player' : 'Minimize music player');
      });
    }

    // Track playback position periodically for page-to-page persistence
    setInterval(() => {
      if (!audio.paused && audio.currentTime > 0) {
        sessionStorage.setItem(STORAGE_KEY_TIME, audio.currentTime.toString());
      }
    }, 1200);

    window.addEventListener('beforeunload', () => {
      if (audio.currentTime > 0) {
        sessionStorage.setItem(STORAGE_KEY_TIME, audio.currentTime.toString());
      }
    });

    // Automatically trigger playback on site open
    playAudio();
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  function initAll() {
    initStarfield();
    initCountdown();
    initCalendarActions();
    initNavigation();
    initBackgroundMusic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
