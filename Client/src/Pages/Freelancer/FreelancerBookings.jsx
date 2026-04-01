import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Swal from "sweetalert2";
import { gsap } from "gsap";

export default function FreelancerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `/api/bookings/freelancer/my-bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Swal.fire("Error", "Could not load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/bookings/update/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic update
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );

      Swal.fire("Success", `Booking ${newStatus} successfully!`, "success");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update booking status.", "error");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Simple entry animation
  useEffect(() => {
    if (!loading && bookings.length > 0 && containerRef.current) {
        gsap.fromTo(
            containerRef.current.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
        );
    }
  }, [loading, bookings]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmed</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pending</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Completed</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar role="freelancer" />
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">No bookings found.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
             {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="p-4 border-b">Client</th>
                    <th className="p-4 border-b">Service</th>
                    <th className="p-4 border-b">Date & Time</th>
                    <th className="p-4 border-b">Price</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody ref={containerRef} className="text-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{booking.clientId?.name || booking.clientName || "Client"}</div>
                        <div className="text-xs text-gray-500">{booking.clientId?.email}</div>
                      </td>
                      <td className="p-4">{booking.service}</td>
                      <td className="p-4 text-sm">
                        <div>{booking.date}</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </td>
                      <td className="p-4 font-bold text-green-600">₹{booking.price}</td>
                      <td className="p-4">{getStatusBadge(booking.status)}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                             <button
                               onClick={() => handleStatusUpdate(booking._id, "completed")}
                               className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                             >
                               Mark Complete
                             </button>
                          )}
                          {(booking.status === "completed" || booking.status === "cancelled") && (
                            <span className="text-gray-400 text-sm italic">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
                {bookings.map(booking => (
                    <div key={booking._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg">{booking.service}</h3>
                                <p className="text-sm text-gray-600">{booking.clientId?.name || "Client"}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                             <p>📅 {booking.date} at {booking.time}</p>
                             <p className="font-semibold text-green-600 mt-1">₹{booking.price}</p>
                        </div>
                        <div className="flex gap-2">
                           {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                  className="flex-1 bg-green-500 text-white py-2 rounded shadow text-sm"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                  className="flex-1 bg-red-500 text-white py-2 rounded shadow text-sm"
                                >
                                  Reject
                                </button>
                              </>
                           )}
                           {booking.status === "confirmed" && (
                               <button
                                 onClick={() => handleStatusUpdate(booking._id, "completed")}
                                 className="flex-1 bg-blue-500 text-white py-2 rounded shadow text-sm"
                               >
                                 Mark Complete
                               </button>
                           )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
