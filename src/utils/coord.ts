import { Point, view } from 'paper';

export const ORIGIN = new Point(0, 0);

export const DEFAULT = new Point(100, 100);

export class Coord {
  static origin = ORIGIN;
  static center = view ? view.center || DEFAULT : DEFAULT;
}
