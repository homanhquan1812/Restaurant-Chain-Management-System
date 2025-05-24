export const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-16 py-3 w-full bg-yellow-100 shadow-sm max-md:px-5">
      {/* Logo */}
      <img 
        loading="lazy" 
        src="/assets/images/logo.png" 
        alt="Utopia Logo" 
        className="object-contain" 
      />

      {/* Menu */}
      <nav className="flex gap-8 items-center text-lg font-medium text-zinc-800">
        <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
        <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
        <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
        <a href="#blog" className="hover:text-amber-400 transition-colors">Blog</a>
      </nav>

      {/* Action Buttons */}
      <div className="flex gap-3 items-center">
        <a
          href="/signup"
          className="px-5 py-3 bg-amber-500 text-white rounded-full text-base font-semibold hover:bg-amber-600 transition-colors"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="px-5 py-3 border border-zinc-300 text-zinc-800 rounded-full text-base font-semibold hover:bg-zinc-200 transition-colors"
        >
          Log In
        </a>
      </div>
    </div>
  );
};
