let allItems = [];
let filters = [];
let loaded = false;

const idsToModify = ["attackSpeedBonus", "bonusAirDamage", "bonusAirDefense", "bonusEarthDamage", "bonusEarthDefense", "bonusFireDamage", "bonusFireDefense", "bonusThunderDamage", "bonusThunderDefense", "bonusWaterDamage", "bonusWaterDefense", "damageBonus", "damageBonusRaw", "emeraldStealing", "exploding", "gatherSpeed", "gatherXpBonus", "healthBonus", "healthRegen", "healthRegenRaw", "jumpHeight", "lifeSteal", "lootBonus", "lootQuality", "manaRegen", "manaSteal", "poison", "rainbowSpellDamageRaw", "reflection", "soulPoints", "speed", "spellCostPct1", "spellCostPct2", "spellCostPct3", "spellCostPct4", "spellCostRaw1", "spellCostRaw2", "spellCostRaw3", "spellCostRaw4", "spellDamage", "spellDamageRaw", "sprint", "sprintRegen", "thorns", "xpBonus"];

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
        poison: "Poison",
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
        damage          : 'neutral-type',
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

const checkboxFilters = [sortInvertFilter, mythicFilter, fabledFilter, legendaryFilter, rareFilter, uniqueFilter, setFilter, normalFilter, wandFilter, bowFilter, daggerFilter, spearFilter, relikFilter, ringFilter, braceletFilter, necklaceFilter, helmetFilter, chestplateFilter, leggingsFilter, bootsFilter];
const weaponCheckboxes = [wandFilter, bowFilter, daggerFilter, spearFilter, relikFilter];
const accessoriesCheckboxes = [ringFilter, braceletFilter, necklaceFilter];
const armorCheckboxes = [helmetFilter, chestplateFilter, leggingsFilter, bootsFilter];

const levelMinFilter = document.getElementById("level-min-filter");
const levelMaxFilter = document.getElementById("level-max-filter");

const itemLimit = 200;

const levelRange = { min: levelMinFilter.value, max: levelMaxFilter.value};

// Event Listeners on Checkboxes
for (const checkbox of checkboxFilters) {
    if (checkbox["id"] !== "sort-invert-filter") {
        checkbox.addEventListener("mousedown", (event) => {
            uncheckAll(event);
        });
    }
    checkbox.addEventListener("change", (event) => {
        update();
    });
}

