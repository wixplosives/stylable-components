export type ElementDimensions =
    | {
          width: number;
          height: number;
      }
    | {
          width: null;
          height: null;
      };

export const unmeasuredDimensions: ElementDimensions = {
    width: null,
    height: null,
};

export interface DimensionsById {
    [id: string]: ElementDimensions;
}
