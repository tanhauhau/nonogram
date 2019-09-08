import React from 'react';

import { Input, Form } from 'antd';
import { strToNumArr } from './utils';
import styles from './NonogramSolver.module.css';

function NonogramSolver({
  size,
  form,
  onRequirementChange,
  xRequirements,
  yRequirements,
  solution,
}) {
  const [width, height] = size;
  const blockSize = 50;
  const labelXSize = 100;
  const labelYSize = 40;

  const cells = [];

  for (let j = 0; j < width; j++) {
    const error = getError(xRequirements[j] || '', height);

    cells.push(
      <Form.Item
        className={styles.input}
        style={getGridPosition(j + 1, 0)}
        validateStatus={error && 'error'}
        help={error}
        key={cells.length}
      >
        <Input
          value={xRequirements[j] || ''}
          onChange={e => {
            const value = e.currentTarget.value;
            onRequirementChange(value, j + 1, 0);
          }}
          size="small"
        />
      </Form.Item>
    );
  }

  for (let i = 0; i < height; i++) {
    const error = getError(yRequirements[i] || '', width);
    cells.push(
      <Form.Item
        className={styles.input}
        style={getGridPosition(0, i + 1)}
        validateStatus={error && 'error'}
        help={error}
        key={cells.length}
      >
        <Input
          value={yRequirements[i] || ''}
          onChange={e => {
            const value = e.currentTarget.value;
            onRequirementChange(value, 0, i + 1);
          }}
          size="small"
        />
      </Form.Item>
    );
  }
  return (
    <div
      className={styles.nonogram}
      style={{
        gridTemplate: getGridTemplate(
          width,
          height,
          blockSize,
          labelXSize,
          labelYSize
        ),
        width: blockSize * width + labelXSize,
      }}
    >
      {cells}
      <Nonogram
        width={width}
        height={height}
        blockSize={blockSize}
        solution={solution}
      />
    </div>
  );
}

export default Form.create({ name: 'nonogram' })(NonogramSolver);

function Block({ size, style }) {
  return (
    <div
      className={styles.block}
      style={{ ...style, width: size, height: size }}
    />
  );
}

const Nonogram = React.memo(function({ width, height, blockSize, solution }) {
  const cells = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      cells.push(
        <Block
          size={blockSize}
          style={{
            ...getGridPosition(j + 1, i + 1),
            borderTopWidth: i > 0 ? (i % 5 === 0 ? 4 : 0) : undefined,
            borderLeftWidth: j > 0 ? (j % 5 === 0 ? 4 : 0) : undefined,
            backgroundColor: solution && solution[i][j] ? '#333' : undefined,
          }}
          key={cells.length}
        />
      );
    }
  }
  return cells;
});

function getGridTemplate(width, height, blockSize, labelXSize, labelYSize) {
  return `${labelYSize}px ${` ${blockSize}px`.repeat(
    height
  )} / ${labelXSize}px ${` ${blockSize}px`.repeat(width)}`;
}

function getGridPosition(column, row) {
  return {
    gridColumnStart: column + 1,
    gridColumnEnd: column + 2,
    gridRowStart: row + 1,
    gridRowEnd: row + 2,
  };
}

function getError(text, max) {
  if (!/^[0-9 ]*$/.test(text)) {
    return 'Invalid characters';
  }
  if (!validateSum(text, max)) {
    return 'Sum exceeded limit';
  }
  return null;
}

function validateSum(text, max, cb) {
  const numbers = strToNumArr(text);
  return numbers.reduce((a, b) => a + b, 0) + numbers.length - 1 <= max;
}
