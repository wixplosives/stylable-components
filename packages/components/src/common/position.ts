export type Position =
    | {
          x: number;
          y: number;
      }
    | {
          x: null;
          y: null;
      };

export const unknownPosition: Position = { x: null, y: null };
