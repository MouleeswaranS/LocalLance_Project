import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "axios";

export default function Login() {
  const [params] = useSearchParams();
  const role = params.get("role") || "client";
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Premium GSAP entry animation
    const tl = gsap.timeline();

    // Set initial states for premium animation
    gsap.set(formRef.current, { opacity: 0, scale: 0.3, rotationY: -90 });

    // Premium entry with morphing effect
    tl.to(formRef.current, {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "client") navigate("/client/dashboard");
      else navigate("/freelancer/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
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
            {role} Login
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-gray-900 font-semibold p-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : `Login as ${role}`}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <Link
              to={`/signup?role=${role}`}
              className="text-yellow-300 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

    </>
  );
}
