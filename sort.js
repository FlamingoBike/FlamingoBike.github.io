function customSort(a, b, types) {

  // Types : [ Object {'name': 'alphabetical', 'invert': true}, Object {'name': 'level', 'invert': false} ]

  let toReturn = 0;

  for (const t of types) {
    switch (t["name"]) {
      case "alphabetical": {
        if (t["invert"]) {
          (a["name"] < b["name"]) ? toReturn = 1 : toReturn = -1;
        } else {
          (a["name"] < b["name"]) ? toReturn = -1 : toReturn = 1;
        }
        break;
      }
      case "level": {
        if (t["invert"]) {
          (a["level"] < b["level"]) ? toReturn = 1 : toReturn = -1;
        } else {
          (a["level"] < b["level"]) ? toReturn = -1 : toReturn = 1;
        }
        break;
      }
      case "pointsSum": {
        let aSum = a["agilityPoints"] + a["dexterityPoints"] + a["strengthPoints"] + a["defensePoints"] + a["intelligencePoints"];
        let bSum = b["agilityPoints"] + b["dexterityPoints"] + b["strengthPoints"] + b["defensePoints"] + b["intelligencePoints"];
        if (t["invert"]) {
          (aSum < bSum) ? toReturn = 1 : toReturn = -1;
        } else {
          (aSum < bSum) ? toReturn = -1 : toReturn = 1;
        }
        break;
      }
      case "majorid":
      case "untradable": {
        break;
      }
      default: {
        if (a[t["name"]] === 0) {
          return 1;
        } else if (b[t["name"]] === 0) {
          return -1;
        } else {
          let statA = (typeof (a[t["name"]]) === "object") ? a[t["name"]]["max"] : a[t["name"]];
          let statB = (typeof (b[t["name"]]) === "object") ? b[t["name"]]["max"] : b[t["name"]];
          if (t["invert"]) {
            //console.log(`A: ${a[sortType]["max"]}, B: ${b[sortType]["max"]}`);
            //(a[sortType]["max"] > b[sortType]["max"]) ? toReturn = 1 : toReturn = -1;
            if (t["name"].substr(0, t["name"].length - 4) === "spellCost") {
              (statA < statB) ? toReturn = -1 : toReturn = 1;
            } else {
              (statA > statB) ? toReturn = -1 : toReturn = 1;
            }
          } else {
            //console.log(`A: ${a[sortType]["max"]}, B: ${b[sortType]["max"]}`);
            //(a[sortType]["max"] > b[sortType]["max"]) ? toReturn = -1 : toReturn = 1;
            if (t["name"].substr(0, t["name"].length - 4) === "spellCost") {
              (statA < statB) ? toReturn = 1 : toReturn = -1;
            } else {
              (statA > statB) ? toReturn = 1 : toReturn = -1;
            }
          }
        }
        break;
      }
    }

    // The first of the filters that returns a non-zero value, breaks the for loop.
    // This is because they are added in order of importance, and the first that is non-zero is the most important.
    if (toReturn != 0) {
      break;
    }
  }

  return toReturn;
}