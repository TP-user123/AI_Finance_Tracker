const Navbar = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo or App Title */}
          <div className="text-xl font-semibold text-gray-800">
            💰 MyFinance
          </div>

          {/* User Icon */}
          <div className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition">
            👤
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;