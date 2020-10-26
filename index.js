const getElement = (selector) => document.querySelector(selector)

const $container = getElement(".container")

const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i)

const cells = range(0, 100).map(_ => {
    const direction = Math.round(Math.random()) ? "forward" : "backward"
    return `<div class="cell ${direction}"></div>`
})

$container.innerHTML = cells.join("")