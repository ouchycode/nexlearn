import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Cek local storage atau default ke 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Hapus tema lama (opsional jika logic class, tapi kita pakai data-theme)
    root.setAttribute("data-theme", theme);

    // Simpan ke local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    // Rotasi: Light -> Dark -> Valentine -> Light
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("valentine");
    else setTheme("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
