import type React from "react";
import ThresholdMatrix from "./ThresholdMatrix";
import ScalerBeforeAfter from "./ScalerBeforeAfter";
import FoldVisualizer from "./FoldVisualizer";
import ConfusionSorter from "./ConfusionSorter";
import { LossOutlier, CorrDrag, LinearFit, PolyDegree } from "./RegressionWidgets";
import { RocSweep, LogisticPlay, SvmMargin, Resample } from "./ClassifyWidgets";
import FlowMap from "./FlowMap";
import ColumnPeel from "./ColumnPeel";
import ParadigmChooser from "./ParadigmChooser";
import XyTable from "./XyTable";
import ParamKnob from "./ParamKnob";
import FoldCompare from "./FoldCompare";
import ScenarioCards from "./ScenarioCards";
import DescribeTable from "./DescribeTable";
import { KnnPlay, GiniCalc, BootstrapVote, SplitBar } from "./ModelWidgets";

/** Đăng ký công cụ tương tác; dùng trong bài bằng  :::widget tên  */
export const WIDGETS: Record<string, React.ComponentType<{ props?: string }>> = {
  "threshold-matrix": ThresholdMatrix,
  "scaler-before-after": ScalerBeforeAfter,
  "fold-visualizer": FoldVisualizer,
  "confusion-sorter": ConfusionSorter,
  "loss-outlier": LossOutlier,
  "corr-drag": CorrDrag,
  "linear-fit": LinearFit,
  "poly-degree": PolyDegree,
  "roc-sweep": RocSweep,
  "logistic-play": LogisticPlay,
  "svm-margin": SvmMargin,
  "resample": Resample,
  "knn-play": KnnPlay,
  "gini-calc": GiniCalc,
  "bootstrap-vote": BootstrapVote,
  "split-bar": SplitBar,
  "flow-map": FlowMap,
  "column-peel": ColumnPeel,
  "paradigm-chooser": ParadigmChooser,
  "xy-table": XyTable,
  "param-knob": ParamKnob,
  "fold-compare": FoldCompare,
  "scenario-cards": ScenarioCards,
  "describe-table": DescribeTable,
};
