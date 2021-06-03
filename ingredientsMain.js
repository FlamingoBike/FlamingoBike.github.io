let allIngredients = [];
let filters = [];
let loaded = false;

const id_dictionary = Object.freeze({
  AGILITYPOINTS: "Agility",
  DEFENSEPOINTS: "Defense",
  DEXTERITYPOINTS: "Dexterity",
  INTELLIGENCEPOINTS: "Intelligence",
  STRENGTHPOINTS: "Strength",
  EMERALDSTEALING: "Stealing",
  EXPLODING: "Exploding",
  REFLECTION: "Reflection",
  SOULPOINTS: "Soul Point Regen",
  SPEED: "Walk Speed",
  JUMP_HEIGHT: "Jump Height",
  LOOTBONUS: "Loot Bonus",
  LOOT_QUALITY: "Loot Quality",
  XPBONUS: "Combat XP Bonus",
  STAMINA: "Sprint Duration",
  STAMINA_REGEN: "Sprint Regen",
  THORNS: "Thorns",
  POISON: "Poison",
  HEALTHBONUS: "Health Bonus",
  HEALTHREGEN: "Health Regen %",
  HEALTHREGENRAW: "Health Regen Raw",
  LIFESTEAL: "Life Steal",
  MANAREGEN: "Mana Regen",
  MANASTEAL: "Mana Steal",
  ATTACKSPEED: "Attack Speed Bonus",
  AIRDAMAGEBONUS: "Air Damage %",
  AIRDEFENSE: "Air Defense %",
  EARTHDAMAGEBONUS: "Earth Damage %",
  EARTHDEFENSE: "Earth Defense %",
  FIREDAMAGEBONUS: "Fire Damage %",
  FIREDEFENSE: "Fire Defense %",
  THUNDERDAMAGEBONUS: "Thunder Damage %",
  THUNDERDEFENSE: "Thunder Defense %",
  WATERDAMAGEBONUS: "Water Damage %",
  WATERDEFENSE: "Water Defense %",
  DAMAGEBONUS: "Main Attack Damage %",
  DAMAGEBONUSRAW: "Main Attack Damage Raw",
  SPELLDAMAGE: "Spell Damage %",
  SPELLDAMAGERAW: "Spell Damage Raw",
  GATHER_SPEED: "Gathering Speed Bonus",
  GATHER_XP_BONUS: "Gathering XP %"
});

const searchField = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const ingredientsDiv = document.getElementById("items-display");

// --- Filters

const star0Filter = document.getElementById("star0-filter");
const star1Filter = document.getElementById("star1-filter");
const star2Filter = document.getElementById("star2-filter");
const star3Filter = document.getElementById("star3-filter");

const alchemismFilter = document.getElementById("alchemism-filter");
const scribingFilter = document.getElementById("scribing-filter");
const cookingFilter = document.getElementById("cooking-filter");
const weaponsmithingFilter = document.getElementById("weaponsmithing-filter");
const woodworkingFilter = document.getElementById("woodworking-filter");
const tailoringFilter = document.getElementById("tailoring-filter");
const armouringFilter = document.getElementById("armouring-filter");
const jewelingFilter = document.getElementById("jeweling-filter");

const levelMinFilter = document.getElementById("level-min-filter");
const levelMaxFilter = document.getElementById("level-max-filter");

const sortTypeFilter = document.getElementById("sort-type-filter");
const sortInvertFilter = document.getElementById("sort-invert-filter");

// --- Limits

const itemLimit = 200;
const levelRange = { min: levelMinFilter.value, max: levelMaxFilter.value};

//

const checkboxFilters = [star0Filter, star1Filter, star2Filter, star3Filter, alchemismFilter, scribingFilter, cookingFilter, armouringFilter, tailoringFilter, weaponsmithingFilter, woodworkingFilter, jewelingFilter];

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

