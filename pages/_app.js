import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import "../styles/globals.scss";
import { mainTheme } from "../styles/theme";

function MyApp({ Component, pageProps }) {
  const [colorMode, setColorMode] = useState("light");
  const [theme, setTheme] = useState(createTheme(mainTheme));

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)")) {
      setColorMode("dark");
    } else {
      setColorMode("light");
    }
  }, []);

  useEffect(() => {
    let changedTheme = mainTheme;
    changedTheme.palette.mode = colorMode;
    setTheme(createTheme(changedTheme));
  }, [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>FF Draftboard</title>
        <link rel="shortcut icon" href="/football.png" />
        <meta
          name="description"
          content="Draftboard view for Sleeper leagues"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z1FJCVYPGH"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-Z1FJCVYPGH');
        `}
      </Script>
      <Component
        {...pageProps}
        colorMode={colorMode}
        setColorMode={setColorMode}
      />
    </ThemeProvider>
  );
}

export default MyApp;
