import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./Pages/Home";
import AuthChoice from "./Pages/AuthChoice";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ClientDashboard from "./Pages/Client/ClientDashboard";
import BrowseFreelancers from "./Pages/Client/BrowseFreelancers";
import PopularService from "./Pages/Client/PopularService";
import FreelancerProfile from "./Pages/Client/FreelancerProfile";
import MyBookings from "./Pages/Client/MyBookings";
import FreelancerDashboard from "./Pages/Freelancer/FreelancerDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth-choice" element={<AuthChoice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Client */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/browse" element={<BrowseFreelancers />} />
          <Route path="/client/service/:serviceName" element={<PopularService />} />
          <Route path="/client/freelancer/:id" element={<FreelancerProfile />} />
          <Route path="/client/bookings" element={<MyBookings />} />

          {/* Freelancer */}
          <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
