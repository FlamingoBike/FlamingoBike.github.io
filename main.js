let allItems = [];
let loaded = false;

const idsToModify = ["bonusAirDamage", "bonusAirDefense", "bonusEarthDamage", "bonusEarthDefense", "bonusFireDamage", "bonusFireDefense", "bonusThunderDamage", "bonusThunderDefense", "bonusWaterDamage", "bonusWaterDefense", "damageBonus", "damageBonusRaw", "emeraldStealing", "exploding", "gatherSpeed", "gatherXpBonus", "healthBonus", "healthRegen", "healthRegenRaw", "jumpHeight", "lifeSteal", "lootBonus", "lootQuality", "manaRegen", "manaSteal", "poison", "rainbowSpellDamageRaw", "reflection", "soulPoints", "speed", "spellCostPct1", "spellCostPct2", "spellCostPct3", "spellCostPct4", "spellCostRaw1", "spellCostRaw2", "spellCostRaw3", "spellCostRaw4", "spellDamage", "spellDamageRaw", "sprint", "sprintRegen", "thorns", "xpBonus"];

const id_dictionary = Object.freeze({
    ATTACK_SPEED: {
        SUPER_SLOW  : 'Super Slow Attack Speed',
        VERY_SLOW   : 'Very Slow Attack Speed',
        SLOW        : 'Slow Attack Speed',
        NORMAL      : 'Normal Attack Speed',
        FAST        : 'Fast Attack Speed',
        VERY_FAST   : 'Very Fast Attack Speed',
        SUPER_FAST  : 'Super Fast Attack Speed'
    },
    CLASSES: {
        Wand    :   'Mage/Dark Wizard',
        Relik   :   'Shaman/Skyseer',
        Bow     :   'Archer/Hunter',
        Dagger  :   'Assassin/Ninja',
        Spear   :   'Warrior/Knight',
    },
    IDS: {
        agilityPoints: "Agility",
        defensePoints: "Defense",
        dexterityPoints: "Dexterity",
        intelligencePoints: "Intelligence",
        strengthPoints: "Strength",
        emeraldStealing: "Stealing",
        exploding: "Exploding",
        reflection: "Reflection",
        soulPoints: "Soul Point Regen",
        speed: "Walk Speed",
        jumpHeight: "Jump Height",
        lootBonus: "Loot Bonus",
        lootQuality: "Loot Quality",
        xpBonus: "Combat XP Bonus",
        sprint: "Sprint Duration",
        sprintRegen: "Sprint Regen",
        thorns: "Thorns",
        healthBonus: "Health Bonus",
        healthRegen: "Health Regen %",
        healthRegenRaw: "Health Regen Raw",
        lifeSteal: "Life Steal",
        manaRegen: "Mana Regen",
        manaSteal: "Mana Steal",
        attackSpeedBonus: "Attack Speed Bonus",
        bonusAirDamage: "Air Damage %",
        bonusAirDefense: "Air Defense %",
        bonusEarthDamage: "Earth Damage %",
        bonusEarthDefense: "Earth Defense %",
        bonusFireDamage: "Fire Damage %",
        bonusFireDefense: "Fire Defense %",
        bonusThunderDamage: "Thunder Damage %",
        bonusThunderDefense: "Thunder Defense %",
        bonusWaterDamage: "Water Damage %",
        bonusWaterDefense: "Water Defense %",
        damageBonus: "Main Attack Damage %",
        damageBonusRaw: "Main Attack Damage Raw",
        spellDamageRaw: "Spell Damage Raw",
        spellDamage: "Spell Damage %",
        spellCostPct1: "1st Spell Cost %",
        spellCostPct2: "2nd Spell Cost %",
        spellCostPct3: "3rd Spell Cost %",
        spellCostPct4: "4th Spell Cost %",
        spellCostRaw1: "1st Spell Cost Raw",
        spellCostRaw2: "2nd Spell Cost Raw",
        spellCostRaw3: "3rd Spell Cost Raw",
        spellCostRaw4: "4th Spell Cost Raw",
        gatherSpeed: "Gathering Speed Bonus",
        gatherXpBonus: "Gathering XP %"
    },
    DAMAGES: {
        fireDamage      : 'fire-type',
        waterDamage     : 'water-type',
        airDamage       : 'air-type',
        thunderDamage   : 'thunder-type',
        earthDamage     : 'earth-type'
    },
    DEFENSES: {
        fireDefense     : 'fire-type',
        waterDefense    : 'water-type',
        airDefense      : 'air-type',
        thunderDefense  : 'thunder-type',
        earthDefense    : 'earth-type'
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

const wandFilter = document.getElementById("wand-filter");
const bowFilter = document.getElementById("bow-filter");
const daggerFilter = document.getElementById("dagger-filter");
const spearFilter = document.getElementById("spear-filter");
const relikFilter = document.getElementById("relik-filter");

const ringFilter = document.getElementById("ring-filter");
const braceletFilter = document.getElementById("bracelet-filter");
const necklaceFilter = document.getElementById("necklace-filter");

const helmetFilter = document.getElementById("helmet-filter");
const chestplateFilter = document.getElementById("chestplate-filter");
const leggingsFilter = document.getElementById("leggings-filter");
const bootsFilter = document.getElementById("boots-filter");

const sortTypeFilter = document.getElementById("sort-type-filter");
const sortInvertFilter = document.getElementById("sort-invert-filter");

const itemLimit = 200;

function updateItemDisplay(itemsToDisplay) {
    itemsDiv.innerHTML = "";
    let limitCounter = 0;
    for (const item of itemsToDisplay) {
        limitCounter++;
        let div_item = `<div class="item" onclick="debug('${item["name"]}')">` +
        `<h3 class="${item.tier.toLowerCase()}">${item["name"]}</h3>` +
        `<p class="subtitle">Combat Level ${item["level"]}<p>`;

        switch (item.category) {
            case 'weapon':
                // Show item's attack speed
                if (item.attackSpeed) {
                    div_item += `<p class="attack-speed">${id_dictionary.ATTACK_SPEED[item["attackSpeed"]]}</p>`
                }

                // Add weapon's damage
                div_item += '<div class="side">';
                for (const t in id_dictionary.DAMAGES) {
                    if (item[t] != '0-0')
                        div_item += `<p class="${id_dictionary.DAMAGES[t]} group"> Damage: ${item[t]}</p>`;
                }
                div_item += '</div>';

                // Show class requirement for weapon
                div_item += `<div class="side"><p class="group">Class Req: ${id_dictionary.CLASSES[item.type]}</p></div>`;
            break;
            case 'armor':
                if (item.health)
                    div_item += `<p class="health side"> Health: ${item.health}</p>`;

                // Show armor's defenses
                div_item += '<div class="side">';
                for (const t in id_dictionary.DEFENSES) {
                    if (item[t] != '0-0')
                        div_item += `<p class="${id_dictionary.DEFENSES[t]} group"> Defense: ${item[t]}</p>`;
                }
                div_item += '</div>';
            break;
        }

        // Add Class requirement
        div_item += '<div class="side">'

        // Add Stats requirement
        if (item.strength > 0) {
            div_item += `<p class="group">Strength Min: ${item.strength}</p>`;
        }
        if (item.agility > 0) {
            div_item += `<p class="group">Agility Min: ${item.agility}</p>`;
        }
        if (item.defense > 0) {
            div_item += `<p class="group">Defense Min: ${item.defense}</p>`;
        }
        if (item.intelligence > 0) {
            div_item += `<p class="group">Intelligence Min: ${item.intelligence}</p>`;
        }
        if (item.dexterity > 0) {
            div_item += `<p class="group">Dexterity Min: ${item.dexterity}</p>`;
        }
        // Close stats div
        div_item += '</div>';

        // Item bonuses
        div_item += '<div class="info flex fl-row fl-space-between">' +
        '<p>Min</p><p>Name</p><p>Max</p>';
        div_item += '</div>';

        for (const id in id_dictionary.IDS) {
            if (item[id] !== 0) {
                div_item += `<div class="stat flex fl-row fl-space-between">`
                switch (typeof(item[id])) {
                    case 'object':
                        if (item[id].min == item[id].max) {
                            div_item += `<p class="info">~</p><p>${id_dictionary.IDS[id]}</p><p class="${(item[id].max > 0) ? 'positive' : 'negative'}">${item[id].max}</p>`;
                        } else {
                            div_item += `<p class="${(item[id].min > 0) ? 'positive' : 'negative'}">${item[id].min}</p><p>${id_dictionary.IDS[id]}</p><p class="${(item[id].max > 0) ? 'positive' : 'negative'}">${item[id].max}</p>`;
                        }
                        break;
                    case 'number':
                        div_item += `<p class="info">~</p><p>${id_dictionary.IDS[id]}</p>` +
                        `<p class="${(item[id] > 0) ? 'positive' : 'negative'}">${item[id]}</p>`;
                        break;
                }
                div_item += `</div>`
            }
        }

        if (item.restrictions)
            div_item += `<p class="restrictions info">${item.restrictions}</p>`;

        // Close divs
        div_item += '</div>';
        div_item += `</div>`;
        itemsDiv.insertAdjacentHTML("beforeend", div_item);

        if (limitCounter >= itemLimit) {
            break;
        }
    }
}

function applyFilters(searchStr) {
    let sortType = sortTypeFilter.value;
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
        if (i["tier"] === "Fabled")
            return fabledFilter.checked;
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
    .filter((i) => {
        if (i["type"] === "Wand")
            return wandFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Bow")
            return bowFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Dagger")
            return daggerFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Spear")
            return spearFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Relik")
            return relikFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        //if (i["accessoryType"] === "Ring")
        if (i["type"] === "Ring")
            return ringFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        //if (i["accessoryType"] === "Bracelet")
        if (i["type"] === "Bracelet")
            return braceletFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        //if (i["accessoryType"] === "Necklace")
        if (i["type"] === "Necklace")
            return necklaceFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Helmet")
            return helmetFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Chestplate")
            return chestplateFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Leggings")
            return leggingsFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Boots")
            return bootsFilter.checked;
        else
            return true;
    })
    .sort((a, b) => {
        let toReturn = 0;
        if (sortType === "alphabetical") {
            
            if (sortInvertFilter.checked) {
                (a["name"] < b["name"]) ? toReturn = 1 : toReturn = -1;
            } else {
                (a["name"] < b["name"]) ? toReturn = -1 : toReturn = 1;
            }
            
        } else {
            if (a[sortType] === 0) {
                return 1;
            } else if (b[sortType] === 0) {
                return -1;
            } else {
                if (sortInvertFilter.checked) {
                    //console.log(`A: ${a[sortType]["max"]}, B: ${b[sortType]["max"]}`);
                    (a[sortType]["max"] > b[sortType]["max"]) ? toReturn = 1 : toReturn = -1;
                } else {
                    //console.log(`A: ${a[sortType]["max"]}, B: ${b[sortType]["max"]}`);
                    (a[sortType]["max"] > b[sortType]["max"]) ? toReturn = -1 : toReturn = 1;
                }
            }
        }
        return toReturn;
    });
}

function update() {
    updateItemDisplay(applyFilters(searchField.value));
}

function convertIds() {
    for (const id of idsToModify) {
        for (const item of allItems) {
            if (item[id] && item[id] !== 0) {
                if (item[id] > 0) {
                    item[id] = {min: Math.round(item[id] * 0.3), max: Math.round(item[id] * 1.3)};
                    if (item[id]["min"] < 1) {
                        item[id]["min"] = 1;
                    }
                } else {
                    item[id] = {min: Math.round(item[id] * 1.3), max: Math.round(item[id] * 0.7)};
                    if (item[id]["max"] > -1) {
                        item[id]["max"] = -1;
                    }
                }
            } else {
                item[id] = 0;
            }
        }
    }
}

function finishedLoading() {
    loaded = true;
    isLoaded();
    update();
}

function requestItems() {
    fetch("./formatteditems.json").then((data) => {
        data.json().then((data) => {
            allItems = data;
            //convertIds();
            //console.log(allItems);
            finishedLoading()
        })
    })
    isLoaded();
}

/*function requestItems() {
    $.ajax({
        url: "https://api.wynncraft.com/public_api.php?action=itemDB&category=all",
        success: (data) => {
            //allItems = data["items"];
            //convertIds();
            //finishedLoading();
            //let apiItems = data["items"];

            fetch("./test.json").then((data) => {
                data.json().then((hppengItems) => {
                    fetch("./itemdata.json").then((data) => {
                        data.json().then((newItems) => {
                            //console.log(data);
                            //allItems = data;
                            for (const item of hppengItems) {
                                if (item["name"].includes("(1.20)")) {
                                    //let targetItemPos = apiItems.indexOf(apiItems.find((i) => { return i["name"] === item["name"].substr(0, item["name"].length - 7)}));
                                    //if (apiItems[targetItemPos] !== undefined) {
                                        //for (const key in item) {
                                            //apiItems[targetItemPos][key] = item[key];
                                        //}
                                    //} else {
                                        //apiItems.push(item);
                                    //}
                                    let found = newItems.find((i) => {return i["name"] === item["name"]})
                                    if (!found) {
                                        console.log(item["name"]);
                                    }
                                }
                            }
                            //console.log(apiItems);
                            //allItems = apiItems;
                            //convertIds();
                            //finishedLoading()
                        })
                    })
                })
            })

        }
    });
    //isLoaded();
    isLoaded();
}*/

function isLoaded() {
    let itemsDisplay = document.querySelector('#items-display');
    if (loaded !== true) {
        itemsDisplay.classList.add('loading');
    } else {
        itemsDisplay.classList.remove('loading');
    }
}

function checkEnterUpdate(event) {
    if (event.keyCode === 13) {
        update();
    }
}

function debug(name) {
    console.log(allItems.find((i) => {return i["name"] === name}));
}