function updateItemDisplay(itemsToDisplay) {
    itemsDiv.innerHTML = "";
    let limitCounter = 0;
    for (const item of itemsToDisplay) {
        limitCounter++;
        let div_item = `<div class="item" onclick="debug('${item["name"]}')">` +
        `<h3 class="${item.tier.toLowerCase()}">${item["name"]}</h3>`

        if (item.type)
            div_item += `<div><img class="itemicon" src="icons/${item.type.toLowerCase()}.png"></div>`
        else
            div_item += `<div><img class="itemicon" src="icons/${item.accessoryType.toLowerCase()}.png"></div>`

        div_item += `<p class="subtitle">Combat Level ${item["level"]}<p>`;

        switch (item.category) {
            case 'weapon':
                // Show item's attack speed
                if (item.attackSpeed) {
                    div_item += `<p class="attack-speed">${id_dictionary.ATTACK_SPEED[item["attackSpeed"]]}</p>`
                }

                // Add weapon's damage
                div_item += '<div class="side">';
                for (const t in id_dictionary.DAMAGES) {
                    if (item[t] && item[t] != '0-0' && item[t] != 0)
                        div_item += `<p class="${id_dictionary.DAMAGES[t]} group"> Damage: ${item[t]}</p>`;
                }
                div_item += '</div>';

                // Show class requirement for weapon
                div_item += `<div class="side"><p class="group">Class Req: ${id_dictionary.CLASSES[item.type]}</p></div>`;
            break;
            case 'accessory':
            case 'armor':
                if (item.health)
                    div_item += `<p class="health side"> Health: ${item.health}</p>`;

                // Show armor's defenses
                div_item += '<div class="side">';
                for (const t in id_dictionary.DEFENSES) {
                    if (item[t] && item[t] != '0-0' && item[t] != 0)
                        div_item += `<p class="${id_dictionary.DEFENSES[t]} group"> Defense: ${item[t]}</p>`;
                }
                div_item += '</div>';
            break;
        }

        // Add Class requirement
        div_item += '<div class="side">'

        // Add Stats requirement
        if (item.strength > 0) {
            div_item += `<p class="group"><span class="earth-color">Strength</span> Min: ${item.strength}</p>`;
        }
        if (item.agility > 0) {
            div_item += `<p class="group"><span class="air-color">Agility</span> Min: ${item.agility}</p>`;
        }
        if (item.defense > 0) {
            div_item += `<p class="group"><span class="fire-color">Defense</span> Min: ${item.defense}</p>`;
        }
        if (item.intelligence > 0) {
            div_item += `<p class="group"><span class="water-color">Intelligence</span> Min: ${item.intelligence}</p>`;
        }
        if (item.dexterity > 0) {
            div_item += `<p class="group"><span class="thunder-color">Dexterity</span> Min: ${item.dexterity}</p>`;
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
                            if (id.substr(0, id.length - 4) === "spellCost") {
                                div_item += `<p class="info">~</p><p>${id_dictionary.IDS[id]}</p><p class="${(item[id].max < 0) ? 'positive' : 'negative'}">${item[id].max}</p>`;
                            } else {
                                div_item += `<p class="info">~</p><p>${id_dictionary.IDS[id]}</p><p class="${(item[id].max > 0) ? 'positive' : 'negative'}">${item[id].max}</p>`;
                            }
                        } else {
                            if (id.substr(0, id.length - 4) === "spellCost") {
                                div_item += `<p class="${(item[id].min < 0) ? 'positive' : 'negative'}">${item[id].min}</p><p>${id_dictionary.IDS[id]}</p><p class="${(item[id].max < 0) ? 'positive' : 'negative'}">${item[id].max}</p>`;
                            } else {
                                div_item += `<p class="${(item[id].min > 0) ? 'positive' : 'negative'}">${item[id].min}</p><p>${id_dictionary.IDS[id]}</p><p class="${(item[id].max > 0) ? 'positive' : 'negative'}">${item[id].max}</p>`;
                            }
                        }
                        break;
                    case 'number':
                        div_item += `<p class="info">~</p><p>${id_dictionary.IDS[id]}</p>`;
                        if (id.substr(0, id.length - 4) === "spellCost") {
                            div_item += `<p class="${(item[id] < 0) ? 'positive' : 'negative'}">${item[id]}</p>`;
                        } else {
                            div_item += `<p class="${(item[id] > 0) ? 'positive' : 'negative'}">${item[id]}</p>`;
                        }
                        break;
                }
                div_item += `</div>`
            }
        }

        // Major ID
        if (item.majorIds) {
            switch (item.majorIds[0]) {
                case "HAWKEYE": {
                    div_item += `<p class="majorid-title">Hawkeye:</p>`;
                    div_item += `<p class="majorid-desc">Arrow storm fires 5 arrows, each dealing 120% damage.</p>`;
                    break;
                }
                case "SORCERY": {
                    div_item += `<p class="majorid-title">Sorcery:</p>`;
                    div_item += `<p class="majorid-desc">30% chance for spells and attacks to cast a second time at no additional cost.</p>`;
                    break;
                }
                case "ARCANES": {
                    div_item += `<p class="majorid-title">Transcendence:</p>`;
                    div_item += `<p class="majorid-desc">50% chance for spells to cost no mana when casted.</p>`;
                    break;
                }
                case "TAUNT": {
                    div_item += `<p class="majorid-title">Taunt:</p>`;
                    div_item += `<p class="majorid-desc">Mobs within 12 blocks target you upon casting War Scream.</p>`;
                    break;
                }
                case "ROVINGASSASSIN": {
                    div_item += `<p class="majorid-title">Roving Assassin:</p>`;
                    div_item += `<p class="majorid-desc">Vanish no longer drains mana while invisible.</p>`;
                    break;
                }
                case "PLAGUE": {
                    div_item += `<p class="majorid-title">Plague:</p>`;
                    div_item += `<p class="majorid-desc">Poisoned mobs spread 70% of their poison to nearby mobs.</p>`;
                    break;
                }
                case "MAGNET": {
                    div_item += `<p class="majorid-title">Magnet:</p>`;
                    div_item += `<p class="majorid-desc">Pulls items within an 8 block radius towards you.</p>`;
                    break;
                }
                case "LIGHTWEIGHT": {
                    div_item += `<p class="majorid-title">Lightweight:</p>`;
                    div_item += `<p class="majorid-desc">You no longer take fall damage.</p>`;
                    break;
                }
                case "MADNESS": {
                    div_item += `<p class="majorid-title">Madness:</p>`;
                    div_item += `<p class="majorid-desc">Casts a random ability every 3 seconds.</p>`;
                    break;
                }
                case "GREED": {
                    div_item += `<p class="majorid-title">Greed:</p>`;
                    div_item += `<p class="majorid-desc">Picking up emeralds heals you and nearby players for 15% max health.</p>`;
                    break;
                }
                case "GUARDIAN": {
                    div_item += `<p class="majorid-title">Guardian:</p>`;
                    div_item += `<p class="majorid-desc">50% of damage taken by nearby allies is redirected to you.</p>`;
                    break;
                }
                case "ENTROPY": {
                    div_item += `<p class="majorid-title">Entropy:</p>`;
                    div_item += `<p class="majorid-desc">Meteor falls three times faster.</p>`;
                    break;
                }
                case "CAVALRYMAN": {
                    div_item += `<p class="majorid-title">Cavalryman:</p>`;
                    div_item += `<p class="majorid-desc">You may cast spells and attack with a 70% damage penalty while on a horse.</p>`;
                    break;
                }
                case "ALTRUISM": {
                    div_item += `<p class="majorid-title">Heart of the Pack:</p>`;
                    div_item += `<p class="majorid-desc">Nearby players gain 35% of the health you naturally regenerate.</p>`;
                    break;
                }
                case "HERO": {
                    div_item += `<p class="majorid-title">Saviour's Sacrfice:</p>`;
                    div_item += `<p class="majorid-desc">While under 30% maximum health, nearby allies gain 50% bonus damage and defence.</p>`;
                    break;
                }
                case "CHERRY_BOMBS": {
                    div_item += `<p class="majorid-title">Cherry Bombs:</p>`;
                    div_item += `<p class="majorid-desc">Your Smoke Bombs explode instantly on contact, dealing 110% damage each.</p>`;
                    break;
                }
                case "RALLY": {
                    div_item += `<p class="majorid-title">Rally:</p>`;
                    div_item += `<p class="majorid-desc">Charge heals you by 10% and nearby allies by 15% on impact, but becomes harmless.</p>`;
                    break;
                }
                case "FREERUNNER": {
                    div_item += `<p class="majorid-title">Freerunner:</p>`;
                    div_item += `<p class="majorid-desc">Double your sprint speed when your sprint bar is under 30%.</p>`;
                    break;
                }
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
    //let sortType = sortTypeFilter.value;
    //let filters = [{ 'name': 'level', 'invert': false }, { 'name': 'pointsSum', 'invert': false }];
    let sortedArray = allItems
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
        if (i["type"] === "Ring" || i["accessoryType"] === "Ring")
            return ringFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Bracelet" || i["accessoryType"] === "Bracelet")
            return braceletFilter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["type"] === "Necklace" || i["accessoryType"] === "Necklace")
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
    .filter((i) => {
        if (i["level"] >= levelRange["min"] && i["level"] <= levelRange["max"])
            return true;
        else
            return false;
    })
    .filter((i) => {
        for (const f of filters) {
            switch (f["name"]) {
                case "alphabetical":
                case "level": {
                    break;
                }
                case "pointsSum": {
                    //toReturn = (i["agilityPoints"] !== 0 || i["dexterityPoints"] !== 0 || i["strengthPoints"] !== 0 || i["defensePoints"] !== 0 || i["intelligencePoints"] !== 0);
                    if (!(i["agilityPoints"] !== 0 || i["dexterityPoints"] !== 0 || i["strengthPoints"] !== 0 || i["defensePoints"] !== 0 || i["intelligencePoints"] !== 0))
                        return false;
                    break;
                }
                case "majorid": {
                    /*if (i["majorIds"]) {
                        console.log(i);
                        return true;
                    } else*/ if (!i["majorIds"]) {
                        /*switch(i["name"]) {
                            case "Infernal Impulse (1.20)":
                            case "Blossom Haze (1.20)":
                            case "Rhythm of Seasons (1.20)":
                            case "Panic Attack (1.20)":
                            case "Ornithopter (1.20)":
                            case "Double Vision (1.20)":
                            case "The Jingling Jester (1.20)":
                                break;
                            default:
                                return false;
                        }*/
                        return false;
                    }
                    break;
                }
                case "untradable": {
                    //return i["restrictions"];
                    if (!i["restrictions"])
                        return false;
                    break;
                }
                case "health": {
                    if (!i["health"])
                        return false;
                    break;
                }
                case "totalhealth": {
                    if (!i["health"] && !i["healthBonus"])
                        return false;
                    break;
                }
                default: {
                    /*if (i[sortType])
                        return true;
                    else*/
                    if (!i[f["name"]])
                        return false;
                    break;
                }
            }
        }
        return true;
    });

    sortedArray = sortedArray.sort((a, b) => {
        return customSort(a, b, filters);
    });

    return sortedArray;
}

