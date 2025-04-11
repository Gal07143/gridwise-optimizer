
import React, { useRef, useEffect, useState } from 'react';
import { EnergyNode, EnergyConnection } from './energy-flow/types';
import { createEnergyFlowLines, createNodePositions } from '@/lib/energy-flow-utils';
import { Motion, spring } from 'react-motion';
import { EnergyNodeCard } from './energy-flow/EnergyNodeCard';
import { EnergyFlowLine } from './energy-flow/EnergyFlowLine';

interface EnergyFlowChartProps {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  width?: number;
  height?: number;
  className?: string;
  animationDelay?: string;
}

export const EnergyFlowChart: React.FC<EnergyFlowChartProps> = ({
  nodes = [],
  connections = [],
  width = 800,
  height = 600,
  className = '',
  animationDelay = '0s'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<any>({});
  const [lines, setLines] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const newPositions = createNodePositions(nodes);
    setPositions(newPositions);
    setLines(createEnergyFlowLines(connections, newPositions));

    // Apply animation delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100); // Small timeout for the DOM to be ready

    return () => clearTimeout(timer);
  }, [nodes, connections]);

  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{ 
        opacity: visible ? 1 : 0, 
        transition: `opacity 0.5s ease-in-out`,
        transitionDelay: animationDelay 
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {lines.map((line, i) => (
          <EnergyFlowLine key={i} line={line} />
        ))}
      </svg>

      <div className="absolute top-0 left-0 w-full h-full">
        {nodes.map((node) => (
          <Motion
            key={node.id}
            defaultStyle={{ x: 500, y: 300, opacity: 0 }}
            style={{
              x: spring(positions[node.id]?.x || 500),
              y: spring(positions[node.id]?.y || 300),
              opacity: spring(1)
            }}
          >
            {(style) => (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(style.x / 1000) * 100}%`,
                  top: `${(style.y / 600) * 100}%`,
                  opacity: style.opacity,
                }}
              >
                <EnergyNodeCard node={node} />
              </div>
            )}
          </Motion>
        ))}
      </div>
    </div>
  );
};
