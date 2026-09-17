import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("app_theme");
    return saved !== null ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("app_theme", isDarkMode ? "dark" : "light");
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#09090b"; // zinc-950
    } else {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#fafafa"; // zinc-50
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};