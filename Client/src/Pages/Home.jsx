import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import Logo from "../Components/Logo";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const titleLettersRef = useRef([]);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const bgElementsRef = useRef([]);
  const logoRef = useRef(null);
  const navbarRef = useRef(null);
  const cardsRef = useRef([]);

  const titleText = "LocalLance - Find Local Talent";

  useEffect(() => {
    document.title = "LocalLance - Find Local Talent";
  }, []);

  useEffect(() => {
    // Premium GSAP entry animation
    const tl = gsap.timeline();

    // Set initial states for premium animation
    gsap.set(navbarRef.current, { opacity: 0, y: -100 });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.3, rotation: -180 });
    gsap.set(titleLettersRef.current, { opacity: 0, y: 100, rotationX: -90 });
    gsap.set(subtitleRef.current, { opacity: 0, x: -50 });
    gsap.set(cardsRef.current.slice(10, 13), { opacity: 0, x: (i) => i === 0 ? -200 : i === 1 ? 0 : 200, y: i => i === 1 ? -100 : 0, scale: 0.8 });
    gsap.set(buttonRef.current, { opacity: 0, scale: 0, rotation: 360 });
    gsap.set(bgElementsRef.current, { scale: 0, opacity: 0 });

    // Background elements with morphing effect
    gsap.to(bgElementsRef.current, {
      scale: 1,
      opacity: 0.3,
      duration: 2,
      ease: "elastic.out(1, 0.3)",
      stagger: 0.3,
    });

    // Continuous background animation
    gsap.to(bgElementsRef.current, {
      x: "+=30",
      y: "+=20",
      rotation: "+=5",
      duration: 20,
      ease: "none",
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
    });

    gsap.to(bgElementsRef.current.slice(0, 3), {
      scale: 1.2,
      duration: 15,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.8,
    });

    gsap.to(bgElementsRef.current.slice(3), {
      scale: 0.8,
      duration: 12,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.6,
    });

    // Premium sequential entry
    tl.to(navbarRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)",
    })
    .to(logoRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "back.out(1.7)",
    }, "-=0.8")
    .to(titleLettersRef.current, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
    }, "-=0.9")
    .to(subtitleRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6")
    .to(cardsRef.current.slice(10, 13), {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotationY: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15,
    }, "-=0.7")
    .to(buttonRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    }, "-=0.8");

    // Enhanced hover effects
    const button = buttonRef.current;
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.1,
        rotation: 5,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    });

    return () => {
      tl.kill();
    };
  }, []);



  return (
    <div>
      {/* Home Page Navbar */}
      <nav ref={navbarRef} className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 shadow-lg z-50 border-b border-purple-700/30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-white">
          {/* Logo */}
          <Link
            to="/"
            className="hover:scale-105 transition-transform duration-300 text-white"
          >
            <Logo size="text-xl" isHomePage={true} />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/auth-choice" className="text-white hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform">
              Login
            </Link>
            <Link to="/auth-choice" className="text-white hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform">
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 text-white border-t border-purple-700/30">
            <div className="flex flex-col items-center py-6 space-y-4 font-medium">
              <Link to="/auth-choice" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 hover:bg-white/10 transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center">
                Login
              </Link>
              <Link to="/auth-choice" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 hover:bg-white/10 transition-colors duration-300 py-2 px-4 rounded-lg w-full text-center">
                Signup
              </Link>
            </div>
          </div>
        )}
      </nav>

      <motion.div
        ref={containerRef}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white text-center relative overflow-hidden pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div
            ref={(el) => (bgElementsRef.current[0] = el)}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"
          ></div>
          <div
            ref={(el) => (bgElementsRef.current[1] = el)}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl"
          ></div>
          <div
            ref={(el) => (bgElementsRef.current[2] = el)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl"
          ></div>
          <div
            ref={(el) => (bgElementsRef.current[3] = el)}
            className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl"
          ></div>
          <div
            ref={(el) => (bgElementsRef.current[4] = el)}
            className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-2xl"
          ></div>
        </div>

        <div className="relative z-10">
          {/* Logo Display */}
          <div
            ref={logoRef}
            className="mb-8 flex justify-center"
          >
            <Logo size="text-4xl sm:text-5xl md:text-6xl" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex justify-center flex-wrap">
            {titleText.split("").map((letter, index) => (
              <span
                key={index}
                ref={(el) => (titleLettersRef.current[index] = el)}
                className="inline-block"
                style={{ display: letter === " " ? "inline-block" : "inline-block", width: letter === " " ? "0.5em" : "auto" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Discover and connect with top-tier freelancers in your area. Transform your projects with expert talent at your fingertips. Whether you need a skilled tradesperson, creative professional, or technical expert, LocalLance connects you with verified local professionals who deliver quality results.
          </p>



          {/* Additional content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto px-4">
            <div
              ref={(el) => (cardsRef.current[10] = el)}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Find Local Talent</h3>
              <p className="text-purple-100">Browse through verified freelancers in your area with detailed profiles and reviews.</p>
            </div>
            <div
              ref={(el) => (cardsRef.current[11] = el)}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-purple-100">Post your project or browse services with our intuitive platform designed for speed.</p>
            </div>
            <div
              ref={(el) => (cardsRef.current[12] = el)}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Trusted</h3>
              <p className="text-purple-100">All freelancers are verified and our platform ensures safe, secure transactions.</p>
            </div>
          </div>

          <Link
            ref={buttonRef}
            to="/auth-choice"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform inline-block"
          >
            Get Started Today
          </Link>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-blue-200 rounded-full opacity-40 animate-bounce delay-500"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-purple-200 rounded-full opacity-50 animate-bounce delay-1000"></div>
      </motion.div>
    </div>
  );
}