function uncheckAll(event) {
    if (event && event["button"] === 2) {
        let uncheckType = "equip";
        let filterlists = {
            "rarity": [mythicFilter, fabledFilter, legendaryFilter, rareFilter, uniqueFilter, setFilter, normalFilter],
            "equip": [wandFilter, bowFilter, daggerFilter, spearFilter, relikFilter, ringFilter, braceletFilter, necklaceFilter, helmetFilter, chestplateFilter, leggingsFilter, bootsFilter]
        }
        switch (event["target"]["id"]) {
            case "mythic-filter":
            case "fabled-filter":
            case "legendary-filter":
            case "rare-filter":
            case "unique-filter":
            case "set-filter":
            case "normal-filter":
                uncheckType = "rarity";
                break;
        }

        for (const chkbox of filterlists[uncheckType]) {
            if (chkbox["id"] !== event["target"]["id"]) {
                chkbox.checked = false;
            } else {
                chkbox.checked = true;
            }
        }

        update();
    }
}

function update() {
    updateItemDisplay(applyFilters(searchField.value));
}

function convertIds() {
    for (const id of idsToModify) {
        for (const item of allItems) {
            if (item[id] && item[id] !== 0) {
                if (item["identified"] === false || item["identified"] === undefined) {
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
    fetch("./newapiitems.json").then((data) => {
        data.json().then((data) => {
            allItems = data;
            //convertIds();
            //console.log(allItems);
            finishedLoading();
        })
    })
    isLoaded();
}

$(document).ready(function () {
    $('#sort-type-filter').select2();
});

/*function requestItems() {
    $.ajax({
        url: "https://api.wynncraft.com/public_api.php?action=itemDB&category=all",
        success: (data) => {
            allItems = data["items"];
            convertIds();
            console.log(allItems);
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

function addFilter() {
    let filterName = sortTypeFilter.value;
    let filterInvert = sortInvertFilter.checked;
    
    let alreadyAdded = false;
    for (const f of filters) {
        if (f["name"] == filterName) {
            alreadyAdded = true;
            break;
        }
    }
    if (!alreadyAdded) {
        filters.push({name: filterName, invert: filterInvert});
        //console.log(filters);
        updateFilterList();
        update();
    }
}

function updateFilterList() {
    let filterList = document.getElementById("filter-list");
    filterList.innerHTML = "";

    let filterString = "";
    for (const f of filters) {
        switch (f["name"]) {
            case "majorid":
            case "untradable": {
                filterString += `<span class="filter-entry" onmousedown="deleteFilter('${f["name"]}')">[${f["name"]}]</span>, `;
                break;
            }
            default: {
                filterString += `<span class="filter-entry" onmousedown="deleteFilter('${f["name"]}')">[${f["name"]}: ${(f["invert"]) ? "descendant" : "ascendant"}]</span>, `;
                break;
            }
        }
        
    }
    filterString = filterString.substr(0, filterString.length - 2);

    filterList.insertAdjacentHTML("beforeend", filterString);
}

function deleteFilter(filterName) {
    for (const f of filters) {
        if (f["name"] == filterName) {
            filters.splice(filters.indexOf(f), 1);
        }
    }
    updateFilterList();
    update();
}

function resetFields() {
    for (const chkbox of checkboxFilters) {
        chkbox.checked = true;
    }
    searchField.value = "";
    filters = [];

    levelMinFilter.value = 0;
    levelMaxFilter.value = 106;
    levelRange["min"] = 0;
    levelRange["max"] = 106;

    updateFilterList();
    update();
}

function checkAndUpdateLevelRange() {
    let minLevel = parseInt(levelMinFilter.value);
    let maxLevel = parseInt(levelMaxFilter.value);

    if (minLevel < 0) {
        levelMinFilter.value = 0;
        minLevel = 0;
    }

    if (maxLevel < minLevel) {
        levelMaxFilter.value = minLevel;
        maxLevel = minLevel;
    }

    levelRange["min"] = minLevel;
    levelRange["max"] = maxLevel;

    update();
}

function filterWeapons() {
    for (const c of weaponCheckboxes) {
        c.checked = true;
    }
    for (const c of accessoriesCheckboxes) {
        c.checked = false;
    }
    for (const c of armorCheckboxes) {
        c.checked = false;
    }

    update();
}

function filterAccessories() {
    for (const c of weaponCheckboxes) {
        c.checked = false;
    }
    for (const c of accessoriesCheckboxes) {
        c.checked = true;
    }
    for (const c of armorCheckboxes) {
        c.checked = false;
    }

    update();
}

function filterArmor() {
    for (const c of weaponCheckboxes) {
        c.checked = false;
    }
    for (const c of accessoriesCheckboxes) {
        c.checked = false;
    }
    for (const c of armorCheckboxes) {
        c.checked = true;
    }

    update();
}


function debug(name) {
    console.log(allItems.find((i) => {return i["name"] === name}));
}