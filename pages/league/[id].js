import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import * as playerData from "../api/players.json";
import styles from "../../styles/LeagueView.module.scss";
import {
  currentYear,
  orderRosters,
  sortPicks,
  sortPlayers,
} from "../../utils/helpers";
import {
  getLeagueInfo,
  getLeagueUsers,
  getRosters,
  getTradedPicks,
} from "../../utils/sleeper-api";
import _, { set } from "lodash";
import {
  ArrowBack,
  DarkMode,
  GridOff,
  GridOn,
  LightMode,
} from "@mui/icons-material";
import Link from "next/link";

export default function LeagueView({ colorMode, setColorMode }) {
  const [rosters, setRosters] = useState(null);
  const [leagueInfo, setLeagueInfo] = useState(null);
  const [allPicks, setAllPicks] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [draftView, setDraftView] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { mode } = theme.palette;
  const { id, sort, draft } = router.query;

  useEffect(() => {
    if (sort && sort !== sortBy) {
      setSortBy(sort);
    }
    if (leagueInfo?.settings?.type === 2 && draft && draft === "true") {
      setDraftView(true);
    }
  }, [sort, draft]);

  useEffect(() => {
    if (id) {
      let updatedRosters;

      getLeagueInfo(id, (info) => {
        setLeagueInfo(info);
        getRosters(id, (rosters) => {
          updatedRosters = addPlayers(rosters);
          getLeagueUsers(id, (users) => {
            updatedRosters = addUsers(updatedRosters, users);
            if (leagueInfo?.settings?.type === 2 && rosters) {
              getTradedPicks(id, (picks) => {
                const updatedPicks = sortPicks(info, picks, updatedRosters);
                setAllPicks(updatedPicks);
                setRosters(
                  addPicks(
                    orderRosters(updatedRosters, sort || sortBy),
                    updatedPicks
                  )
                );
              });
            } else {
              setRosters(updatedRosters);
            }
          });
        });
      });
    }
  }, [id]);

  useEffect(() => {
    if (rosters & (leagueInfo?.settings?.type === 2)) {
      setRosters(addPicks(rosters, allPicks));
      draftView && updateUrl();
    }
  }, [draftView, rosters]);

  useEffect(() => {
    if (rosters) {
      setRosters([...orderRosters(rosters, sortBy)]);
      sort && sort !== sortBy && updateUrl();
    }
  }, [sortBy]);

  function updateUrl() {
    router.push({
      pathname: `/league/${id}/`,
      query: { sort: sortBy, draft: draftView },
    });
  }

  function addPlayers(teams) {
    let updatedRosters = [];
    teams.forEach((team) => {
      updatedRosters.push({
        ...team,
        players: sortPlayers(team.players.map((player) => playerData[player])),
      });
    });
    return updatedRosters;
  }

  function addUsers(teams, users) {
    let updatedRosters = [];
    teams.forEach((team) => {
      users.forEach((user) => {
        if (user.user_id === team.owner_id) {
          updatedRosters.push({
            ...team,
            user,
          });
        }
      });
    });
    return updatedRosters;
  }

  function addPicks(teams, picks) {
    let updatedTeams = teams.map((t) => {
      t.picks = [];
      return t;
    });
    picks.forEach((pick) => {
      updatedTeams.forEach((team) => {
        if (draftView) {
          if (team.roster_id === pick.roster_id) {
            team.picks.push(pick);
          }
        } else {
          if (team.roster_id === pick.owner_id) {
            team.picks.push(pick);
          }
        }
      });
    });
    return updatedTeams;
  }

  return rosters ? (
    <div
      className={styles.container}
      style={{
        backgroundColor: theme.palette.background[mode],
      }}
    >
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
            onClick={() =>
              setColorMode(colorMode === "dark" ? "light" : "dark")
            }
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
      <div className={styles.content}>
        <Box
          className={styles.usersContainer}
          style={{
            backgroundColor: theme.palette.usersBar[mode],
          }}
        >
          <Grid container className={styles.users}>
            {rosters.map((team) => (
              <Grid
                key={team.owner_id}
                item
                container
                direction="column"
                className={styles.team}
              >
                <Grid item key={team.owner_id} className={styles.userContainer}>
                  <Card
                    className={styles.user}
                    sx={{
                      backgroundColor: theme.palette.user[mode],
                      color: theme.palette.text[mode],
                    }}
                  >
                    <div className={styles.username}>
                      {team.user.display_name}
                    </div>
                    <div className={styles.record}>
                      {`${team.settings.wins}-${team.settings.losses}`}
                      <br />
                      {`${team.settings.fpts}/${team.settings.ppts}pts`}
                    </div>
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
        {leagueInfo.settings.type === 2 && (
          <div className={styles.picksContainer}>
            <Grid container className={styles.picks}>
              {rosters.map((team, teamIndex) => (
                <Grid
                  key={team.owner_id}
                  item
                  container
                  direction="column"
                  className={styles.team}
                >
                  {team.picks?.map((pick, i) => {
                    let isFuturePick =
                      parseInt(pick.season) > currentYear() + 1;
                    return (
                      <Grid
                        item
                        key={`pick-${i}`}
                        className={styles.pickContainer}
                      >
                        <Card
                          xs={1}
                          className={styles.pick}
                          sx={{
                            backgroundColor: isFuturePick
                              ? theme.palette.pickSubdued[mode]
                              : theme.palette.pick[mode],
                            color: theme.palette.text[mode],
                            // outlineColor: isFuturePick ? "red" : "none",
                          }}
                        >
                          <div className={styles.value}>
                            {draftView &&
                            parseInt(pick.season) === currentYear() + 1
                              ? `${pick.round}.${
                                  (teamIndex < 9 ? "0" : "") + (teamIndex + 1)
                                }`
                              : `${pick.season} Round ${pick.round}`}
                          </div>
                          <div className={styles.originalOwner}>
                            {draftView
                              ? pick.current_owner.display_name
                              : pick.original_owner.display_name}
                          </div>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        <div className={styles.rostersContainer}>
          <Grid container className={styles.rosters} id="rosters">
            {rosters.map((team) => (
              <Grid
                key={team.owner_id}
                item
                container
                direction="column"
                className={styles.team}
              >
                {team.players.map((player) => (
                  <Grid
                    item
                    key={player.player_id}
                    className={styles.playerContainer}
                  >
                    <Card
                      xs={1}
                      className={styles.player}
                      sx={{
                        backgroundColor: theme.palette[player.position][mode],
                      }}
                    >
                      <div className={styles.name}>
                        {player.first_name}
                        <br />
                        {player.last_name}
                      </div>
                      <div className={styles.meta}>
                        <Tooltip title="Position">
                          <div className={styles.info}>
                            👤 {player.position}
                          </div>
                        </Tooltip>
                        <Tooltip title="Age">
                          <div className={styles.info}>🎂 {player.age}</div>
                        </Tooltip>
                      </div>
                      <div className={styles.meta}>
                        <Tooltip title="Team">
                          <div className={styles.info}>🏟️ {player.team}</div>
                        </Tooltip>
                        <Tooltip title="Number">
                          <div className={styles.info}>👕 {player.number}</div>
                        </Tooltip>
                      </div>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={styles.container}
      style={{
        backgroundColor: theme.palette.background[mode],
      }}
    >
      <div
        className={styles.loadingContent}
        style={{
          color: theme.palette.text[mode],
        }}
      >
        <h1 className={styles.loading}>Loading your league...</h1>
      </div>
    </div>
  );
}
