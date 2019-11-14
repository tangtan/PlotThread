import { Color } from 'paper';

export const BLACK = new Color(0, 0, 0);

export const WHITE = new Color(1, 1, 1);

export const RED = new Color(1, 0, 0);

export const GREEN = new Color(0, 1, 0);

export const BLUE = new Color(0, 0, 1);

export const GREY = new Color(0.5, 0.5, 0.5);

export const ColorSet = {
  black: BLACK,
  white: WHITE,
  red: RED,
  green: GREEN,
  blue: BLUE,
  grey: GREY
};

export class ColorPicker {
  static black: Color = BLACK;
  static white: Color = WHITE;
  static red: Color = RED;
  static green: Color = GREEN;
  static blue: Color = BLUE;
  static grey: Color = GREY;

  constructor() {}

  static RGBColor(r: number, g: number, b: number, a?: number) {
    return new Color(r / 255, g / 255, b / 255, a || 1);
  }

  static GRAYColor(gray: number, a?: number) {
    return new Color(gray / 255, a || 1);
  }

  static RANDColor() {
    return Color.random();
  }
}
