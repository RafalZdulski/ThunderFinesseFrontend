
export interface GameModeDetails {
  mode: string;
  type: string;

  ranks: string[];
  nations: string[];
  classes: string[];
  statuses: string[];
  battleRatings: string[];

  battlesPerRank: number[];
  kdPerRank: number[];
  wrPerRank: number[];

  battlesPerNation: number[];
  kdPerNation: number[];
  wrPerNation: number[];

  battlesPerClass: number[];
  kdPerClass: number[];
  wrPerClass: number[];

  battlesPerStatus: number[];
  kdPerStatus: number[];
  wrPerStatus: number[];

  battlesBrNationHeatMap: number[][];
  wrBrNationHeatmap: number[][];
  kdBrNationHeatmap: number[][];
}
