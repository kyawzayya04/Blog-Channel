import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function useTheme() {
  let contexts = useContext(ThemeContext);

  if (contexts === undefined) {
    new Error(`ThemeContext should be used only in ThemeContextProvider !`);
  }

  return contexts; // { theme : 'dark' }
}
