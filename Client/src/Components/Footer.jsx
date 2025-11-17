export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Freelancing Booking Platform</h3>
            <p className="text-gray-400">
              Connect with top freelancers and transform your projects with expert talent.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Find Freelancers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Post a Project</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">How it Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Find Work</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Create Profile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Freelancing Booking Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
