import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Swal from "sweetalert2";

gsap.registerPlugin(ScrollTrigger);

export default function FreelancerProfile() {
  const { id } = useParams();
  const location = useLocation();
  const freelancer = location.state?.freelancer;
  const from = location.state?.from;
  const [freelancerData, setFreelancerData] = useState(freelancer || null);
  const [dataLoading, setDataLoading] = useState(!freelancer);
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const profileRef = useRef(null);
  const reviewsRef = useRef(null);

  const services = [
    "Home Cleaning",
    "Plumbing",
    "Electrical Work",
    "Carpentry",
    "Mechanics",
    "Gardening",
    "AC & Appliance Repair",
    "Home Painting",
    "Cleaning & Pest Control",
    "Electronics & Gadgets"
  ];

  const locations = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Ahmedabad",
    "Pune",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Jaipur",
    "Surat"
  ];

  const names = [
    "Rajesh Kumar", "Priya Sharma", "Amit Singh", "Sneha Patel", "Vikram Rao",
    "Kavita Jain", "Arjun Mehta", "Meera Joshi", "Ravi Gupta", "Anjali Verma",
    "Suresh Reddy", "Nisha Agarwal", "Deepak Sharma", "Poonam Singh", "Manoj Yadav",
    "Rekha Nair", "Karan Kapoor", "Sunita Roy", "Vivek Tiwari", "Alisha Khan",
    "Rohit Das", "Neha Saxena", "Ajay Kumar", "Kiran Bhatia", "Sanjay Mishra",
    "Priyanka Choudhury", "Rahul Jain", "Shweta Gupta", "Ankit Sharma", "Divya Patel",
    "Ravi Sharma", "Kavita Singh", "Arjun Patel", "Meera Rao", "Ravi Jain",
    "Anjali Mehta", "Suresh Joshi", "Nisha Gupta", "Deepak Verma", "Poonam Reddy",
    "Manoj Agarwal", "Rekha Sharma", "Karan Singh", "Sunita Patel", "Vivek Rao",
    "Alisha Jain", "Rohit Mehta", "Neha Joshi", "Ajay Gupta", "Kiran Verma"
  ];

  const maleNames = [
    "Rajesh Kumar", "Amit Singh", "Vikram Rao", "Arjun Mehta", "Ravi Gupta",
    "Suresh Reddy", "Deepak Sharma", "Manoj Yadav", "Karan Kapoor", "Vivek Tiwari",
    "Rohit Das", "Ajay Kumar", "Sanjay Mishra", "Rahul Jain", "Ankit Sharma",
    "Ravi Sharma", "Arjun Patel", "Ravi Jain", "Suresh Joshi", "Deepak Verma",
    "Manoj Agarwal", "Karan Singh", "Vivek Rao", "Rohit Mehta", "Ajay Gupta"
  ];

  // Fetch freelancer data from API if not provided via state
  useEffect(() => {
    const fetchFreelancer = async () => {
      if (!freelancer && id) {
        try {
          setDataLoading(true);
          const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/freelancers/${id}`
);
          const freelancer = response.data;
          if (freelancer.services && !Array.isArray(freelancer.services)) {
            freelancer.services = Object.values(freelancer.services);
          }
          setFreelancerData(freelancer);
        } catch (error) {
          console.error('Error fetching freelancer:', error);
          // Fallback to generated data if API fails
          setFreelancerData(generateFreelancer(parseInt(id)));
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchFreelancer();
  }, [freelancer, id]);

  const generateFreelancer = (freelancerId) => {
    const service = services[Math.floor(Math.random() * services.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const gender = maleNames.includes(name) ? 'men' : 'women';
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);
    const reviews = Math.floor(Math.random() * 300) + 50;
    const price = `₹${200 + Math.floor(Math.random() * 300)}/hr`;
    const experienceYears = 3 + Math.floor(Math.random() * 8);
    const experience = `${experienceYears} years`;
    const completedJobs = Math.floor(Math.random() * 800) + 100;
    const location = locations[Math.floor(Math.random() * locations.length)];
    const imageNumber = Math.floor(Math.random() * 99) + 1;
    const image = `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`;

    return {
      id: freelancerId,
      name,
      services: [service],
      address: location,
      rating: parseFloat(rating),
      reviews,
      price,
      image,
      experience,
      completedJobs,
      description: `Professional ${service.toLowerCase()} specialist with ${experienceYears} years of experience. Committed to delivering high-quality service and customer satisfaction. Skilled in all aspects of ${service.toLowerCase()} and equipped with the latest tools and techniques.`,
      skills: [
        `${service} Expertise`,
        "Customer Service",
        "Problem Solving",
        "Time Management",
        "Quality Assurance"
      ],
      availability: "Available Mon-Sat, 9 AM - 6 PM",
      responseTime: "< 2 hours"
    };
  };

  const generateReviews = () => {
    const reviewTexts = [
      "Excellent service! Very professional and punctual.",
      "Great work quality. Would definitely recommend.",
      "Fast response and reliable. Highly satisfied.",
      "Professional approach and attention to detail.",
      "Outstanding service. Exceeded expectations."
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      rating: 4 + Math.floor(Math.random() * 2),
      text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }));
  };

  const reviews = generateReviews();



  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Smooth and faster entry animations
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

    // Faster scroll-triggered animations
    gsap.set(profileRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 50
    });

    ScrollTrigger.create({
      trigger: profileRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.to(profileRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      },
    });

    gsap.set(reviewsRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 50
    });

    ScrollTrigger.create({
      trigger: reviewsRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.to(reviewsRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      },
    });

    return () => {
      entryTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gray-50"
    >
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
            <h1
              ref={titleRef}
              className="mb-4 text-4xl font-bold md:text-5xl"
            >
              Freelancer Profile
            </h1>
            <p className="mb-8 text-xl text-blue-100">
              Get to know your service provider
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div
        ref={profileRef}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        {dataLoading ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <p className="text-xl text-gray-600">Loading freelancer profile...</p>
            </div>
          </div>
        ) : freelancerData ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="p-8">
              <div className="mb-8 flex flex-col items-start md:flex-row md:items-center">
                <img
                  src={freelancerData.image}
                  alt={freelancerData.name}
                  className="mb-4 h-32 w-32 rounded-full object-cover md:mr-8 md:mb-0"
                />
              <div className="flex-1">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  {freelancerData.name}
                </h2>
                <p className="mb-2 text-xl font-semibold text-gray-600">
                  {freelancerData.services && freelancerData.services.length > 0 ? (typeof freelancerData.services[0] === 'string' ? freelancerData.services[0] : freelancerData.services[0].name) : "No service"}
                </p>
                <p className="mb-4 text-gray-500">{freelancerData.location}</p>

                <div className="mb-4 flex items-center">
                  <span className="text-2xl text-yellow-400">⭐</span>
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    {freelancerData.rating}
                  </span>
                  <span className="ml-2 text-gray-500">
                    ({freelancerData.reviews} reviews)
                  </span>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-lg font-semibold text-gray-900">{freelancerData.experience}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Completed Jobs</p>
                    <p className="text-lg font-semibold text-gray-900">{freelancerData.completedJobs}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Response Time</p>
                    <p className="text-lg font-semibold text-gray-900">{freelancerData.responseTime}</p>
                  </div>
                </div>

                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Hourly Rate</p>
                      <p className="text-3xl font-bold text-green-600">{freelancerData.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Availability</p>
                      <p className="text-lg font-semibold text-green-700">{freelancerData.availability}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">About</h3>
              <p className="leading-relaxed text-gray-600">{freelancerData.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {freelancerData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to={`/client/book/${freelancerData.id}`}
                state={{ freelancer: freelancerData, from: 'profile' }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Book Now
              </Link>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors">
                Contact Freelancer
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="p-8 text-center">
              <p className="text-xl text-gray-600">Freelancer not found.</p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div
        ref={reviewsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Recent Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm">{review.date}</span>
              </div>
              <p className="text-gray-600 mb-4">"{review.text}"</p>
              <p className="text-sm font-medium text-gray-900">- {review.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
