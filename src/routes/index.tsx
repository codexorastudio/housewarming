import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useState, useRef, useEffect } from "react";
import { Petals } from "@/components/wedding/Petals";
import { Ornament } from "@/components/wedding/Ornament";
import { Countdown } from "@/components/wedding/Countdown";
import { RsvpForm } from "@/components/wedding/RsvpForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Baptism & Housewarming — Nathania Justin & Family" },
      {
        name: "description",
        content:
          "You are invited to the joyous celebration of the Baptism of Nathania Justin & Housewarming of Our New Home. Saturday, 12 September 2026, 9 AM at St George Cathedral Church, Kothamangalam.",
      },
      { property: "og:title", content: "Baptism of Nathania Justin & Housewarming of Our New Home" },
      {
        property: "og:description",
        content: "Join us as we celebrate these two beautiful blessings on Saturday, 12 September 2026 at St George Cathedral Church, Kothamangalam.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://nathaniajustin.vercel.app/images/og-preview.jpg" },
      { property: "og:image:secure_url", content: "https://nathaniajustin.vercel.app/images/og-preview.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Baptism of Nathania Justin & Housewarming of Our New Home" },
      { name: "twitter:description", content: "Join us as we celebrate these two beautiful blessings on Saturday, 12 September 2026 at St George Cathedral Church, Kothamangalam." },
      { name: "twitter:image", content: "https://nathaniajustin.vercel.app/images/og-preview.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Pinyon+Script&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: CelebrationApp,
});

const galleryImgs = [
  { src: "/images/img5.jpg", alt: "Nathania Justin — Holy Baptism Blessing", cls: "col-span-2 row-span-2" },
  { src: "/images/img1.jpg", alt: "Our New Home — Housewarming Blessing", cls: "col-span-1 row-span-1" },
  { src: "/images/img2.jpg", alt: "Darling Nathania Justin", cls: "col-span-1 row-span-1" },
  { src: "/images/img3.jpg", alt: "Precious Moments", cls: "col-span-1 row-span-1" },
  { src: "/images/img4.jpg", alt: "God's Little Blessing", cls: "col-span-1 row-span-1" },
];

