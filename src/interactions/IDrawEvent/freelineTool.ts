import { BaseTool, ToolCFG } from './baseTool';
import PathDrawer from '../../drawers/pathDrawer';
import paper, { Path, Group } from 'paper';

export default class FreelineTool extends BaseTool {
  _group: Group;
  _freeline: Path;
  constructor(cfg?: ToolCFG) {
    super(cfg);
    const pathDrawer = new PathDrawer({});
    this._group = pathDrawer.draw('polyline', true);
    this._freeline = this._group.firstChild as Path;
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

  _onMouseDrag(e: paper.ToolEvent) {
    if (this.isCreating && e.point) this._freeline.add(e.point);
  }

  _onMouseUp(e: paper.ToolEvent) {
    if (this.isCreating) {
      this.isCreating = false;
      this.isTransforming = true;
    }
  }
}
