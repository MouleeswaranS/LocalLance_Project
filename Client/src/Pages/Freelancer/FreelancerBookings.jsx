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
  `${import.meta.env.VITE_API_URL}/api/bookings/freelancer/my-bookings`,
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
  `${import.meta.env.VITE_API_URL}/api/bookings/update/${bookingId}`,
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar role="freelancer" />
      <div className="mx-auto w-full max-w-7xl flex-grow px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">My Bookings</h1>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center shadow">
            <p className="text-xl text-gray-600">No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
             {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-gray-100 text-sm text-gray-700 uppercase">
                  <tr>
                    <th className="border-b p-4">Client</th>
                    <th className="border-b p-4">Service</th>
                    <th className="border-b p-4">Date & Time</th>
                    <th className="border-b p-4">Price</th>
                    <th className="border-b p-4">Status</th>
                    <th className="border-b p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody ref={containerRef} className="text-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b transition-colors last:border-0 hover:bg-gray-50">
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
                                className="rounded bg-green-500 px-3 py-1 text-sm text-white transition hover:bg-green-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                className="rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                             <button
                               onClick={() => handleStatusUpdate(booking._id, "completed")}
                               className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600"
                             >
                               Mark Complete
                             </button>
                          )}
                          {(booking.status === "completed" || booking.status === "cancelled") && (
                            <span className="text-sm text-gray-400 italic">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
                {bookings.map(booking => (
                    <div key={booking._id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold">{booking.service}</h3>
                                <p className="text-sm text-gray-600">{booking.clientId?.name || "Client"}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                        </div>
                        <div className="mb-4 text-sm text-gray-600">
                             <p>📅 {booking.date} at {booking.time}</p>
                             <p className="mt-1 font-semibold text-green-600">₹{booking.price}</p>
                        </div>
                        <div className="flex gap-2">
                           {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                  className="flex-1 rounded bg-green-500 py-2 text-sm text-white shadow"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                  className="flex-1 rounded bg-red-500 py-2 text-sm text-white shadow"
                                >
                                  Reject
                                </button>
                              </>
                           )}
                           {booking.status === "confirmed" && (
                               <button
                                 onClick={() => handleStatusUpdate(booking._id, "completed")}
                                 className="flex-1 rounded bg-blue-500 py-2 text-sm text-white shadow"
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