function CelebrationApp() {
  const [showIntro, setShowIntro] = useState(true);
  const [isFaded, setIsFaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const introVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isCompletedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowIntro(false);
      
      const startAudioOnInteraction = () => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => console.log("Autoplay blocked:", err));
        }
        window.removeEventListener("click", startAudioOnInteraction);
        window.removeEventListener("touchstart", startAudioOnInteraction);
        window.removeEventListener("pointerdown", startAudioOnInteraction);
        window.removeEventListener("keydown", startAudioOnInteraction);
        window.removeEventListener("scroll", startAudioOnInteraction);
      };
      
      window.addEventListener("click", startAudioOnInteraction);
      window.addEventListener("touchstart", startAudioOnInteraction);
      window.addEventListener("pointerdown", startAudioOnInteraction);
      window.addEventListener("keydown", startAudioOnInteraction);
      window.addEventListener("scroll", startAudioOnInteraction);
      
      return () => {
        window.removeEventListener("click", startAudioOnInteraction);
        window.removeEventListener("touchstart", startAudioOnInteraction);
        window.removeEventListener("pointerdown", startAudioOnInteraction);
        window.removeEventListener("keydown", startAudioOnInteraction);
        window.removeEventListener("scroll", startAudioOnInteraction);
      };
    }
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImgs.length) % galleryImgs.length : null));
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImgs.length : null));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handleComplete = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setIsFaded(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 1500);
  };

  const handleTimeUpdate = () => {
    const video = introVideoRef.current;
    if (video && video.duration && video.currentTime > 1 && video.duration - video.currentTime <= 0.5) {
      handleComplete();
    }
  };

  const handleIntroClick = () => {
    const video = introVideoRef.current;
    const audio = audioRef.current;

    if (!isPlaying && video) {
      setIsPlaying(true);
      video.play().catch((err) => {
        console.error("Play failed:", err);
      });
      if (audio) {
        audio.play().catch((err) => {
          console.error("Audio play failed:", err);
        });
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
      <Toaster position="top-center" richColors />
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
        preload="none"
        muted={isMuted}
      />
      {showIntro && (
        <div
          id="intro-screen"
          onClick={handleIntroClick}
          onTouchStart={(e) => {
            e.preventDefault();
            handleIntroClick();
          }}
          className={`fixed inset-0 z-50 cursor-pointer md:hidden pointer-events-${isFaded ? "none" : "auto"}`}
          style={{
            backgroundColor: "#f6f4f2",
            transition: "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: isFaded ? 0 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div 
            className="relative w-full h-full md:h-[85vh] md:max-w-[480px] md:rounded-sm md:overflow-hidden md:shadow-[0_20px_60px_rgba(0,0,0,0.65)] md:border-4 md:border-double md:border-sand/35 transition-all duration-300"
            style={{
              aspectRatio: "9/16",
            }}
          >
            <video
              id="intro-video"
              ref={introVideoRef}
              src="/intro-video.mp4#t=0.1"
              muted
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              onLoadedMetadata={(e) => {
                e.currentTarget.currentTime = 0.1;
              }}
              onLoadedData={(e) => {
                e.currentTarget.currentTime = 0.1;
              }}
              className="w-full h-full object-cover"
              style={{
                transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isFaded ? "scale(1.05)" : "scale(1)",
              }}
            />
          </div>
        </div>
      )}
      <HeroVideo />
      <WelcomeMessageSection onOpenLightbox={(idx) => setLightboxIndex(idx)} />
      <CountdownSection />
      <Gallery onOpenLightbox={(idx) => setLightboxIndex(idx)} />
      <Venue onOpenLightbox={() => setLightboxIndex(1)} />
      <Footer />

      {/* Lightbox Modal */}
      <LightboxModal
        images={galleryImgs}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {!showIntro && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-ivory/90 text-primary backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-ivory hover:border-primary/45 shadow-[var(--shadow-soft)] cursor-pointer"
          aria-label={isMuted ? "Unmute Music" : "Mute Music"}
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <div className="flex items-end gap-[3px] h-4">
              <span className="w-[3px] bg-primary rounded-full" style={{ animation: "soundbar 0.8s ease-in-out infinite alternate" }} />
              <span className="w-[3px] bg-primary rounded-full" style={{ animation: "soundbar 0.8s ease-in-out infinite alternate", animationDelay: "0.2s" }} />
              <span className="w-[3px] bg-primary rounded-full" style={{ animation: "soundbar 0.8s ease-in-out infinite alternate", animationDelay: "0.4s" }} />
              <span className="w-[3px] bg-primary rounded-full" style={{ animation: "soundbar 0.8s ease-in-out infinite alternate", animationDelay: "0.15s" }} />
            </div>
          )}
        </button>
      )}
    </div>
  );
}

