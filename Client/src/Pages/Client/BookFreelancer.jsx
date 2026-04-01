import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Swal from "sweetalert2";

export default function BookFreelancer() {
  // ✅ FIX: route param is "id", not "freelancerId"
  const { id: freelancerId } = useParams();
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: ""
  });

  // Fetch freelancer data
  useEffect(() => {
    const fetchFreelancer = async () => {
     try {
  setDataLoading(true);
  const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/freelancers/${freelancerId}`
);
  setFreelancer(response.data);
} catch (error) {
        console.error("Error fetching freelancer:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load freelancer details",
          icon: "error"
        });
        navigate("/client/browse");
      } finally {
        setDataLoading(false);
      }
    };

    fetchFreelancer();
  }, [freelancerId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.date) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a date",
        icon: "warning"
      });
      return false;
    }

    if (!formData.time) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a time",
        icon: "warning"
      });
      return false;
    }

    if (!formData.address.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter an address",
        icon: "warning"
      });
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Swal.fire({
        title: "Invalid Date",
        text: "Please select a future date",
        icon: "warning"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a service",
        icon: "warning",
        confirmButtonText: "Login"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        freelancerId,
        freelancerName: freelancer?.name || "",
        freelancerImage: freelancer?.image || "",
        service: (freelancer?.services && freelancer.services.length) ? (typeof freelancer.services[0] === 'string' ? freelancer.services[0] : freelancer.services[0].name) : "",
        date: formData.date,
        time: formData.time,
        address: formData.address,
        location: formData.address,
        price: freelancer?.price || 0
      };

      await axios.post(
  `${import.meta.env.VITE_API_URL}/api/bookings/create`,
  bookingData,  
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Your booking has been created successfully",
        icon: "success",
        confirmButtonText: "View My Bookings"
      }).then(() => {
        navigate("/client/bookings");
      });
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to create booking. Please try again.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Freelancer not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="client" />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-24 text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-indigo-500 to-purple-700 opacity-20 blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 ref={titleRef} className="mb-4 text-4xl font-bold md:text-5xl">
              Book {freelancer.name}
            </h1>
            <p className="mb-8 text-xl text-blue-100">
              Schedule your service appointment
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div ref={formRef} className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-8">

            {/* Freelancer Info */}
            <div className="mb-8 flex items-center rounded-lg bg-gray-50 p-6">
              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="mr-6 h-20 w-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {freelancer.name}
                </h2>
                <p className="mb-2 text-lg text-gray-600">
                  {freelancer.services && freelancer.services.length > 0 ? (typeof freelancer.services[0] === 'string' ? freelancer.services[0] : freelancer.services[0].name) : 'No service'}
                </p>
                <p className="mb-2 text-gray-500">{freelancer.address}</p>
                <div className="flex items-center">
                  <span className="text-lg text-yellow-400">⭐</span>
                  <span className="ml-1 font-medium text-gray-700">
                    {freelancer.rating}
                  </span>
                  <span className="ml-1 text-gray-500">
                    ({freelancer.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {freelancer.price}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="mb-2 block text-sm font-medium text-gray-700">
                    Select Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                  Service Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter the complete address where the service will be provided"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? "Creating Booking..." : "Confirm Booking"}
                </button>
                <Link
                  to={`/client/freelancer/${freelancerId}`}
                  state={{ freelancer, from: "book" }}
                  className="flex-1 rounded-lg bg-gray-200 px-6 py-3 text-center font-semibold text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Back to Profile
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
