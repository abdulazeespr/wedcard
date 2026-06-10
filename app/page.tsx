'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const searchParams = useSearchParams();
  const guestName = searchParams.get('name');

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
          <section className="relative w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-3xl w-full">
              <h2 className="text-5xl md:text-6xl font-light text-center mb-4 text-purple-900">
                The Itinerary
              </h2>
              <p className="text-center text-purple-600 uppercase text-sm tracking-widest mb-16">
                Sunday, July 26, 2026
              </p>

              {/* Timeline */}
              <div className="space-y-12">
                {/* Event 1 */}
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-purple-700 rounded-full"></div>
                    <div className="w-1 h-20 bg-purple-300 my-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-700 font-semibold mb-2">Grand Arrival</p>
                    <p className="text-purple-600 text-sm uppercase tracking-wider mb-2">
                     City Palace Auditorium
                    </p>
                    <p className="text-purple-900 font-semibold">10:30 AM</p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-purple-700 rounded-full"></div>
                    <div className="w-1 h-20 bg-purple-300 my-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-700 font-semibold mb-2">Ceremony</p>
                    <p className="text-purple-600 text-sm uppercase tracking-wider mb-2">
                      Welcome & Greetings
                    </p>
                    <p className="text-purple-900 font-semibold">11:00 AM</p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-purple-700 rounded-full"></div>
                    <div className="w-1 h-20 bg-purple-300 my-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-700 font-semibold mb-2">Lunch</p>
                    <p className="text-purple-600 text-sm uppercase tracking-wider mb-2">
                      Grand Lunch Feast
                    </p>
                    <p className="text-purple-900 font-semibold">12:00 PM</p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-purple-700 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-700 font-semibold mb-2">Photo Windup</p>
                    <p className="text-purple-600 text-sm uppercase tracking-wider mb-2">
                      Smiling Faces & Happy Traces 📸 ✨
                    </p>
                    <p className="text-purple-900 font-semibold">12:10 PM</p>
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

        </div>
      )}
    </div>
  );
}
