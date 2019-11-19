import paper, { Tool } from 'paper';

export type ToolCFG = {
  maxDistance?: number;
  minDistance?: number;
  fixedDistance?: number;
};

export class BaseTool {
  _tool: Tool;
  constructor(cfg?: ToolCFG) {
    this._tool = new Tool();
    if (cfg && cfg.maxDistance) this._tool.maxDistance = cfg.maxDistance;
    if (cfg && cfg.minDistance) this._tool.minDistance = cfg.minDistance;
    if (cfg && cfg.fixedDistance) this._tool.fixedDistance = cfg.fixedDistance;
    // this._tool.onMouseDown = this._onMouseDown;
    // 上述方式会导致this指针异常：BaseTool => Tool
    this._tool.onMouseDown = (e: paper.ToolEvent) => {
      this._onMouseDown(e);
    };
    this._tool.onMouseDrag = (e: paper.ToolEvent) => {
      this._onMouseDrag(e);
    };
    this._tool.onMouseMove = (e: paper.ToolEvent) => {
      this._onMouseMove(e);
    };
    this._tool.onMouseUp = (e: paper.ToolEvent) => {
      this._onMouseUp(e);
    };
    this._tool.onKeyDown = (e: paper.KeyEvent) => {
      this._onKeyDown(e);
    };
    this._tool.onKeyUp = (e: paper.KeyEvent) => {
      this._onKeyUp(e);
    };
  }

  activate() {
    this._tool.activate();
  }

  remove() {
    this._tool.remove();
  }

  _onMouseDown(e: paper.ToolEvent) {}

  _onMouseDrag(e: paper.ToolEvent) {}

  _onMouseUp(e: paper.ToolEvent) {}

  _onMouseMove(e: paper.ToolEvent) {}

  _onKeyDown(e: paper.KeyEvent) {}

  _onKeyUp(e: paper.KeyEvent) {}
}
