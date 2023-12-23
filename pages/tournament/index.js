import Head from "next/head";
import styles from "../../styles/Tournament.module.scss";
import { Alert, Button, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  getLeagueInfo,
  getLeagueUsers,
  getRosters,
  getUserInfo,
} from "../../utils/sleeper-api";
import { useRouter } from "next/router";

export default function Tournament({ colorMode }) {
  const theme = useTheme();
  const router = useRouter();
  const [leagueIds, setLeagueIds] = useState([]);
  const [leagueIdValue, setLeagueIdValue] = useState("");
  const [allTeams, setAllTeams] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (router.query.leagues) {
      console.log(router.query.leagues);
      const leagues = router.query.leagues.split("-");
      setLeagueIds(leagues);

      const fetchData = async (id) => {
        await getTeams(id);
      };

      leagues.forEach((league) => {
        !leagueIds.includes(league) && fetchData(league);
      });
    }
  }, [router.query.leagues]);

  const columns = [
    { field: "username", headerName: "USERNAME", width: 200 },
    // { field: "teamName", headerName: "TEAM", width: 200 },
    { field: "leagueName", headerName: "LEAGUE", width: 200 },
    {
      field: "pointsFor",
      headerName: "POINTS",
      type: "number",
      width: 150,
    },
    {
      field: "maxPointsFor",
      headerName: "MAX POINTS",
      type: "number",
      width: 150,
    },
    {
      field: "pointsAgainst",
      headerName: "POINTS AGAINST",
      type: "number",
      width: 150,
    },
    { field: "wins", headerName: "W", width: 50, type: "number" },
    { field: "losses", headerName: "L", width: 50, type: "number" },
    { field: "ties", headerName: "T", width: 50, type: "number" },
  ];

  const getTeams = async (leagueId) => {
    // check to see if leagueId is already added
    allTeams.forEach((team) => {
      console.log(team.leagueId, leagueId);
      if (team.leagueId === leagueId) {
        setAlert({
          severity: "warning",
          message: `League ${leagueId} is already added`,
          onClose: () => setAlert(null),
        });
        return false;
      }
    });

    let teams = [];

    // get league info, start chain
    await getLeagueInfo(
      leagueId,
      (info) => {
        // console.log({ info });
        if (!info) {
          setAlert({
            severity: "error",
            message: `No league found for ${leagueId}`,
          });
          return false;
        }
        let leagueName = info.name;

        getRosters(leagueId, (rosters) => {
          // console.log({ rosters });
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

            getUserInfo(roster.owner_id, (user) => {
              // add team data to teams array
              teams.push({
                username: user.username,
                id: leagueId + roster.owner_id,
                owner_id: roster.owner_id,
                leagueId,
                leagueName: leagueName,
                pointsFor: (fpts + fpts_decimal / 100).toFixed(2),
                maxPointsFor: (ppts + ppts_decimal / 100).toFixed(2),
                pointsAgainst: (
                  fpts_against +
                  fpts_against_decimal / 100
                ).toFixed(2),
                wins: wins,
                losses: losses,
                ties: ties,
              });
              if (teams.length === info.total_rosters) {
                setAllTeams((preAllTeams) => [...preAllTeams, ...teams]);
                console.log({ teams });
                setAlert({
                  severity: "success",
                  message: `Successfully added rosters for ${leagueId}`,
                  onClose: () => setAlert(null),
                });
              }
            });
          });
        });
      },
      // displaying axios error on front-end
      (error) => {
        console.log({ error });
        setAlert({
          severity: "error",
          message: `Error fetching rosters for ${leagueId}`,
          onClose: () => setAlert(null),
        });
      }
    );
  };

  const handleAddLeague = async () => {
    if (leagueIdValue === "") {
      setAlert({
        severity: "warning",
        message: `Please enter a league ID`,
        onClose: () => setAlert(null),
      });
      return false;
    }

    // check to see if leagueId is already added
    if (!leagueIds.includes(leagueIdValue)) {
      setAlert({
        severity: "info",
        message: `Fetching rosters for ${leagueIdValue}`,
      });
      await getLeagueInfo(
        leagueIdValue,
        (info) => {
          setLeagueIdValue("");
          setAlert(null);
          router.push({
            pathname: `/tournament/`,
            query: { leagues: [...leagueIds, leagueIdValue].join("-") },
          });
        },
        (error) => {
          console.log({ error });
          setAlert({
            severity: "error",
            message: `Error fetching rosters for ${leagueIdValue}`,
            onClose: () => setAlert(null),
          });
        }
      );
    } else {
      setAlert({
        severity: "warning",
        message: `League ${leagueIdValue} is already added`,
        onClose: () => setAlert(null),
      });
    }
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
              <Alert
                severity={alert.severity}
                onClose={alert.onClose && alert.onClose}
              >
                {alert.message}
              </Alert>
            )}
          </div>
        </div>
        {allTeams.length > 0 && (
          <div className={styles.teams}>
            <DataGrid
              rows={allTeams}
              columns={columns}
              getRowId={(row) => {
                return row.id;
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
