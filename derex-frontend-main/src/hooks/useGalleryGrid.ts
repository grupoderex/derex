import { useMemo } from "react";

export interface UseGalleryGridParams {
  imageCount: number;
}

export interface UseGalleryGridReturn {
  gridClasses: string;
  getImageColSpan: (index: number) => string;
}

interface ColumnConfig {
  max: number;
  cols: number;
}

interface ColSpanRule {
  images: number;
  colsContext?: number;
  spans: string[];
}

const GRID_CONFIG = {
  desktop: {
    columns: [
      { max: 1, cols: 1 },
      { max: 2, cols: 2 },
      { max: 4, cols: 3 },
      { max: 6, cols: 3 },
      { max: 8, cols: 4 },
      { max: 9, cols: 3 },
      { max: 10, cols: 5 },
      { max: Infinity, cols: 4 },
    ] as ColumnConfig[],
    colSpanRules: [
      { images: 1, spans: ["md:col-span-full"] },
      { images: 2, colsContext: 3, spans: ["md:col-span-2", "md:col-span-1"] },
      { images: 2, colsContext: 4, spans: ["md:col-span-2", "md:col-span-2"] },
      { images: 2, colsContext: 5, spans: ["md:col-span-3", "md:col-span-2"] },
      {
        images: 3,
        colsContext: 4,
        spans: ["md:col-span-2", "md:col-span-1", "md:col-span-1"],
      },
      {
        images: 3,
        colsContext: 5,
        spans: ["md:col-span-2", "md:col-span-2", "md:col-span-1"],
      },
      {
        images: 4,
        colsContext: 5,
        spans: [
          "md:col-span-2",
          "md:col-span-1",
          "md:col-span-1",
          "md:col-span-1",
        ],
      },
    ] as ColSpanRule[],
  },
  mobile: {
    columns: [
      { max: 1, cols: 1 },
      { max: Infinity, cols: 2 },
    ] as ColumnConfig[],
  },
};

const TAILWIND_CLASSES = {
  mobile: {
    1: "grid-cols-1",
    2: "grid-cols-2",
  } as Record<number, string>,
  desktop: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  } as Record<number, string>,
};

function calculateColumns(count: number, config: ColumnConfig[]): number {
  const found = config.find(({ max }) => count <= max);
  return found?.cols ?? 4;
}

function getLastRowInfo(totalImages: number, cols: number) {
  const lastRowStart = Math.floor(totalImages / cols) * cols;
  const imagesInLastRow = totalImages - lastRowStart;
  return { lastRowStart, imagesInLastRow };
}

function getMobileColSpan(index: number, totalImages: number): string {
  const cols = calculateColumns(totalImages, GRID_CONFIG.mobile.columns);
  const { lastRowStart, imagesInLastRow } = getLastRowInfo(totalImages, cols);

  if (index < lastRowStart || imagesInLastRow === cols) {
    return "col-span-1";
  }

  if (cols === 2 && imagesInLastRow === 1) {
    return "col-span-2";
  }

  return "col-span-1";
}

function getDesktopColSpan(index: number, totalImages: number): string {
  const cols = calculateColumns(totalImages, GRID_CONFIG.desktop.columns);
  const { lastRowStart, imagesInLastRow } = getLastRowInfo(totalImages, cols);

  if (index < lastRowStart || imagesInLastRow === cols) {
    return "md:col-span-1";
  }

  const positionInLastRow = index - lastRowStart;

  const rule = GRID_CONFIG.desktop.colSpanRules.find(
    (r) =>
      r.images === imagesInLastRow &&
      (r.colsContext === undefined || r.colsContext === cols)
  );

  if (rule && positionInLastRow < rule.spans.length) {
    return rule.spans[positionInLastRow];
  }

  return "md:col-span-1";
}

export function useGalleryGrid({
  imageCount,
}: UseGalleryGridParams): UseGalleryGridReturn {
  const gridClasses = useMemo(() => {
    const desktopCols = calculateColumns(
      imageCount,
      GRID_CONFIG.desktop.columns
    );
    const mobileCols = calculateColumns(imageCount, GRID_CONFIG.mobile.columns);

    const mobileClass = TAILWIND_CLASSES.mobile[mobileCols] || "grid-cols-2";
    const desktopClass =
      TAILWIND_CLASSES.desktop[desktopCols] || "md:grid-cols-4";

    return `${mobileClass} ${desktopClass}`;
  }, [imageCount]);

  const getImageColSpan = useMemo(
    () =>
      (index: number): string => {
        const mobileSpan = getMobileColSpan(index, imageCount);
        const desktopSpan = getDesktopColSpan(index, imageCount);
        return `${mobileSpan} ${desktopSpan}`;
      },
    [imageCount]
  );

  return {
    gridClasses,
    getImageColSpan,
  };
}
