import { useEffect, useState } from "react";
import { setToLS, getFromLS } from "../utils/storage";
import _ from "lodash";

export const useTheme = () => {
  const themes = getFromLS("all-themes");
  const [theme, setTheme] = useState(themes.data.light);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const applyTheme = () => {
    const localTheme = getFromLS("theme");
    console.log("localtheme", localTheme);
    localTheme ? setTheme(localTheme) : setTheme(themes.data.light);
    console.log("themeloaded", themeLoaded);
    setThemeLoaded(true);
  };
  const setMode = (mode) => {
    setToLS("theme", mode);
    setTheme(mode);
    console.log("mode", mode);
    applyTheme();
  };

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes.data, "font"));
    return allFonts;
  };

  useEffect(() => {
    const localTheme = getFromLS("theme");
    console.log("localtheme", localTheme);
    localTheme ? setTheme(localTheme) : setTheme(themes.data.light);
    setThemeLoaded(true);
  }, [themes.data.light]);

  //   useEffect(() => {
  //     const localTheme = getFromLS('theme');
  //     console.log("localtheme", localTheme);
  //     const defaultTheme = themes.data.light;
  //     localTheme ? setTheme(localTheme) : setTheme(defaultTheme);
  //     setThemeLoaded(true);
  // }, [themes.data.light]);

  return { theme, themeLoaded, setMode, getFonts };
};
