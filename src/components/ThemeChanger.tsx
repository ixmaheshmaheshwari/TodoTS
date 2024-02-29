import React, { createContext, useEffect, useState } from "react";

interface ThemeContextType {
  toggle: string;
  toggleFunction: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeChanger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toggle, setToggle] = useState<string>("light");

  const toggleFunction = () => {
    setToggle((toggle) => (toggle === "light" ? "dark" : "light"));
    document.body.style.backgroundColor = toggle === "light" ? "dark" : "light";
  };

  useEffect(() => {
    // Set initial background color
    document.body.style.backgroundColor = toggle === "light" ? "white" : "#1e1e1e";
  }, [toggle]);

  return (
    <ThemeContext.Provider value={{ toggle, toggleFunction }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeChanger };
