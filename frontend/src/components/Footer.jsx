import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Github, Send, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-bg-card border-t border-border-color pt-16 pb-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Kolom 1: Brand & Desc */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform duration-300">
                N
              </div>
              <span className="text-2xl font-black tracking-tight text-text-main">
                Nex<span className="text-primary">Learn</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Platform edukasi masa depan. Kami membantu Anda menguasai skill
              digital paling dicari dengan metode belajar yang fleksibel dan
              interaktif.
            </p>
            <div className="flex gap-4">
              <SocialIcon
                icon={<Instagram size={18} />}
                href="https://instagram.com/kevinnardd_"
              />
              <SocialIcon
                icon={<Github size={18} />}
                href="https://github.com/ouchycode"
              />
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="font-bold text-text-main mb-6 text-lg">Jelajahi</h3>
            <ul className="space-y-4 text-sm text-text-muted">
              <li>
                <FooterLink to="/">Beranda</FooterLink>
              </li>
              <li>
                <FooterLink to="/courses">Semua Kursus</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">Tentang Kami</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Hubungi Kami</FooterLink>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Karir
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="font-bold text-text-main mb-6 text-lg">
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Jl. Aria Santika No.40A, RT.005/RW.011, Margasari, Kec.
                  Karawaci, Kota Tangerang, Banten 15114
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>23050472@uym.ac.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+62 812 1933 4093</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter */}
          <div>
            <h3 className="font-bold text-text-main mb-6 text-lg">
              Newsletter
            </h3>
            <p className="text-text-muted text-sm mb-4">
              Dapatkan info dan materi terbaru langsung di inbox Anda.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Email Anda..."
                className="w-full bg-bg-main border border-border-color text-text-main py-3 pl-4 pr-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50 text-sm"
              />
              <button className="absolute right-2 top-1.5 bg-primary text-white p-1.5 rounded-lg hover:bg-primary-hover transition-colors shadow-md">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border-color pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>
            © {new Date().getFullYear()} Kevin Ardiansyah. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Komponen Kecil untuk Link Footer
const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
  >
    {children}
  </Link>
);

// Komponen Kecil untuk Sosmed
const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    className="w-9 h-9 rounded-full bg-bg-main border border-border-color flex items-center justify-center text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
