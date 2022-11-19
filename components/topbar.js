import {
  ArrowBack,
  DarkMode,
  GridOff,
  GridOn,
  LightMode,
} from "@mui/icons-material";
import {
  AppBar,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import styles from "../styles/LeagueView.module.scss";

export default function TopBar({
  leagueInfo,
  draftView,
  setDraftView,
  sortBy,
  setSortBy,
  colorMode,
  setColorMode,
}) {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <AppBar
      className={styles.appbar}
      color="appbar"
      elevation={1}
      sx={{ backgroundColor: theme.palette.appbar[mode] }}
    >
      <Toolbar>
        {/* <Link href="/"> */}
        <IconButton
          color="text"
          sx={{ color: theme.palette.text[mode] }}
          edge="start"
          // Neither <Link> nor router.push work
          onClick={() => (window.location.href = "/")}
        >
          <ArrowBack />
        </IconButton>
        {/* </Link> */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          className={styles.leagueName}
        >
          {leagueInfo.name}
        </Typography>
        {leagueInfo.settings.type === 2 && (
          <Tooltip title="Toggle draft view">
            <IconButton
              color="text"
              size="large"
              sx={{ color: theme.palette.text[mode] }}
              edge="start"
              onClick={() => setDraftView(!draftView)}
            >
              {draftView ? <GridOff /> : <GridOn />}
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          color="text"
          size="large"
          sx={{ color: theme.palette.text[mode] }}
          edge="start"
          onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
        >
          {colorMode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-by-label">Sort teams by</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by"
            value={sortBy}
            defaultValue="default"
            label="Sort teams by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="wins-asc">Wins, ascending</MenuItem>
            <MenuItem value="wins-desc">Wins, descending</MenuItem>
            <MenuItem value="fpts-asc">Points for, ascending</MenuItem>
            <MenuItem value="fpts-desc">Points for, descending</MenuItem>
            <MenuItem value="ppts-asc">Max points for, ascending</MenuItem>
            <MenuItem value="ppts-desc">Max points for, descending</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
}
