const mongoose = require('mongoose');
const Freelancer = require('./models/Freelancer');
require('dotenv').config();

const services = [
  "Home Cleaning",
  "Plumbing",
  "Electrical Work",
  "Carpentry",
  "Mechanics",
  "Bike & Car Repair",
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

const generateFreelancers = () => {
  const freelancers = [];
  let id = 1;

  locations.forEach(location => {
    services.forEach(service => {
      for (let i = 0; i < 5; i++) { // 5 freelancers per service per location
        const name = names[Math.floor(Math.random() * names.length)];
        const gender = maleNames.includes(name) ? 'men' : 'women';
        const rating = (4.0 + Math.random() * 1.0).toFixed(1);
        const reviews = Math.floor(Math.random() * 300) + 50;
        const price = `₹${200 + Math.floor(Math.random() * 300)}/hr`;
        const experienceYears = 3 + Math.floor(Math.random() * 8);
        const experience = `${experienceYears} years`;
        const completedJobs = Math.floor(Math.random() * 800) + 100;
        const imageNumber = Math.floor(Math.random() * 99) + 1;
        const image = `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`;

        freelancers.push({
          name,
          services: [{
            name: service,
            description: `Professional ${service.toLowerCase()} services`,
            price: price,
            category: 'General',
            rating: parseFloat(rating),
            bookings: Math.floor(Math.random() * 100)
          }],
          address: location,
          rating: parseFloat(rating),
          reviews,
          price,
          image,
          experience,
          completedJobs,
          description: `Professional ${service.toLowerCase()} specialist with ${experienceYears} years of experience. Committed to delivering high-quality service and customer satisfaction.`,
          skills: [
            `${service} Expertise`,
            "Customer Service",
            "Problem Solving",
            "Time Management",
            "Quality Assurance"
          ],
          availability: "Available Mon-Sat, 9 AM - 6 PM",
          responseTime: "< 2 hours"
        });
      }
    });
  });

  return freelancers;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing freelancers
    await Freelancer.deleteMany({});
    console.log('Cleared existing freelancers');

    // Generate and insert new freelancers
    const freelancers = generateFreelancers();
    await Freelancer.insertMany(freelancers);
    console.log(`Seeded ${freelancers.length} freelancers`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
