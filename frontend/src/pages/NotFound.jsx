// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center h-screen p-4 text-white flex-col">


      <h1 className="text-4xl font-bold mb-4"><span className="text-red-600 ">404</span> - Page Not Found</h1>
      <p className="mb-6">Oops! This is not the page you are looking for.</p>
      <Link to="/" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent  transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
