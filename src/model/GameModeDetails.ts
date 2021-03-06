
export interface GameModeDetails {
  mode: string;
  type: string;

  ranks: string[];
  nations: string[];
  classes: string[];
  statuses: string[];
  brs: string[];

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

  battlesBrNationHeatmap: any[];
  wrBrNationHeatmap: any[];
  kdBrNationHeatmap: any[];
}
