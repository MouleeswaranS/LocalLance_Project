import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function FreelancerDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeServices: 0,
    completedBookings: 0,
    earnings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // GSAP Refs
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const bookingsRef = useRef(null);
  const bookingCardsRef = useRef([]);
  const actionsRef = useRef(null);
  const actionCardsRef = useRef([]);

  // store the resolved userId so we can reuse
  const userIdRef = useRef(null);

  // Helper to get safe user id from localStorage
  const resolveUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return null;
      return user.id ?? user._id ?? user.userId ?? null;
    } catch (e) {
      return null;
    }
  };

  // FETCH DASHBOARD DATA (resilient route handling)
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Dashboard Stats (using "me" endpoint)
      const dashboardRes = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/freelancers/dashboard/me`,
  {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = dashboardRes?.data ?? {};

      const normalizedStats = {
        totalBookings:
          data.totalBookings ?? data.stats?.totalBookings ?? data.total ?? 0,
        activeServices:
          data.activeServices ?? data.stats?.activeBookings ?? 0,
        completedBookings:
          data.completedBookings ?? data.stats?.completedBookings ?? 0,
        earnings:
          data.totalEarnings ?? data.stats?.totalEarnings ?? data.earnings ?? 0,
      };

      setStats(normalizedStats);

      const normalizedRecent =
        data.recentBookings ?? data.recent ?? data.bookings ?? data.recentBookingsData ?? [];
      setRecentBookings(Array.isArray(normalizedRecent) ? normalizedRecent : []);

      // 2. Fetch Freelancer Profile for Services (using "me" endpoint)
      let freelancerRes = null;
      try {
        freelancerRes = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/freelancers/profile/me`,
  {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        // fail silently if profile load fails separate from dashboard
        console.warn("Profile load failed", err);
      }

      const freelancerServices = freelancerRes?.data?.services ?? [];
      const priceFromProfile = freelancerRes?.data?.price ?? "₹299";
      const ratingFromProfile = freelancerRes?.data?.rating ?? 4.5; // fallback if individual service has no rating

      const formattedServices = freelancerServices.map((s, index) => {
         // handle both old string array and new object array
         if (typeof s === 'string') {
             return {
                 id: index,
                 name: s,
                 icon: "🛠️",
                 description: `${s} services`,
                 price: priceFromProfile,
                 rating: ratingFromProfile,
                 bookings: 0
             };
         }
         return {
             id: s._id || index,
             name: s.name,
             icon: "🛠️",
             description: s.description,
             price: s.price,
             rating: s.rating || 0,
             bookings: s.bookings || 0
         };
      });

      setServices(formattedServices);
    } catch (error) {
      console.error("Dashboard error:", error);
      // Friendly error for user
      Swal.fire("Error", "Failed to load dashboard. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // initial fetch + start polling for "near real-time" updates
  useEffect(() => {
    fetchDashboardData();

    // start polling every 15s for near real-time updates (only if logged in)
    const token = localStorage.getItem("token");
    const userId = resolveUserId();
    if (token && userId) {
      userIdRef.current = userId;
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 15000); // 15s

      return () => clearInterval(interval);
    }
    // no cleanup needed if polling wasn't started
  }, []); // run once on mount

  // GSAP Animations — run after DOM is ready and after data loaded (so refs exist)
  useEffect(() => {
    if (loading) return; // wait for data to be ready

    // Ensure refs exist
    if (!titleRef.current || !subtitleRef.current || !statsRef.current) return;

    const tl = gsap.timeline();

    gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: 50 });
    // statsRef.current.children might be HTMLCollection; handle gracefully
    if (statsRef.current.children) {
      gsap.set(statsRef.current.children, { opacity: 0, y: 30, scale: 0.9 });
    }

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    })
      .to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
        "-=0.9"
      )
      .to(
        statsRef.current.children,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
        },
        "-=0.6"
      );

    // Animate service cards on scroll
    serviceCardsRef.current
      .filter(Boolean)
      .forEach((card, index) => {
        const column = index % 3;
        let initialProps = { opacity: 0, scale: 0.9 };
        if (column === 0) initialProps.x = -80;
        else if (column === 1) initialProps.y = -80;
        else initialProps.x = 80;

        gsap.set(card, initialProps);

        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          animation: gsap.to(card, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: (index % 3) * 0.05,
          }),
        });
      });

    // Animate booking cards
    bookingCardsRef.current
      .filter(Boolean)
      .forEach((card, index) => {
        gsap.set(card, { opacity: 0, x: -80, scale: 0.95 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          animation: gsap.to(card, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.06,
          }),
        });
      });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill && t.kill());
    };
  }, [loading, services, recentBookings]);

  // Helper to show a fallback string for client name
  const clientNameFromBooking = (booking) => {
    if (!booking) return "Client";
    // check common shapes returned by backend:
    // 1) booking.clientId (populated object with .name)
    // 2) booking.clientName (string)
    // 3) booking.client (string)
    const fromClientId = booking.clientId?.name ?? booking.clientId?.fullName ?? null;
    const byName = fromClientId ?? booking.clientName ?? booking.client?.name ?? booking.client;
    return typeof byName === "string" && byName.length ? byName : "Client";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="freelancer" />

      {/* HERO SECTION */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4">
              Grow Your Freelance Business
            </h1>
            <p ref={subtitleRef} className="text-xl mb-8 text-purple-100">
              Manage your services, track bookings, and connect with more clients
            </p>

            {/* STATS */}
            <div
              ref={statsRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.totalBookings}</div>
                <div className="text-purple-200">Total Bookings</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.activeServices}</div>
                <div className="text-purple-200">Active Services</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">₹{stats.earnings}</div>
                <div className="text-purple-200">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div ref={servicesRef} className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
          <Link
            to="/freelancer/services"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Manage Services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services.length ? services : [{ id: "empty-1", name: "No services yet", icon: "➕", description: "Add services", price: "—", rating: 0, bookings: 0 }])
            .slice(0, 6)
            .map((service, index) => (
              <div
                key={service.id}
                ref={(el) => (serviceCardsRef.current[index] = el)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{service.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="ml-1 text-gray-700">{service.rating}</span>
                      <span className="ml-1 text-gray-500 text-sm">
                        ({service.bookings} bookings)
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{service.price}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* RECENT BOOKINGS SECTION */}
      <div ref={bookingsRef} className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Bookings</h2>
            <Link
              to="/freelancer/bookings"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.length === 0 && !loading && (
              <p className="text-center text-gray-500">No recent bookings</p>
            )}

            {recentBookings.map((booking, index) => {
              const clientName = clientNameFromBooking(booking);
              // Ensure price rendered safely
              const price =
                booking.price ?? booking.amount ?? (booking.fee ? `₹${booking.fee}` : "—");
              return (
                <div
                  key={booking._id ?? booking.id ?? index}
                  ref={(el) => (bookingCardsRef.current[index] = el)}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {booking.service ?? "Service"}
                      </h3>
                      <p className="text-gray-600 mb-2">{clientName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.date ?? "Date"} • {booking.time ?? "Time"}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 mb-2">
                        {typeof price === "number" ? `₹${price}` : price}
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (booking.status ?? "").toLowerCase() === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : (booking.status ?? "").toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status ?? "pending"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div ref={actionsRef} className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              ref={(el) => (actionCardsRef.current[0] = el)}
              to="/freelancer/services"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl text-center hover:shadow-lg"
            >
              <div className="text-4xl mb-4">➕</div>
              <h3 className="text-xl font-semibold mb-2">Add Service</h3>
              <p className="text-purple-100">Create new service offerings</p>
            </Link>

            <Link
              ref={(el) => (actionCardsRef.current[1] = el)}
              to="/freelancer/bookings"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl text-center hover:shadow-lg"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
              <p className="text-green-100">Handle client bookings & schedules</p>
            </Link>

            <div
              ref={(el) => (actionCardsRef.current[2] = el)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl text-center"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-blue-100">View earnings & performance</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
