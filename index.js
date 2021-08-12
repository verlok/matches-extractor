((productionMode = false) => {
  const openAllCollapsed = () => {
    const collapsedElements = document.querySelectorAll(
      ".suf-CompetitionMarketGroup-collapsed"
    );
    for (let element of collapsedElements) {
      element.click();
    }
  };

  const getTextArrFromElements = (container, elementSelector) => {
    const elements = container.querySelectorAll(elementSelector);
    const output = [];
    for (let element of elements) {
      output.push(element.innerText);
    }
    return output;
  };

  const crunchData = () => {
    const openChampionshipContainers = document.querySelectorAll(
      ".suf-CompetitionMarketGroup:not(.suf-CompetitionMarketGroup-collapsed)"
    );
    const data = [];
    for (championshipContainer of openChampionshipContainers) {
      const timesArr = getTextArrFromElements(championshipContainer, ".rcl-ParticipantFixtureDetails_Details-datetime .rcl-ParticipantFixtureDetails_BookCloses");
      const teamNamesArr = getTextArrFromElements(championshipContainer, ".rcl-ParticipantFixtureDetailsTeam_TeamName");
      const oddsArr = getTextArrFromElements(championshipContainer, ".sgl-ParticipantOddsOnly80_Odds"); 

      // Get matches and odds together
      const matchesCount = timesArr.length;
      for (let matchIndex = 0; matchIndex < matchesCount; matchIndex += 1) {
        const teamA = teamNamesArr[matchIndex * 2];
        const teamB = teamNamesArr[matchIndex * 2 + 1];
        const time = timesArr[matchIndex];
        const odds1 = oddsArr[matchIndex];
        const oddsX = oddsArr[matchIndex + matchesCount];
        const odds2 = oddsArr[matchIndex + matchesCount * 2];
        data.push([teamA, teamB, time, odds1, oddsX, odds2]);
      }
    }
    return data;
  };

  const makeCsv = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";

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
    debugger;
    const data = crunchData();
    makeCsv(data);
  });
  openAllCollapsed();
})(true); // ⚠️👁 IMPORTANT! Change this "false" to "true" :)
