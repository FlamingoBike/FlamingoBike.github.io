let allItems = [];
let loaded = false;

const searchField = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const itemsDiv = document.getElementById("items-display");

function updateItemDisplay(itemsToDisplay) {
    itemsDiv.innerHTML = "";
    for (const item of itemsToDisplay) {
        itemsDiv.insertAdjacentHTML("beforeend", `<div class="item">${item["name"]}</div>&nbsp;`);
    }
}

function applyFilters(searchStr) {
    let filteredItems = allItems.filter((i) => {
        return i["name"].toLowerCase().includes(searchStr.toLowerCase());
    });

    filteredItems = filteredItems.sort((a, b) => {
        let toReturn = 0;
        (a["name"] < b["name"]) ? toReturn = -1 : toReturn = 1;
        return toReturn;
    });

    return filteredItems;
}

function update() {
    updateItemDisplay(applyFilters(searchField.value));
}

function convertIds() {
    const idsToModify = ["bonusAirDamage", "bonusAirDefense", "bonusEarthDamage", "bonusEarthDefense", "bonusFireDamage", "bonusFireDefense", "bonusThunderDamage", "bonusThunderDefense", "bonusWaterDamage", "bonusWaterDefense", "damageBonus", "damageBonusRaw", "emeraldStealing", "exploding", "gatherSpeed", "gatherXpBonus", "healthBonus", "healthRegen", "healthRegenRaw", "jumpHeight", "lifeSteal", "lootBonus", "lootQuality", "manaRegen", "manaSteal", "poison", "rainbowSpellDamageRaw", "reflection", "soulPoints", "speed", "spellCostPct1", "spellCostPct2", "spellCostPct3", "spellCostPct4", "spellCostRaw1", "spellCostRaw2", "spellCostRaw3", "spellCostRaw4", "spellDamage", "spellDamageRaw", "sprint", "sprintRegen", "thorns", "xpBonus"];

    for (const id of idsToModify) {
        for (const item of allItems) {
            if (item[id] !== 0) {
                if (item[id] > 0) {
                    item[id] = {min: Math.floor(item[id] * 0.3), max: Math.floor(item[id] * 1.3)};
                    if (item[id]["min"] < 1) {
                        item[id]["min"] = 1;
                    }
                } else {
                    item[id] = {min: Math.floor(item[id] * 1.3), max: Math.floor(item[id] * 0.7)};
                    if (item[id]["max"] > -1) {
                        item[id]["max"] = -1;
                    }
                }
            }
        }
    }
}

function finishedLoading() {
    loaded = true;
    isLoaded();
    updateItemDisplay(allItems);
    console.log(allItems.find((i) => {return i["name"] === "Divzer"}));
}

function requestItems() {
    $.ajax({
        url: "https://api.wynncraft.com/public_api.php?action=itemDB&category=all",
        success: (data) => {
            allItems = data["items"];
            convertIds();
            finishedLoading();
        }
    });
    isLoaded();
}

function isLoaded() {
    let itemsDisplay = document.querySelector('#items-display');
    if (loaded !== true) {
        itemsDisplay.classList.add('loading');
    } else {
        itemsDisplay.classList.remove('loading');
    }
}
