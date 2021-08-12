let openAllCollapsed = () => {
  let collapsedElements = document.querySelectorAll(
    ".suf-CompetitionMarketGroup-collapsed"
  );
  for (let element of collapsedElements) {
    element.click();
  }
};

let crunchData = () => {
  let openChampionshipRows = document.querySelectorAll(
    ".suf-CompetitionMarketGroup_Open"
  );
  let data = [];
  for (championshipRow of openChampionshipRows) {
    let championshipContainer = championshipRow.parentElement;

    // Extract team names, all in a single array, they are to regroup A vs B
    let teamNameEls = championshipContainer.querySelectorAll(
      ".rcl-ParticipantFixtureDetailsTeam_TeamName"
    );
    let teamNamesArr = [];
    for (let teamNameEl of teamNameEls) {
      teamNamesArr.push(teamNameEl.innerText);
    }

    // Extract odds
    let oddsEls = championshipContainer.querySelectorAll(
      ".sgl-ParticipantOddsOnly80_Odds"
    );
    let oddsArr = [];
    for (let oddsEl of oddsEls) {
      oddsArr.push(oddsEl.innerText);
    }

    // Separator line? (not for now)
    /* let championshipName = championshipContainer.querySelector(
      ".suf-CompetitionMarketGroupButton_Text"
    ).innerText;
    matchesAndOdds.push([`Championship: ${championshipName}`]); */

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
  link.setAttribute("download", "my_data.csv");
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

// Let's run this

(() => {
  let DEVMODE = true;
  if (DEVMODE) {
    let data = crunchData();
    console.log(data);
    return;
  }

  waitUntil(allIsOpen, () => {
    let data = crunchData();
    makeCsv(data);
  });
  openAllCollapsed();
})();
