let allItems;
let loaded = false;

function updateItemDisplay(itemsToDisplay) {
  for (const item of itemsToDisplay) {
    $("#items-display").append(`<div>${item["name"]}</div>`);
  }
}

function finishedLoading() {
  loaded = true;
  updateItemDisplay(allItems);
}

function requestItems() {
  $.ajax({
    url: "https://api.wynncraft.com/public_api.php?action=itemDB&category=all",
    success: (data) => {
      allItems = data["items"];
      finishedLoading();
    }
  })
}