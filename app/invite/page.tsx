'use client';

import { useState, useEffect } from 'react';

export default function InviteGenerator() {
  const [guestName, setGuestName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Get the base URL (e.g., http://localhost:3000 or https://yourdomain.com)
    setBaseUrl(window.location.origin);
  }, []);

  // Generate the full link with the guest name
  const generatedLink = guestName.trim()
    ? `${baseUrl}/?name=${encodeURIComponent(guestName.trim())}`
    : baseUrl;

  // Generate the WhatsApp message template
  const messageTemplate = `Assalamu Alaikum *${guestName.trim() || '[Guest Name]'}*! ✨ We cordially invite you to the wedding ceremony of Fayez & Hasna.\n\nPlease click here to view your personalized invitation and RSVP: ${generatedLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!guestName.trim()) {
      alert("Please enter a guest name first.");
      return;
    }
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messageTemplate)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#5D4874] font-body flex flex-col items-center justify-center p-6 bg-grain selection:bg-[#5D4874] selection:text-white">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <div className="relative z-10 w-full max-w-2xl bg-white border border-[#E9E4ED] rounded-[2rem] shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#5D4874] text-white p-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FFF9F5]/80 font-medium mb-3">
            INVITATION GENERATOR
          </p>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-great-vibes)]">
            Create Custom Invite
          </h1>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          {/* Guest Name Input */}
          <div className="space-y-3">
            <label htmlFor="guestName" className="block text-xs uppercase tracking-[0.15em] text-[#8469A3] font-semibold">
              Guest Name
            </label>
            <input
              id="guestName"
              type="text"
              placeholder="e.g. Uncle John & Family"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-[#ECE8F0] focus:border-[#5D4874] focus:ring-1 focus:ring-[#5D4874] outline-none text-[#5D4874] bg-[#FAF8FB] transition-all text-sm"
            />
          </div>

          {/* Generated Link Preview */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.15em] text-[#8469A3] font-semibold">
              Personalized Link
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#FAF8FB] border border-[#ECE8F0] rounded-2xl px-6 py-4 overflow-x-auto text-sm text-[#8469A3] whitespace-nowrap">
                {generatedLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="shrink-0 bg-[#E9E4ED] hover:bg-[#8469A3] text-[#5D4874] hover:text-white px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-sm shadow-sm"
                title="Copy Link"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.15em] text-[#8469A3] font-semibold flex justify-between items-center">
              <span>Message Preview</span>
            </label>
            <textarea
              readOnly
              value={messageTemplate}
              rows={5}
              className="w-full px-6 py-4 rounded-2xl border border-[#ECE8F0] outline-none text-[#5D4874] bg-[#FAF8FB] transition-all text-sm resize-none whitespace-pre-wrap"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={handleSendWhatsApp}
              disabled={!guestName.trim()}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 shadow-md uppercase tracking-wider text-xs font-bold ${
                guestName.trim()
                  ? 'bg-[#25D366] hover:bg-[#128C7E] text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Send via WhatsApp
            </button>
          </div>
          
          <div className="text-center mt-6">
             <a href="/" className="text-xs uppercase tracking-[0.1em] text-[#8469A3] hover:text-[#5D4874] underline underline-offset-4 transition-colors">
               Back to Invitation
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}
