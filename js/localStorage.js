const LocalStorage = () => {
  const LOCAL_STORAGE_LIBRARY_KEY = "library";

  function saveLibraryToLocalStorage(library) {
    localStorage.setObject(LOCAL_STORAGE_LIBRARY_KEY, library);
  }

  function getLibraryFromLocalStorage() {
    var localLibrary = localStorage.getObject(LOCAL_STORAGE_LIBRARY_KEY);
    if (localLibrary === null) localLibrary = [];
    return localLibrary;
  }

  Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
  };

  Storage.prototype.getObject = function (key) {
    return JSON.parse(this.getItem(key));
  };

  return { saveLibraryToLocalStorage, getLibraryFromLocalStorage };
};
