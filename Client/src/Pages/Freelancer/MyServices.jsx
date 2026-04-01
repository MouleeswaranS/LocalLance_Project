import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Swal from "sweetalert2";

gsap.registerPlugin(ScrollTrigger);

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const servicesRef = useRef(null);
  const serviceCardsRef = useRef([]);

  const categories = [
    'Home Cleaning',
    'Plumbing',
    'Electrical Work',
    'Carpentry',
    'Painting',
    'Gardening',
    'Appliance Repair',
    'Moving Services',
    'Pet Care',
    'Tutoring',
    'Photography',
    'Event Planning'
  ];

  // Helper to get user safely
  const getUserParams = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || user?._id || user?.userId;
    return { token, userId };
  };

  const fetchServices = async () => {
    const { token } = getUserParams();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch freelancer profile using the "me" endpoint
      const response = await axios.get(`/api/freelancers/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend now returns services as an array of objects
      const fetchedServices = response.data.services || [];
      
      const normalizedServices = fetchedServices.map((s, i) => {
        if (typeof s === 'string') {
          return {
            _id: `legacy-${i}`, 
            name: s,
            description: 'Legacy service',
            price: '₹0',
            category: 'Uncategorized',
            bookings: 0,
            rating: 0
          };
        }
        return s;
      });

      setServices(normalizedServices);
      
      // Initialize form with current profile experience
      setNewService(prev => ({
        ...prev,
        experience: response.data.experience || ''
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load services. Ensure you are logged in as a freelancer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.description || !newService.price || !newService.category) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const { token } = getUserParams();
      
      const serviceToAdd = { ...newService, bookings: 0, rating: 0 };
      const updatedServices = [...services, serviceToAdd];
      
      const payload = { 
        services: updatedServices,
        experience: newService.experience // Update experience at profile level
      };

      await axios.put(`/api/freelancers/profile/me`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchServices();
      setNewService({ name: '', description: '', price: '', category: '' });

      Swal.fire({
        title: 'Success!',
        text: 'Service added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 1500
      });
    } catch (error) {
      console.error('Error adding service:', error);
      Swal.fire('Error', 'Failed to add service', 'error');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category
    });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleUpdateService = async () => {
    if (!newService.name || !newService.description || !newService.price || !newService.category) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    try {
      const { token } = getUserParams();

      const updatedServices = services.map(s => {
        if (s === editingService || s._id === editingService._id) {
           return { ...s, ...newService };
        }
        return s;
      });

      await axios.put(`/api/freelancers/profile/me`, { 
        services: updatedServices,
        experience: newService.experience // Update experience at profile level
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(updatedServices);
      setEditingService(null);
      setNewService({ name: '', description: '', price: '', category: '' });

      Swal.fire({
        title: 'Success!',
        text: 'Service updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating service:', error);
      Swal.fire('Error', 'Failed to update service', 'error');
    }
  };

  const handleDeleteService = async (serviceToDelete) => {
    const result = await Swal.fire({
      title: 'Delete Service',
      text: `Are you sure you want to delete "${serviceToDelete.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { token } = getUserParams();

        const updatedServices = services.filter(s => s !== serviceToDelete && s._id !== serviceToDelete._id);

        await axios.put(`/api/freelancers/profile/me`, { services: updatedServices }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setServices(updatedServices);

        Swal.fire({
          title: 'Deleted!',
          text: 'Service has been deleted.',
          icon: 'success',
          timer: 1500
        });
      } catch (error) {
        console.error('Error deleting service:', error);
        Swal.fire('Error', 'Failed to delete service', 'error');
      }
    }
  };

  useEffect(() => {
    fetchServices();
    window.scrollTo(0, 0);

    const entryTl = gsap.timeline();

    gsap.set(titleRef.current, {
      opacity: 0,
      scale: 0.1,
      rotationZ: -45,
      y: -100,
      skewX: -15
    });

    entryTl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      rotationZ: 0,
      y: 0,
      skewX: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Cleanup
    return () => {
      entryTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Update animations when services list changes
  useEffect(() => {
    const ctx = gsap.context(() => {
     serviceCardsRef.current.filter(Boolean).forEach((card, index) => {
        // Reset state for re-animation or new items
        gsap.set(card, { opacity: 0, scale: 0.8, x: -50 });
        
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          // simple play animation
          animation: gsap.to(card, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: (index % 3) * 0.1
          }),
        });
      });
    }, servicesRef); // Scope to container

    return () => ctx.revert();
  }, [services]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="freelancer" />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            My Services
          </h1>
          <p className="text-xl mb-8 text-purple-100">
            Manage your service offerings and pricing
          </p>
        </div>
      </div>

      {/* Add/Edit Service Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={newService.category}
              onChange={(e) => setNewService({ ...newService, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Price (e.g., ₹299)"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <input
              type="text"
              placeholder="Experience (e.g., 5 years)"
              value={newService.experience || ''}
              onChange={(e) => setNewService({ ...newService, experience: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="md:col-span-2">
              <textarea
                placeholder="Service Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={editingService ? handleUpdateService : handleAddService}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>

            {editingService && (
              <button
                onClick={() => {
                  setEditingService(null);
                  setNewService({ name: '', description: '', price: '', category: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Services List */}
        <div ref={servicesRef} className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No services added yet.</p>
              <p className="text-gray-500 mt-2">Add your first service above to get started.</p>
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service._id || index}
                ref={(el) => (serviceCardsRef.current[index] = el)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {service.category}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{service.description}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>Price: <strong className="text-green-600">{service.price}</strong></span>
                        <span>Bookings: <strong>{service.bookings || 0}</strong></span>
                        <span>Rating: <strong>{service.rating || 'N/A'} ⭐</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleEditService(service)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
