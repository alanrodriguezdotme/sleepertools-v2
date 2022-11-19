import { Box, Card, Grid, useTheme } from "@mui/material";
import styles from "../styles/LeagueView.module.scss";

export default function Users({ rosters }) {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
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
                <div className={styles.username}>{team.user.display_name}</div>
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
  );
}
