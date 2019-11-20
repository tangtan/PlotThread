import { BaseTool, ToolCFG } from './baseTool';
import PathDrawer from '../drawers/pathDrawer';
import paper, { Path, Group } from 'paper';

export default class PolylineTool extends BaseTool {
  _group: Group;
  _polyline: Path;
  constructor(cfg?: ToolCFG) {
    super(cfg);
    const pathDrawer = new PathDrawer({});
    this._group = pathDrawer.draw('polyline', true);
    this._polyline = this._group.firstChild as Path;
  }

  get isCreating() {
    return this._group.data.isCreating;
  }

  set isCreating(flag: boolean) {
    this._group.data.isCreating = flag;
  }

  set isTransforming(flag: boolean) {
    this._group.data.isTransforming = flag;
  }

  remove() {
    super.remove();
    return [this._group];
  }

  _onMouseDown(e: paper.ToolEvent) {
    if (this.isCreating && e.point) this._polyline.add(e.point);
  }

  _onKeyDown(e: paper.KeyEvent) {
    super._onKeyDown(e);
    switch (e.key) {
      case 'escape':
        this.isCreating = false;
        this.isTransforming = true;
        break;
      default:
        break;
    }
  }
}
