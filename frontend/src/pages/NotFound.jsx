// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
