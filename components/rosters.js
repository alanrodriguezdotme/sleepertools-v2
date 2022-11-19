import { Card, Grid, useTheme } from "@mui/material";
import styles from "../styles/LeagueView.module.scss";

export default function Rosters({ rosters }) {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
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
                    <div className={styles.info}>👤 {player.position}</div>
                    <div className={styles.info}>🎂 {player.age}</div>
                  </div>
                  <div className={styles.meta}>
                    <div className={styles.info}>🏟️ {player.team}</div>
                    <div className={styles.info}>👕 {player.number}</div>
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
