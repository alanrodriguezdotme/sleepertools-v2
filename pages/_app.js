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
        <title>Sleeper Draftboard View</title>
        <link rel="shortcut icon" href="/football.png" />
        <meta
          name="description"
          content="Draftboard view for Sleeper leagues"
        />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
