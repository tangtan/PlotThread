import paper, { Group, PointText } from 'paper';
import { BaseTool, ToolCFG } from './baseTool';
import TextDrawer from '../drawers/textDrawer';

export default class TextTool extends BaseTool {
  _groups: Group[];
  _drawer: TextDrawer | null;
  _group: Group | null;
  _object: PointText | null;
  constructor(cfg?: ToolCFG) {
    super(cfg);
    this._drawer = null;
    this._object = null;
    this._group = null;
    this._groups = [];
  }

  get isCreating() {
    if (!this._group) return false;
    return this._group.data.isCreating;
  }

  set isCreating(flag: boolean) {
    if (this._group) this._group.data.isCreating = flag;
  }

  set isTransforming(flag: boolean) {
    if (this._group) this._group.data.isTransforming = flag;
  }

  remove() {
    super.remove();
    // 同步 visual object 状态
    this.isCreating = false;
    this.isTransforming = true;
    return this._groups;
  }

  _onMouseDown(e: paper.ToolEvent) {
    if (e.point) {
      this.isCreating = false;
      this.isTransforming = true;
      this._drawer = new TextDrawer({});
      this._group = this._drawer.draw(
        'freetext',
        true,
        e.point.x || 0,
        e.point.y || 0
      );
      this._object = this._group.firstChild as PointText;
      if (this._group) this._groups.push(this._group);
    }
  }

  _onKeyDown(e: paper.KeyEvent) {
    if (this._object && e.character) {
      this._object.content += e.character;
    }
  }
}
