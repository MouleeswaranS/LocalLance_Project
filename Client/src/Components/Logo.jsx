import React from 'react';

const Logo = ({ className = "", size = "text-4xl", isHomePage = false }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        {/* Briefcase icon */}
        <path
          d="M12 16H36V32H12V16Z"
          fill="url(#gradient1)"
          stroke="url(#gradient2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 16V12C16 10.8954 16.8954 10 18 10H30C31.1046 10 32 10.8954 32 12V16"
          stroke="url(#gradient2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 22H28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 26H28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isHomePage ? "#1E40AF" : "#3B82F6"} />
            <stop offset="100%" stopColor={isHomePage ? "#7C3AED" : "#8B5CF6"} />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isHomePage ? "#3B82F6" : "#60A5FA"} />
            <stop offset="100%" stopColor={isHomePage ? "#9333EA" : "#A78BFA"} />
          </linearGradient>
        </defs>
      </svg>
      <span className={`${size} font-bold bg-gradient-to-r ${isHomePage ? 'from-blue-600 to-purple-600' : 'from-blue-400 to-purple-400'} bg-clip-text text-transparent`}>
        Local<span className={isHomePage ? 'text-purple-600' : 'text-purple-300'}>Lance</span>
      </span>
    </div>
  );
};

export default Logo;
