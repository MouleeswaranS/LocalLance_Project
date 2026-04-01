import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../Components/Navbar";
import { showSuccessMessage } from "../Components/SweetMessage";
import { gsap } from "gsap";
import axios from "axios";

export default function Signup() {
  const [params] = useSearchParams();
  const role = params.get("role") || "client";
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Premium GSAP entry animation
    const tl = gsap.timeline();

    // Set initial states for premium animation
    gsap.set(formRef.current, { opacity: 0, scale: 0.3, rotationX: -90 });

    // Premium entry with morphing effect
    tl.to(formRef.current, {
      opacity: 1,
      scale: 1,
      rotationX: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        name,
        email,
        password,
        role,
        service: role === "freelancer" ? service : undefined,
      }
    );

      showSuccessMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);
      setTimeout(() => {
        navigate(role === "client" ? "/client/dashboard" : "/freelancer/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen flex items-center justify-center ${
          role === "client"
            ? "bg-gradient-to-br from-blue-600 to-indigo-700"
            : "bg-gradient-to-br from-green-600 to-emerald-700"
        } text-white pt-20 relative overflow-hidden`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div ref={formRef} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-6 text-center capitalize">
            {role} Signup
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none placeholder-gray-200"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none placeholder-gray-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none placeholder-gray-200"
            required
          />

          {role === "freelancer" && (
            <input
              type="text"
              placeholder="Service Category (e.g., Plumber, Electrician)"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none placeholder-gray-200"
              required
            />
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-white text-gray-900 font-semibold p-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : `Create ${role} Account`}
          </button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link
              to={`/login?role=${role}`}
              className="text-yellow-300 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

    </>
  );
}
