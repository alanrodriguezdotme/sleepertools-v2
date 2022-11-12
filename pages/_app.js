import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/globals.scss";
import { mainTheme } from "../styles/theme";

function MyApp({ Component, pageProps }) {
  const [colorMode, setColorMode] = useState("light");
  const [theme, setTheme] = useState(createTheme(mainTheme));

  useEffect(() => {
    // if (window.matchMedia("(prefers-color-scheme: dark)")) {
    //   setColorMode("dark");
    // } else {
    //   setColorMode("light");
    // }
  }, []);

  useEffect(() => {
    let changedTheme = mainTheme;
    changedTheme.palette.mode = colorMode;
    setTheme(createTheme(changedTheme));
  }, [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Sleeper Draftboard View</title>
        <link rel="shortcut icon" href="/football.png" />
        <meta
          name="description"
          content="Draftboard view for Sleeper leagues"
        />
      </Head>
      <Component
        {...pageProps}
        colorMode={colorMode}
        setColorMode={setColorMode}
      />
    </ThemeProvider>
  );
}

export default MyApp;
