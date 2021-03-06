import React, { useState } from 'react';
import Size from './Size';
import NonogramSolver from './NonogramSolver';
import { Button, Checkbox } from 'antd';
import { solve, strToNumArr } from './utils';
import 'antd/dist/antd.css';

const DEFAULT_X = [
  '4 4',
  '1 2 3 2',
  '13 1',
  '13',
  '4 2 2',
  '7 1 1',
  '1 4 1 2',
  '1 3 3',
  '1 4 1 2',
  '7 1',
  '4 2 1',
  '13',
  '8 3 2',
  '1 6 2',
  '4 4',
];
const DEFAULT_Y = [
  '3 3',
  '1 1 5 1 1',
  '1 4 4 1',
  '6 6',
  '13',
  '12',
  '3 5 3',
  '6 6',
  '5 2 2',
  '1 2 3 2 1',
  '1 2 1 2 1',
  '1 2 3 2 1',
  '3 2 2 1 1',
  '1 2 3',
  '4 3',
];

function App() {
  const [size, setSize] = React.useState([15, 15]);
  const [xRequirements, setXRequirements] = React.useState(DEFAULT_X);
  const [yRequirements, setYRequirements] = React.useState(DEFAULT_Y);
  const [solution, setSolution] = React.useState(null);
  const [showStep, setShowStep] = React.useState(false);
  const setSteps = useStep(solution, setSolution);

  const onRequirementChange = (value, column, row) => {
    if (column === 0) {
      // y
      const newYRequirements = [...yRequirements];
      newYRequirements[row - 1] = value;
      setYRequirements(newYRequirements);
    } else {
      // x
      const newXRequirements = [...xRequirements];
      newXRequirements[column - 1] = value;
      setXRequirements(newXRequirements);
    }
  };
  const onSizeChange = newSize => {
    setSize(newSize);
    if (xRequirements.length < newSize[0]) {
      setXRequirements(
        xRequirements.concat(
          new Array(newSize[0] - xRequirements.length).fill(null)
        )
      );
    } else if (xRequirements.length > newSize[0]) {
      setXRequirements(xRequirements.slice(0, newSize[0]));
    } else if (yRequirements.length < newSize[1]) {
      setYRequirements(
        yRequirements.concat(
          new Array(newSize[1] - yRequirements.length).fill(null)
        )
      );
    } else if (yRequirements.length > newSize[1]) {
      setYRequirements(yRequirements.slice(0, newSize[1]));
    }
  };

  return (
    <div style={{ paddingTop: 16, textAlign: 'center' }}>
      <Size size={size} onChange={onSizeChange} />
      <NonogramSolver
        size={size}
        onRequirementChange={onRequirementChange}
        xRequirements={xRequirements}
        yRequirements={yRequirements}
        solution={solution}
      />
      <Button
        type="primary"
        onClick={() => {
          const [solution, steps] = solve({
            xRequirements: xRequirements.map(strToNumArr),
            yRequirements: yRequirements.map(strToNumArr),
            width: size[0],
            height: size[1],
          });
          if (showStep) {
            setSteps(steps);
            setSolution(
              new Array(size[1])
                .fill(null)
                .map(() => new Array(size[0]).fill(false))
            );
          } else {
            setSteps(null);
            setSolution(solution);
          }
        }}
      >
        Solve
      </Button>
      <Checkbox
        style={{ marginLeft: 8 }}
        onClick={() => setShowStep(!showStep)}
        checked={showStep}
      >
        Show Steps
      </Checkbox>
    </div>
  );
}

function useStep(solution, setSolution) {
  const [steps, setSteps] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  React.useEffect(() => {
    if (steps !== null && stepIndex < steps.length) {
      setTimeout(() => {
        setSolution(solution => getNextSolution(solution, steps[stepIndex]));
        setStepIndex(index => index + 1);
      });
    } else if (steps === null) {
      setStepIndex(0);
    }
  }, [steps, stepIndex]);

  return setSteps;
}

function getNextSolution(state, { mark, i, j }) {
  return [
    ...state.slice(0, i),
    [...state[i].slice(0, j), mark, ...state[i].slice(j + 1)],
    ...state.slice(i + 1),
  ];
}

export default App;
