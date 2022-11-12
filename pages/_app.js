import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import Head from "next/head";
import "../styles/globals.scss";
import { lightTheme } from "../styles/theme";

const theme = createTheme(lightTheme);

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Sleeper Tools</title>
        <meta name="description" content="Tools for Sleeper" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
