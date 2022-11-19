import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material";
import * as playerData from "../api/players.json";
import styles from "../../styles/LeagueView.module.scss";
import { orderRosters, sortPicks, sortPlayers } from "../../utils/helpers";
import {
  getLeagueInfo,
  getLeagueUsers,
  getRosters,
  getTradedPicks,
} from "../../utils/sleeper-api";
import _ from "lodash";
import Users from "../../components/users";
import Picks from "../../components/picks";
import Rosters from "../../components/rosters";
import TopBar from "../../components/topbar";

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
            if (info?.settings?.type === 2) {
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
    if (rosters && leagueInfo.settings.type === 2) {
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
      <TopBar
        leagueInfo={leagueInfo}
        draftView={draftView}
        setDraftView={setDraftView}
        sortBy={sortBy}
        setSortBy={setSortBy}
        colorMode={colorMode}
        setColorMode={setColorMode}
      />
      <div className={styles.content}>
        <Users rosters={rosters} />
        {leagueInfo.settings.type === 2 && (
          <Picks rosters={rosters} draftView={draftView} />
        )}
        <Rosters rosters={rosters} />
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
