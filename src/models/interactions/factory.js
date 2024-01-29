import CuvetteHandler from "./cuvette";
import SFHandler from "./sf";

export default function buildInteractionHandler(name, obj, scene, cam, options) {
  switch(name) {
    case "sf":
      return new SFHandler(obj);
    case "cuvette":
      return new CuvetteHandler(obj, cam, options);
    default:
      return null;
  }
}