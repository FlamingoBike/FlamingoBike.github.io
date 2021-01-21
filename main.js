let allItems = [];
let loaded = false;

const searchField = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const itemsDiv = document.getElementById("items-display");

function updateItemDisplay(itemsToDisplay) {
    itemsDiv.innerHTML = "";
    for (const item of itemsToDisplay) {
        itemsDiv.insertAdjacentHTML("beforeend", `<div>${item["name"]}</div>&nbsp;`);
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

function finishedLoading() {
    loaded = true;
    isLoaded();
    updateItemDisplay(allItems);
}

function requestItems() {
    $.ajax({
        url: "https://api.wynncraft.com/public_api.php?action=itemDB&category=all",
        success: (data) => {
            allItems = data["items"];
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