function LightboxModal({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: { src: string; alt: string }[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-up select-none"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-white/80 hover:text-white p-3 rounded-full bg-black/40 border border-white/25 transition hover:scale-110 cursor-pointer"
        aria-label="Close Lightbox"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev Arrow */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-50 text-white/80 hover:text-white p-3.5 rounded-full bg-black/40 border border-white/25 transition hover:scale-110 cursor-pointer"
          aria-label="Previous Image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Main Image View */}
      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-[78vh] object-contain rounded-sm border border-white/20 shadow-2xl"
        />
        <p className="mt-4 font-sans-ui text-sm sm:text-base text-sand tracking-widest text-center drop-shadow-md">
          {currentImage.alt}
        </p>
      </div>

      {/* Next Arrow */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-50 text-white/80 hover:text-white p-3.5 rounded-full bg-black/40 border border-white/25 transition hover:scale-110 cursor-pointer"
          aria-label="Next Image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch((err) => console.log("Hero video autoplay blocked:", err));
    };

    playVideo();

    window.addEventListener("touchstart", playVideo, { once: true });
    window.addEventListener("click", playVideo, { once: true });

    return () => {
      window.removeEventListener("touchstart", playVideo);
      window.removeEventListener("click", playVideo);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <div className="video-container absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
        <div className="overlay absolute inset-0 bg-black/45 backdrop-brightness-[0.85]" />
      </div>

      <Petals count={22} />

      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 sm:px-6 text-center text-ivory drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] py-10 sm:py-12 md:py-8">
        {/* Holy Cross */}
        <div className="animate-fade-up flex items-center gap-3 text-sand mb-3 sm:mb-4 md:mb-2">
          <span className="h-px w-8 sm:w-12 bg-sand/60" />
          <svg width="20" height="28" viewBox="0 0 24 32" fill="currentColor" className="drop-shadow-md">
            <path d="M10 0H14V9H23V13H14V32H10V13H1V9H10V0Z" />
          </svg>
          <span className="h-px w-8 sm:w-12 bg-sand/60" />
        </div>

        <p className="animate-fade-up font-sans-ui text-[11px] sm:text-[13px] uppercase tracking-[0.45em] text-ivory/95 font-medium">
          You are invited to the joyous celebration of
        </p>

        <div className="animate-fade-up mt-4 sm:mt-6 md:mt-3 flex flex-col items-center gap-1 sm:gap-2 md:gap-0.5" style={{ animationDelay: "0.2s" }}>
          <h1 className="font-display text-4xl sm:text-6xl md:text-5xl lg:text-6xl uppercase tracking-[0.2em] text-ivory font-light drop-shadow-md">
            Baptism
          </h1>
          <p className="font-sans-ui text-[11px] uppercase tracking-[0.35em] text-sand font-medium">
            OF
          </p>
          <span className="font-script text-6xl sm:text-8xl md:text-7xl lg:text-8xl text-sand my-1 md:my-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
            Nathania Justin
          </span>

          <div className="flex items-center justify-center gap-4 my-1 md:my-0 text-sand">
            <span className="font-script text-4xl sm:text-5xl md:text-4xl text-sand font-bold">&amp;</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-4xl lg:text-5xl uppercase tracking-[0.2em] text-ivory font-light drop-shadow-md">
            Housewarming
          </h2>
          <p className="font-sans-ui text-[11px] uppercase tracking-[0.35em] text-sand font-medium">
            OF OUR NEW HOME
          </p>
        </div>

        <p className="animate-fade-up mt-5 sm:mt-6 md:mt-3 max-w-xl font-body text-base sm:text-lg md:text-base italic text-ivory/90 leading-relaxed" style={{ animationDelay: "0.4s" }}>
          Please join us as we celebrate these two beautiful blessings on the same special day.
        </p>

        <div className="animate-fade-up mt-5 sm:mt-6 md:mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-sans-ui text-xs sm:text-sm uppercase tracking-[0.2em] text-sand" style={{ animationDelay: "0.6s" }}>
          <span>Saturday, 12 September 2026</span>
          <span className="hidden sm:inline text-ivory/40">•</span>
          <span>9 AM</span>
          <span className="hidden sm:inline text-ivory/40">•</span>
          <span>St George Cathedral Church, Kothamangalam</span>
        </div>

        {/* Premium Gold Glassmorphic Location Button */}
        <a
          href="#venue"
          className="animate-fade-up mt-6 sm:mt-8 md:mt-5 inline-flex items-center gap-3 rounded-full border border-sand/50 bg-black/40 backdrop-blur-md px-8 sm:px-10 py-3.5 sm:py-4 font-sans-ui text-xs sm:text-xs uppercase tracking-[0.35em] text-sand shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:bg-sand hover:text-wine-deep hover:border-sand hover:shadow-[0_8px_30px_rgba(212,175,55,0.45)] cursor-pointer group"
          style={{ animationDelay: "0.8s" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sand group-hover:text-wine-deep transition-colors duration-300"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="font-semibold">View Event Locations</span>
        </a>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-10 -translate-x-1/2 text-ivory/70 hidden sm:block">
        <div className="animate-shimmer flex flex-col items-center gap-1">
          <span className="font-sans-ui text-[9px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="h-5 w-px bg-ivory/60" />
        </div>
      </div>
    </section>
  );
}

function WelcomeMessageSection({ onOpenLightbox }: { onOpenLightbox: (index: number) => void }) {
  return (
    <section className="relative bg-background py-24 px-6 flex items-center justify-center">
      <div className="relative z-10 mx-auto w-full max-w-5xl rounded-sm border border-primary/20 bg-ivory p-8 sm:p-14 shadow-[var(--shadow-frame)] text-foreground">
        <div className="text-center mb-10">
          <Ornament label="With Praise & Gratitude" />
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-primary font-semibold">
            Two Blessings, One Memorable Day
          </h2>
          <p className="mt-4 font-body text-lg italic text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            "Every good and perfect gift is from above." With joyful hearts, we request the honour of your presence as we celebrate the Holy Baptism of our darling daughter <strong>Nathania Justin</strong> and step into <strong>Our New Home</strong> with prayers and thanksgiving.
          </p>
        </div>

        {/* Featured Dual Spotlight: Main Baby Photo & House Photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Main Baby Photo (IMG_1421.JPG.jpeg / index 0) */}
          <div
            onClick={() => onOpenLightbox(0)}
            className="group relative overflow-hidden rounded-sm border-2 border-primary/30 shadow-lg aspect-[3/4] w-full cursor-pointer"
          >
            <img
              src="/images/img5.jpg"
              alt="Nathania Justin"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white text-center">
              <p className="font-script text-3xl text-sand">Nathania Justin</p>
              <p className="font-sans-ui text-[10px] uppercase tracking-[0.3em] text-sand/80">Holy Baptism Blessing</p>
            </div>
          </div>

          {/* Main House Photo (IMG_1417.JPG.jpeg / index 1) */}
          <div
            onClick={() => onOpenLightbox(1)}
            className="group relative overflow-hidden rounded-sm border-2 border-primary/30 shadow-lg aspect-[3/4] w-full cursor-pointer"
          >
            <img
              src="/images/img1.jpg"
              alt="Our New Home"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 text-white text-center">
              <p className="font-display text-2xl text-sand">Our New Home</p>
              <p className="font-sans-ui text-[10px] uppercase tracking-[0.3em] text-sand/80">Housewarming & Blessing</p>
            </div>
          </div>
        </div>

        <div className="mt-10 ornament-divider text-primary">
          <span className="ornament-line" />
          <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
            <circle cx="16" cy="16" r="2" />
          </svg>
          <span className="ornament-line" />
        </div>

        <div className="text-center mt-6">
          <p className="font-script text-3xl sm:text-4xl text-primary leading-relaxed">
            "As for me and my house, we will serve the Lord."
          </p>
          <p className="mt-2 font-sans-ui text-xs uppercase tracking-[0.3em] text-primary/70 font-semibold">
            — Joshua 24:15
          </p>
        </div>
      </div>
    </section>
  );
}



function EventCalendar() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  // September 2026 starts on Tuesday (index 2)
  const calendarCells = [
    null, null, // Sun, Mon
    1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12, // 12 is Saturday (Event day)
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30
  ];

  return (
    <div className="w-[300px] sm:w-[340px] bg-ivory text-primary p-6 sm:p-8 rounded-sm shadow-[var(--shadow-frame)] border border-sand/30 flex flex-col items-center select-none">
      <h3 className="font-script text-4xl sm:text-5xl text-primary mb-4">
        September 2026
      </h3>
      
      <div className="grid grid-cols-7 gap-2 w-full text-center border-b border-primary/20 pb-2 mb-2">
        {daysOfWeek.map((day, idx) => (
          <span key={idx} className="font-sans-ui text-[10px] sm:text-xs uppercase tracking-wider text-primary/75 font-semibold">
            {day}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 gap-x-2 w-full text-center">
        {calendarCells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="aspect-square" />;
          }
          
          if (day === 12) {
            return (
              <div key={idx} className="relative flex items-center justify-center aspect-square">
                <svg className="absolute w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] text-wine fill-current drop-shadow-sm animate-pulse" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="relative z-10 text-white font-sans-ui text-[12px] sm:text-[14px] font-bold">
                  12
                </span>
              </div>
            );
          }
          
          return (
            <div key={idx} className="flex items-center justify-center aspect-square font-sans-ui text-[12px] sm:text-[14px] text-foreground/80 hover:text-primary transition-colors cursor-default">
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CountdownSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-shrink-0 animate-fade-in order-2 lg:order-1">
            <EventCalendar />
          </div>
          
          <div className="flex-grow text-center lg:text-left order-1 lg:order-2">
            <p className="font-sans-ui text-[10px] uppercase tracking-[0.5em] text-primary-foreground/70">
              Counting Down to the Special Day
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-white">Until We Celebrate Together</h2>
            <div className="mt-10">
              <Countdown />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



function Gallery({ onOpenLightbox }: { onOpenLightbox: (index: number) => void }) {
  return (
    <section id="gallery" className="bg-secondary py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Ornament label="Memories & Our Home" />
        <h2 className="font-display text-5xl text-primary sm:text-6xl">Photo Gallery</h2>
        <p className="mx-auto mt-4 max-w-md font-body italic text-foreground/75">
          Glimpses of our new home and family moments.
        </p>
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 md:grid-cols-4 gap-4 px-6 auto-rows-[200px] sm:auto-rows-[250px]">
        {galleryImgs.map((g, i) => (
          <figure
            key={i}
            onClick={() => onOpenLightbox(i)}
            className={`group relative overflow-hidden rounded-sm border border-primary/20 shadow-[var(--shadow-soft)] cursor-pointer ${g.cls}`}
          >
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs sm:text-sm font-sans-ui tracking-wider drop-shadow-sm opacity-0 group-hover:opacity-100 transition duration-300">
              {g.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Venue({ onOpenLightbox }: { onOpenLightbox: (index: number) => void }) {
  return (
    <section id="venue" className="relative bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <Ornament label="Locations" />
          <h2 className="font-display text-5xl text-primary sm:text-6xl">Event Venues</h2>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {/* Main House Photo with Clickable Lightbox */}
          <div
            onClick={() => onOpenLightbox(1)}
            className="group relative overflow-hidden rounded-sm border border-primary/20 shadow-[var(--shadow-frame)] h-80 sm:h-auto cursor-pointer"
          >
            <img src="/images/img1.jpg" alt="Our New Home" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </div>

          <div className="flex flex-col justify-center gap-8">
            <VenueCard
              title="St. George Cathedral Church"
              subtitle="Holy Baptism Ceremony · 9:00 AM"
              address="Kothamangalam, Ernakulam, Kerala"
              maps="https://maps.app.goo.gl/T9LWqPHC91TW5ba56?g_st=iw"
            />
            <VenueCard
              title="Our New Home"
              subtitle="Housewarming & Lunch · 11:00 AM onwards"
              address="Kothamangalam, Ernakulam, Kerala"
              maps="https://maps.app.goo.gl/Hay1kzEVJ8hp1fXK9"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function VenueCard({
  title, subtitle, address, maps,
}: { title: string; subtitle: string; address: string; maps: string }) {
  return (
    <article className="relative rounded-sm border border-primary/25 bg-ivory p-8 backdrop-blur-sm shadow-[var(--shadow-soft)]">
      <p className="font-sans-ui text-xs uppercase tracking-[0.3em] font-bold text-primary/70">
        {subtitle}
      </p>
      <h3 className="mt-2 font-display text-3xl text-primary font-semibold">{title}</h3>
      <p className="mt-3 font-body text-lg italic text-foreground/75">{address}</p>
      <a
        href={maps}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 border-b border-primary pb-1 font-sans-ui text-[11px] uppercase tracking-[0.35em] text-primary font-semibold transition hover:opacity-75"
      >
        Open in Maps →
      </a>
    </article>
  );
}




function Footer() {
  const whatsappUrl =
    "https://wa.me/919747647421?text=" +
    encodeURIComponent(
      "Hi! I loved this website design and would like to create one like this."
    );

  return (
    <footer className="bg-primary py-16 text-center text-primary-foreground border-t border-sand/20">
      <p className="font-display text-3xl uppercase tracking-widest text-sand">
        Baptism &amp; Housewarming
      </p>
      <p className="mt-2 font-script text-5xl text-sand">
        Nathania Justin &amp; Family
      </p>
      <p className="mt-4 font-sans-ui text-[12px] uppercase tracking-[0.5em] text-primary-foreground/80">
        12 · 09 · 2026
      </p>
      <div className="ornament-divider mt-6 text-primary-foreground">
        <span className="ornament-line" style={{ background: "linear-gradient(90deg, transparent, currentColor, transparent)" }} />
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="2" /></svg>
        <span className="ornament-line" style={{ background: "linear-gradient(90deg, transparent, currentColor, transparent)" }} />
      </div>
      <p className="mt-6 font-script text-2xl sm:text-3xl text-sand/90 px-4 max-w-xl mx-auto">
        "Your love, blessings and presence will make this day even more special."
      </p>

      {/* GRANDPIX Branding & WhatsApp Direct Inquiry Link */}
      <div className="mt-14 pt-8 border-t border-sand/15 flex flex-col items-center justify-center">
        <p className="font-sans-ui text-[10px] uppercase tracking-[0.35em] text-sand/70 mb-3">
          Designed &amp; Crafted by
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105 cursor-pointer"
          title="Contact Grandpix on WhatsApp to build your website"
        >
          <img
            src="/images/grandpix-logo.png"
            alt="GRANDPIX Logo"
            className="h-12 sm:h-14 w-auto object-contain drop-shadow-md transition duration-300 group-hover:brightness-110"
          />
          <span className="font-sans-ui text-[11px] uppercase tracking-[0.25em] text-sand/90 group-hover:text-sand border-b border-sand/40 pb-0.5 transition-colors">
            Contact on WhatsApp →
          </span>
        </a>
      </div>
    </footer>
  );
}
