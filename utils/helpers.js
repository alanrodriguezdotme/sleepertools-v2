import _ from "lodash";

export function currentYear() {
  const d = new Date();
  return d.getFullYear();
}

export function sortPicks(leagueInfo, trades, teams) {
  let allPicks = [];
  let tradedPicks = [];

  // create allPicks
  // for each roster in the league
  for (let roster = 1; roster < leagueInfo.total_rosters + 1; roster++) {
    // for each of the next 2 years
    for (let year = 2; year < 4; year++) {
      // for each draft round
      for (let round = 1; round <= leagueInfo.settings.draft_rounds; round++) {
        let pick = {
          season: (currentYear() - 1 + year).toString(),
          round,
          roster_id: roster,
          owner_id: roster,
        };
        allPicks.push(pick);
      }
    }
  }

  // reduce traded picks to future picks only
  for (let i = 0; i < trades.length; i++) {
    if (parseInt(trades[i].season, 10) >= currentYear()) {
      tradedPicks.push(trades[i]);
    }
  }

  console.log(`arranging picks`);

  // change owner_id of traded pick in allPicks
  for (let j = 0; j < allPicks.length; j++) {
    for (let t = 0; t < tradedPicks.length; t++) {
      /** If it's the same season and round */
      if (
        tradedPicks[t].season === allPicks[j].season &&
        tradedPicks[t].round === allPicks[j].round
      ) {
        /** Make sure it belongs to the right team */
        if (tradedPicks[t].roster_id === allPicks[j].roster_id) {
          allPicks[j].owner_id = tradedPicks[t].owner_id;
        }
      }
    }
  }

  // assign user info to each pick
  allPicks.forEach((pick) => {
    teams.forEach((team) => {
      if (pick.owner_id === team.roster_id) {
        pick.current_owner = team.user;
      }
      if (pick.previous_owner_id === team.roster_id) {
        pick.previous_owner = team.user;
      }
      if (pick.roster_id === team.roster_id) {
        pick.original_owner = team.user;
      }
    });
  });

  return _.sortBy(allPicks, ["season", "round", "owner_id"]);
}

export function sortPlayers(team) {
  let QBs = [];
  let RBs = [];
  let WRs = [];
  let TEs = [];
  let Ks = [];
  let DEFs = [];
  let DLs = [];
  let LBs = [];
  let DBs = [];

  console.log("... sorting players");

  team.forEach((player) => {
    if (player) {
      switch (player.position) {
        case "QB":
          QBs.push(player);
          break;
        case "RB":
          RBs.push(player);
          break;
        case "WR":
          WRs.push(player);
          break;
        case "TE":
          TEs.push(player);
          break;
        case "K":
          Ks.push(player);
          break;
        case "DEF":
          DEFs.push(player);
          break;
        case "DL":
          DLs.push(player);
          break;
        case "LB":
          LBs.push(player);
          break;
        case "DB":
          DBs.push(player);
          break;
        default:
          break;
      }
    }
  });

  function orderByADP(players) {
    return _.orderBy(players, (p) => p.search_rank, ["asc"]);
  }

  return [
    ...orderByADP(QBs),
    ...orderByADP(RBs),
    ...orderByADP(WRs),
    ...orderByADP(TEs),
    ...orderByADP(Ks),
    ...orderByADP(DEFs),
    ...orderByADP(DLs),
    ...orderByADP(LBs),
    ...orderByADP(DBs),
  ];
}

export function orderRosters(rostersToSort, sortType) {
  let sortedRosters = rostersToSort;
  switch (sortType) {
    case "default":
      sortedRosters = _.orderBy(sortedRosters, (team) => team.roster_id, [
        "asc",
      ]);
      break;
    case "wins-asc":
      sortedRosters = _.orderBy(
        sortedRosters,
        [(team) => team.settings.wins, (team) => team.settings.fpts],
        ["asc", "asc"]
      );
      break;
    case "wins-desc":
      sortedRosters = _.orderBy(
        sortedRosters,
        [(team) => team.settings.wins, (team) => team.settings.fpts],
        ["desc", "desc"]
      );
      break;
    case "fpts-asc":
      sortedRosters = _.orderBy(sortedRosters, (team) => team.settings.fpts, [
        "asc",
      ]);
      break;
    case "fpts-desc":
      sortedRosters = _.orderBy(sortedRosters, (team) => team.settings.fpts, [
        "desc",
      ]);
      break;
    case "ppts-asc":
      sortedRosters = _.orderBy(sortedRosters, (team) => team.settings.ppts, [
        "asc",
      ]);
      break;
    case "ppts-desc":
      sortedRosters = _.orderBy(sortedRosters, (team) => team.settings.ppts, [
        "desc",
      ]);
      break;
  }
  return sortedRosters;
}
