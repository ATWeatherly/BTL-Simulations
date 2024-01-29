const labs = require("../labs/index.json");
const labIndex = labs.index;

export function getLabIdFromUrl(location) {
  const path = decodeURI(location.pathname).split("/");

  if (path.length < 3 || path[2].trim() === "" || !labExists(path[2])) {
    return null;
  }

  return path[2];
}

export function getLabData(id) {
  if (!labExists(id)) {
    return null;
  }

  return require("../labs/" + labIndex[id].src + "/data.json");
}

export function getAllLabIds() {
  const labIds = [];
  for (let labId in labIndex) {

    labIds.push(labId);
  }
  return labIds;
}

export function getLabIcon(id, iconName) {
  iconName = iconName ?? "icon.png";
  return require("../labs/" + labIndex[id].src + "/" + iconName).default;
}

export function getUrlNameFromLab(id) {
  if (!labExists(id)) {
    return "";
  }
  return id + "/" + getLabData(id).name.toLowerCase().split(" ").join("-");
}

export function getLabTutorial(id) {
  if (!labExists(id)) {
    return null;
  }
  return require("../labs/" + labIndex[id].src + "/tutorial.js").tutorial || null;
}

export function getLabCategories() {
  return labs.categories;
}

export function getSimData(id) {
  if (!labExists(id)) {
    return null;
  }
  return require("../labs/" + labIndex[id].src + "/sim.js").sim;
}





function labExists(id) {
  return labIndex[id] !== undefined;
}