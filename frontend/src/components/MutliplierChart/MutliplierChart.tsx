import React from "react";
import { TEChart } from "tw-elements-react";

// Wrap your component with React.memo
const MutliplierChart = React.memo(() => {
  return (
    <TEChart
      type="line"
      data={{
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
          {
            label: "Multiplier",
            data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
          },
        ],
      }}
    />
  );
});

export default MutliplierChart;
