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
import { sortPicks, sortPlayers } from "../../utils/helpers";
import {
  getLeagueInfo,
  getLeagueUsers,
  getRosters,
  getTradedPicks,
} from "../../utils/sleeper-api";
import _ from "lodash";
import { ArrowBack, DarkMode, LightMode } from "@mui/icons-material";

export default function LeagueView({ colorMode, setColorMode }) {
  const [rosters, setRosters] = useState(null);
  const [leagueInfo, setLeagueInfo] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const { mode } = theme.palette;
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      let updatedRosters;

      getLeagueInfo(id, (info) => {
        setLeagueInfo(info);
        getRosters(id, (rosters) => {
          updatedRosters = addPlayers(rosters);
          getLeagueUsers(id, (users) => {
            updatedRosters = addUsers(updatedRosters, users);
            if (info?.settings?.type === 2 && rosters) {
              getTradedPicks(id, (picks) => {
                const updatedPicks = sortPicks(info, picks);
                setRosters(addPicks(updatedRosters, updatedPicks));
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
    if (rosters) {
      let sortedRosters = rosters;

      switch (sortBy) {
        case "default":
          sortedRosters = _.orderBy(sortedRosters, (team) => team.roster_id, [
            "asc",
          ]);
          break;
        case "wins-asc":
          sortedRosters = _.orderBy(
            sortedRosters,
            (team) => team.settings.wins,
            ["asc"]
          );
          break;
        case "wins-desc":
          sortedRosters = _.orderBy(
            sortedRosters,
            (team) => team.settings.wins,
            ["desc"]
          );
          break;
        case "fpts-asc":
          sortedRosters = _.orderBy(
            sortedRosters,
            (team) => team.settings.fpts,
            ["asc"]
          );
          break;
        case "fpts-desc":
          sortedRosters = _.orderBy(
            sortedRosters,
            (team) => team.settings.fpts,
            ["desc"]
          );
          break;
      }

      setRosters([...sortedRosters]);
    }
  }, [sortBy]);

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
    let updatedTeams = teams;
    picks.forEach((pick) => {
      let updatedPick = {
        ...pick,
        original_owner: teams[pick.roster_id - 1].user,
        previous_owner:
          teams[
            pick.previous_owner_id
              ? pick.previous_owner_id - 1
              : pick.roster_id - 1
          ].user,
        current_owner: teams[pick.owner_id - 1].user,
      };

      if (!updatedTeams[pick.owner_id - 1].picks) {
        updatedTeams[pick.owner_id - 1].picks = [updatedPick];
      } else {
        updatedTeams[pick.owner_id - 1].picks.push(updatedPick);
      }
    });
    return updatedTeams;
  }

  return (
    rosters && (
      <div
        className={styles.container}
        style={{
          backgroundColor: theme.palette.background[mode],
        }}
      >
        <AppBar
          className={styles.appbar}
          color="appbar"
          sx={{ backgroundColor: theme.palette.appbar[mode] }}
        >
          <Toolbar>
            <IconButton
              color="text"
              sx={{ color: theme.palette.text[mode] }}
              edge="start"
              onClick={() => router.push("/")}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
              className={styles.leagueName}
            >
              {leagueInfo.name}
            </Typography>
            <IconButton
              color="text"
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
                <Grid item xs={1} key={team.owner_id}>
                  <Card
                    xs={1}
                    className={styles.user}
                    sx={{
                      backgroundColor: theme.palette.user[mode],
                      color: theme.palette.text[mode],
                    }}
                  >
                    <div className={styles.username}>
                      {team.user.display_name}
                    </div>
                    <div className={styles.userInfo}>
                      {`${team.settings.wins}-${team.settings.losses} ${team.settings.fpts}pts`}
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          {leagueInfo.settings.type === 2 && (
            <div className={styles.picksContainer}>
              <Grid container className={styles.picks}>
                {rosters.map((team) => (
                  <Grid
                    key={team.owner_id}
                    item
                    container
                    xs={1}
                    direction="column"
                    className={styles.team}
                  >
                    {team.picks?.map((pick, i) => (
                      <Grid item xs={1} key={`pick-${i}`}>
                        <Card
                          xs={1}
                          className={styles.pick}
                          sx={{
                            backgroundColor: theme.palette.pick[mode],
                            color: theme.palette.text[mode],
                          }}
                        >
                          <div className={styles.value}>
                            {pick.season} Round {pick.round}
                          </div>
                          <div className={styles.originalOwner}>
                            {pick.original_owner.display_name}
                          </div>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
          <div className={styles.rostersContainer}>
            <Grid container className={styles.rosters}>
              {rosters.map((team) => (
                <Grid
                  key={team.owner_id}
                  item
                  container
                  xs={1}
                  direction="column"
                  className={styles.team}
                >
                  {team.players.map((player) => (
                    <Grid item xs={1} key={player.player_id}>
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
                            <div className={styles.info}>
                              #️⃣ {player.number}
                            </div>
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
    )
  );
}
