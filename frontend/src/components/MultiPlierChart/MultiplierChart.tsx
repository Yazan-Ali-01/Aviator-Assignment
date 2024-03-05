import React, { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';
import * as d3 from 'd3-shape';
import { scaleLinear } from 'd3-scale';

const getPointAtLength = (length: number, pathNode: SVGPathElement | null) => {
  if (!pathNode) return { x: 0, y: 0 };
  const point = pathNode.getPointAtLength(length);
  return { x: point.x, y: point.y };
};

interface DataPoint {
  time: number;
  multiplier: number;
}
const MultiplierChart: React.FC = () => {
  const data: DataPoint[] = [
    { time: 0, multiplier: 1 },
    // ... add more data points here
    { time: 10, multiplier: 9.03 },
  ];

  // Scales for your axes
  const xScale = scaleLinear().domain([0, 10]).range([0, 750]); // Assuming 300 is the width of your chart
  const yScale = scaleLinear().domain([1, 10]).range([402, 0]); // Assuming 150 is the height of your chart

  // Generate the line
  const lineGenerator = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.multiplier))
    .curve(d3.curveBasis); // This makes the line a curve

  const pathData = lineGenerator(data);

  // Spring animation for the line drawing
  const spring = useSpring({
    from: { x: 0 },
    to: { x: 1 },
    config: { duration: 5000 }, // Duration of your animation
  });

  const pathRef = React.useRef<SVGPathElement>(null);

  // Spring animation for the ball
  const { length } = useSpring({
    from: { length: 0 },
    to: { length: 1000 },
    config: { duration: 5000 },
  });

  // Animated values for the ball's position
  const ballStyle = length.to(l => {
    const { x, y } = getPointAtLength(l, pathRef.current);
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  });

  return (
    <svg width="770" height="402" className='mr-2 rounded-lg bg-[#1F2530]'>
      <animated.path
        d={pathData}
        stroke="green"
        strokeWidth="2"
        fill="none"
        strokeDasharray={1000} // Length of the dash array, should be long enough to cover the whole line
        strokeDashoffset={spring.x.to(x => 1000 * (1 - x))} // Animate the dash offset from full length to 0
      />
      {/* You can add your animated ball here */}
    </svg>
  );
};

export default MultiplierChart;
