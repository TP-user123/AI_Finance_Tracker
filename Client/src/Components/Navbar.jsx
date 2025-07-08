const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow sticky top-0 z-10">
      <input
        type="text"
        placeholder="Search transactions..."
        className="border px-4 py-2 rounded-md w-full max-w-sm"
      />
      <div className="ml-4 text-2xl">👤</div>
    </header>
  );
};

export default Navbar;