function updateIngredientDisplay(ingredientsToDisplay) {
    ingredientsDiv.innerHTML = "";
    let limitCounter = 0;
    for (const item of ingredientsToDisplay) {
        limitCounter++;
        let div_item = `<div class="item"> <h3>${item["name"]} `

        switch (item["tier"]) {
            case 0: {
                div_item += `[<span class="star0">✫✫✫</span>]`;
                break;
            }
            case 1: {
                div_item += `[<span class="star1">✫</span><span class="star0">✫✫</span>]`;
                break;
            }
            case 2: {
                div_item += `[<span class="star2">✫✫</span><span class="star0">✫</span>]`;
                break;
            }
            case 3: {
                div_item += `[<span class="star3">✫✫✫</span>]`;
                break;
            }
        }

        div_item += `</h3>`;

        div_item += `<p class="subtitle">Level ${item["level"]}<p>`;

        // Duration and Durability
        if (item["itemOnlyIDs"] && item["itemOnlyIDs"]["durabilityModifier"] !== 0 && item["consumableOnlyIDs"] && item["consumableOnlyIDs"]["duration"] !== 0) {
            div_item += `<div class="flex fl-row"><p><span class="${(item["itemOnlyIDs"]["durabilityModifier"] > 0) ? "positive" : "negative"}">${item["itemOnlyIDs"]["durabilityModifier"]} Durability</span> or <span class="${(item["consumableOnlyIDs"]["duration"] > 0) ? "positive" : "negative"}">${item["consumableOnlyIDs"]["duration"]} Duration</span></p></div>`
        } else if (item["itemOnlyIDs"]["durabilityModifier"] !== 0) {
            div_item += `<div class="flex fl-row"><p class="${(item["itemOnlyIDs"]["durabilityModifier"] > 0) ? "positive" : "negative"}">${item["itemOnlyIDs"]["durabilityModifier"]} Durability</p></div>`
        } else if (item["consumableOnlyIDs"]["duration"] !== 0) {
            div_item += `<div class="flex fl-row"><p class="${(item["consumableOnlyIDs"]["duration"] > 0) ? "positive" : "negative"}">${item["consumableOnlyIDs"]["duration"]} Duration</p></div>`
        }
        // Charges
        if (item["consumableOnlyIDs"] && item["consumableOnlyIDs"]["charges"] !== 0) {
            div_item += `<div class="flex fl-row"><p class="${(item["consumableOnlyIDs"]["charges"] > 0) ? "positive" : "negative"}">${item["consumableOnlyIDs"]["charges"]} Charges</p></div>`
        }
        // Skill Point Requirements
        let itemIDs = item["itemOnlyIDs"];
        for (const id in itemIDs) {
            if (itemIDs[id] !== 0) {
                if (id !== "durabilityModifier" && id !== "powderSlotModifier" && id !== "attackSpeedModifier") {
                    div_item += `<div><p><span class="${(itemIDs[id] > 0) ? "negative" : "positive"}">${itemIDs[id]}</span> `;
                    switch (id) {
                        case "strengthRequirement": {
                            div_item += `Strength req.</p></div>`;
                            break;
                        }
                        case "dexterityRequirement": {
                            div_item += `Dexterity req.</p></div>`;
                            break;
                        }
                        case "intelligenceRequirement": {
                            div_item += `Intelligence req.</p></div>`;
                            break;
                        }
                        case "defenceRequirement": {
                            div_item += `Defense req.</p></div>`;
                            break;
                        }
                        case "agilityRequirement": {
                            div_item += `Agility req.</p></div>`;
                            break;
                        }
                    }
                }
            }
        }
        // Slot Effectiveness Modifiers
        let posMods = item["ingredientPositionModifiers"];
        for (const pos in posMods) {
            if (posMods[pos] !== 0) {
                div_item += `<div><p><span class="${(posMods[pos] > 0) ? "positive" : "negative"}">${posMods[pos]}%</span> Effectiveness `;
                switch (pos) {
                    case "left": {
                        div_item += `to the Left</p></div>`;
                        break;
                    }
                    case "right": {
                        div_item += `to the Right</p></div>`;
                        break;
                    }
                    case "above": {
                        div_item += `Above</p></div>`;
                        break;
                    }
                    case "under": {
                        div_item += `Below</p></div>`;
                        break;
                    }
                    case "touching": {
                        div_item += `to Touching</p></div>`;
                        break;
                    }
                    case "notTouching": {
                        div_item += `to Not Touching</p></div>`;
                        break;
                    }
                }
            }
        }
        // Ingredient Identifications
        if (Object.keys(item["identifications"]).length !== 0) {
            div_item += '<div class="info flex fl-row fl-space-between">' +
            '<p>Min</p><p>Name</p><p>Max</p>';
            div_item += '</div>';

            for (const id in id_dictionary) {
                if (item["identifications"][id]) {
                    div_item += `<div class="stat flex fl-row fl-space-between">`
                    if (item["identifications"][id].min == item["identifications"][id].max) {
                        if (id.substr(0, id.length - 4) === "spellCost") {
                            div_item += `<p class="info">~</p><p>${id_dictionary[id]}</p><p class="${(item["identifications"][id].max < 0) ? 'positive' : 'negative'}">${item["identifications"][id].max}</p>`;
                        } else {
                            div_item += `<p class="info">~</p><p>${id_dictionary[id]}</p><p class="${(item["identifications"][id].max > 0) ? 'positive' : 'negative'}">${item["identifications"][id].max}</p>`;
                        }
                    } else {
                        if (id.substr(0, id.length - 4) === "spellCost") {
                            div_item += `<p class="${(item["identifications"][id].min < 0) ? 'positive' : 'negative'}">${item["identifications"][id].min}</p><p>${id_dictionary[id]}</p><p class="${(item["identifications"][id].max < 0) ? 'positive' : 'negative'}">${item["identifications"][id].max}</p>`;
                        } else {
                            div_item += `<p class="${(item["identifications"][id].min > 0) ? 'positive' : 'negative'}">${item["identifications"][id].min}</p><p>${id_dictionary[id]}</p><p class="${(item["identifications"][id].max > 0) ? 'positive' : 'negative'}">${item["identifications"][id].max}</p>`;
                        }
                    }
                    div_item += `</div>`
                }
            }
        }
        //

        // Crafting Professions Icons
        // Separator div to make more space
        div_item += `<div class="flex fl-row">&nbsp;</div>`
        div_item += `<div class="flex fl-row">`
        for (const skill of item["skills"]) {
            switch (skill) {
                case "ALCHEMISM": {
                    div_item += `<img class="small-svg-icon" src="./icons/alchemism.svg">&nbsp;`
                    break;
                }
                case "SCRIBING": {
                    div_item += `<img class="small-svg-icon" src="./icons/scribing.svg">&nbsp;`
                    break;
                }
                case "COOKING": {
                    div_item += `<img class="small-svg-icon" src="./icons/cooking.svg">&nbsp;`
                    break;
                }
                case "ARMOURING": {
                    div_item += `<img class="small-svg-icon" src="./icons/armouring.svg">&nbsp;`
                    break;
                }
                case "TAILORING": {
                    div_item += `<img class="small-svg-icon" src="./icons/tailoring.svg">&nbsp;`
                    break;
                }
                case "WEAPONSMITHING": {
                    div_item += `<img class="small-svg-icon" src="./icons/weaponsmithing.svg">&nbsp;`
                    break;
                }
                case "WOODWORKING": {
                    div_item += `<img class="small-svg-icon" src="./icons/woodworking.svg">&nbsp;`
                    break;
                }
                case "JEWELING": {
                    div_item += `<img class="small-svg-icon" src="./icons/jeweling.svg">&nbsp;`
                    break;
                }
            }
        }
        div_item += `</div>`

        // Close divs
        div_item += '</div>';

        ingredientsDiv.insertAdjacentHTML("beforeend", div_item);

        if (limitCounter >= itemLimit) {
            break;
        }
    }
}

