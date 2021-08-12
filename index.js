((productionMode = false) => {
  const openAllCollapsed = () => {
    const collapsedElements = document.querySelectorAll(
      ".suf-CompetitionMarketGroup-collapsed"
    );
    for (let element of collapsedElements) {
      element.click();
    }
  };

  // Extract team names, all in a single array
  const getTeamNames = (championshipContainer) => {
    const teamNameEls = championshipContainer.querySelectorAll(
      ".rcl-ParticipantFixtureDetailsTeam_TeamName"
    );
    const outArr = [];
    for (let teamNameEl of teamNameEls) {
      outArr.push(teamNameEl.innerText);
    }
    return outArr;
  };

  // Extract odds, all in a single array
  const getOddsArr = (championshipContainer) => {
    const oddsEls = championshipContainer.querySelectorAll(
      ".sgl-ParticipantOddsOnly80_Odds"
    );
    const oddsArr = [];
    for (let oddsEl of oddsEls) {
      oddsArr.push(oddsEl.innerText);
    }
    return oddsArr;
  };

  const crunchData = () => {
    const openChampionshipContainers = document.querySelectorAll(
      ".suf-CompetitionMarketGroup:not(.suf-CompetitionMarketGroup-collapsed)"
    );
    const data = [];
    for (championshipContainer of openChampionshipContainers) {
      const teamNamesArr = getTeamNames(championshipContainer);
      const oddsArr = getOddsArr(championshipContainer);

      //debugger;

      // Get matches and odds together
      const matchesCount = teamNamesArr.length / 2;
      for (let matchIndex = 0; matchIndex < matchesCount; matchIndex += 1) {
        const teamA = teamNamesArr[matchIndex * 2];
        const teamB = teamNamesArr[matchIndex * 2 + 1];
        const odds1 = oddsArr[matchIndex];
        const oddsX = oddsArr[matchIndex + matchesCount];
        const odds2 = oddsArr[matchIndex + matchesCount * 2];
        data.push([teamA, teamB, odds1, oddsX, odds2]);
      }
    }
    return data;
  };

  const makeCsv = (data) => {
    const csvContent = "data:text/csv;charset=utf-8,";

    data.forEach(function (rowArray) {
      const row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `matches-${date}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const waitUntil = (conditionFn, callback) => {
    const interval = setInterval(() => {
      if (conditionFn()) {
        clearInterval(interval);
        callback();
      }
    }, 500);
  };

  const allIsOpen = () =>
    !document.querySelectorAll(".suf-CompetitionMarketGroup-collapsed").length;

  /*
   *
   * NOW LET'S
   * RUN THIS!
   *
   */

  // Conservative mode, for development only
  if (!productionMode) {
    const data = crunchData();
    console.log(data);
    return;
  }

  // Production mode, will expand all championships and download the file
  waitUntil(allIsOpen, () => {
    const data = crunchData();
    makeCsv(data);
  });
  openAllCollapsed();
})(false); // 👁 remember to change false to true to make it work effectively 👁
