// Not used yet.

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff", // Choose a suitable color for primary
      light: "#20d0e3", // A lighter shade
      dark: "#0056b3", // A darker shade
    },
    secondary: {
      main: "#f44336", // Choose a suitable color for secondary
      light: "#ff6b6b", // A lighter shade
      dark: "#d9534f", // A darker shade
    },
    success: {
      main: "#17a598",
    },
    warning: {
      main: "#f7c440",
    },
    error: {
      main: "#e60000",
    },
    info: {
      main: "#20b2aa",
    },
    background: {
      default: "#333", // Light background color
      darker: "#1c1c1c",
      paper: "#fff", // Background color for paper components
    },
    text: {
      primary: "#fff", // Main text color
      secondary: "#777777", // Secondary text color
      disabled: "#aaa",
    },
  },
  gradients: {
    primaryGradient: "linear-gradient(90deg, #20d0e3, #f7c440, #ce00fc)",
    secondaryGradient: "linear-gradient(90deg, #ce00fc, #f7c440, #20d0e3)",
    darkOverlay: "linear-gradient(to bottom, rgba(28, 28, 28, 1), rgba(28, 28, 28, 0))",
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Default font family
  },
});

export default theme;
