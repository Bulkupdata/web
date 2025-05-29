// src/context/ThemeContext.tsx
import  { createContext, useContext, useState, ReactNode } from "react";

type Theme = {
  backgroundColor: string;
  textColor: string;
  trayBackground: string;
  trayTextColor: string;
};

type ThemeContextType = {
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  theme: Theme;
};

const defaultTheme: Theme = {
  backgroundColor: "#FFD000",
  textColor: "#000",
  trayBackground: "#FFD000",
  trayTextColor: "#000",
};

const ThemeContext = createContext<ThemeContextType>({
  selectedProvider: "MTN",
  setSelectedProvider: () => {},
  theme: defaultTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProvider, setSelectedProvider] = useState("MTN");

  const getTheme = (provider: string): Theme => {
    switch (provider) {
      case "MTN":
        return {
          backgroundColor: "#FFD000",
          textColor: "#000",
          trayBackground: "#FFD000",
          trayTextColor: "#000",
        };
      case "Airtel":
        return {
          backgroundColor: "#E60000",
          textColor: "#fff",
          trayBackground: "#fff",
          trayTextColor: "#000",
        };
      case "Glo":
        return {
          backgroundColor: "#2B720C",
          textColor: "#fff",
          trayBackground: "#2B720C",
          trayTextColor: "#fff",
        };
      case "9mobile":
        return {
          backgroundColor: "#123204",
          textColor: "#fff",
          trayBackground: "#123204",
          trayTextColor: "#fff",
        };
      default:
        return defaultTheme;
    }
  };

  const theme = getTheme(selectedProvider);

  return (
    <ThemeContext.Provider
      value={{ selectedProvider, setSelectedProvider, theme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
