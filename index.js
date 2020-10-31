const getElement = (selector) => document.querySelector(selector)

const $containerBasic = getElement(".container-basic")
const $containerDfs = getElement(".container-dfs")

const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i)

const drawCells = (container, cells) => {
    container.innerHTML = cells.join("")
}

const basicCells = range(0, 100).map(_ => {
    const direction = Math.round(Math.random()) ? "forward" : "backward"
    return `<div class="cell-basic ${direction}"></div>`
})

drawCells($containerBasic, basicCells)


// DFS MAZE

const dfsCells = range(0, 100).map(_ => {
    return []
    return `<div class="cell-dfs"></div>`
})

const drawDfsCells = (dfsCells) => {
    const html = dfsCells.map((directions) => {
        return `<div class="cell-dfs ${directions.join(" ")}"></div>`
    }).join("")
    
    $containerDfs.innerHTML = html
}

drawDfsCells(dfsCells)


const path = [[0, 0], [0, 1], [1, 11]]

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

const buildPath = (currentCell, endCell, frontier=[], explored=new Set([0]), path=[[currentCell, currentCell]]) => {

    if (currentCell[1] === endCell) {
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
        dfsCells[current] = [...dfsCells[current], "right"]
        dfsCells[next] = [...dfsCells[next], "left"]
    }
    if (isRightToLeft) {
        dfsCells[current] = [...dfsCells[current], "left"]
        dfsCells[next] = [...dfsCells[next], "right"]
    }
    if (isTopToBottom) {
        dfsCells[current] = [...dfsCells[current], "bottom"]
        dfsCells[next] = [...dfsCells[next], "top"]
    }
    if (isBottomToTop) {
        dfsCells[current] = [...dfsCells[current], "top"]
        dfsCells[next] = [...dfsCells[next], "bottom"]
    }
    return removeWalls(restPath)
}


removeWalls(buildPath([0, 0], 99))
drawDfsCells(dfsCells)