function applyFilters(searchStr) {
    let sortedArray = allIngredients
    .filter((i) => {
        return i["name"].toLowerCase().includes(searchStr.toLowerCase());
    })
    .filter((i) => {
        if (i["tier"] === 0)
            return star0Filter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === 1)
            return star1Filter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === 2)
            return star2Filter.checked;
        else
            return true;
    })
    .filter((i) => {
        if (i["tier"] === 3)
            return star3Filter.checked;
        else
            return true;
    })
    .filter((i) => {
        let final = false;
        for (const skill of i["skills"]) {
            switch (skill) {
                case "ALCHEMISM": {
                    final = final || alchemismFilter.checked;
                    break;
                }
                case "SCRIBING": {
                    final = final || scribingFilter.checked;
                    break;
                }
                case "COOKING": {
                    final = final || cookingFilter.checked;
                    break;
                }
                case "WEAPONSMITHING": {
                    final = final || weaponsmithingFilter.checked;
                    break;
                }
                case "WOODWORKING": {
                    final = final || woodworkingFilter.checked;
                    break;
                }
                case "TAILORING": {
                    final = final || tailoringFilter.checked;
                    break;
                }
                case "ARMOURING": {
                    final = final || armouringFilter.checked;
                    break;
                }
                case "JEWELING": {
                    final = final || jewelingFilter.checked;
                    break;
                }
            }
        }
        return final;
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
                    if (!(i["identifications"]["AGILITYPOINTS"] !== 0 || i["identifications"]["DEXTERITYPOINTS"] !== 0 || i["identifications"]["STRENGTHPOINTS"] !== 0 || i["identifications"]["DEFENSEPOINTS"] !== 0 || i["identifications"]["INTELLIGENCEPOINTS"] !== 0))
                        return false;
                    break;
                }
                case "agilityRequirement":
                case "defenceRequirement":
                case "dexterityRequirement":
                case "intelligenceRequirement":
                case "strengthRequirement": {
                    if (!(i["itemOnlyIDs"][f["name"]] !== 0))
                        return false;
                    break;
                }
                case "durability": {
                    if (!(i["itemOnlyIDs"]["durabilityModifier"] !== 0))
                        return false;
                    break;
                }
                case "duration": {
                    if (!(i["consumableOnlyIDs"] && i["consumableOnlyIDs"]["duration"] !== 0))
                        return false;
                    break;
                }
                case "charges": {
                    if (!(i["consumableOnlyIDs"] && i["consumableOnlyIDs"]["charges"] !== 0))
                        return false;
                    break;
                }
                case "totalEffectiveness": {
                    if (!(i["ingredientPositionModifiers"] && i["ingredientPositionModifiers"]["left"] === 0 && i["ingredientPositionModifiers"]["right"] === 0 && i["ingredientPositionModifiers"]["above"] === 0 && i["ingredientPositionModifiers"]["under"] === 0 && i["ingredientPositionModifiers"]["touching"] === 0 && i["ingredientPositionModifiers"]["notTouching"] === 0))
                    break;
                }
                default: {
                    if (!i["identifications"][f["name"]])
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

function update() {
    updateIngredientDisplay(applyFilters(searchField.value));
}

function fixIngredients() {
    fetch("./iiingredients.json").then((data) => {
        data.json().then((data) => {
            for (const ing of data) {
                // Change all "minimum"s to "min"s and "maximum"s to "max"s
                for (const id in ing["identifications"]) {
                    ing["identifications"][id]["min"] = ing["identifications"][id]["minimum"];
                    ing["identifications"][id]["max"] = ing["identifications"][id]["maximum"];
                    delete ing["identifications"][id]["minimum"];
                    delete ing["identifications"][id]["maximum"];
                }
            }
            
            console.log(data);
        });
    });
}

function finishedLoading() {
    loaded = true;
    isLoaded();
    update();
}

function requestIngredients() {
    //fixIngredients();
    fetch("./iiingredients.json").then((data) => {
        data.json().then((data) => {
            allIngredients = data;
            //console.log(allIngredients);
            finishedLoading();
        })
    })
    isLoaded();
}

function isLoaded() {
    if (loaded !== true) {
        ingredientsDiv.classList.add('loading');
    } else {
        ingredientsDiv.classList.remove('loading');
    }
}

$(document).ready(function () {
    $('#sort-type-filter').select2();
});

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

function uncheckAll(event) {
    if (event && event["button"] === 2) {
    let uncheckType = "prof";
    let filterlists = {
        "rarity": [star0Filter, star1Filter, star2Filter, star3Filter],
        "prof": [alchemismFilter, scribingFilter, cookingFilter, armouringFilter, tailoringFilter, weaponsmithingFilter, woodworkingFilter, jewelingFilter]
    }
    switch (event["target"]["id"]) {
        case "star0-filter":
        case "star1-filter":
        case "star2-filter":
        case "star3-filter":
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

function debug(name) {
    console.log(allItems.find((i) => {return i["name"] === name}));
}