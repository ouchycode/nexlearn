import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import {
  Search,
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Heart,
  Home as HomeIcon,
  Phone,
  Info,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [keyword, setKeyword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate(`/courses?search=${keyword}`);
      setIsMobileMenuOpen(false); // Tutup menu setelah cari
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setIsMobileMenuOpen(false);
  };
  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    setIsMobileMenuOpen(false);
  };

  // NavLink Component untuk Desktop
  const NavLink = ({ to, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className="relative group py-2">
        <span
          className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
            isActive
              ? "text-primary"
              : "text-text-muted group-hover:text-text-main"
          }`}
        >
          {label}
        </span>
        <span
          className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-primary transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
    );
  };

  // NavLink Component untuk Mobile
  const MobileNavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-primary/10 text-primary font-bold"
            : "text-text-muted hover:bg-bg-card hover:text-text-main"
        }`}
      >
        <Icon size={20} />
        <span className="text-base">{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-bg-main/80 backdrop-blur-xl border-b border-border-color shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* LOGO */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform duration-300">
                  N
                </div>
                <span className="text-2xl font-black tracking-tight text-text-main">
                  Nex<span className="text-primary">Learn</span>
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/" label="Home" />
                <NavLink to="/courses" label="Kursus" />
                <NavLink to="/about" label="Tentang" />
                <NavLink to="/contact" label="Kontak" />
              </div>
            </div>

            {/* SEARCH DESKTOP */}
            <div className="hidden md:flex flex-1 max-w-sm mx-8 group">
              <div className="relative w-full transition-transform duration-300 group-focus-within:scale-105">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted group-focus-within:text-primary transition-colors">
                  <Search size={18} strokeWidth={2.5} />
                </span>
                <input
                  type="text"
                  placeholder="Cari skill baru..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-bg-card ring-1 ring-border-color focus:ring-primary focus:shadow-glow transition-all duration-300 text-sm font-medium text-text-main placeholder-text-muted outline-none"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>

            {/* ACTION BUTTONS DESKTOP */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-bg-card border border-border-color text-text-main hover:text-primary hover:border-primary transition-all duration-300"
              >
                {theme === "light" && <Sun size={20} />}
                {theme === "dark" && <Moon size={20} />}
                {theme === "valentine" && (
                  <Heart size={20} className="text-pink-500 fill-pink-500" />
                )}
              </button>

              {token ? (
                <>
                  {role === "admin" && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 text-text-muted hover:text-primary font-semibold text-sm transition-colors px-3 py-2"
                    >
                      <LayoutDashboard size={18} /> <span>Dashboard</span>
                    </Link>
                  )}
                  {role === "student" && (
                    <Link
                      to="/my-courses"
                      className="flex items-center gap-2 text-text-muted hover:text-primary font-semibold text-sm transition-colors px-3 py-2"
                    >
                      <BookOpen size={18} /> <span>Kelas Saya</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full bg-bg-card hover:bg-primary/10 flex items-center justify-center text-text-muted hover:text-primary border border-border-color"
                  >
                    <User size={20} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white text-sm transition-all"
                  >
                    <LogOut size={16} /> <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="px-5 py-2.5 rounded-full font-bold text-text-muted hover:text-primary text-sm"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={openRegister}
                    className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105"
                  >
                    Daftar Gratis
                  </button>
                </>
              )}
            </div>

            {/* MOBILE TOGGLE & THEME */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-main"
              >
                {theme === "light" && <Sun size={20} />}
                {theme === "dark" && <Moon size={20} />}
                {theme === "valentine" && (
                  <Heart size={20} className="text-pink-500" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-text-main p-2 hover:bg-bg-card rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        <div
          className={`md:hidden absolute w-full bg-bg-main border-b border-border-color overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="px-4 pt-2 pb-8 space-y-6 shadow-2xl">
            {/* Search Mobile */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Cari materi..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border-color text-text-main outline-none focus:ring-2 focus:ring-primary"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Navigation Links Mobile */}
            <div className="flex flex-col space-y-1">
              <MobileNavLink to="/" label="Home" icon={HomeIcon} />
              <MobileNavLink
                to="/courses"
                label="Semua Kursus"
                icon={BookOpen}
              />
              <MobileNavLink to="/about" label="Tentang Kami" icon={Info} />
              <MobileNavLink to="/contact" label="Kontak" icon={Phone} />
            </div>

            {/* User Actions Mobile */}
            <div className="pt-4 border-t border-border-color">
              {token ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 px-4 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {role === "admin" ? "A" : "S"}
                    </div>
                    <div>
                      <p className="text-text-main font-bold text-sm">
                        Dashboard Aktif
                      </p>
                      <p className="text-text-muted text-xs capitalize">
                        {role}
                      </p>
                    </div>
                  </div>

                  {role === "admin" && (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 text-text-muted hover:text-primary"
                    >
                      <LayoutDashboard size={20} />{" "}
                      <span className="font-semibold">Dashboard Admin</span>
                    </Link>
                  )}
                  {role === "student" && (
                    <Link
                      to="/my-courses"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 text-text-muted hover:text-primary"
                    >
                      <BookOpen size={20} />{" "}
                      <span className="font-semibold">Kelas Saya</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 text-text-muted hover:text-primary"
                  >
                    <User size={20} />{" "}
                    <span className="font-semibold">Profil Saya</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-red-500 bg-red-500/5 rounded-xl font-bold"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={openLogin}
                    className="py-3 rounded-xl font-bold text-text-main bg-bg-card border border-border-color"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={openRegister}
                    className="py-3 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/20"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default Navbar;
