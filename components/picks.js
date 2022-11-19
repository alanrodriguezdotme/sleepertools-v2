import { Card, Grid, useTheme } from "@mui/material";
import styles from "../styles/LeagueView.module.scss";
import { currentYear } from "../utils/helpers";

export default function Picks({ rosters, draftView }) {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
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
              let isFuturePick = parseInt(pick.season) > currentYear() + 1;
              return (
                <Grid item key={`pick-${i}`} className={styles.pickContainer}>
                  <Card
                    xs={1}
                    className={styles.pick}
                    sx={{
                      backgroundColor: isFuturePick
                        ? theme.palette.pickSubdued[mode]
                        : theme.palette.pick[mode],
                      color: theme.palette.text[mode],
                      opacity: isFuturePick ? 0.66 : 1,
                    }}
                  >
                    <div className={styles.value}>
                      {draftView && !isFuturePick
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
  );
}
