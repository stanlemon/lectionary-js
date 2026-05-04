export type Proper = {
  type: number;
  text: string | boolean;
  week?: number | null;
  month?: number | null;
  day?: number | null;
};

export type ProperDatasetMap = Record<string, Proper[]>;

export type SeriesKey = "A" | "B" | "C";

export type SeriesDatasetMap = Record<SeriesKey, Proper[]>;

export default interface Loader {
  load(
    date: Date,
    weekOfLectionary: number | null
  ): Proper[] | ProperDatasetMap;
}
