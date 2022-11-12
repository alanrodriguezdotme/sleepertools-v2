import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import { getUserInfo, getUserLeagues } from "../utils/sleeper-api";

export default function Home() {
  const [sleeperUsername, setSleeperUsername] = useState("");
  const [sleeperLeagues, setSleeperLeagues] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const router = useRouter();

  function handleSignIn() {
    if (sleeperUsername.length > 0) {
      getUserInfo(sleeperUsername, (user) => {
        getUserLeagues(user.user_id, setSleeperLeagues);
      });
    }
  }

  function handleViewLeagueClick() {
    router.push(`/leagues/${selectedLeague.league_id}`);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          {sleeperLeagues === null ? (
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                id="sleeper-username"
                label="Enter your Sleeper username"
                value={sleeperUsername}
                onChange={(e) => setSleeperUsername(e.target.value)}
              />
              <Button variant="contained" onClick={handleSignIn}>
                Sign in
              </Button>
            </Grid>
          ) : (
            <Grid item>
              <InputLabel id="leagueDropdownLabel">
                Select one of your leagues
              </InputLabel>
              <Select
                labelId="leagueDropdownLabel"
                id="leagueDropdown"
                value={selectedLeague}
                defaultValue={sleeperLeagues[0]}
                label="Select one of your leagues"
                onChange={(e) => setSelectedLeague(e.target.value)}
              >
                {sleeperLeagues.map((league) => (
                  <MenuItem key={league.league_id} value={league}>
                    {league.name}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={handleViewLeagueClick}>
                View league
              </Button>
            </Grid>
          )}
        </Grid>
      </main>
    </div>
  );
}
