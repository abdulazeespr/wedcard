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
    { name: 'Azees', message: 'Mm', date: '9 JUN 2026 • 03:19 PM' },
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
              <h1 className="text-7xl md:text-8xl font-bold mb-4 text-purple-300 drop-shadow-lg">
                Fayez
              </h1>

              {/* Ampersand */}
              <div className="ampersand text-6xl md:text-7xl font-light text-purple-300 my-4 drop-shadow-lg">
                &
              </div>

              {/* Second Name */}
              <h2 className="text-7xl md:text-8xl font-bold mb-8 text-purple-300 drop-shadow-lg">
                Hasna
              </h2>

              {/* Event Type */}
              <p className="event-type text-2xl md:text-3xl font-light text-purple-200 drop-shadow-lg mb-12">
                Reception Ceremony
              </p>

              {/* View Details Button */}
              <button
                ref={buttonRef}
                onClick={handleViewDetails}
                className="px-8 py-3 border-2 border-purple-300 text-purple-300 text-lg font-semibold hover:bg-purple-300 hover:text-white transition-all duration-300 rounded-full drop-shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                TAP TO OPEN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS SCREEN */}
      {showDetails && (
        <div ref={detailsRef} className="w-full bg-white">
          {/* RECEPTION PAGE */}
          <section className="relative w-full h-screen bg-gradient-to-b from-purple-900 to-purple-800 flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/receptionpic.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-2xl">
              {guestName && (
                <>
                  <p className="text-lg font-light mb-4 opacity-90">Dear</p>
                  <h2 className="text-5xl md:text-6xl font-light mb-2 text-yellow-300">
                    {guestName}
                  </h2>
                </>
              )}
              <p className="text-2xl font-light mb-8">
                You are cordially invited to the reception ceremony of
              </p>

              {/* Couple Names */}
              <h1 className="text-5xl md:text-6xl font-light mb-2 text-purple-200">
                Fayez
              </h1>
              <p className="text-3xl font-light mb-6">&</p>
              <h1 className="text-5xl md:text-6xl font-light mb-8 text-purple-200">
                Hasna
              </h1>

              {/* Date and Time */}
              <div className="mt-12">
                <p className="text-lg font-light uppercase tracking-widest mb-2">
                  SUNDAY
                </p>
                <p className="text-4xl font-bold mb-4">July 26, 2026 | 11:00 AM</p>
              </div>

              {/* Scroll Down */}
              <p className="text-sm font-light uppercase tracking-widest mt-12 animate-bounce">
                SCROLL DOWN
              </p>
            </div>
          </section>

          {/* QUOTE SECTION */}
          <section className="relative w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
            {/* Quote */}
            <div className="text-center max-w-2xl mb-16">
              <p className="text-3xl md:text-5xl font-light text-purple-600 mb-6 italic">
                وَخَلَقْنَاكُمْ أَزْوَاجًا
              </p>
              <p className="text-xl md:text-2xl font-light text-purple-600 mb-4">
                "And We created you in pairs"
              </p>
              <p className="text-sm font-light text-purple-600 uppercase tracking-widest">
                SURAH AN-NABA 78:8
              </p>
            </div>

            {/* Save the Date */}
            <div className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 rounded-2xl py-16 px-8 text-white text-center">
              <h3 className="text-4xl md:text-5xl font-light mb-4 text-purple-300">
                Save The Date
              </h3>
              <p className="text-3xl font-bold mb-8">July 26, 2026</p>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-purple-800/50 rounded-full py-6 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">32</p>
                  <p className="text-xs uppercase font-light">Days</p>
                </div>
                <div className="bg-purple-800/50 rounded-full py-6 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">06</p>
                  <p className="text-xs uppercase font-light">Hours</p>
                </div>
                <div className="bg-purple-800/50 rounded-full py-6 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">19</p>
                  <p className="text-xs uppercase font-light">Minutes</p>
                </div>
                <div className="bg-purple-800/50 rounded-full py-6 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs uppercase font-light">Seconds</p>
                </div>
              </div>

              <button className="px-8 py-3 border-2 border-purple-300 text-purple-300 font-semibold uppercase text-sm tracking-wider rounded-full hover:bg-purple-300 hover:text-purple-900 transition-all duration-300">
                Add to Calendar
              </button>

              <p className="text-xs font-light mt-6 uppercase tracking-widest text-purple-200">
                We are counting down the moments
              </p>
            </div>
          </section>

          {/* ITINERARY SECTION */}
          <section className="relative w-full min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-4xl w-full">
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
                      <p className="font-bold text-sm text-[#7A6A88]">10:30 AM</p>
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
                      <h3 className="text-xl font-bold text-[#564A62]">Ceremony</h3>
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
                      <p className="font-bold text-sm text-[#7A6A88]">12:00 PM</p>
                    </div>
                  </div>

                  {/* Event 4 (Right on Desktop) */}
                  <div className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                    <div className="hidden md:flex w-1/2 justify-end pr-12">
                      <p className="font-bold text-sm text-[#7A6A88]">12:10 PM</p>
                    </div>
                    
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#7A6A88] -translate-x-1/2 border-2 border-[#FFFDF9] shadow-sm z-10 top-1 md:top-auto"></div>
                    
                    <div className="w-full md:w-1/2 pl-16 md:pl-12 flex flex-col items-start text-left">
                      <h3 className="text-xl font-bold text-[#564A62]">Photo Windup</h3>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#9A8CA1] mt-1">Smiling Faces & Happy Traces 📸 ✨</p>
                      <p className="font-bold text-sm text-[#7A6A88] mt-1 md:hidden">12:10 PM</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* VENUE SECTION */}
          <section className="relative w-full h-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(/venue.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-between px-8 md:px-16 lg:px-24">
              {/* Left Side - Text */}
              <div className="text-white max-w-lg">
                {/* Label */}
                <p className="text-xs uppercase tracking-widest mb-6 text-purple-300 font-light">
                  The Venue
                </p>

                {/* Main Heading */}
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  City Palace <br /> Auditorium
                </h2>

                {/* Location */}
                <p className="text-lg md:text-xl font-light text-gray-200">
                  Kechery, Thrissur, Kerala
                </p>
              </div>

              {/* Right Side - Buttons Card */}
              <div className="hidden lg:flex items-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-8 py-8 w-80 flex flex-col items-center gap-6">
                  {/* Icon */}
                  <div className="text-4xl">🏰</div>

                  {/* Get Directions Button */}
                  <button className="w-full px-6 py-3 border-2 border-white text-white font-semibold uppercase text-sm tracking-wider rounded-full hover:bg-white hover:text-black transition-all duration-300">
                    Get Directions
                  </button>
                </div>
              </div>

              {/* Mobile Buttons */}
              <div className="lg:hidden fixed bottom-8 left-0 right-0 px-4 flex justify-center">
                <button className="px-8 py-3 border-2 border-white text-white font-semibold uppercase text-sm tracking-wider rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm">
                  Get Directions
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 1: RSVP SECTION (FORM & GUEST LIST) */}
          {/* ========================================================================= */}
          <section className="relative w-full min-h-screen bg-[#FAF9FC] flex flex-col items-center justify-center py-20 px-4">
            {/* RSVP Tab Toggle */}
            <div className="flex bg-[#FCF6F5] border border-[#EBE3EE] rounded-full p-1 mb-8 shadow-sm max-w-xs w-full">
              <button
                onClick={() => setRsvpTab('rsvp')}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-300 ${
                  rsvpTab === 'rsvp'
                    ? 'bg-[#5B4A70] text-white shadow-md'
                    : 'text-[#5B4A70] hover:bg-[#F2EBF5]'
                }`}
              >
                RSVP NOW
              </button>
              <button
                onClick={() => setRsvpTab('list')}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-300 ${
                  rsvpTab === 'list'
                    ? 'bg-[#5B4A70] text-white shadow-md'
                    : 'text-[#5B4A70] hover:bg-[#F2EBF5]'
                }`}
              >
                GUEST LIST
              </button>
            </div>

            {rsvpTab === 'rsvp' ? (
              /* RSVP Card Form */
              <div className="bg-white border border-[#E9E4ED] rounded-[2rem] shadow-xl p-8 md:p-12 w-full max-w-xl text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#8C7B9E] font-medium mb-3">
                  REQUEST OF PRESENCE
                </p>
                <h2 className="text-5xl md:text-6xl font-[family-name:var(--font-great-vibes)] text-[#5B4A70] mb-2">
                  Will you join us?
                </h2>
                <p className="text-xs italic text-[#8C7B9E] mb-8">
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
                      className="w-full px-6 py-4 rounded-2xl border border-[#ECE8F0] focus:border-[#5B4A70] focus:ring-1 focus:ring-[#5B4A70] outline-none text-[#4A3C5C] bg-white transition-all text-sm"
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
                      className="w-full px-6 py-4 rounded-2xl border border-[#ECE8F0] focus:border-[#5B4A70] focus:ring-1 focus:ring-[#5B4A70] outline-none text-[#4A3C5C] bg-white transition-all text-sm"
                    />
                  </div>

                  {/* Attend Choice */}
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#8C7B9E] font-semibold mb-3">
                      WILL YOU ATTEND?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Yes Choice */}
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(true)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all text-sm ${
                          rsvpAttending === true
                            ? 'border-[#5B4A70] bg-[#FAF8FB] text-[#5B4A70] font-semibold ring-1 ring-[#5B4A70]'
                            : 'border-[#ECE8F0] text-[#6B5A7D] hover:bg-gray-50'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                          rsvpAttending === true ? 'bg-[#5B4A70] border-[#5B4A70] text-white' : 'border-gray-300'
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
                            ? 'border-[#5B4A70] bg-[#FAF8FB] text-[#5B4A70] font-semibold ring-1 ring-[#5B4A70]'
                            : 'border-[#ECE8F0] text-[#6B5A7D] hover:bg-gray-50'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                          rsvpAttending === false ? 'bg-[#5B4A70] border-[#5B4A70] text-white' : 'border-gray-300'
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
                      <p className="text-[#5B4A70] font-[family-name:var(--font-great-vibes)] text-3xl italic mb-1">
                        Wonderful!
                      </p>
                      <p className="text-[9px] tracking-widest text-[#8C7B9E] uppercase font-bold mb-4">
                        DETAILS FOR {rsvpName ? rsvpName.toUpperCase() : 'NAME'}
                      </p>
                      <p className="text-xs text-[#5B4A70] font-semibold mb-4">
                        How many family members will attend?
                      </p>
                      
                      <div className="flex items-center justify-center gap-6 mb-3">
                        {/* Decrement Button */}
                        <button
                          type="button"
                          onClick={() => setRsvpCount(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-full border border-[#5B4A70] text-[#5B4A70] flex items-center justify-center hover:bg-[#5B4A70] hover:text-white transition-all text-xl"
                        >
                          -
                        </button>
                        {/* Counter Value */}
                        <span className="text-3xl font-bold text-[#5B4A70] w-12 text-center">
                          {rsvpCount}
                        </span>
                        {/* Increment Button */}
                        <button
                          type="button"
                          onClick={() => setRsvpCount(prev => prev + 1)}
                          className="w-10 h-10 rounded-full border border-[#5B4A70] text-[#5B4A70] flex items-center justify-center hover:bg-[#5B4A70] hover:text-white transition-all text-xl"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[9px] tracking-wider text-[#8C7B9E] uppercase font-semibold">
                        INCLUDING YOURSELF
                      </p>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full bg-[#5B4A70] hover:bg-[#4C3D5E] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg uppercase tracking-wider text-xs"
                  >
                    SUBMIT RSVP
                  </button>
                </form>
              </div>
            ) : (
              /* RSVP Guest List View */
              <div className="bg-white border border-[#E9E4ED] rounded-[2rem] shadow-xl p-8 md:p-12 w-full max-w-xl">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#8C7B9E] font-medium text-center mb-6">
                  ATTENDING GUESTS
                </p>
                <div className="divide-y divide-[#ECE8F0] max-h-[400px] overflow-y-auto pr-2">
                  {rsvps.map((rsvp, idx) => (
                    <div key={idx} className="py-4 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-[#5B4A70] text-base">{rsvp.name}</h4>
                        <p className="text-xs text-[#8C7B9E]">{rsvp.place}</p>
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
          <section className="relative w-full py-24 px-4 bg-[#FAF7F5] flex flex-col items-center justify-center text-center">
            {/* Elegant logo/motif */}
            <div className="mb-6 text-[#533E60] opacity-80">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#533E60] mb-8">
              With Love & Gratitude
            </h2>

            {/* Paragraphs */}
            <div className="max-w-2xl mx-auto space-y-6 text-[#6E5A78] text-base md:text-lg leading-relaxed px-4">
              <p>
                We sincerely thank you for sharing in our joy and for your warm wishes and prayers. Your presence in our lives means the world to us.
              </p>
              <p className="font-medium">
                May Allah bless you all.
              </p>
            </div>

            {/* Regards block */}
            <div className="mt-16">
              <p className="text-[10px] tracking-[0.25em] text-[#9E8CA6] uppercase font-bold mb-6">
                REGARDS FAMILIES OF:
              </p>
              <div className="space-y-4 font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl text-[#735F7E]">
                 <p>Hayyan & Hani</p>
                 <p>Hezlin & Hiyam</p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: SEND YOUR BLESSINGS (GUEST BOOK) */}
          {/* ========================================================================= */}
          <section className="relative w-full py-24 px-4 bg-gradient-to-b from-[#5E4E73] to-[#4D3F5E] flex flex-col items-center justify-center text-white">
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
        </div>
      )}

      {/* Background Audio Element */}
      <audio ref={audioRef} src="/wedd.mp3" loop />

      {/* Floating Audio Play/Pause Button */}
      {showDetails && (
        <button
          onClick={togglePlay}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-purple-900/90 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-purple-300/50 backdrop-blur-sm group"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 w-6 h-6 pb-0.5">
              <span className="w-1 bg-purple-300 rounded-full animate-music-wave-1"></span>
              <span className="w-1 bg-purple-200 rounded-full animate-music-wave-2"></span>
              <span className="w-1 bg-purple-300 rounded-full animate-music-wave-3"></span>
              <span className="w-1 bg-purple-100 rounded-full animate-music-wave-4"></span>
            </div>
          ) : (
            <svg className="w-6 h-6 fill-current text-purple-200 ml-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
