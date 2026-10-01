export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">NO LIMITS</h2>
          <p className="text-sm text-gray-400 mt-2">
            Shop without limits.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-10">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">SHOP</h3>
            <button className="text-sm text-gray-400 hover:text-purple-500 transition">
              Products
            </button>
            <button className="text-sm text-gray-400 hover:text-purple-500 transition">
              Categories
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">COMPANY</h3>
            <button className="text-sm text-gray-400 hover:text-purple-500 transition">
              About
            </button>
            <button className="text-sm text-gray-400 hover:text-purple-500 transition">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-5">
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} No Limits. All rights reserved.
        </p>
      </div>
    </footer>
  );
}