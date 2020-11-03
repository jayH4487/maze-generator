const getElement = (selector) => document.querySelector(selector)

const $container = getElement(".container")

const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i)


const cells = range(0, 100).map(_ => [])

const drawCells = (cells) => {
    const html = cells.map((directions) => {
        return `<div class="cell ${directions.join(" ")}"></div>`
    }).join("")
    
    $container.innerHTML = html
}

drawCells(cells)


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
    endCell, frontier=[getSuccessors(currentCell[1])],
    explored=new Set([0]),
    path=[[currentCell, currentCell]]
) => {

    if (frontier.length === 0) {
        return path
    }
    const successors = getSuccessors(currentCell[1])
    

    const [updatedCurrentCell, ...restFrontier] = [...successors, ...frontier].filter(([_, cell]) => !explored.has(cell))
    const updatedExplored = explored.add(updatedCurrentCell[1])
    const updatedPath = [...path, updatedCurrentCell]

    return buildPath(updatedCurrentCell, endCell, restFrontier, updatedExplored, updatedPath)

}

const removeWalls = ([currentPath, ...restPath]) => {
    if (currentPath === undefined) {
        return
    }
    const [current, next] = currentPath
    const isLeftToRight = Math.floor(current / 10) === Math.floor(next / 10) && current < next
    const isRightToLeft = Math.floor(current / 10) === Math.floor(next / 10) && current > next
    const isTopToBottom = (current % 10) === (next % 10) && current < next
    const isBottomToTop = (current % 10) === (next % 10) && current > next

    if (isLeftToRight) {
        cells[current] = [...cells[current], "right"]
        cells[next] = [...cells[next], "left"]
    }
    if (isRightToLeft) {
        cells[current] = [...cells[current], "left"]
        cells[next] = [...cells[next], "right"]
    }
    if (isTopToBottom) {
        cells[current] = [...cells[current], "bottom"]
        cells[next] = [...cells[next], "top"]
    }
    if (isBottomToTop) {
        cells[current] = [...cells[current], "top"]
        cells[next] = [...cells[next], "bottom"]
    }
    return removeWalls(restPath)
}


removeWalls(buildPath([0, 0], 99))
drawCells(cells)