import type { ReactNode } from "react";

const VISIBLE_ROWS = 5;
const ROW_HEIGHT_REM = 2.5;
const HEADER_HEIGHT_REM = 2.5;

export function ScrollableTable({ children }: { children: ReactNode }) {
  return (
    <div
      className="overflow-y-auto rounded-md border border-border"
      style={{ maxHeight: `${HEADER_HEIGHT_REM + VISIBLE_ROWS * ROW_HEIGHT_REM}rem` }}
    >
      {children}
    </div>
  );
}
