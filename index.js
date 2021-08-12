((productionMode = false) => {
  let openAllCollapsed = () => {
    let collapsedElements = document.querySelectorAll(
      ".suf-CompetitionMarketGroup-collapsed"
    );
    for (let element of collapsedElements) {
      element.click();
    }
  };

  // Extract team names, all in a single array
  let getTeamNames = (championshipContainer) => {
    let teamNameEls = championshipContainer.querySelectorAll(
      ".rcl-ParticipantFixtureDetailsTeam_TeamName"
    );
    let outArr = [];
    for (let teamNameEl of teamNameEls) {
      outArr.push(teamNameEl.innerText);
    }
    return outArr;
  };

  // Extract odds, all in a single array
  let getOddsArr = (championshipContainer) => {
    let oddsEls = championshipContainer.querySelectorAll(
      ".sgl-ParticipantOddsOnly80_Odds"
    );
    let oddsArr = [];
    for (let oddsEl of oddsEls) {
      oddsArr.push(oddsEl.innerText);
    }
    return oddsArr;
  };

  let crunchData = () => {
    let openChampionshipContainers = document.querySelectorAll(
      ".suf-CompetitionMarketGroup:not(.suf-CompetitionMarketGroup-collapsed)"
    );
    let data = [];
    for (championshipContainer of openChampionshipContainers) {
      let teamNamesArr = getTeamNames(championshipContainer);
      let oddsArr = getOddsArr(championshipContainer);

      debugger;

      // Get matches and odds together
      let matchesCount = teamNamesArr.length / 2;
      for (let matchIndex = 0; matchIndex < matchesCount; matchIndex += 1) {
        let teamA = teamNamesArr[matchIndex * 2];
        let teamB = teamNamesArr[matchIndex * 2 + 1];
        let odds1 = oddsArr[matchIndex];
        let oddsX = oddsArr[matchIndex + matchesCount];
        let odds2 = oddsArr[matchIndex + matchesCount * 2];
        data.push([teamA, teamB, odds1, oddsX, odds2]);
      }
    }
    return data;
  };

  let makeCsv = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    data.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let date = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `matches-${date}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  let waitUntil = (conditionFn, callback) => {
    let interval = setInterval(() => {
      if (conditionFn()) {
        clearInterval(interval);
        callback();
      }
    }, 500);
  };

  let allIsOpen = () =>
    !document.querySelectorAll(".suf-CompetitionMarketGroup-collapsed").length;

  /*
   *
   * NOW LET'S
   * RUN THIS!
   *
   */

  // Conservative mode, for development only
  if (!productionMode) {
    let data = crunchData();
    console.log(data);
    return;
  }

  // Production mode, will expand all championships and download the file
  waitUntil(allIsOpen, () => {
    let data = crunchData();
    makeCsv(data);
  });
  openAllCollapsed();
})(false); // 👁 remember to change false to true to make it work effectively 👁
