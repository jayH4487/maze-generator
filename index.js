const getElement = (selector) => document.querySelector(selector)

const $container = getElement(".container")
const $cellSize = getElement(".cell-size")
const $randomizeMaze = getElement(".btn")

const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i)

const randomizeArray = (arr) => {
    if (arr.length === 0) {
        return []
    }
    const randomIndex = Math.floor(Math.random() * arr.length)
    return [arr[randomIndex], ...randomizeArray([...arr.slice(0, randomIndex), ...arr.slice(randomIndex + 1)])]
}

const getSuccessors = (cell, cellSize) => {
    const width = 400 / cellSize
    const height = 400 / cellSize

    const up = cell - height < 0
        ? -1 
        : cell - height

    const down = cell + height > height * width
        ? -1
        : cell + height

    const left = Math.floor((cell - 1) / width) === Math.floor((cell) / width)
        ? cell - 1
        : -1

    const right = Math.floor((cell + 1) / width) === Math.floor((cell) / width)
        ? cell + 1
        : -1

    const validSuccessors = [down, left, right, up].filter(el => el > -1 && el < width * height)
    return randomizeArray(validSuccessors.map(el => [cell, el]))
}

const buildPath = (
    currentCell,
    cellSize,
    frontier=getSuccessors(currentCell[1], cellSize),
    explored=new Set([0]),
    path=[currentCell],
) => {
    if (frontier.length === 0) {
        return path
    }
    const successors = getSuccessors(currentCell[1], cellSize)

    const [
        updatedCurrentCell,
        ...restFrontier
    ] = [...successors, ...frontier].filter(([_, cell]) => !explored.has(cell))

    const updatedExplored = explored.add((updatedCurrentCell || [0, 0])[1])

    const updatedPath = [...path, updatedCurrentCell || [0, 0]]

    return buildPath(
        updatedCurrentCell,
        cellSize,
        restFrontier, updatedExplored,
        updatedPath,
    )

}

const removeWalls = ([currentPath, ...restPath], cells, cellSize) => {
    if (currentPath === undefined) {
        return cells
    }
    const [current, next] = currentPath

    const height = 400 / cellSize

    const walls = new Map([
        [1, "right"],
        [-1, "left"],
        [height, "bottom"],
        [-height, "top"]
    ])
    
    const currentWallToRemove = walls.get(next - current)
    const nextWallToRemove = walls.get(current - next)

    //cells[current] = [...cells[current], currentWallToRemove]
    //cells[next] = [...cells[next], nextWallToRemove]

    const updatedCells = cells.map((cell, i) => {
        if (i === current) {
            return [...cell, currentWallToRemove]
        }
        if (i === next) {
            return [...cell, nextWallToRemove]
        }
        return cell
    })

    return removeWalls(restPath, updatedCells, cellSize)
}

const drawCells = (cells, cellSize) => {
    const html = cells.map((directions) => {
        return `
            <div
                class="cell ${directions.join(" ")}"
                style="width:${cellSize}px;height:${cellSize}px"
            >
            </div>
        `
    }).join("")
    
    $container.innerHTML = html
}

const drawMaze = (cellSize=40) => {
    const cellCount = (400 / cellSize)**2
    const cells = range(0, cellCount).map(_ => [])
    const path = buildPath([0, 0], cellSize)
    const updatedCells = removeWalls(path, cells, cellSize)
    drawCells(updatedCells, cellSize)
}

drawMaze()

const setCellSize = (size) => {
    const cellSize = {
        small: 40,
        medium: 20,
        large: 10
    }
    drawMaze(cellSize[size])
}

$cellSize.addEventListener("change", (e) => setCellSize(e.target.value))

$randomizeMaze.addEventListener("click", () => setCellSize($cellSize.value))
