import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function ClientDashboard() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [bookingLoading, setBookingLoading] = useState(null);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const servicesRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const additionalServiceCardsRef = useRef([]);
  const actionsRef = useRef(null);
  const actionCardsRef = useRef([]);
  const timeoutRef = useRef(null);
  const entryTlRef = useRef(null);

  const services = [
    {
      id: 1,
      name: "Home Cleaning",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
      description: "Professional home cleaning services",
      price: "₹299",
      rating: 4.8,
      reviews: 1250,
    },
    {
      id: 2,
      name: "Plumbing",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop",
      description: "Expert plumbing repairs and installations",
      price: "₹199",
      rating: 4.7,
      reviews: 890,
    },
    {
      id: 3,
      name: "Electrical Work",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop",
      description: "Licensed electricians for all your needs",
      price: "₹249",
      rating: 4.9,
      reviews: 756,
    },
    {
      id: 4,
      name: "Carpentry",
      image:
        "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=250&fit=crop",
      description: "Custom furniture and woodwork",
      price: "₹349",
      rating: 4.6,
      reviews: 634,
    },
    {
      id: 5,
      name: "Mechanics",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop",
      description: "Professional vehicle repair and maintenance",
      price: "₹499",
      rating: 4.7,
      reviews: 756,
    },
    {
      id: 6,
      name: "Gardening",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      description: "Lawn care and garden maintenance",
      price: "₹179",
      rating: 4.5,
      reviews: 543,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill?.());

    const initAnimations = () => {
      try {
        if (titleRef.current) {
          gsap.set(titleRef.current, { opacity: 0, y: -50 });
        }
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, { opacity: 0, y: 50 });
        }
        if (searchRef.current) {
          gsap.set(searchRef.current, { opacity: 0, scale: 0.8 });
        }

        entryTlRef.current = gsap.timeline();

        if (titleRef.current) {
          entryTlRef.current.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
          });
        }

        if (subtitleRef.current) {
          entryTlRef.current.to(
            subtitleRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
            },
            "-=0.8"
          );
        }

        if (searchRef.current) {
          entryTlRef.current.to(
            searchRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 1.0,
            },
            "-=0.6"
          );
        }
      } catch (err) {
        console.warn("Hero GSAP Error:", err);
      }

      try {
        serviceCardsRef.current.forEach((card, index) => {
          if (!card) return;
          const column = index % 3;
          let props = { opacity: 0, scale: 0.8 };
          if (column === 0) props.x = -100;
          else if (column === 1) props.y = -100;
          else props.x = 100;

          gsap.set(card, props);

          ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            animation: gsap.to(card, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 1,
              delay: index * 0.1,
            }),
          });
        });
      } catch (err) {
        console.warn("Service GSAP Error:", err);
      }

      try {
        additionalServiceCardsRef.current.forEach((card, index) => {
          if (!card) return;

          const column = index % 3;
          let props = { opacity: 0, scale: 0.8 };
          if (column === 0) props.x = -100;
          else if (column === 1) props.y = -100;
          else props.x = 100;

          gsap.set(card, props);

          ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            animation: gsap.to(card, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 1,
              delay: index * 0.1,
            }),
          });
        });
      } catch (err) {
        console.warn("Additional Service GSAP Error:", err);
      }

      try {
        actionCardsRef.current.forEach((card, index) => {
          if (!card) return;

          const column = index % 3;
          let props = { opacity: 0, scale: 0.8 };
          if (column === 0) props.x = -100;
          else if (column === 1) props.y = -100;
          else props.x = 100;

          gsap.set(card, props);

          ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            animation: gsap.to(card, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 1,
              delay: index * 0.1,
            }),
          });
        });
      } catch (err) {
        console.warn("Action GSAP Error:", err);
      }
    };

    timeoutRef.current = setTimeout(initAnimations, 100);

    return () => {
      clearTimeout(timeoutRef.current);
      entryTlRef.current?.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill?.());
    };
  }, []);

  const handleQuickBook = async (service) => {
    setBookingLoading(service.id);

    try {
      navigate(
        `/client/browse?service=${encodeURIComponent(service.name)}`
      );
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="client" />

      {/* HERO */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4">
            Find Trusted Freelancers Near You
          </h1>
          <p ref={subtitleRef} className="text-xl mb-8 text-blue-100">
            Book verified professionals for all your home and business needs
          </p>

          <div ref={searchRef} className="max-w-md mx-auto">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none bg-transparent"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 text-white font-semibold">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR SERVICES */}
      <div ref={servicesRef} className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (serviceCardsRef.current[index] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>

                <div className="flex justify-between items-center my-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 font-medium">
                      {service.rating}
                    </span>
                    <span className="ml-1 text-gray-500 text-sm">
                      ({service.reviews})
                    </span>
                  </div>

                  <span className="text-2xl font-bold text-green-600">
                    {service.price}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook(service)}
                    disabled={bookingLoading === service.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg"
                  >
                    {bookingLoading === service.id ? "Booking..." : "Book Now"}
                  </button>

                  <Link
                    to={`/client/service/${encodeURIComponent(service.name)}`}
                    state={{ service }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-center rounded-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MORE SERVICES */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-12">
            More Services for You
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 7 */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[0] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop"
                alt="Bike & Car Repair"
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">Bike & Car Repair</h3>
                <p className="text-gray-600 text-sm">
                  Professional repair services
                </p>

                <div className="flex justify-between items-center my-4">
                  <span className="text-2xl text-green-600 font-bold">
                    ₹399
                  </span>
                  <span>⭐ 4.7 (1034)</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleQuickBook({
                        id: 7,
                        name: "Bike & Car Repair",
                        price: "₹399",
                      })
                    }
                    disabled={bookingLoading === 7}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg"
                  >
                    {bookingLoading === 7 ? "Booking..." : "Book Now"}
                  </button>

                  <Link
                    to={`/client/service/Bike%20&%20Car%20Repair`}
                    state={{ service: { name: "Bike & Car Repair" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* 8 */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[1] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop"
                alt="AC & Appliance Repair"
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  AC & Appliance Repair
                </h3>
                <p className="text-gray-600 text-sm">
                  Repair & maintenance services
                </p>

                <div className="flex justify-between items-center my-4">
                  <span className="text-2xl text-green-600 font-bold">
                    ₹349
                  </span>
                  <span>⭐ 4.7 (1203)</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleQuickBook({
                        id: 8,
                        name: "AC & Appliance Repair",
                        price: "₹349",
                      })
                    }
                    disabled={bookingLoading === 8}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg"
                  >
                    {bookingLoading === 8 ? "Booking..." : "Book Now"}
                  </button>

                  <Link
                    to={`/client/service/AC%20&%20Appliance%20Repair`}
                    state={{ service: { name: "AC & Appliance Repair" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* 9 */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[2] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=250&fit=crop"
                alt="Home Painting"
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">Home Painting</h3>
                <p className="text-gray-600 text-sm">
                  Interior & exterior painting
                </p>

                <div className="flex justify-between items-center my-4">
                  <span className="text-2xl text-green-600 font-bold">
                    ₹799
                  </span>
                  <span>⭐ 4.5 (756)</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleQuickBook({
                        id: 9,
                        name: "Home Painting",
                        price: "₹799",
                      })
                    }
                    disabled={bookingLoading === 9}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg"
                  >
                    {bookingLoading === 9 ? "Booking..." : "Book Now"}
                  </button>

                  <Link
                    to={`/client/service/Home%20Painting`}
                    state={{ service: { name: "Home Painting" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* 10 - FIXED BUG HERE */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[3] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
                alt="Cleaning & Pest Control"
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  Cleaning & Pest Control
                </h3>
                <p className="text-gray-600 text-sm">
                  Cleaning and pest control services
                </p>

                <div className="flex justify-between items-center my-4">
                  <span className="text-2xl text-green-600 font-bold">
                    ₹449
                  </span>
                  <span>⭐ 4.8 (1456)</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleQuickBook({
                        id: 10,
                        name: "Cleaning & Pest Control",
                        price: "₹449",
                      })
                    }
                    disabled={bookingLoading === 10}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg"
                  >
                    {bookingLoading === 10 ? "Booking..." : "Book Now"}
                  </button>

                  <Link
                    to={`/client/service/Cleaning%20&%20Pest%20Control`}
                    state={{ service: { name: "Cleaning & Pest Control" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* 11 */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[4] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=250&fit=crop"
                alt="Electronics & Gadgets"
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  Electronics & Gadgets
                </h3>
                <p className="text-gray-600 text-sm">
                  Electronic device repair
                </p>

                <div className="flex justify-between items-center my-4">
                  <span className="text-2xl text-green-600 font-bold">
                    ₹299
                  </span>
                  <span>⭐ 4.4 (634)</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleQuickBook({
                        id: 11,
                        name: "Electronics & Gadgets",
                        price: "₹299",
                      })
                    }
                    disabled={bookingLoading === 11}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg"
                  >
                    {bookingLoading === 11 ? "Booking..." : "Book Now"}
                  </button>

                  <Link
                    to={`/client/service/Electronics%20&%20Gadgets`}
                    state={{ service: { name: "Electronics & Gadgets" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/client/browse"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:scale-105 transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div ref={actionsRef} className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              ref={(el) => (actionCardsRef.current[0] = el)}
              to="/client/browse"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl text-center hover:shadow-lg"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                Browse Freelancers
              </h3>
              <p className="text-blue-100">
                Find the perfect professional
              </p>
            </Link>

            <Link
              ref={(el) => (actionCardsRef.current[1] = el)}
              to="/client/bookings"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl text-center hover:shadow-lg"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">
                My Bookings
              </h3>
              <p className="text-green-100">
                Manage your upcoming jobs
              </p>
            </Link>

            <div
              ref={(el) => (actionCardsRef.current[2] = el)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl text-center"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-purple-100">
                Get help from our team
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
