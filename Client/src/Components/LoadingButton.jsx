const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <button
      disabled={isLoading}
      className={`px-5 py-2 rounded-md transition font-medium flex items-center justify-center
        ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
        text-white`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8h-2a6 6 0 11-6-6z"
            ></path>
          </svg>
          <span>Saving...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
