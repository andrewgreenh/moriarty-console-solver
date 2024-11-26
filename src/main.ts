import "./style.css";

type Cell = 0 | 1;

/**
 * A grid represents a 3 by 3 grid of numbers.
 * In data, its just an array of 9 elements with the following indices:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
type Grid = Cell[];

function gridToHTML(grid: Grid, solvingMoves: number[]): HTMLDivElement {
  const gridContainer = document.createElement("div");
  for (const variant of gridVariants(grid)) {
    const gridHash = hashGrid(variant);
    gridContainer.classList.add("grid" + gridHash);
  }
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
  gridContainer.style.gridTemplateRows = "repeat(3, 1fr)";
  gridContainer.style.width = "60px";
  gridContainer.style.height = "60px";
  gridContainer.style.border = "1px solid black";
  gridContainer.style.transition = "scale 0.5s";

  for (let i = 0; i < 9; i++) {
    if (grid[i] === 0) {
      continue;
    }
    const cell = document.createElement("div");
    cell.style.gridRow = `${Math.floor(i / 3) + 1}`;
    cell.style.gridColumn = `${(i % 3) + 1}`;
    cell.style.background = "lightgreen";
    cell.style.border = "1px solid black";
    gridContainer.appendChild(cell);
  }

  const nextMove = solvingMoves[0];
  if (nextMove !== undefined) {
    const cell = document.createElement("div");
    cell.style.gridRow = `${Math.floor(nextMove / 3) + 1}`;
    cell.style.gridColumn = `${(nextMove % 3) + 1}`;
    if (grid[nextMove] === 1) cell.style.color = "black";
    gridContainer.appendChild(cell);
    cell.appendChild(document.createTextNode(solvingMoves.length + ""));

    const nextGrid = applyMove(grid, nextMove);
    const nextGridHash = hashGrid(nextGrid);
    gridContainer.addEventListener("click", () => {
      const nextGridElement = document.querySelector<HTMLDivElement>(".grid" + nextGridHash);
      nextGridElement!.style.scale = "2";
      nextGridElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        nextGridElement!.style.scale = "1";
      }, 1500);
    });
  }

  return gridContainer;
}

function rotateGrid(grid: Grid): Grid {
  const newIndices = [6, 3, 0, 7, 4, 1, 8, 5, 2];
  return newIndices.map((i) => grid[i]);
}

function flipGrid(grid: Grid): Grid {
  const newIndices = [2, 1, 0, 5, 4, 3, 8, 7, 6];
  return newIndices.map((i) => grid[i]);
}

function hashGrid(grid: Grid): string {
  return grid.join("");
}

function* allPossibleGrids(remainingLength = 9): Generator<Grid> {
  if (remainingLength === 0) {
    yield [];
    return;
  }

  for (const grid of allPossibleGrids(remainingLength - 1)) {
    yield [0, ...grid];
    yield [1, ...grid];
  }
}

function* gridVariants(grid: Grid): Generator<Grid> {
  const seen = new Set<string>();
  seen.add(hashGrid(grid));
  yield grid;
  grid = rotateGrid(grid);
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }

  grid = rotateGrid(grid);
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }
  grid = rotateGrid(grid);
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }
  grid = flipGrid(rotateGrid(grid));
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }
  grid = rotateGrid(grid);
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }
  grid = rotateGrid(grid);
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }
  grid = rotateGrid(grid);
  if (!seen.has(hashGrid(grid))) {
    seen.add(hashGrid(grid));
    yield grid;
  }
}

function* allUniqueGrids(): Generator<Grid> {
  const seen = new Set<string>();
  for (const grid of allPossibleGrids()) {
    const hash = hashGrid(grid);
    if (seen.has(hash)) {
      continue;
    }
    for (const variant of gridVariants(grid)) {
      seen.add(hashGrid(variant));
    }
    yield grid;
  }
}

// prettier-ignore
const gridMoves: Grid[] = [
  [
    1, 1, 0,
    1, 0, 0,
    0, 0, 0
  ],
  [
    1, 1, 1,
    0, 1, 0,
    0, 0, 0
  ],
  [
    0, 1, 1,
    0, 0, 1,
    0, 0, 0
  ],
  [
    1, 0, 0,
    1, 1, 0,
    1, 0, 0
  ],
  [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0
  ],
  [
    0, 0, 1,
    0, 1, 1,
    0, 0, 1
  ],
  [
    0, 0, 0,
    1, 0, 0,
    1, 1, 0
  ],
  [
    0, 0, 0,
    0, 1, 0,
    1, 1, 1
  ],
  [
    0, 0, 0,
    0, 0, 1,
    0, 1, 1
  ],
]

function applyMove(grid: Grid, moveIndex: number) {
  const move = gridMoves[moveIndex];
  if (!move) throw new Error("Invalid move index: " + moveIndex);
  return grid.map((cell, i) => (move[i] === 1 ? flip(cell) : cell));
}

const allGrids = Array.from(allUniqueGrids());

const root = document.querySelector<HTMLDivElement>("#app")!;

root.style.display = "flex";
root.style.flexWrap = "wrap";
root.style.gap = "20px";

type State = {
  grid: Grid;
  history: number[];
};

const target = [1, 1, 1, 1, 1, 1, 1, 1, 1].join("");
function solveGrid(grid: Grid): number[] {
  if (hashGrid(grid) === target) {
    return [];
  }
  const toExplore: State[] = [{ grid, history: [] }];
  const seen = new Set<string>();
  for (const variant of gridVariants(grid)) seen.add(hashGrid(variant));
  let next;
  while ((next = toExplore.shift())) {
    for (let i = 0; i < 9; i++) {
      const newState: State = {
        grid: applyMove(next.grid, i),
        history: [...next.history, i],
      };
      if (hashGrid(newState.grid) === target) {
        return newState.history;
      }
      if (seen.has(hashGrid(newState.grid))) {
        continue;
      }
      toExplore.push(newState);
      for (const variant of gridVariants(newState.grid)) seen.add(hashGrid(variant));
      if (toExplore.length > 100) {
        throw new Error("too much to explore");
      }
    }
  }
  throw new Error("Could not solve :(");
}

for (const grid of allGrids) {
  const solved = solveGrid(grid);
  root.appendChild(gridToHTML(grid, solved));
}

function flip(cell: Cell): Cell {
  return (1 - cell) as Cell;
}
