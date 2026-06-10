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
    const targetDate = new Date('2026-07-26T10:00:00'); // July 26, 2026, 10:00 AM

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
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
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
          duration: 2,
          delay: 1,
          onComplete: () => {
            setIsLoading(false);
            // Start main animations after loading completes
            animateContent();
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      // Fade in the details section
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [showDetails]);

  const animateContent = () => {
    const timeline = gsap.timeline();

    // Animate heading
    if (textRef.current) {
      const heading = textRef.current.querySelector('h1');
      const ampersand = textRef.current.querySelector('.ampersand');
      const subheading = textRef.current.querySelector('h2');
      const eventType = textRef.current.querySelector('.event-type');

      if (heading) {
        timeline.fromTo(
          heading,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          0
        );
      }

      if (ampersand) {
        timeline.fromTo(
          ampersand,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
          0.3
        );
      }

      if (subheading) {
        timeline.fromTo(
          subheading,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          0.6
        );
      }

      if (eventType) {
        timeline.fromTo(
          eventType,
          { opacity: 0 },
          { opacity: 0.8, duration: 0.8, ease: 'power2.out' },
          0.8
        );
      }
    }

    // Animate button
    if (buttonRef.current) {
      timeline.fromTo(
        buttonRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        1
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
      {/* INVITATION SCREEN */}
      {!showDetails && (
        <div className="relative w-full h-screen overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/envelope-cover.mp4.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Loading Animation */}
          {isLoading && (
            <div
              ref={loadingRef}
              className="absolute inset-0 flex items-center justify-center bg-white z-50"
            >
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-2xl font-light text-purple-600">
                  Wedding Invitation Loading...
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <div ref={textRef} className="text-center px-4 max-w-2xl">
              {/* Basmala */}
              <p className="text-xl font-light mb-8 opacity-90">
                بسم الله الرحمن الرحيم
              </p>

              {/* Names */}
              <h1 className="text-7xl md:text-8xl font-[family-name:var(--font-great-vibes)] mb-4 text-[#5D4874] drop-shadow-sm font-normal">
                Fayez
              </h1>

              {/* Ampersand */}
              <div className="ampersand text-5xl md:text-6xl font-[family-name:var(--font-great-vibes)] text-[#5D4874] my-2 drop-shadow-sm font-normal">
                &
              </div>

              {/* Second Name */}
              <h2 className="text-7xl md:text-8xl font-[family-name:var(--font-great-vibes)] mb-8 text-[#5D4874] drop-shadow-sm font-normal">
                Hasna
              </h2>

              {/* Event Type */}
              <p className="event-type text-lg md:text-xl font-sans tracking-widest text-[#8469A3] mb-12 font-semibold uppercase">
                Wedding Ceremony
              </p>

              {/* Wax Seal "TAP TO OPEN" Button */}
              <div className="flex flex-col items-center justify-center gap-4 mt-4">
                <button
                  ref={buttonRef}
                  onClick={handleViewDetails}
                  className="w-24 h-24 rounded-full bg-[#5D4874] border-4 border-[#8469A3]/50 outline outline-2 outline-[#5D4874] outline-offset-4 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(93,72,116,0.6)] cursor-pointer"
                >
                  <span className="font-[family-name:var(--font-great-vibes)] text-4xl text-white">F&H</span>
                </button>
                <p className="text-sm font-semibold tracking-[0.2em] text-[#e5c158] uppercase flex items-center gap-1 animate-pulse">
                  ✨ TAP TO OPEN ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS SCREEN */}
      {showDetails && (
        <div ref={detailsRef} className="min-h-screen bg-[#FFF9F5] text-[#5D4874] font-body overflow-x-hidden selection:bg-[#5D4874] selection:text-white bg-grain">
          {/* RECEPTION PAGE */}
          <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#FFF9F5]">
            {/* Background Image with Premium Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/receptionpic.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-2xl text-white">
              {/* Watermark & Guest Greeting Section */}
              <div className="relative w-full mb-6 py-6 flex flex-col items-center justify-center">
                {/* Watermark Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
                  <span className="text-white/[0.08] font-serif text-5xl md:text-[5.5rem] tracking-[0.2em] leading-none uppercase">
                    RECEPTION
                  </span>
                  <span className="text-white/[0.08] font-serif text-5xl md:text-[5.5rem] tracking-[0.2em] leading-none uppercase mt-3">
                    CELEBRATION
                  </span>
                </div>

                {/* Guest Greeting */}
                {guestName && (
                  <div className="relative z-10 text-center">
                    <p className="text-sm md:text-base font-light italic mb-2 tracking-wide text-white/95">Dear</p>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-wide text-[#E9C46A] drop-shadow-md">
                      {guestName}
                    </h2>
                  </div>
                )}
              </div>

              <p className="text-xs md:text-sm font-light tracking-[0.1em] text-white/90 mb-8 max-w-md mx-auto">
                You are cordially invited to the reception ceremony of
              </p>

              {/* Basmala */}
              <div className="flex flex-col items-center justify-center mb-8">
                <p className="text-2xl md:text-3xl font-light text-white leading-relaxed tracking-wide select-none">
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </p>
                <div className="w-20 h-[1.5px] bg-[#e5c158] mt-3 opacity-80"></div>
              </div>

              {/* Couple Names */}
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-12 py-3.5 shadow-xl min-w-[280px] md:min-w-[340px]">
                  <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-great-vibes)] text-[#5D4874] tracking-wide">
                    Fayez
                  </h1>
                </div>
                <p className="text-2xl font-light text-white my-1 font-serif">&</p>
                <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-12 py-3.5 shadow-xl min-w-[280px] md:min-w-[340px]">
                  <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-great-vibes)] text-[#5D4874] tracking-wide">
                    Hasna
                  </h1>
                </div>
              </div>

              {/* Date and Time */}
              <div className="mt-8 flex flex-col items-center">
                <p className="text-xs font-semibold tracking-[0.3em] text-white/90 mb-3 uppercase">
                  SUNDAY
                </p>
                <div className="flex items-center justify-center gap-4 w-full max-w-lg px-4">
                  <div className="flex-1 max-w-[60px] h-[1px] bg-[#e5c158] opacity-80"></div>
                  <p className="text-2xl md:text-3xl font-semibold tracking-wide text-white whitespace-nowrap">
                    July 26, 2026 | 10:00 AM
                  </p>
                  <div className="flex-1 max-w-[60px] h-[1px] bg-[#e5c158] opacity-80"></div>
                </div>
              </div>

              {/* Scroll Down */}
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-white/80 mt-16 animate-bounce uppercase">
                SCROLL DOWN
              </p>
            </div>
          </header>

          {/* QUOTE SECTION */}
          <section className="py-24 px-6 text-center bg-[#FFF9F5] relative flex flex-col items-center justify-center">
            {/* Quote */}
            <div className="text-center max-w-2xl animate-on-scroll opacity-0">
              <p className="text-3xl md:text-5xl font-light text-[#5D4874] mb-6 italic">
                وَخَلَقْنَاكُمْ أَزْوَاجًا
              </p>
              <p className="text-xl md:text-2xl font-light text-[#5D4874] mb-4">
                "And We created you in pairs"
              </p>
              <p className="text-sm font-light text-[#8469A3] uppercase tracking-widest">
                SURAH AN-NABA 78:8
              </p>
            </div>
          </section>

          {/* SAVE THE DATE / COUNTDOWN SECTION */}
          <section className="py-24 bg-[#5D4874] text-white relative flex flex-col items-center justify-center min-h-[60vh]">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center animate-on-scroll opacity-0">
              <h3 className="text-4xl md:text-5xl font-[family-name:var(--font-great-vibes)] mb-4 text-[#FFF9F5]">
                Save The Date
              </h3>
              <p className="text-3xl font-bold mb-8">July 26, 2026</p>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-4 mb-8 max-w-md mx-auto">
                <div className="bg-[#8469A3]/30 backdrop-blur-sm rounded-full py-6 flex flex-col items-center justify-center border border-white/10">
                  <p className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</p>
                  <p className="text-xs uppercase font-light">Days</p>
                </div>
                <div className="bg-[#8469A3]/30 backdrop-blur-sm rounded-full py-6 flex flex-col items-center justify-center border border-white/10">
                  <p className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</p>
                  <p className="text-xs uppercase font-light">Hours</p>
                </div>
                <div className="bg-[#8469A3]/30 backdrop-blur-sm rounded-full py-6 flex flex-col items-center justify-center border border-white/10">
                  <p className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</p>
                  <p className="text-xs uppercase font-light">Minutes</p>
                </div>
                <div className="bg-[#8469A3]/30 backdrop-blur-sm rounded-full py-6 flex flex-col items-center justify-center border border-white/10">
                  <p className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</p>
                  <p className="text-xs uppercase font-light">Seconds</p>
                </div>
              </div>

              <button className="px-8 py-3 border-2 border-[#FFF9F5] text-[#FFF9F5] font-semibold uppercase text-sm tracking-wider rounded-full hover:bg-[#FFF9F5] hover:text-[#5D4874] transition-all duration-300">
                Add to Calendar
              </button>

              <p className="text-xs font-light mt-6 uppercase tracking-widest text-[#FFF9F5]/80">
                We are counting down the moments
              </p>
            </div>
          </section>

          {/* ITINERARY SECTION */}
          <section className="py-24 bg-[#FFF9F5] text-[#5D4874] relative flex flex-col items-center justify-center px-4">

            <div className="max-w-4xl w-full animate-on-scroll opacity-0">
              <div className="text-center mb-16 md:mb-24">
                <h2 className="text-6xl md:text-7xl font-[family-name:var(--font-great-vibes)] mb-3 text-[#7A6A88]">
                  The Itinerary
                </h2>
                <p className="text-[#A496AC] uppercase text-[10px] md:text-xs tracking-[0.2em]">
                  Sunday, July 26, 2026
                </p>
              </div>

              {/* Timeline Container */}
              <div className="relative w-full max-w-3xl mx-auto">
                {/* The Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-2 bottom-2 w-[1px] bg-[#E3D9E8] -translate-x-1/2"></div>

                <div className="space-y-12 md:space-y-20">
                  
                  {/* Event 1 (Left on Desktop) */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="w-full md:w-1/2 flex flex-col items-start md:items-end pr-0 md:pr-12 pl-16 md:pl-0">
                      <h3 className="text-xl font-bold text-[#564A62]">Grand Arrival</h3>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#9A8CA1] mt-1">City Palace Auditorium</p>
                    </div>
                    
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#7A6A88] -translate-x-1/2 border-2 border-[#FFFDF9] shadow-sm z-10 top-1 md:top-auto"></div>
                    
                    <div className="w-full md:w-1/2 pl-16 md:pl-12 mt-1 md:mt-0 text-left">
                      <p className="font-bold text-sm text-[#7A6A88]">10:00 AM</p>
                    </div>
                  </div>

                  {/* Event 2 (Right on Desktop) */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="hidden md:flex w-1/2 justify-end pr-12">
                      <p className="font-bold text-sm text-[#7A6A88]">11:00 AM</p>
                    </div>
                    
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#7A6A88] -translate-x-1/2 border-2 border-[#FFFDF9] shadow-sm z-10 top-1 md:top-auto"></div>
                    
                    <div className="w-full md:w-1/2 pl-16 md:pl-12 flex flex-col items-start text-left">
                      <h3 className="text-xl font-bold text-[#564A62]">Wedding Ceremony</h3>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#9A8CA1] mt-1">Welcome & Greetings</p>
                      <p className="font-bold text-sm text-[#7A6A88] mt-1 md:hidden">11:00 AM</p>
                    </div>
                  </div>

                  {/* Event 3 (Left on Desktop) */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="w-full md:w-1/2 flex flex-col items-start md:items-end pr-0 md:pr-12 pl-16 md:pl-0">
                      <h3 className="text-xl font-bold text-[#564A62]">Lunch</h3>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#9A8CA1] mt-1">Grand Lunch Feast</p>
                    </div>
                    
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#7A6A88] -translate-x-1/2 border-2 border-[#FFFDF9] shadow-sm z-10 top-1 md:top-auto"></div>
                    
                    <div className="w-full md:w-1/2 pl-16 md:pl-12 mt-1 md:mt-0 text-left">
                      <p className="font-bold text-sm text-[#7A6A88]">12:30 PM</p>
                    </div>
                  </div>

                  {/* Event 4 (Right on Desktop) */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="hidden md:flex w-1/2 justify-end pr-12">
                      <p className="font-bold text-sm text-[#7A6A88]">12:30 PM</p>
                    </div>
                    
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#7A6A88] -translate-x-1/2 border-2 border-[#FFFDF9] shadow-sm z-10 top-1 md:top-auto"></div>
                    
                    <div className="w-full md:w-1/2 pl-16 md:pl-12 flex flex-col items-start text-left">
                      <h3 className="text-xl font-bold text-[#564A62]">Photo Windup</h3>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#9A8CA1] mt-1">Smiling Faces & Happy Traces 📸 ✨</p>
                      <p className="font-bold text-sm text-[#7A6A88] mt-1 md:hidden">12:30 PM</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* VENUE SECTION */}
          <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-t-4 border-[#8469A3] bg-cover bg-center" style={{ backgroundImage: 'url(/venue.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative h-full w-full flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between px-8 md:px-16 lg:px-24 py-16 md:py-0 animate-on-scroll opacity-0 gap-8">
              {/* Left Side - Text */}
              <div className="text-white max-w-lg mt-12 md:mt-0">
                {/* Label */}
                <p className="text-xs uppercase tracking-widest mb-4 md:mb-6 text-purple-300 font-light">
                  The Venue
                </p>

                {/* Main Heading */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                  City Palace <br /> Auditorium
                </h2>

                {/* Location */}
                <p className="text-base sm:text-lg md:text-xl font-light text-gray-200">
                  Kechery, Thrissur, Kerala
                </p>
              </div>

              {/* Right Side - Buttons Card */}
              <div className="hidden lg:flex items-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-8 py-8 w-80 flex flex-col items-center gap-6">
                  {/* Icon */}
                  <div className="text-4xl">🏰</div>

                  {/* Get Directions Button */}
                  <button className="w-full px-6 py-3 border-2 border-white text-white font-semibold uppercase text-sm tracking-wider rounded-full hover:bg-white hover:text-black transition-all duration-300"
                    onClick={() => handleGetDirections()}>
                    Get Directions
                  </button>
                </div>
              </div>

              {/* Mobile Buttons */}
              <div className="lg:hidden w-full mb-12 md:mb-0">
                <button className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white font-semibold uppercase text-sm tracking-wider rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                  onClick={() => handleGetDirections()}>
                  Get Directions
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 1: RSVP SECTION (FORM & GUEST LIST) */}
          {/* ========================================================================= */}
          <section id="rsvp" className="py-24 bg-white relative overflow-hidden flex flex-col items-center justify-center px-4 animate-on-scroll opacity-0">
            {/* RSVP Tab Toggle */}
            <div className="flex bg-[#FCF6F5] border border-[#EBE3EE] rounded-full p-1 mb-8 shadow-sm max-w-xs w-full">
              <button
                onClick={() => setRsvpTab('rsvp')}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-300 ${
                  rsvpTab === 'rsvp'
                    ? 'bg-[#5D4874] text-white shadow-md'
                    : 'text-[#5D4874] hover:bg-[#FAF9FC]'
                }`}
              >
                RSVP NOW
              </button>
              <button
                onClick={() => setRsvpTab('list')}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-300 ${
                  rsvpTab === 'list'
                    ? 'bg-[#5D4874] text-white shadow-md'
                    : 'text-[#5D4874] hover:bg-[#FAF9FC]'
                }`}
              >
                GUEST LIST
              </button>
            </div>

            {rsvpTab === 'rsvp' ? (
              /* RSVP Card Form */
              <div className="bg-white border border-[#E9E4ED] rounded-[2rem] shadow-xl p-8 md:p-12 w-full max-w-xl text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#8469A3] font-medium mb-3">
                  REQUEST OF PRESENCE
                </p>
                <h2 className="text-5xl md:text-6xl font-[family-name:var(--font-great-vibes)] text-[#5D4874] mb-2">
                  Will you join us?
                </h2>
                <p className="text-xs italic text-[#8469A3] mb-8">
                  Please kindly respond by June 15th
                </p>

                <form onSubmit={handleRsvpSubmit} className="space-y-6 text-left">
                  {/* Name Input */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="name"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-[#ECE8F0] focus:border-[#5D4874] focus:ring-1 focus:ring-[#5D4874] outline-none text-[#5D4874] bg-white transition-all text-sm"
                    />
                  </div>

                  {/* Place Input */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="place"
                      value={rsvpPlace}
                      onChange={(e) => setRsvpPlace(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-[#ECE8F0] focus:border-[#5D4874] focus:ring-1 focus:ring-[#5D4874] outline-none text-[#5D4874] bg-white transition-all text-sm"
                    />
                  </div>

                  {/* Attend Choice */}
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#8469A3] font-semibold mb-3">
                      WILL YOU ATTEND?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Yes Choice */}
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(true)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all text-sm ${
                          rsvpAttending === true
                            ? 'border-[#5D4874] bg-[#FAF8FB] text-[#5D4874] font-semibold ring-1 ring-[#5D4874]'
                            : 'border-[#ECE8F0] text-[#8469A3] hover:bg-gray-50'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                          rsvpAttending === true ? 'bg-[#5D4874] border-[#5D4874] text-white' : 'border-gray-300'
                        }`}>
                          {rsvpAttending === true && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        Yes, In Sha Allah! 🤩
                      </button>

                      {/* No Choice */}
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(false)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all text-sm ${
                          rsvpAttending === false
                            ? 'border-[#5D4874] bg-[#FAF8FB] text-[#5D4874] font-semibold ring-1 ring-[#5D4874]'
                            : 'border-[#ECE8F0] text-[#8469A3] hover:bg-gray-50'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                          rsvpAttending === false ? 'bg-[#5D4874] border-[#5D4874] text-white' : 'border-gray-300'
                        }`}>
                          {rsvpAttending === false && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                        Unfortunately, I can't
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Family Members Selector */}
                  {rsvpAttending === true && (
                    <div className="bg-[#FAF8FB] border border-[#ECE8F0] rounded-2xl p-6 text-center animate-fadeIn">
                      <p className="text-[#5D4874] font-[family-name:var(--font-great-vibes)] text-3xl italic mb-1">
                        Wonderful!
                      </p>
                      <p className="text-[9px] tracking-widest text-[#8469A3] uppercase font-bold mb-4">
                        DETAILS FOR {rsvpName ? rsvpName.toUpperCase() : 'NAME'}
                      </p>
                      <p className="text-xs text-[#5D4874] font-semibold mb-4">
                        How many family members will attend?
                      </p>
                      
                      <div className="flex items-center justify-center gap-6 mb-3">
                        {/* Decrement Button */}
                        <button
                          type="button"
                          onClick={() => setRsvpCount(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-full border border-[#5D4874] text-[#5D4874] flex items-center justify-center hover:bg-[#5D4874] hover:text-white transition-all text-xl"
                        >
                          -
                        </button>
                        {/* Counter Value */}
                        <span className="text-3xl font-bold text-[#5D4874] w-12 text-center">
                          {rsvpCount}
                        </span>
                        {/* Increment Button */}
                        <button
                          type="button"
                          onClick={() => setRsvpCount(prev => prev + 1)}
                          className="w-10 h-10 rounded-full border border-[#5D4874] text-[#5D4874] flex items-center justify-center hover:bg-[#5D4874] hover:text-white transition-all text-xl"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[9px] tracking-wider text-[#8469A3] uppercase font-semibold">
                        INCLUDING YOURSELF
                      </p>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full bg-[#5D4874] hover:bg-[#4a395c] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg uppercase tracking-wider text-xs"
                  >
                    SUBMIT RSVP
                  </button>
                </form>
              </div>
            ) : (
              /* RSVP Guest List View */
              <div className="bg-white border border-[#E9E4ED] rounded-[2rem] shadow-xl p-8 md:p-12 w-full max-w-xl">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#8469A3] font-medium text-center mb-6">
                  ATTENDING GUESTS
                </p>
                <div className="divide-y divide-[#ECE8F0] max-h-[400px] overflow-y-auto pr-2">
                  {rsvps.map((rsvp, idx) => (
                    <div key={idx} className="py-4 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-[#5D4874] text-base">{rsvp.name}</h4>
                        <p className="text-xs text-[#8469A3]">{rsvp.place}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          rsvp.attending
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rsvp.attending ? `Yes (${rsvp.familyCount})` : "Can't Attend"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: WITH LOVE & GRATITUDE SECTION */}
          {/* ========================================================================= */}
          <section className="py-20 px-6 bg-[#FFF9F5] text-center border-y border-[#8469A3]/20 relative flex flex-col items-center justify-center animate-on-scroll opacity-0">
            {/* Elegant logo/motif */}
            <div className="mb-6 text-[#5D4874] opacity-80">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#5D4874] mb-8">
              With Love & Gratitude
            </h2>

            {/* Paragraphs */}
            <div className="max-w-2xl mx-auto space-y-6 text-[#5D4874] text-base md:text-lg leading-relaxed px-4">
              <p>
                We sincerely thank you for sharing in our joy and for your warm wishes and prayers. Your presence in our lives means the world to us.
              </p>
              <p className="font-medium">
                May Allah bless you all.
              </p>
            </div>

            {/* Regards block */}
            <div className="mt-16">
              <p className="text-[10px] tracking-[0.25em] text-[#8469A3] uppercase font-bold mb-6">
                REGARDS FAMILIES OF:
              </p>
              <div className="space-y-4 font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl text-[#5D4874]">
                <p>Hayyan && Hani</p>
                <p>Hezlin && Hiyam</p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: SEND YOUR BLESSINGS (GUEST BOOK) */}
          {/* ========================================================================= */}
          <section className="py-24 bg-[#5D4874] text-white text-center relative overflow-hidden flex flex-col items-center justify-center px-4 animate-on-scroll opacity-0">
            <div className="max-w-xl w-full text-center">
              {/* Header */}
              <h2 className="text-5xl md:text-6xl font-[family-name:var(--font-great-vibes)] text-[#E9D6FF] mb-2">
                Send Your Blessings
              </h2>
              {/* Arabic Script */}
              <p className="text-2xl md:text-3xl text-[#E9C46A] mb-8 font-serif leading-loose tracking-wide">
                بَارَكَ اللهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا
              </p>

              {/* Blessings Form */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 md:p-10 shadow-2xl mb-16 text-left">
                <form onSubmit={handleBlessingSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={blessingsName}
                      onChange={(e) => setBlessingsName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/40 outline-none text-white placeholder-white/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Your message..."
                      value={blessingsMessage}
                      onChange={(e) => setBlessingsMessage(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/40 outline-none text-white placeholder-white/50 transition-all text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#8B7AA1] hover:bg-[#9C8BB2] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg uppercase tracking-wider text-xs"
                  >
                    SEND BLESSINGS ✨
                  </button>
                </form>
              </div>

              {/* Blessings Counter */}
              <p className="text-xs uppercase tracking-[0.2em] text-[#D8C7EB] font-bold mb-8">
                {blessingsList.length} BLESSINGS
              </p>

              {/* Blessings List */}
              <div className="space-y-8 text-left max-h-[500px] overflow-y-auto pr-2">
                {blessingsList.map((blessing, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-6 last:border-0">
                    <h4 className="font-[family-name:var(--font-great-vibes)] text-2xl text-[#E9C46A] mb-1">
                      {blessing.name}
                    </h4>
                    <p className="text-sm text-white/90 font-light leading-relaxed mb-2">
                      {blessing.message}
                    </p>
                    <p className="text-[10px] text-white/45 tracking-wider uppercase">
                      {blessing.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-8 bg-[#2C2433] text-center relative overflow-hidden text-[#FFF9F5]/60 text-sm flex flex-col items-center justify-center">
            {/* instagram link with icon */}
            <a href="https://www.instagram.com/naasbay/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 hover:text-[#FFF9F5] transition-colors mb-3">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 132.004 132"><defs><linearGradient id="b"><stop offset="0" stopColor="#3771c8"/><stop stopColor="#3771c8" offset=".128"/><stop offset="1" stopColor="#60f" stopOpacity="0"/></linearGradient><linearGradient id="a"><stop offset="0" stopColor="#fd5"/><stop offset=".1" stopColor="#fd5"/><stop offset=".5" stopColor="#ff543e"/><stop offset="1" stopColor="#c837ab"/></linearGradient><radialGradient id="c" cx="158.429" cy="578.088" r="65" xlinkHref="#a" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -1.98198 1.8439 0 -1031.402 454.004)" fx="158.429" fy="578.088"/><radialGradient id="d" cx="147.694" cy="473.455" r="65" xlinkHref="#b" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.17394 .86872 -3.5818 .71718 1648.348 -458.493)" fx="147.694" fy="473.455"/></defs><path fill="url(#c)" d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z" transform="translate(1.004 1)"/><path fill="url(#d)" d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z" transform="translate(1.004 1)"/><path fill="#fff" d="M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z"/></svg>
              <span className="font-medium tracking-wide">naasbay</span>
            </a>
            <p>© {new Date().getFullYear()} naasbay. All rights reserved.</p>
          </footer>
        </div>
      )}

      {/* Background Audio Element */}
      <audio ref={audioRef} src="/wedd.mp3" loop />

      {/* Floating Audio Play/Pause Button */}
      {showDetails && (
        <button
          onClick={togglePlay}
          className="fixed bottom-6 right-6 z-40 bg-white/90 backdrop-blur-md border border-[#8469A3]/30 text-[#5D4874] p-3.5 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group w-14 h-14 flex items-center justify-center"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 w-6 h-6 pb-0.5">
              <span className="w-1 bg-[#8469A3] rounded-full animate-music-wave-1"></span>
              <span className="w-1 bg-[#5D4874] rounded-full animate-music-wave-2"></span>
              <span className="w-1 bg-[#8469A3] rounded-full animate-music-wave-3"></span>
              <span className="w-1 bg-[#5D4874] rounded-full animate-music-wave-4"></span>
            </div>
          ) : (
            <svg className="w-6 h-6 fill-current text-[#5D4874] ml-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
