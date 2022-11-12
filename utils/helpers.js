import _ from "lodash";

export function currentYear() {
  const d = new Date();
  return d.getFullYear();
}

export function sortPicks(leagueInfo, trades) {
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
          console.log({ original: allPicks[j], traded: tradedPicks[t] });
          allPicks[j].owner_id = tradedPicks[t].owner_id;
        }
      }
    }
  }

  return _.sortBy(allPicks, ["season", "owner_id", "round"]);
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

  team.forEach((player) => {
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
  });

  return [
    ...QBs,
    ...RBs,
    ...WRs,
    ...TEs,
    ...Ks,
    ...DEFs,
    ...DLs,
    ...LBs,
    ...DBs,
  ];
}
