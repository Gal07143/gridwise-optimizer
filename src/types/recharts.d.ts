
declare module 'recharts' {
  import React from 'react';

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: React.ReactNode;
    aspect?: number;
    minWidth?: number;
    minHeight?: number;
    debounce?: number;
  }

  export interface LineChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    children?: React.ReactNode;
    layout?: 'horizontal' | 'vertical';
    syncId?: string;
    onMouseMove?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onClick?: (e: any) => void;
  }

  export interface BarChartProps extends LineChartProps {}
  export interface AreaChartProps extends LineChartProps {}
  export interface ComposedChartProps extends LineChartProps {}

  export interface LineProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey: string | number | ((obj: any) => any);
    name?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fill?: string;
    fillOpacity?: number;
    activeDot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    dot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    label?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    connectNulls?: boolean;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  }

  export interface BarProps {
    dataKey: string | number | ((obj: any) => any);
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    name?: string;
    unit?: string | number;
    shape?: React.ReactNode | ((props: any) => React.ReactNode);
    label?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  }

  export interface AreaProps extends LineProps {
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
    baseValue?: number | 'dataMin' | 'dataMax' | 'auto';
  }

  export interface CartesianGridProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    horizontal?: boolean;
    vertical?: boolean;
    horizontalPoints?: number[];
    verticalPoints?: number[];
    horizontalCoordinatesGenerator?: (props: any) => number[];
    verticalCoordinatesGenerator?: (props: any) => number[];
    strokeDasharray?: string;
    stroke?: string;
  }

  export interface LegendProps {
    width?: number;
    height?: number;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    iconSize?: number;
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    payload?: {
      value: string;
      id: string;
      type: string;
      color?: string;
    }[];
    formatter?: (value: string, entry: any, index: number) => React.ReactNode;
    onClick?: (e: any) => void;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
  }

  export interface PieProps {
    cx?: number | string;
    cy?: number | string;
    innerRadius?: number | string;
    outerRadius?: number | string;
    startAngle?: number;
    endAngle?: number;
    minAngle?: number;
    paddingAngle?: number;
    nameKey?: string;
    dataKey?: string | number | ((obj: any) => any);
    labelLine?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    label?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    activeIndex?: number | number[];
    activeShape?: React.ReactNode | ((props: any) => React.ReactNode);
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  }

  export interface TooltipProps {
    separator?: string;
    offset?: number;
    itemStyle?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    cursor?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    content?: React.ReactNode | ((props: any) => React.ReactNode);
    formatter?: (value: any, name: string, entry: any, index: number) => React.ReactNode;
    labelFormatter?: (label: any) => React.ReactNode;
    itemSorter?: (item1: any, item2: any) => number;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  }

  export interface XAxisProps {
    dataKey?: string;
    hide?: boolean;
    scale?: string | ((x: any) => any);
    tick?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    tickLine?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    axisLine?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    label?: string | number | React.ReactNode | ((props: any) => React.ReactNode);
    height?: number;
    width?: number;
    allowDataOverflow?: boolean;
    type?: 'number' | 'category';
    domain?: number[] | string[];
    ticks?: number[] | string[];
    tickCount?: number;
    minTickGap?: number;
    tickSize?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  }

  export interface YAxisProps extends XAxisProps {
    orientation?: 'left' | 'right';
  }

  export interface CellProps {
    fill?: string;
    stroke?: string;
  }

  export const Area: React.FC<AreaProps>;
  export const AreaChart: React.FC<AreaChartProps>;
  export const Bar: React.FC<BarProps>;
  export const BarChart: React.FC<BarChartProps>;
  export const CartesianGrid: React.FC<CartesianGridProps>;
  export const Cell: React.FC<CellProps>;
  export const ComposedChart: React.FC<ComposedChartProps>;
  export const Legend: React.FC<LegendProps>;
  export const Line: React.FC<LineProps>;
  export const LineChart: React.FC<LineChartProps>;
  export const Pie: React.FC<PieProps>;
  export const PieChart: React.FC<{ width?: number; height?: number; children?: React.ReactNode }>;
  export const ResponsiveContainer: React.FC<ResponsiveContainerProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const XAxis: React.FC<XAxisProps>;
  export const YAxis: React.FC<YAxisProps>;
}
