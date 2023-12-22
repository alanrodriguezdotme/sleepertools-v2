import Head from "next/head";
import styles from "../../styles/Tournament.module.scss";
import { Alert, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  getLeagueInfo,
  getLeagueUsers,
  getRosters,
} from "../../utils/sleeper-api";
import { useRouter } from "next/router";

export default function Tournament({ colorMode }) {
  const theme = useTheme();
  const router = useRouter();
  const [leagueIds, setLeagueIds] = useState([]);
  const [leagueIdValue, setLeagueIdValue] = useState("");
  const [allTeams, setAllTeams] = useState([]);
  const [alert, setAlert] = useState(null);

  const columns = [
    { field: "username", headerName: "Username", width: 200 },
    { field: "teamName", headerName: "Team Name", width: 200 },
    { field: "leagueName", headerName: "League Name", width: 200 },
    {
      field: "pointsFor",
      headerName: "Points for",
      type: "number",
      width: 100,
    },
    {
      field: "maxPointsFor",
      headerName: "Max points for",
      type: "number",
      width: 100,
    },
    {
      filed: "pointsAgainst",
      headerName: "Points against",
      type: "number",
      width: 100,
    },
    { field: "wins", headerName: "Wins", width: 100 },
    { field: "losses", headerName: "Losses", width: 100 },
    { field: "ties", headerName: "Ties", width: 100 },
  ];

  const getTeams = (leagueId) => {
    const teams = [];
    setAlert({ severity: "info", message: `Fetching rosters for ${leagueId}` });
    getLeagueInfo(leagueId, (info) => {
      if (!info) {
        setAlert({
          severity: "error",
          message: `No league found for ${leagueId}`,
        });
        return;
      }
      let leagueName = info.name;

      getLeagueUsers(leagueId, (users) => {
        users.forEach((user) => {
          teams.push({
            id: user.user_id,
            username: user.display_name,
            teamName: user.metadata.team_name,
          });
        });

        getRosters(leagueId, (rosters) => {
          rosters.forEach((roster) => {
            const {
              fpts,
              fpts_decimal,
              fpts_against,
              fpts_against_decimal,
              ppts,
              ppts_decimal,
              wins,
              losses,
              ties,
            } = roster.settings;
            teams.forEach((team) => {
              if (team.id === roster.owner_id) {
                team.leagueName = leagueName;
                team.pointsFor = (fpts + fpts_decimal / 100).toFixed(2);
                team.maxPointsFor = (ppts + ppts_decimal / 100).toFixed(2);
                team.pointsAgainst = (
                  fpts_against +
                  fpts_against_decimal / 100
                ).toFixed(2);
                team.wins = wins;
                team.losses = losses;
                team.ties = ties;
              }
            });
          });
          router.push({
            pathname: `/tournament/`,
            query: { leagues: leagueIds },
          });
          console.log({ teams });
          setAllTeams(teams);
          setAlert(null);
        });
      });
    });
  };

  const handleAddLeague = () => {
    getTeams(leagueIdValue);
    setLeagueIds([...leagueIds, leagueIdValue]);
    setLeagueIdValue("");
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: theme.palette.background[colorMode],
        color: theme.palette.text[colorMode],
      }}
    >
      <Head>
        <title>FF Tournament Tracker</title>
        <meta
          name="description"
          content={`Tournament tracker for Sleeper fantasy football leagues`}
        />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.info}>
            <Typography variant="h5">FF Tournament Tracker</Typography>
            <Typography variant="body1">
              Track team scores across multiple Sleeper leagues for fantasy
              football tournaments.
            </Typography>
          </div>
          <div className={styles.right}>
            <div className={styles.formGroup}>
              <TextField
                id="sleeper-league-id"
                label="Enter a Sleeper league ID"
                value={leagueIdValue}
                onChange={(e) => setLeagueIdValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddLeague();
                    e.preventDefault();
                  }
                }}
                className={styles.input}
              />
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleAddLeague}
              >
                Add Sleeper league
              </Button>
            </div>
            {alert && (
              <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            )}
          </div>
        </div>
        {allTeams.length > 0 && (
          <div className={styles.teams}>
            <DataGrid rows={allTeams} columns={columns} />
          </div>
        )}
      </main>
    </div>
  );
}
