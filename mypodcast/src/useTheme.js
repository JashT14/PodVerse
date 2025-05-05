import { useState, useEffect } from "react";

export const useTheme = () => {
  // Initialize theme from localStorage (defaults to dark)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });

  // Whenever theme changes, update body class and localStorage
  useEffect(() => {
    document.body.className = theme + "-mode";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
