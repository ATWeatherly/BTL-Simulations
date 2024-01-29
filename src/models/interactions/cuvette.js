import * as t from 'three';

import { NotifInfo } from "../../components/Notifications/Notifications";
import DragHandler from "./handlers/DragHandler";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import Helvetica from "../../styles/helvetiker_regular.typeface.json";

export default class CuvetteHandler extends DragHandler {
  constructor(obj, cam, options) {
    super(obj, 5, cam);

    if (options?.dragLocks !== undefined) {
      this.setDragLocks(options.dragLocks, options.dragDist);
    }

    if (options?.name !== undefined) {
      this.name = options.name;
      this.addEventListener("pickup", () => {
        NotifInfo(this.name + " picked up.");
      });
    }

    if (options?.label !== undefined) {
      this.label = options.label;

      // generate label text as mesh
      const font = new FontLoader().parse(Helvetica);
      const text = new TextGeometry(this.label + "", {
        font: font,
        size: 0.01,
        height: 0
      });
      const mesh = new t.Mesh(text, new t.MeshBasicMaterial({color: 0x000000}));
      
      // set mesh parent for relative positioning
      mesh.parent = obj;
      
      // measure text and position accordingly
      const box = new t.Box3().setFromObject(mesh);
      const width = box.max.x - box.min.x;

      mesh.rotation.x = Math.PI / 2;
      // for some reason the width calculated isn't *exactly* accurate? 
      mesh.position.x = -width / 2 - 0.003; 
      mesh.position.y = -0.005;
      mesh.position.z = 0.05;

      obj.children.push(mesh);
    }
  }

  handle(ray) {
    const ret = this.handleDrag(ray);
    if (ret !== false && ret !== null) {
      return [ret];
    }
  }
}