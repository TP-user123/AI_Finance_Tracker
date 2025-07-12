import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center bg-gray-100">
      {/* 404 GIF or image */}
      <img
        src="https://media.giphy.com/media/hEc4k5pN17GZq/giphy.gif" // or your preferred gif/image URL
        alt="404 - Page Not Found"
        className="w-full max-w-md h-auto mb-6"
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        The page you're looking for doesn't exist or has been moved. Let's get you back home.
      </p>

      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
