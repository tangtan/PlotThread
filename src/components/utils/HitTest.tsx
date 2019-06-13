import React, { Component } from 'react';
import paper, {
  Path,
  Point,
  view,
  project,
  MouseEvent,
  Item,
  Color,
  Segment
} from 'paper';

type Props = {};

type State = {
  paths: number;
  minPoints: number;
  maxPoints: number;
  minRadius: number;
  maxRadius: number;
  movePath: boolean;
  focusPath: Item;
  segment: Segment | null;
};

const hitOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

export default class HitTest extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paths: 50,
      minPoints: 5,
      maxPoints: 15,
      minRadius: 30,
      maxRadius: 90,
      movePath: false,
      focusPath: new Item(),
      segment: null
    };
  }

  private createPaths = () => {
    const radiusDelta = this.state.maxRadius - this.state.minRadius;
    const pointsDelta = this.state.maxPoints - this.state.minPoints;
    for (let i = 0; i < this.state.paths; i++) {
      const radius = this.state.minRadius + Math.random() * radiusDelta;
      const points = this.state.minPoints + Math.random() * pointsDelta;
      // console.log(view);
      const center = new Point(800 * Math.random(), 800 * Math.random());
      const path = this.createBlob(center, radius, points);
      const lightness = (Math.random() - 0.5) * 0.4 + 0.4;
      const hue = Math.random() * 360;
      const color = new Color({
        hue: hue,
        saturation: 1,
        lightness: lightness
      });
      path.fillColor = color;
      path.strokeColor = 'black';
      path.onMouseDrag = this.onMouseDrag;
      // path.onMouseMove = this.onMouseMove;
    }
  };

  private createBlob = (center: Point, maxRadius: number, points: number) => {
    const path = new Path();
    path.closed = true;
    for (let i = 0; i < points; i++) {
      const delta = new Point({
        length: maxRadius * 0.5 + Math.random() * maxRadius * 0.5,
        angle: (360 / points) * i
      });
      path.add(center.add(delta));
    }
    path.smooth();
    return path;
  };

  private onMouseDown = (e: MouseEvent) => {
    console.log('view click');
    const hitResult = project.hitTest(e.point, hitOption);

    if (!hitResult) {
      return;
    }

    if (e.modifiers.shift) {
      if (hitResult.type === 'segment') {
        hitResult.segment.remove();
      }
      return;
    }

    if (hitResult) {
      this.setState({ focusPath: hitResult.item });
      if (hitResult.type === 'segment') {
        this.setState({ segment: hitResult.segment });
      }
    }

    let movePath = hitResult.type === 'fill';
    this.setState({ movePath: movePath });
    if (movePath) {
      project.activeLayer.addChild(hitResult.item);
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    // console.log(e);
    project.activeLayer.selected = false;
    if (this.state.movePath) {
      this.state.focusPath.selected = true;
    }
  };

  private onMouseDrag = (e: MouseEvent) => {
    if (this.state.segment) {
      this.state.segment.point.x += e.delta.x;
      this.state.segment.point.y += e.delta.y;
    }
    if (this.state.focusPath.selected) {
      // this.state.focusPath.position.add(e.delta);
      this.state.focusPath.position.x += e.delta.x;
      this.state.focusPath.position.y += e.delta.y;
    }
  };

  componentDidMount() {
    // paper.setup('canvas');
    this.createPaths();
    view.onMouseDown = this.onMouseDown;
    view.onMouseMove = this.onMouseMove;
  }

  render() {
    return <div className="null-element" />;
  }
}
