import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function AuthChoice() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const clientCardRef = useRef(null);
  const freelancerCardRef = useRef(null);

  useEffect(() => {
    // GSAP animations for entry from bottom - smooth and slow for premium feel
    gsap.fromTo(clientCardRef.current, { y: "100vh", opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.6 });
    gsap.fromTo(freelancerCardRef.current, { y: "100vh", opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.8 });
  }, []);

  const handleCardClick = (role) => {
    setSelectedRole(role);
    if (role === 'client') {
      gsap.to(clientCardRef.current, { y: "100vh", opacity: 0, duration: 0.8, ease: "power3.inOut" });
    } else {
      gsap.to(freelancerCardRef.current, { y: "100vh", opacity: 0, duration: 0.8, ease: "power3.inOut" });
    }
    setTimeout(() => {
      navigate(`/login?role=${role}`);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "tween", ease: "anticipate", duration: 0.8 }}
    >
      <Navbar />
      <AnimatePresence>
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="relative z-10 text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to LocalLance
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-12 text-purple-100 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect with local talent or find your next project. Choose your role to get started.
            </motion.p>

            <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
              <div
                ref={clientCardRef}
                className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleCardClick('client')}
              >
                <div className="text-6xl mb-4">👔</div>
                <h3 className="text-2xl font-bold mb-4">I'm a Client</h3>
                <p className="text-purple-100 mb-6">Find and hire skilled freelancers for your projects</p>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-blue-600 group-hover:to-indigo-700 transition-all">
                  Get Started as Client
                </div>
              </div>

              <div
                ref={freelancerCardRef}
                className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleCardClick('freelancer')}
              >
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-2xl font-bold mb-4">I'm a Freelancer</h3>
                <p className="text-purple-100 mb-6">Showcase your skills and find exciting opportunities</p>
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-emerald-600 group-hover:to-green-700 transition-all">
                  Get Started as Freelancer
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
