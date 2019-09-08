export function solve({ xRequirements, yRequirements, width, height }) {
  const board = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(false));
  const steps = [];

  const findSolution = (i, j) => {
    if (i === height) return true;

    const nextI = i + (j + 1 === width ? 1 : 0);
    const nextJ = (j + 1) % width;
    steps.push({ mark: true, i, j });
    board[i][j] = true;
    if (verify(board, i, j) && findSolution(nextI, nextJ)) {
      return true;
    }
    steps.push({ mark: false, i, j });
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
    } else {
      // make sure the row is done
      if (isLast) {
        return acc <= requirements[k];
      } 
    }

    return true;
  };

  if (findSolution(0, 0)) {
    return [board, steps];
  }
  return null;
}

export function strToNumArr(text) {
  return text
    .split(/\s+/)
    .map(Number)
    .filter(Boolean);
}
