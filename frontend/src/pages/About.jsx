import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fotoProfil from "../assets/profile-kevin.jpg";
import {
  Target,
  Flag,
  Code2,
  Database,
  Server,
  Cloud,
  Palette,
  Terminal,
  Github,
  Linkedin,
  Instagram,
  Cpu,
} from "lucide-react";
// GSAP
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Reveal
      gsap.from(".hero-anim", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      // 2. Vision & Mission Cards
      gsap.from(".vision-card", {
        scrollTrigger: { trigger: ".vision-section", start: "top 85%" }, // Lebih sensitif (85%)
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.2)",
      });

      // 3. Tech Stack Items (PERBAIKAN DISINI)
      // Kita gunakan .fromTo agar status awal dan akhir jelas
      gsap.fromTo(
        ".tech-item",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".tech-section",
            start: "top 90%", // Muncul lebih cepat saat di-scroll
          },
        }
      );

      // 4. Team Profile
      gsap.from(".team-card", {
        scrollTrigger: { trigger: ".team-section", start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans overflow-x-hidden transition-colors duration-500"
    >
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <div className="hero-anim mb-4 inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary">
          <Cpu size={32} />
        </div>
        <h1 className="hero-anim text-4xl md:text-6xl font-black mb-6 tracking-tight">
          Membangun Masa Depan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
            Lewat Baris Kode.
          </span>
        </h1>
        <p className="hero-anim text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          NexLearn bukan sekadar platform kursus. Ini adalah wujud mimpi kami
          untuk mendemokratisasi akses pendidikan teknologi bagi seluruh
          generasi muda Indonesia.
        </p>
      </div>

      {/* --- VISION & MISSION --- */}
      <div className="max-w-7xl mx-auto px-4 mb-32 vision-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi Card */}
          <div className="vision-card bg-bg-card border border-border-color p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500 shadow-sm">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
              <Target size={150} />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-black mb-4 text-text-main">
                Visi Kami 🔭
              </h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Menjadi ekosistem edukasi digital #1 yang mencetak talenta
                teknologi berkualitas dunia, yang siap bersaing di era industri
                4.0 tanpa terhalang biaya.
              </p>
            </div>
          </div>

          {/* Misi Card */}
          <div className="vision-card bg-bg-card border border-border-color p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-pink-500/50 transition-colors duration-500 shadow-sm">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity text-pink-500">
              <Flag size={150} />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-6">
                <Flag size={32} />
              </div>
              <h2 className="text-3xl font-black mb-4 text-text-main">
                Misi Kami 🚀
              </h2>
              <ul className="space-y-4 text-text-muted text-lg">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-xs font-bold mt-1">
                    1
                  </span>
                  Menyediakan kurikulum standar industri terkini.
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-xs font-bold mt-1">
                    2
                  </span>
                  Membangun komunitas belajar yang inklusif.
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-xs font-bold mt-1">
                    3
                  </span>
                  Menghubungkan talenta dengan karir global.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- TECH STACK (PERBAIKAN GRID & RENDERING) --- */}
      <div className="bg-bg-card/50 border-y border-border-color py-20 mb-32 tech-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">
              Powered by Modern Tech ⚡
            </h2>
            <p className="text-text-muted">
              Dibangun menggunakan teknologi terkini untuk performa maksimal.
            </p>
          </div>

          {/* Grid diperbaiki: min 2 kolom di HP, 3 di Tablet, 6 di Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            <TechCard
              icon={<Code2 size={32} />}
              name="React.js"
              label="Frontend Library"
              className="text-blue-400"
            />
            <TechCard
              icon={<Palette size={32} />}
              name="Tailwind"
              label="CSS Framework"
              className="text-cyan-400"
            />
            <TechCard
              icon={<Server size={32} />}
              name="Node.js"
              label="Runtime Env"
              className="text-green-500"
            />
            <TechCard
              icon={<Terminal size={32} />}
              name="Express"
              label="Backend Framework"
              className="text-gray-500"
            />
            <TechCard
              icon={<Database size={32} />}
              name="MongoDB"
              label="NoSQL Database"
              className="text-green-600"
            />
            <TechCard
              icon={<Cloud size={32} />}
              name="Vercel"
              label="Cloud Hosting"
              className="text-text-main"
            />
          </div>
        </div>
      </div>

      {/* --- TEAM SECTION --- */}
      <div className="max-w-4xl mx-auto px-4 pb-32 team-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-4">Meet The Creator 👨‍💻</h2>
          <p className="text-text-muted">Sosok di balik baris kode NexLearn.</p>
        </div>

        <div className="team-card bg-bg-card border border-border-color rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 hover:shadow-glow transition-all duration-500 shadow-sm">
          {/* Avatar */}
          <div className="aspect-square w-52 md:w-72 shrink-0 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
            <img
              src={fotoProfil}
              alt="Kevin Ardiansyah"
              className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <div className="mb-4 flex justify-center md:justify-start">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Fullstack Developer
              </span>
            </div>
            <h3 className="text-4xl font-black mb-2 text-text-main">
              Kevin Ardiansyah
            </h3>
            <p className="text-text-muted text-lg mb-6">
              Mahasiswa Ilmu Komputer di Universitas Yatsi Madani. Passionate di
              bidang Web Development dan UI/UX Design. Aktif berkontribusi di
              berbagai proyek open-source dan komunitas tech lokal.
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <SocialLink
                href="https://github.com/ouchycode"
                icon={<Github size={20} />}
              />
              <SocialLink
                href="https://instagram.com/kevinnardd_"
                icon={<Instagram size={20} />}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// --- KOMPONEN KECIL (DIPISAH SUPAYA RAPI) ---

const TechCard = ({ icon, name, label, className }) => (
  <div className="tech-item bg-bg-main border border-border-color p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-default">
    <div
      className={`mb-3 transition-transform duration-300 group-hover:scale-110 ${className}`}
    >
      {icon}
    </div>
    <h4 className="font-bold text-text-main text-sm">{name}</h4>
    <p className="text-[10px] text-text-muted uppercase tracking-wide mt-1">
      {label}
    </p>
  </div>
);

const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-bg-main border border-border-color flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all hover:scale-110"
  >
    {icon}
  </a>
);

export default About;
