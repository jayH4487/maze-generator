const getElement = (selector) => document.querySelector(selector)

const $container = getElement(".container")
const $randomizeMaze = getElement(".btn-randomize")

const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i)

const drawCells = (cells) => {
    const html = cells.map((directions) => {
        return `<div class="cell ${directions.join(" ")}"></div>`
    }).join("")
    
    $container.innerHTML = html
}

const randomizeArray = (arr) => {
    if (arr.length === 0) {
        return []
    }
    const randomIndex = Math.floor(Math.random() * arr.length)
    return [arr[randomIndex], ...randomizeArray([...arr.slice(0, randomIndex), ...arr.slice(randomIndex + 1)])]

}

const getSuccessors = (cell) => {
    const up = cell - 10 < 0 ? -1 : cell - 10
    const down = cell + 10 > 100 ? -1 : cell + 10
    const left = Math.floor((cell - 1) / 10) === Math.floor((cell) / 10) ? cell - 1 : -1
    const right = Math.floor((cell + 1) / 10) === Math.floor((cell) / 10) ? cell + 1 : -1

    const validSuccessors = [down, left, right, up].filter(el => el > -1 && el < 100)
    return randomizeArray(validSuccessors.map(el => [cell, el]))
}

const buildPath = (
    currentCell,
    frontier=getSuccessors(currentCell[1]),
    explored=new Set([0]),
    path=[currentCell]
) => {
    if (frontier.length === 0) {
        return path
    }
    const successors = getSuccessors(currentCell[1])

    const [
        updatedCurrentCell,
        ...restFrontier
    ] = [...successors, ...frontier].filter(([_, cell]) => !explored.has(cell))
    const updatedExplored = explored.add((updatedCurrentCell || [0, 0])[1])
    const updatedPath = [...path, updatedCurrentCell || [0, 0]]

    return buildPath(updatedCurrentCell, restFrontier, updatedExplored, updatedPath)

}

const removeWalls = ([currentPath, ...restPath], cells) => {
    if (currentPath === undefined) {
        return cells
    }
    const [current, next] = currentPath
    const walls = new Map([
        [1, "right"],
        [-1, "left"],
        [10, "bottom"],
        [-10, "top"]
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

    return removeWalls(restPath, updatedCells)
}


const drawMaze = () => {
    const cells = range(0, 100).map(_ => [])
    const path = buildPath([0, 0])
    const updatedCells = removeWalls(path, cells)
    drawCells(updatedCells)
}

drawMaze()

$randomizeMaze.addEventListener("click", drawMaze)