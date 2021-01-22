let allItems = [];
let loaded = false;

const id_dictionary = Object.freeze({
    ATTACK_SPEED: {
        SUPER_SLOW  : 'Super Slow Attack Speed',
        VERY_SLOW   : 'Very Slow Attack Speed',
        SLOW        : 'Slow Attack Speed',
        NORMAL      : 'Normal Attack Speed',
        FAST        : 'Fast Attack Speed',
        VERY_FAST   : 'Very Fast Attack Speed',
        SUPER_FAST  : 'Super Fast Attack Speed'
    }
});

const searchField = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const itemsDiv = document.getElementById("items-display");

const mythicFilter = document.getElementById("mythic-filter");
const fabledFilter = document.getElementById("fabled-filter");
const legendaryFilter = document.getElementById("legendary-filter");
const rareFilter = document.getElementById("rare-filter");
const uniqueFilter = document.getElementById("unique-filter");
const setFilter = document.getElementById("set-filter");
const normalFilter = document.getElementById("normal-filter");

function updateItemDisplay(itemsToDisplay) {
    itemsDiv.innerHTML = "";
    for (const item of itemsToDisplay) {
        let div_item = `<div class="item">` +
        `<h3>${item["name"]}</h3>` +
        `<p class="subtitle">Combat Level ${item["level"]}<p>`;

        if (item.attackSpeed) {
            div_item += `<p class="attack-speed">${id_dictionary.ATTACK_SPEED[item["attackSpeed"]]}</p>`
        }


        div_item += `</div>`;
        itemsDiv.insertAdjacentHTML("beforeend", div_item);
    }
}

function applyFilters(searchStr) {
    return allItems
    .filter((i) => {
        return i["name"].toLowerCase().includes(searchStr.toLowerCase());
    })
    .filter((i) => {
        if (i["tier"] === "Mythic")
            return mythicFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === "Legendary")
            return legendaryFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === "Rare")
            return rareFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === "Unique")
            return uniqueFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === "Set")
            return setFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === "Normal")
            return normalFilter.checked;
        else
            return true;
    })
    .sort((a, b) => {
        let toReturn = 0;
        (a["name"] < b["name"]) ? toReturn = -1 : toReturn = 1;
        return toReturn;
    });
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
    console.log(allItems.find((i) => {return i["name"] === "Morph-Stardust"}));
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
