const itemsToDisplay = {};

function updateItemDisplay() {
  for (const item of itemsToDisplay) {
    $("#items-display").add("div")
  }
}