import type React from "react";
import ThresholdMatrix from "./ThresholdMatrix";
import ScalerBeforeAfter from "./ScalerBeforeAfter";
import FoldVisualizer from "./FoldVisualizer";
import ConfusionSorter from "./ConfusionSorter";

/** Đăng ký công cụ tương tác; dùng trong bài bằng  :::widget tên  */
export const WIDGETS: Record<string, React.ComponentType<{ props?: string }>> = {
  "threshold-matrix": ThresholdMatrix,
  "scaler-before-after": ScalerBeforeAfter,
  "fold-visualizer": FoldVisualizer,
  "confusion-sorter": ConfusionSorter,
};
