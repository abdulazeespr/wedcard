'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';

function WeddingApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const searchParams = useSearchParams();
  const guestName = searchParams.get('name');

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-07-26T10:00:00');

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Section Scroll Animation Observer
  useEffect(() => {
    if (!showDetails) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.08,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const targets = document.querySelectorAll('.animate-on-scroll');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [showDetails]);

  // RSVP state
  const [rsvps, setRsvps] = useState([
    { name: 'Abdul Rahman', place: 'Thrissur', attending: true, familyCount: 4 },
    { name: 'Sarah Jasmine', place: 'Kochi', attending: true, familyCount: 2 },
    { name: 'Mohammed Ali', place: 'Dubai', attending: false, familyCount: 0 }
  ]);
  const [rsvpTab, setRsvpTab] = useState<'rsvp' | 'list'>('rsvp');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPlace, setRsvpPlace] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(true);
  const [rsvpCount, setRsvpCount] = useState(2);

  // Blessings state
  const [blessingsList, setBlessingsList] = useState([
    { name: 'Azees', message: 'Masha Allah.. Masha Allah ..Congratulations to both of you .', date: '9 JUN 2026 • 03:19 PM' },
    { name: 'Fayez', message: 'May Allah bless your Marriage and fill your life with Love, Joy and lifetime companionship ✨', date: '16 MAY 2026 • 08:34 PM' },
    { name: 'JP', message: 'I wish... all that one could wish', date: '16 MAY 2026 • 01:30 PM' }
  ]);
  const [blessingsName, setBlessingsName] = useState('');
  const [blessingsMessage, setBlessingsMessage] = useState('');

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPlace.trim() || rsvpAttending === null) return;
    const newRsvp = {
      name: rsvpName.trim(),
      place: rsvpPlace.trim(),
      attending: rsvpAttending,
      familyCount: rsvpAttending ? rsvpCount : 0,
    };
    setRsvps([newRsvp, ...rsvps]);
    setRsvpName('');
    setRsvpPlace('');
    setRsvpAttending(true);
    setRsvpCount(2);
    setRsvpTab('list');
  };

  const handleGetDirections = () => {
    window.open('https://maps.app.goo.gl/orNgYG5edZFSbN7eA', '_blank');
  };

  const handleBlessingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blessingsName.trim() || !blessingsMessage.trim()) return;

    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${day} ${month} ${year} • ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    const newBlessing = {
      name: blessingsName.trim(),
      message: blessingsMessage.trim(),
      date: timeStr
    };
    setBlessingsList([newBlessing, ...blessingsList]);
    setBlessingsName('');
    setBlessingsMessage('');
  };

  useEffect(() => {
    // Loading animation
    if (loadingRef.current) {
      gsap.fromTo(
        loadingRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1.8,
          delay: 1.5,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsLoading(false);
            animateContent();
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power2.out' }
      );
    }
  }, [showDetails]);

  const animateContent = () => {
    const timeline = gsap.timeline();

    if (textRef.current) {
      const basmala = textRef.current.querySelector('.basmala-text');
      const heading = textRef.current.querySelector('h1');
      const ampersand = textRef.current.querySelector('.ampersand');
      const subheading = textRef.current.querySelector('h2');
      const divider = textRef.current.querySelector('.hero-divider');
      const eventType = textRef.current.querySelector('.event-type');

      if (basmala) {
        timeline.fromTo(basmala, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0);
      }
      if (heading) {
        timeline.fromTo(heading, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.2);
      }
      if (ampersand) {
        timeline.fromTo(ampersand, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0.5);
      }
      if (subheading) {
        timeline.fromTo(subheading, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.7);
      }
      if (divider) {
        timeline.fromTo(divider, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0.9);
      }
      if (eventType) {
        timeline.fromTo(eventType, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.1);
      }
    }

    if (buttonRef.current) {
      timeline.fromTo(
        buttonRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
        1.3
      );
    }
  };

  const handleViewDetails = () => {
    setShowDetails(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio play failed:", err);
      });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log("Audio play failed:", err);
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">

      {/* ================================================================= */}
      {/* INVITATION / COVER SCREEN */}
      {/* ================================================================= */}
      {!showDetails && (
        <div className="relative w-full h-screen overflow-hidden">

          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/envelope-cover.mp4.mp4" type="video/mp4" />
          </video>

          {/* Layered Overlay — vignette + gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)'
          }} />

          {/* Loading Screen */}
          {isLoading && (
            <div
              ref={loadingRef}
              className="absolute inset-0 flex items-center justify-center z-50"
              style={{ background: '#1A0F0A' }}
            >
              <div className="text-center flex flex-col items-center gap-6">
                {/* Spinning ornamental ring */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#C9A96E]/20" />
                  <div
                    className="absolute inset-0 rounded-full border-t border-r border-[#C9A96E]/70"
                    style={{ animation: 'spin-slow 2.5s linear infinite' }}
                  />
                  <span
                    className="text-3xl text-[#C9A96E]"
                    style={{ fontFamily: 'var(--font-great-vibes)' }}
                  >
                    F&H
                  </span>
                </div>
                <p
                  className="text-sm tracking-[0.3em] text-[#C9A96E]/70 uppercase"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  Loading Invitation…
                </p>
              </div>
            </div>
          )}

          {/* Main Invite Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
            <div ref={textRef} className="text-center max-w-2xl w-full flex flex-col items-center">

              {/* Basmala */}
              <p
                className="basmala-text text-xl sm:text-2xl font-light mb-8 text-[#C9A96E]/90 tracking-wide opacity-0"
                style={{ direction: 'rtl' }}
              >
                بسم الله الرحمن الرحيم
              </p>

              {/* Name 1 */}
              <h1
                className="text-[4.5rem] sm:text-[6rem] md:text-[8rem] mb-0 text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] opacity-0 leading-none"
                style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
              >
                Fayez
              </h1>

              {/* Ampersand */}
              <div
                className="ampersand text-5xl sm:text-6xl my-2 text-[#C9A96E] opacity-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: 'var(--font-great-vibes)' }}
              >
                &
              </div>

              {/* Name 2 */}
              <h2
                className="text-[4.5rem] sm:text-[6rem] md:text-[8rem] mb-6 text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] opacity-0 leading-none"
                style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
              >
                Hasna
              </h2>

              {/* Ornamental Divider */}
              <div className="hero-divider flex items-center justify-center gap-4 mb-6 opacity-0 w-full max-w-[200px]">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                <span className="text-[#C9A96E]/60 text-xs">✦</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
              </div>

              {/* Event Type */}
              <p
                className="event-type text-xs sm:text-sm tracking-[0.4em] text-[#C9A96E]/90 mb-12 uppercase opacity-0 font-medium"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Wedding Ceremony
              </p>

              {/* TAP TO OPEN Button */}
              <div className="flex flex-col items-center justify-center gap-5 mt-2">
                <button
                  ref={buttonRef}
                  onClick={handleViewDetails}
                  id="tap-to-open-btn"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center cursor-pointer opacity-0 transition-all duration-500 hover:scale-105 active:scale-95"
                  style={{
                    background: 'rgba(201,169,110,0.08)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(201,169,110,0.6)',
                    boxShadow: '0 0 35px rgba(201,169,110,0.2), inset 0 0 25px rgba(201,169,110,0.08)',
                    animation: 'pulseGlow 2.5s ease-in-out infinite',
                  }}
                  aria-label="Tap to open wedding invitation"
                >
                  <span
                    className="text-4xl sm:text-5xl text-[#C9A96E] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                    style={{ fontFamily: 'var(--font-great-vibes)' }}
                  >
                    F&H
                  </span>
                </button>

                <p
                  className="text-xs sm:text-sm tracking-[0.35em] text-[#C9A96E]/90 uppercase flex items-center gap-2 font-medium"
                  style={{ fontFamily: 'var(--font-outfit)', animation: 'bounceGentle 2.5s ease-in-out infinite' }}
                >
                  ✦ Tap to Open ✦
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* DETAILS SCREEN */}
      {/* ================================================================= */}
      {showDetails && (
        <div ref={detailsRef} className="min-h-screen bg-[#FAF6F1] overflow-x-hidden bg-grain" style={{ color: '#3D2B1F' }}>

          {/* ============================================================= */}
          {/* HERO / Wedding HEADER */}
          {/* ============================================================= */}
          <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Background image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/wedding.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            >
              {/* Layered overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center top, rgba(61,43,31,0.2) 0%, rgba(0,0,0,0.5) 100%)'
              }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-xl text-white">

              {/* Guest Greeting */}
              {guestName && (
                <div className="mb-8 animate-fadeInUp">
                  <p
                    className="text-sm sm:text-base md:text-lg font-light italic mb-2 tracking-[0.18em] text-[#C9A96E]/85"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    Dear
                  </p>
                  <h2
                    className="text-5xl sm:text-6xl md:text-7xl text-[#C9A96E] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: 'var(--font-great-vibes)' }}
                  >
                    {guestName}
                  </h2>
                </div>
              )}

              {/* Invitation text */}
              <p
                className="text-base sm:text-lg md:text-xl tracking-[0.1em] text-white/80 mb-6 max-w-sm mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontStyle: 'italic' }}
              >
                You are cordially invited to the wedding ceremony of
              </p>

              {/* Basmala */}
              <div className="flex flex-col items-center justify-center mb-10 mt-2">
                <p
                  className="text-4xl sm:text-5xl md:text-6xl text-[#C9A96E] leading-relaxed tracking-wider select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                  style={{ direction: 'rtl' }}
                >
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </p>
                {/* Shimmer divider */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="w-14 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                  <span className="text-[#C9A96E]/50 text-xs">✦</span>
                  <div className="w-14 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                </div>
              </div>

              {/* Couple Names */}
              <div className="flex flex-col items-center gap-0 mb-8 mt-4">
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl text-white tracking-wide drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
                >
                  Fayez
                </h1>
                <p
                  className="text-4xl sm:text-5xl text-[#C9A96E] my-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]"
                  style={{ fontFamily: 'var(--font-great-vibes)' }}
                >
                  &
                </p>
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl text-white tracking-wide drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
                >
                  Hasna
                </h1>
              </div>

              {/* Date & Time */}
              <div className="flex flex-col items-center gap-3">
                <p
                  className="text-xs sm:text-sm tracking-[0.35em] text-[#C9A96E]/85 uppercase"
                  style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600 }}
                >
                  Sunday
                </p>
                <div className="flex items-center justify-center gap-4 w-full max-w-md px-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/50" />
                  <p
                    className="text-lg sm:text-xl md:text-2xl tracking-wide text-white/90 whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
                  >
                    July 26, 2026 &nbsp;|&nbsp; 11:00 AM
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/50" />
                </div>
              </div>

              {/* Scroll Down */}
              <div className="mt-16 flex flex-col items-center gap-3">
                <p
                  className="text-[10px] sm:text-xs tracking-[0.4em] text-[#C9A96E]/60 uppercase"
                  style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600, animation: 'bounceGentle 2s ease-in-out infinite' }}
                >
                  Scroll Down
                </p>
                <svg
                  className="w-4 h-4 text-[#C9A96E]/50"
                  style={{ animation: 'bounceGentle 2s ease-in-out infinite 0.3s' }}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </header>

          {/* ============================================================= */}
          {/* QURANIC QUOTE SECTION */}
          {/* ============================================================= */}
          <section className="py-20 sm:py-28 px-6 text-center bg-[#FAF6F1] relative flex flex-col items-center justify-center">
            <div className="text-center max-w-2xl animate-on-scroll opacity-0">

              {/* Ornamental top */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/50" />
                <span className="text-[#C9A96E]/40 text-[10px]">✦</span>
                <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/50" />
              </div>

              <p
                className="text-3xl sm:text-4xl md:text-5xl text-[#3D2B1F] mb-5 leading-relaxed"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontStyle: 'italic' }}
              >
                وَخَلَقْنَاكُمْ أَزْوَاجًا
              </p>

              <p
                className="text-lg sm:text-xl md:text-2xl text-[#3D2B1F]/80 mb-4"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontStyle: 'italic' }}
              >
                &ldquo;And We created you in pairs&rdquo;
              </p>

              <p
                className="text-[10px] sm:text-xs text-[#8B6F47] uppercase tracking-[0.3em]"
                style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
              >
                Surah An-Naba 78:8
              </p>

              {/* Ornamental bottom */}
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/50" />
                <span className="text-[#C9A96E]/40 text-[10px]">✦</span>
                <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/50" />
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* SAVE THE DATE / COUNTDOWN SECTION */}
          {/* ============================================================= */}
          <section
            className="py-20 sm:py-28 text-white relative flex flex-col items-center justify-center min-h-[60vh] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2C1810 0%, #3D2B1F 50%, #2C1810 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 10s ease infinite',
            }}
          >
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
            />

            {/* Top golden rule */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center animate-on-scroll opacity-0 w-full">
              <h3
                className="text-4xl sm:text-5xl md:text-6xl mb-3 text-[#FAF6F1]"
                style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
              >
                Save The Date
              </h3>
              <p
                className="text-xl sm:text-2xl md:text-3xl font-light mb-10 text-[#C9A96E]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                July 26, 2026
              </p>

              {/* Countdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-xs sm:max-w-md mx-auto">
                {[
                  { val: timeLeft.days, label: 'Days' },
                  { val: timeLeft.hours, label: 'Hours' },
                  { val: timeLeft.minutes, label: 'Mins' },
                  { val: timeLeft.seconds, label: 'Secs' },
                ].map(({ val, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center py-5 sm:py-6 px-2 rounded-2xl border"
                    style={{
                      background: 'rgba(201,169,110,0.07)',
                      backdropFilter: 'blur(8px)',
                      borderColor: 'rgba(201,169,110,0.2)',
                    }}
                  >
                    <p
                      className="text-2xl sm:text-3xl font-light tabular-nums text-white"
                      style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
                    >
                      {val.toString().padStart(2, '0')}
                    </p>
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]/70 mt-1"
                      style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                className="px-8 py-3 border border-[#C9A96E]/50 text-[#C9A96E] uppercase text-xs tracking-[0.25em] rounded-full transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E] btn-lift"
                style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
              >
                Add to Calendar
              </button>

              <p
                className="text-[10px] font-light mt-6 uppercase tracking-[0.3em] text-white/40"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                We are counting down the moments
              </p>
            </div>

            {/* Bottom golden rule */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
          </section>

          {/* ============================================================= */}
          {/* ITINERARY / TIMELINE SECTION */}
          {/* ============================================================= */}
          <section className="py-20 sm:py-28 bg-[#FAF6F1] relative flex flex-col items-center justify-center px-4 sm:px-6">
            <div className="max-w-4xl w-full animate-on-scroll opacity-0">

              {/* Section Header */}
              <div className="text-center mb-14 sm:mb-20">
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8B6F47] mb-4"
                  style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600 }}
                >
                  Schedule of Events
                </p>
                <h2
                  className="text-5xl sm:text-6xl md:text-7xl text-[#3D2B1F] mb-4"
                  style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
                >
                  The Itinerary
                </h2>
                <p
                  className="text-[#9C8E7E] text-xs sm:text-sm tracking-[0.18em]"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  Sunday, July 26, 2026
                </p>
              </div>

              {/* Timeline */}
              <div className="relative w-full max-w-3xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-6 sm:left-8 md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A96E]/10 via-[#C9A96E]/50 to-[#C9A96E]/10 -translate-x-1/2" />

                <div className="space-y-10 sm:space-y-14 md:space-y-20">

                  {/* Event 1 — Left on desktop */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="w-full md:w-1/2 flex flex-col items-start md:items-end pr-0 md:pr-12 pl-14 sm:pl-16 md:pl-0">
                      <h3
                        className="text-lg sm:text-xl font-semibold text-[#3D2B1F]"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        Grand Arrival
                      </h3>
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9C8E7E] mt-1"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        City Palace Auditorium
                      </p>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-6 sm:left-8 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#C9A96E] -translate-x-1/2 border-2 border-[#FAF6F1] shadow z-10 top-1 md:top-auto" />
                    <div className="w-full md:w-1/2 pl-14 sm:pl-16 md:pl-12 mt-1 md:mt-0">
                      <p
                        className="text-sm font-medium text-[#8B6F47]"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        11:00 AM
                      </p>
                    </div>
                  </div>

                  {/* Event 2 — Right on desktop */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="hidden md:flex w-1/2 justify-end pr-12">
                      <p
                        className="text-sm font-medium text-[#8B6F47]"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        11:30 AM
                      </p>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-6 sm:left-8 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#C9A96E] -translate-x-1/2 border-2 border-[#FAF6F1] shadow z-10 top-1 md:top-auto" />
                    <div className="w-full md:w-1/2 pl-14 sm:pl-16 md:pl-12 flex flex-col items-start">
                      <h3
                        className="text-lg sm:text-xl font-semibold text-[#3D2B1F]"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        Wedding Ceremony
                      </h3>
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9C8E7E] mt-1"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        Welcome & Greetings
                      </p>
                      <p
                        className="text-sm font-medium text-[#8B6F47] mt-1 md:hidden"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        11:30 AM
                      </p>
                    </div>
                  </div>

                  {/* Event 3 — Left on desktop */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="w-full md:w-1/2 flex flex-col items-start md:items-end pr-0 md:pr-12 pl-14 sm:pl-16 md:pl-0">
                      <h3
                        className="text-lg sm:text-xl font-semibold text-[#3D2B1F]"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        Lunch
                      </h3>
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9C8E7E] mt-1"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        Grand Lunch Feast
                      </p>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-6 sm:left-8 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#C9A96E] -translate-x-1/2 border-2 border-[#FAF6F1] shadow z-10 top-1 md:top-auto" />
                    <div className="w-full md:w-1/2 pl-14 sm:pl-16 md:pl-12 mt-1 md:mt-0">
                      <p
                        className="text-sm font-medium text-[#8B6F47]"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        11:30 AM
                      </p>
                    </div>
                  </div>

                  {/* Event 4 — Right on desktop */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="hidden md:flex w-1/2 justify-end pr-12">
                      <p
                        className="text-sm font-medium text-[#8B6F47]"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        11:30 AM
                      </p>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-6 sm:left-8 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#C9A96E] -translate-x-1/2 border-2 border-[#FAF6F1] shadow z-10 top-1 md:top-auto" />
                    <div className="w-full md:w-1/2 pl-14 sm:pl-16 md:pl-12 flex flex-col items-start">
                      <h3
                        className="text-lg sm:text-xl font-semibold text-[#3D2B1F]"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        Photo Windup
                      </h3>
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9C8E7E] mt-1"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        Smiling Faces & Happy Traces 📸 ✨
                      </p>
                      <p
                        className="text-sm font-medium text-[#8B6F47] mt-1 md:hidden"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        11:45 AM
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* VENUE SECTION */}
          {/* ============================================================= */}
          <section
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: 'url(/venue.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

            {/* Content */}
            <div className="relative h-full w-full flex flex-col lg:flex-row items-start lg:items-center justify-center lg:justify-between px-6 sm:px-10 md:px-16 lg:px-24 py-16 animate-on-scroll opacity-0 gap-8">

              {/* Left — Text */}
              <div className="text-white max-w-lg mt-8 lg:mt-0">
                <p
                  className="text-[10px] uppercase tracking-[0.35em] mb-4 text-[#C9A96E]/80"
                  style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
                >
                  The Venue
                </p>
                <h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 leading-tight text-white"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
                >
                  City Palace <br /> Auditorium
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-[#C9A96E]/50" />
                </div>
                <p
                  className="text-base sm:text-lg font-light text-white/70"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  Kechery, Thrissur, Kerala
                </p>
              </div>

              {/* Right — Desktop card */}
              <div className="hidden lg:flex items-center">
                <div
                  className="rounded-3xl px-8 py-8 w-72 flex flex-col items-center gap-6 border"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    borderColor: 'rgba(201,169,110,0.25)',
                  }}
                >
                  <div className="text-4xl">🏰</div>
                  <button
                    className="w-full px-6 py-3 border border-[#C9A96E]/60 text-[#C9A96E] text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 hover:bg-[#C9A96E]/15 hover:border-[#C9A96E] btn-lift"
                    style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
                    onClick={() => handleGetDirections()}
                  >
                    Get Directions
                  </button>
                </div>
              </div>

              {/* Mobile button */}
              <div className="lg:hidden w-full mb-4">
                <button
                  className="w-full sm:w-auto px-8 py-3.5 border border-[#C9A96E]/60 text-[#C9A96E] text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 hover:bg-[#C9A96E]/15 btn-lift"
                  style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500, backdropFilter: 'blur(8px)' }}
                  onClick={() => handleGetDirections()}
                >
                  Get Directions
                </button>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* RSVP SECTION */}
          {/* ============================================================= */}
          <section id="rsvp" className="py-20 sm:py-28 bg-[#FAF6F1] relative overflow-hidden flex flex-col items-center justify-center px-4 animate-on-scroll opacity-0">

            {/* Section header */}
            <div className="text-center mb-8">
              <p
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#8B6F47] mb-3"
                style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600 }}
              >
                Kindly Respond
              </p>
              <h2
                className="text-4xl sm:text-5xl text-[#3D2B1F]"
                style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
              >
                RSVP
              </h2>
            </div>

            {/* Tab Toggle */}
            <div
              className="flex rounded-full p-1 mb-8 w-full max-w-xs border"
              style={{
                background: '#F0EAE3',
                borderColor: 'rgba(139,111,71,0.2)',
              }}
            >
              <button
                onClick={() => setRsvpTab('rsvp')}
                className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  background: rsvpTab === 'rsvp' ? '#3D2B1F' : 'transparent',
                  color: rsvpTab === 'rsvp' ? '#FAF6F1' : '#8B6F47',
                  boxShadow: rsvpTab === 'rsvp' ? '0 2px 12px rgba(61,43,31,0.25)' : 'none',
                }}
              >
                RSVP Now
              </button>
              <button
                onClick={() => setRsvpTab('list')}
                className="flex-1 py-2.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  background: rsvpTab === 'list' ? '#3D2B1F' : 'transparent',
                  color: rsvpTab === 'list' ? '#FAF6F1' : '#8B6F47',
                  boxShadow: rsvpTab === 'list' ? '0 2px 12px rgba(61,43,31,0.25)' : 'none',
                }}
              >
                Guest List
              </button>
            </div>

            {rsvpTab === 'rsvp' ? (
              /* RSVP Form Card */
              <div
                className="rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-xl text-center border"
                style={{
                  background: '#FFFFFF',
                  borderColor: 'rgba(139,111,71,0.15)',
                  boxShadow: '0 4px 40px rgba(61,43,31,0.07)',
                }}
              >
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8B6F47] font-medium mb-3"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  Request of Presence
                </p>
                <h3
                  className="text-4xl sm:text-5xl text-[#3D2B1F] mb-2"
                  style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
                >
                  Will you join us?
                </h3>
                <p
                  className="text-xs italic text-[#9C8E7E] mb-7"
                  style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
                >
                  Please kindly respond by July 20th
                </p>

                <form onSubmit={handleRsvpSubmit} className="space-y-5 text-left">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border outline-none text-sm transition-all"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1rem',
                      borderColor: 'rgba(139,111,71,0.2)',
                      color: '#3D2B1F',
                      background: '#FAF6F1',
                    }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your Place"
                    value={rsvpPlace}
                    onChange={(e) => setRsvpPlace(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border outline-none text-sm transition-all"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1rem',
                      borderColor: 'rgba(139,111,71,0.2)',
                      color: '#3D2B1F',
                      background: '#FAF6F1',
                    }}
                  />

                  <div>
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8B6F47] font-semibold mb-3"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                      Will you attend?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(true)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-sm"
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '1rem',
                          borderColor: rsvpAttending === true ? '#3D2B1F' : 'rgba(139,111,71,0.2)',
                          background: rsvpAttending === true ? '#F5EEE6' : 'transparent',
                          color: rsvpAttending === true ? '#3D2B1F' : '#9C8E7E',
                          boxShadow: rsvpAttending === true ? 'inset 0 0 0 1px #3D2B1F' : 'none',
                        }}
                      >
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0"
                          style={{
                            background: rsvpAttending === true ? '#3D2B1F' : 'transparent',
                            borderColor: rsvpAttending === true ? '#3D2B1F' : 'rgba(139,111,71,0.4)',
                          }}
                        >
                          {rsvpAttending === true && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        Yes, In Sha Allah! 🤩
                      </button>

                      <button
                        type="button"
                        onClick={() => setRsvpAttending(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-sm"
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '1rem',
                          borderColor: rsvpAttending === false ? '#3D2B1F' : 'rgba(139,111,71,0.2)',
                          background: rsvpAttending === false ? '#F5EEE6' : 'transparent',
                          color: rsvpAttending === false ? '#3D2B1F' : '#9C8E7E',
                          boxShadow: rsvpAttending === false ? 'inset 0 0 0 1px #3D2B1F' : 'none',
                        }}
                      >
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0"
                          style={{
                            background: rsvpAttending === false ? '#3D2B1F' : 'transparent',
                            borderColor: rsvpAttending === false ? '#3D2B1F' : 'rgba(139,111,71,0.4)',
                          }}
                        >
                          {rsvpAttending === false && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                        Unfortunately, I can&apos;t
                      </button>
                    </div>
                  </div>

                  {/* Family count */}
                  {rsvpAttending === true && (
                    <div
                      className="rounded-2xl p-5 text-center border animate-fadeIn"
                      style={{
                        background: '#FAF6F1',
                        borderColor: 'rgba(139,111,71,0.15)',
                      }}
                    >
                      <p
                        className="text-[#3D2B1F] text-2xl sm:text-3xl italic mb-1"
                        style={{ fontFamily: 'var(--font-great-vibes)' }}
                      >
                        Wonderful!
                      </p>
                      <p
                        className="text-[9px] tracking-widest text-[#8B6F47] uppercase font-bold mb-4"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        Details for {rsvpName ? rsvpName.toUpperCase() : 'you'}
                      </p>
                      <p
                        className="text-sm text-[#3D2B1F] mb-4"
                        style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem' }}
                      >
                        How many family members will attend?
                      </p>
                      <div className="flex items-center justify-center gap-6 mb-3">
                        <button
                          type="button"
                          onClick={() => setRsvpCount(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-full border text-[#3D2B1F] flex items-center justify-center transition-all text-xl hover:bg-[#3D2B1F] hover:text-white"
                          style={{ borderColor: 'rgba(61,43,31,0.4)' }}
                        >
                          −
                        </button>
                        <span
                          className="text-3xl font-light text-[#3D2B1F] w-12 text-center"
                          style={{ fontFamily: 'var(--font-cormorant)' }}
                        >
                          {rsvpCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRsvpCount(prev => prev + 1)}
                          className="w-10 h-10 rounded-full border text-[#3D2B1F] flex items-center justify-center transition-all text-xl hover:bg-[#3D2B1F] hover:text-white"
                          style={{ borderColor: 'rgba(61,43,31,0.4)' }}
                        >
                          +
                        </button>
                      </div>
                      <p
                        className="text-[9px] tracking-wider text-[#9C8E7E] uppercase"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        Including yourself
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full text-white py-4 px-6 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] text-xs btn-lift"
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontWeight: 600,
                      background: '#3D2B1F',
                      boxShadow: '0 4px 20px rgba(61,43,31,0.25)',
                    }}
                  >
                    Submit RSVP
                  </button>
                </form>
              </div>
            ) : (
              /* Guest List Card */
              <div
                className="rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-xl border"
                style={{
                  background: '#FFFFFF',
                  borderColor: 'rgba(139,111,71,0.15)',
                  boxShadow: '0 4px 40px rgba(61,43,31,0.07)',
                }}
              >
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8B6F47] font-medium text-center mb-6"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  Attending Guests
                </p>
                <div className="divide-y divide-[rgba(139,111,71,0.1)] max-h-[400px] overflow-y-auto pr-1">
                  {rsvps.map((rsvp, idx) => (
                    <div key={idx} className="py-4 flex justify-between items-center gap-4">
                      <div>
                        <h4
                          className="font-semibold text-[#3D2B1F] text-base"
                          style={{ fontFamily: 'var(--font-cormorant)' }}
                        >
                          {rsvp.name}
                        </h4>
                        <p
                          className="text-xs text-[#9C8E7E]"
                          style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                          {rsvp.place}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold"
                          style={{
                            fontFamily: 'var(--font-outfit)',
                            background: rsvp.attending ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: rsvp.attending ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {rsvp.attending ? `Yes (${rsvp.familyCount})` : "Can't Attend"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ============================================================= */}
          {/* WITH LOVE & GRATITUDE SECTION */}
          {/* ============================================================= */}
          <section
            className="py-20 sm:py-28 px-6 text-center border-y relative flex flex-col items-center justify-center animate-on-scroll opacity-0"
            style={{
              background: '#FAF6F1',
              borderColor: 'rgba(139,111,71,0.2)',
            }}
          >
            {/* Heart icon */}
            <div className="mb-5 text-[#C9A96E]/60" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <svg className="w-7 h-7 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            <h2
              className="text-4xl sm:text-5xl text-[#3D2B1F] mb-7"
              style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
            >
              With Love & Gratitude
            </h2>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#C9A96E]/50" />
              <span className="text-[#C9A96E]/40 text-[10px]">✦</span>
              <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#C9A96E]/50" />
            </div>

            <div
              className="max-w-xl mx-auto space-y-5 text-[#3D2B1F]/80 text-base sm:text-lg leading-relaxed px-2"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}
            >
              <p>
                We sincerely thank you for sharing in our joy and for your warm wishes and prayers. Your presence in our lives means the world to us.
              </p>
              <p style={{ fontStyle: 'italic', color: '#8B6F47' }}>
                May Allah bless you all.
              </p>
            </div>

            {/* Regards */}
            <div className="mt-14">
              <p
                className="text-[9px] sm:text-[10px] tracking-[0.3em] text-[#8B6F47] uppercase font-bold mb-5"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Regards, Families of:
              </p>
              <div
                className="space-y-3 text-3xl sm:text-4xl text-[#3D2B1F]"
                style={{ fontFamily: 'var(--font-great-vibes)' }}
              >
                <p>Hayyan & Hani</p>
                <p>Hezlin & Hiyam</p>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* SEND YOUR BLESSINGS (GUEST BOOK) */}
          {/* ============================================================= */}
          <section
            className="py-20 sm:py-28 text-white text-center relative overflow-hidden flex flex-col items-center justify-center px-4 animate-on-scroll opacity-0"
            style={{ background: 'linear-gradient(160deg, #2C1810 0%, #3D2B1F 60%, #1A0F0A 100%)' }}
          >
            {/* Top golden rule */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

            <div className="max-w-xl w-full text-center">
              <p
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]/60 mb-4"
                style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
              >
                Guest Book
              </p>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl text-[#FAF6F1] mb-3"
                style={{ fontFamily: 'var(--font-great-vibes)', fontWeight: 400 }}
              >
                Send Your Blessings
              </h2>

              <p
                className="text-xl sm:text-2xl text-[#C9A96E] mb-8 leading-loose tracking-wide"
                style={{ direction: 'rtl' }}
              >
                بَارَكَ اللهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا
              </p>

              {/* Blessings Form */}
              <div
                className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl mb-14 text-left border"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(201,169,110,0.15)',
                }}
              >
                <form onSubmit={handleBlessingSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={blessingsName}
                    onChange={(e) => setBlessingsName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border outline-none text-white placeholder-white/40 transition-all"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(201,169,110,0.2)',
                    }}
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Your message..."
                    value={blessingsMessage}
                    onChange={(e) => setBlessingsMessage(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border outline-none text-white placeholder-white/40 transition-all resize-none"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(201,169,110,0.2)',
                    }}
                  />
                  <button
                    type="submit"
                    className="w-full text-[#3D2B1F] font-semibold py-4 px-6 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] text-xs btn-lift"
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      background: '#C9A96E',
                      boxShadow: '0 4px 20px rgba(201,169,110,0.3)',
                    }}
                  >
                    Send Blessings ✨
                  </button>
                </form>
              </div>

              {/* Blessings count */}
              <p
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]/50 font-bold mb-8"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {blessingsList.length} Blessings Received
              </p>

              {/* Blessings list */}
              <div className="space-y-7 text-left max-h-[480px] overflow-y-auto pr-1">
                {blessingsList.map((blessing, idx) => (
                  <div
                    key={idx}
                    className="pb-6 last:border-0"
                    style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}
                  >
                    <h4
                      className="text-xl sm:text-2xl text-[#C9A96E] mb-1.5"
                      style={{ fontFamily: 'var(--font-great-vibes)' }}
                    >
                      {blessing.name}
                    </h4>
                    <p
                      className="text-sm text-white/80 font-light leading-relaxed mb-2"
                      style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem' }}
                    >
                      {blessing.message}
                    </p>
                    <p
                      className="text-[9px] text-white/35 tracking-wider uppercase"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                      {blessing.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom golden rule */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
          </section>

          {/* ============================================================= */}
          {/* FOOTER */}
          {/* ============================================================= */}
          <footer
            className="py-8 text-center relative overflow-hidden flex flex-col items-center justify-center gap-3 px-4"
            style={{ background: '#1A0F0A', color: 'rgba(250,246,241,0.45)' }}
          >
            <a
              href="https://www.instagram.com/naasbay/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 transition-colors hover:opacity-80 mb-1"
              style={{ color: 'rgba(201,169,110,0.7)' }}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 132.004 132"><defs><linearGradient id="b"><stop offset="0" stopColor="#3771c8"/><stop stopColor="#3771c8" offset=".128"/><stop offset="1" stopColor="#60f" stopOpacity="0"/></linearGradient><linearGradient id="a"><stop offset="0" stopColor="#fd5"/><stop offset=".1" stopColor="#fd5"/><stop offset=".5" stopColor="#ff543e"/><stop offset="1" stopColor="#c837ab"/></linearGradient><radialGradient id="c" cx="158.429" cy="578.088" r="65" xlinkHref="#a" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -1.98198 1.8439 0 -1031.402 454.004)" fx="158.429" fy="578.088"/><radialGradient id="d" cx="147.694" cy="473.455" r="65" xlinkHref="#b" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.17394 .86872 -3.5818 .71718 1648.348 -458.493)" fx="147.694" fy="473.455"/></defs><path fill="url(#c)" d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z" transform="translate(1.004 1)"/><path fill="url(#d)" d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z" transform="translate(1.004 1)"/><path fill="#fff" d="M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z"/></svg>
              <span
                className="text-xs font-medium tracking-wider"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                naasbay
              </span>
            </a>
            <p
              className="text-[10px] tracking-wider"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              © {new Date().getFullYear()} naasbay. All rights reserved.
            </p>
          </footer>
        </div>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} src="/wedd.mp3" loop />

      {/* Floating Audio Button */}
      {showDetails && (
        <button
          onClick={togglePlay}
          id="audio-toggle-btn"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 w-14 h-14 flex items-center justify-center floating-audio-btn"
          style={{
            background: 'rgba(250,246,241,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(201,169,110,0.3)',
            boxShadow: '0 4px 24px rgba(61,43,31,0.2)',
            color: '#3D2B1F',
          }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 w-6 h-6 pb-0.5">
              <span className="w-1 bg-[#C9A96E] rounded-full animate-music-wave-1" />
              <span className="w-1 bg-[#8B6F47] rounded-full animate-music-wave-2" />
              <span className="w-1 bg-[#C9A96E] rounded-full animate-music-wave-3" />
              <span className="w-1 bg-[#8B6F47] rounded-full animate-music-wave-4" />
            </div>
          ) : (
            <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24" style={{ color: '#3D2B1F' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <WeddingApp />
    </Suspense>
  );
}
