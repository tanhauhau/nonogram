function solve({ xRequirements, yRequirements, width, height }) {
  const board = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(false));
  // xRequirements = xRequirements.map(text => strToNumArr(text));
  // yRequirements = yRequirements.map(text => strToNumArr(text));

  const findSolution = (i, j) => {
    if (i === height) return true;

    const nextI = i + (j + 1 === width ? 1 : 0);
    const nextJ = (j + 1) % width;
    board[i][j] = true;
    if (verify(board, i, j) && findSolution(nextI, nextJ)) {
      return true;
    }
    board[i][j] = false;
    if (verify(board, i, j) && findSolution(nextI, nextJ)) {
      return true;
    }
    return false;
  };

  const verify = (board, i, j) => {
    return (
      verifyRow(xRequirements[j], height, i, idx => board[idx][j]) &&
      verifyRow(yRequirements[i], width, j, idx => board[i][idx])
    );
  };

  const verifyRow = (requirements, maxLength, length, getter) => {
    let k = 0;
    let acc = 0;
    let isLast = false;
    for (let i = 0; i <= length; i++) {
      if (getter(i)) {
        acc++;
        if (!isLast) {
          if (k >= requirements.length) {
            return false;
          }
        }
        isLast = true;
      } else {
        if (isLast) {
          if (requirements[k] !== acc) {
            return false;
          }
          acc = 0;
          k++;
        }
        isLast = false;
      }
    }

    if (length === maxLength - 1) {
      // make sure the row is done
      if (isLast) {
        return k === requirements.length - 1 && acc === requirements[k];
      } else {
        return k === requirements.length;
      }
    }

    return true;
  };

  if (findSolution(0, 0)) {
    return board;
  }
  return null;
}

const printBoard = board => {
  return board.map(row => row.map(i => (i ? '⏺' : '🅾️')).join(' ')).join('\n');
};

function strToNumArr(text) {
  return text
    .split(/\s+/)
    .map(Number)
    .filter(Boolean);
}

const question = `
2
4 3
2 3 3 1
2 4 2 1
2 5
3 2 2 3
8 3
1 4 4 
3 4
3 2 2
3 8
3 1 2
2 1 1
4 2
2
---
3
4
1 7
2 3 3
1 2 4
2 2 2
1 3 2
1 3 1 2
2 2 2 1
1 2 1 1
2 2 2 2
1 2 4 1 1
8 2
8 1
8 2
`;

const [xRequirements, yRequirements] = question
  .trim()
  .split('---')
  .map(axis =>
    axis
      .trim()
      .split('\n')
      .map(row => strToNumArr(row))
  );

console.log(
  printBoard(
    solve({
      xRequirements,
      yRequirements,
      width: 15,
      height: 15,
    })
  )
);
