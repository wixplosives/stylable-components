export type Position =
    | {
          x: number;
          y: number;
      }
    | {
          x: null;
          y: null;
      };

export const defaultPosition: Position = { x: null, y: null };
