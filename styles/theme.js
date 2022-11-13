import {
  blue,
  brown,
  deepOrange,
  green,
  grey,
  indigo,
  orange,
  pink,
  purple,
  red,
} from "@mui/material/colors";

export const mainTheme = {
  palette: {
    background: {
      light: grey[100],
      main: grey[500],
      dark: grey[900],
    },
    text: {
      light: grey[800],
      main: grey[500],
      dark: "#fff",
    },
    appbar: {
      light: indigo[200],
      main: indigo[500],
      dark: indigo[900],
    },
    usersBar: {
      light: indigo[100],
      main: indigo[200],
      dark: grey[800],
    },
    user: {
      light: grey[100],
      main: grey[500],
      dark: grey[900],
    },
    pick: {
      light: grey[300],
      main: grey[500],
      dark: grey[800],
    },
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: indigo[300],
    },
    QB: {
      light: red[100],
      main: red[500],
      dark: red[900],
    },
    RB: {
      light: green[100],
      main: green[500],
      dark: green[900],
    },
    WR: {
      light: blue[100],
      main: blue[500],
      dark: blue[900],
    },
    TE: {
      light: orange[100],
      main: orange[500],
      dark: orange[900],
    },
    K: {
      light: purple[100],
      main: purple[500],
      dark: purple[900],
    },
    DEF: {
      light: brown[100],
      main: brown[500],
      dark: brown[900],
    },
    DL: {
      light: deepOrange[100],
      main: deepOrange[500],
      dark: deepOrange[900],
    },
    LB: {
      light: indigo[100],
      main: indigo[500],
      dark: indigo[900],
    },
    DB: {
      light: pink[100],
      main: pink[500],
      dark: pink[900],
    },
  },
  typography: {
    fontFamily: ["monospace", "IBM Plex Mono"],
  },
};
