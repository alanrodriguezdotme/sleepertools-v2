import {
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import { getUserInfo, getUserLeagues } from "../utils/sleeper-api";

export default function Home({ colorMode, setColorMode }) {
  const [sleeperUsername, setSleeperUsername] = useState("");
  const [sleeperLeagues, setSleeperLeagues] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const theme = useTheme();
  const router = useRouter();

  function handleSignIn() {
    if (sleeperUsername.length > 0) {
      getUserInfo(sleeperUsername, (user) => {
        getUserLeagues(user.user_id, setSleeperLeagues);
      });
    }
  }

  function handleViewLeagueClick() {
    router.push(`/league/${selectedLeague.league_id}`);
  }

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: theme.palette.background[colorMode],
        color: theme.palette.text[colorMode],
      }}
    >
      <main className={styles.main}>
        {/* <h1>Sleeper League View</h1> */}
        {sleeperLeagues === null ? (
          <div className={styles.formGroup}>
            <TextField
              id="sleeper-username"
              label="Enter your Sleeper username"
              value={sleeperUsername}
              onChange={(e) => setSleeperUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignIn();
                  e.preventDefault();
                }
              }}
            />
            <Button variant="contained" onClick={handleSignIn}>
              View your leagues
            </Button>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <FormControl>
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
            </FormControl>
            <Button variant="contained" onClick={handleViewLeagueClick}>
              View league
            </Button>
          </div>
        )}
        <div className={styles.footer}>
          Created by{" "}
          <Link
            href="https://alanrodriguez.me"
            target="_blank"
            rel="noreferrer"
          >
            Alan Rodriguez
          </Link>
        </div>
      </main>
    </div>
  );
}
