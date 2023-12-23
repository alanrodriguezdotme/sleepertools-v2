import axios from "axios";
import { currentYear } from "./helpers";

export async function getUserInfo(username, set) {
  await axios.get(`https://api.sleeper.app/v1/user/${username}`).then((res) => {
    if (set) {
      set(res.data);
    } else {
      return res.data;
    }
  });
}

export async function getUserLeagues(userId, set) {
  await axios
    .get(
      `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${currentYear()}`
    )
    .then((res) => {
      if (set) {
        set(res.data);
      } else {
        return res.data;
      }
    });
}

export async function getLeagueInfo(leagueId, set, setError) {
  await axios
    .get(`https://api.sleeper.app/v1/league/${leagueId}`)
    .then((res) => {
      if (set) {
        set(res.data);
      } else {
        return res.data;
      }
    })
    .catch((err) => {
      if (setError) {
        setError(err);
      }
      return err;
    });
}

export async function getRosters(leagueId, set) {
  await axios
    .get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`)
    .then((res) => {
      if (set) {
        set(res.data);
      } else {
        return res.data;
      }
    });
}

export async function getLeagueUsers(leagueId, set) {
  await axios
    .get(`https://api.sleeper.app/v1/league/${leagueId}/users`)
    .then((res) => {
      if (set) {
        set(res.data);
      } else {
        return res.data;
      }
    });
}

export async function getTradedPicks(leagueId, set) {
  await axios
    .get(`https://api.sleeper.app/v1/league/${leagueId}/traded_picks`)
    .then((res) => {
      if (set) {
        set(res.data);
      } else {
        return res.data;
      }
    });
}
