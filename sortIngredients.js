function customSort(a, b, types) {

    // Types : [ Object {'name': 'alphabetical', 'invert': true}, Object {'name': 'level', 'invert': false} ]

    let aIDs = a["identifications"];
    let bIDs = b["identifications"];

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
                let aSum = aIDs["AGILITYPOINTS"] + aIDs["DEXTERITYPOINTS"] + aIDs["STRENGTHPOINTS"] + aIDs["DEFENSEPOINTS"] + aIDs["INTELLIGENCEPOINTS"];
                let bSum = bIDs["AGILITYPOINTS"] + bIDs["DEXTERITYPOINTS"] + bIDs["STRENGTHPOINTS"] + bIDs["DEFENSEPOINTS"] + bIDs["INTELLIGENCEPOINTS"];
                if (t["invert"]) {
                    (aSum < bSum) ? toReturn = 1 : toReturn = -1;
                } else {
                    (aSum < bSum) ? toReturn = -1 : toReturn = 1;
                }
                break;
            }
            case "agilityRequirement":
            case "defenceRequirement":
            case "dexterityRequirement":
            case "intelligenceRequirement":
            case "strengthRequirement": {
                if (a["itemOnlyIDs"][t["name"]] === 0) {
                    return 1;
                } else if (b["itemOnlyIDs"][t["name"]] === 0) {
                    return -1;
                } else {
                    if (t["invert"]) {
                        (a["itemOnlyIDs"][t["name"]] > b["itemOnlyIDs"][t["name"]]) ? toReturn = -1 : toReturn = 1;
                    } else {
                        (a["itemOnlyIDs"][t["name"]] > b["itemOnlyIDs"][t["name"]]) ? toReturn = 1 : toReturn = -1;
                    }
                }
                break;
            }
            case "durability": {
                if (t["invert"]) {
                    (a["itemOnlyIDs"]["durabilityModifier"] > b["itemOnlyIDs"]["durabilityModifier"]) ? toReturn = -1 : toReturn = 1;
                } else {
                    (a["itemOnlyIDs"]["durabilityModifier"] > b["itemOnlyIDs"]["durabilityModifier"]) ? toReturn = 1 : toReturn = -1;
                }
                break;
            }
            case "duration": {
                if (a["consumableOnlyIDs"] && !b["consumableOnlyIDs"]) {
                    return 1
                } else if (!a["consumableOnlyIDs"] && b["consumableOnlyIDs"]) {
                    return -1
                } else {
                    if (t["invert"]) {
                        (a["consumableOnlyIDs"]["duration"] > b["consumableOnlyIDs"]["duration"]) ? toReturn = -1 : toReturn = 1;
                    } else {
                        (a["consumableOnlyIDs"]["duration"] > b["consumableOnlyIDs"]["duration"]) ? toReturn = 1 : toReturn = -1;
                    }
                }
                break;
            }
            case "charges": {
                if (a["consumableOnlyIDs"] && !b["consumableOnlyIDs"]) {
                    return 1
                } else if (!a["consumableOnlyIDs"] && b["consumableOnlyIDs"]) {
                    return -1
                } else {
                    if (t["invert"]) {
                        (a["consumableOnlyIDs"]["charges"] > b["consumableOnlyIDs"]["charges"]) ? toReturn = -1 : toReturn = 1;
                    } else {
                        (a["consumableOnlyIDs"]["charges"] > b["consumableOnlyIDs"]["charges"]) ? toReturn = 1 : toReturn = -1;
                    }
                }
                break;
            }
            case "totalEffectiveness": {
                if (a["ingredientPositionModifiers"] && !b["ingredientPositionModifiers"]) {
                    return 1
                } else if (!a["ingredientPositionModifiers"] && b["ingredientPositionModifiers"]) {
                    return -1
                } else {
                    aEff = a["ingredientPositionModifiers"]["left"] + a["ingredientPositionModifiers"]["right"] + a["ingredientPositionModifiers"]["above"] + a["ingredientPositionModifiers"]["under"] + a["ingredientPositionModifiers"]["touching"] + a["ingredientPositionModifiers"]["notTouching"];
                    bEff = b["ingredientPositionModifiers"]["left"] + b["ingredientPositionModifiers"]["right"] + b["ingredientPositionModifiers"]["above"] + b["ingredientPositionModifiers"]["under"] + b["ingredientPositionModifiers"]["touching"] + b["ingredientPositionModifiers"]["notTouching"];
                    if (t["invert"]) {
                        (aEff > bEff) ? toReturn = -1 : toReturn = 1;
                    } else {
                        (aEff > bEff) ? toReturn = 1 : toReturn = -1;
                    }
                }
                break;
            }
            default: {
                if (aIDs[t["name"]] === 0) {
                    return 1;
                } else if (bIDs[t["name"]] === 0) {
                    return -1;
                } else {
                    let statA = aIDs[t["name"]]["max"];
                    let statB = bIDs[t["name"]]["max"];
                    if (t["invert"]) {
                        (statA > statB) ? toReturn = -1 : toReturn = 1;
                    } else {
                        (statA > statB) ? toReturn = 1 : toReturn = -1;
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