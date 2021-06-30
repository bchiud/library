function getLibraryFromLocalStorage() {
  console.log("getFromLocalStorage");

  var localLibrary = JSON.parse(localStorage.getItem("library"));
  if (localLibrary === null) localLibrary = [];
  return localLibrary;
}

function saveLibraryToLocalStorage(library) {
  localStorage.setItem("library", JSON.stringify(library));
}

