import { act, createContext, useReducer } from "react";

// Theme Context
const ThemeContext = createContext();

// Theme Context Provider

let ThemeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

const ThemeContextProvider = ({ children }) => {
  let [state, dispatch] = useReducer(ThemeReducer, {
    theme: localStorage.getItem("theme") || "light",
  });

  let changeTheme = (theme) => {
    localStorage.setItem("theme", theme);
    // action = type + payload { type,payload }
    dispatch({ type: "CHANGE_THEME", payload: theme });
  };

  const isDark = state.theme === "dark";

  return (
    <ThemeContext.Provider value={{ ...state, changeTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
