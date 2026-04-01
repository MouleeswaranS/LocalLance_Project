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
        const response = await axios.get(`/api/freelancers/${freelancerId}`);
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
        "http://localhost:5000/api/bookings/create",
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
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4">
              Book {freelancer.name}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Schedule your service appointment
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div ref={formRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">

            {/* Freelancer Info */}
            <div className="flex items-center mb-8 p-6 bg-gray-50 rounded-lg">
              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="w-20 h-20 rounded-full object-cover mr-6"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {freelancer.name}
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  {freelancer.services && freelancer.services.length > 0 ? (typeof freelancer.services[0] === 'string' ? freelancer.services[0] : freelancer.services[0].name) : 'No service'}
                </p>
                <p className="text-gray-500 mb-2">{freelancer.address}</p>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="ml-1 text-gray-700 font-medium">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter the complete address where the service will be provided"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? "Creating Booking..." : "Confirm Booking"}
                </button>
                <Link
                  to={`/client/freelancer/${freelancerId}`}
                  state={{ freelancer, from: "book" }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
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
