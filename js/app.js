const gridLength = 10
let numOfShipPlacements = null
const regex = new RegExp('pixel')
let playerhits = null
let aIHits = null
const randomGridCell = function(){
  return Math.round(Math.random()*Math.pow(gridLength,2))
}
const children = function(name){
  const parent = document.querySelector(`.${name}`)
  const child = parent.querySelectorAll('div')
  return child
}
class Ship {
  constructor(height, width, name, cssClass) {
    this.name = name
    this.height = height
    this.width = width
    this.cssClass = cssClass
    this.style = function(){
      return console.log(this)
    }
    this.yaxis = function(){
      return [this.height, this.width] = [this.width, this.height]

    }
  }
}
const coordArray = function(){
  const row = Array.from(Array(10)).map((x,idx)=> idx)
  return new Array(10).fill(row)
}
const allShipType = {
  Destoryer: [1, 2, 'Destoryer','destoryerCss'],
  Submarine: [1, 3, 'Submarine','submarineCss'],
  Cruiser: [1, 3, 'Cruiser','cruiserCss'],
  Battleship: [1, 4, 'Battleship','battleshipCss'],
  Carrier: [1, 5, 'Carrier','carrierCss']
}
let shipToPlace = null

document.addEventListener('DOMContentLoaded',()=>{
  class Grid {
    constructor(gridLength=gridLength, name, cssClass) {
      this.name = name
      this.gridLength = gridLength
      this.cssClass = cssClass
      this.board = function(){
        const box = document.querySelector(`.${this.name}`)
        const items = box.querySelectorAll('div')
        return Array.from(items)

      }
      this.style = function(){
        return console.log(this)
      }
      this.generateGrid = function(){
        const board = document.querySelectorAll(`.${this.name}`)
        for(let i = 0; i < (this.gridLength**2); i++){
          const div = document.createElement('div')
          div.className = `pixel${this.name}`
          div.textContent = `${i}`
          div.addEventListener('click',()=>{
            if(numOfShipPlacements !== 10){
              const lastone = div.textContent.toString().split('').pop()
              const result = div.className
              const test = result.match(regex)

              if(lastone<shipToPlace.width) {
                alert('Ahoy , Matey!, that ship is to large for that space')
                return false
              }
              if(test===null) {
                alert('Ahoy , Matey!, A ship can\'t be place over another')
                return false
              }
              console.log('clicked' ,div)
              // console.log(nodeList(div.textContent,this.blankPixels()))
              return printShip(div, parseInt(div.textContent) +1, div.parentNode.childNodes)
            }else{
              const onHit = (e)=>{
                console.log(e.target)
              }
              const onMiss= (e)=>{
                console.log(e.target)
              }
            }
          })
          board[0].appendChild(div)
        }
      }
      this.blankPixels = function(){
        const elem = this.board()
        const tempArr = []
        for(const value of elem.values()) {
          if (value.className === `pixel${this.name}`){
            tempArr.push(value)
          }else{
            tempArr.push(null)
          }
        }
        return tempArr
      }
      this.autoShipPlacement = function(){
        for (const keys in allShipType){
          const currentShipCPU = allShipType[keys]
          shipToPlace = new Ship(currentShipCPU[0],currentShipCPU[1],currentShipCPU[2],currentShipCPU[3])
          let index = randomGridCell()
          console.log(index)
          if(this.blankPixels()[index]===null) index = randomGridCell()
          printShip(this.blankPixels()[index], index, this.blankPixels()[index],true)
        }
      }
    }
  }
  const shipSelect = document.querySelectorAll('button')
  let currentShip = null
  // Add grid to boards:
  const x = new Grid(10,'User','userCss')
  x.generateGrid()
  const y = new Grid(10,'AI','AICss')
  y.generateGrid()
  console.log(y.name)
  console.log(x.name)
  // Add grid to boards ^

  shipSelect.forEach(button=>{
    button.addEventListener('click',()=>{
      currentShip = allShipType[button.innerText]
      button.disabled = true
      console.log(currentShip)
      shipToPlace = new Ship(currentShip[0],currentShip[1],currentShip[2],currentShip[3])
      console.log(shipToPlace)
      startVerses(numOfShipPlacements)
    })
  })
  const printShip = function (div, xy, parent,AI=false){
    if(shipToPlace === null) return false

    console.log(parent)
    div.className = shipToPlace.cssClass
    let i = shipToPlace.width - 1
    if(parseInt((xy - i).toFixed().match(/[0-9]$/g)) < i){
      console.log('%',parseInt((xy - i).toFixed().match(/[0-9]$/g)))
    }
    do{
      if(AI){
        parent.previousElementSibling.className = shipToPlace.cssClass
      }else{
        parent[xy].previousElementSibling.className = shipToPlace.cssClass
      }

      xy--

      i = i - 1

      console.log(i,':',xy)
    }while (0<i)
    numOfShipPlacements++
    console.log(x.blankPixels())
    // return shipToPlace.cssClass
  }

  const nodeList = function(id,arr){
    const xCoord = id % gridLength
    const yCoord = parseInt(id.toString().match(/^[0-9]/g))/*Math.floor(id/gridLength)*/
    const rowStart = parseInt(yCoord+'0')
    const rowEnd = parseInt(yCoord+'9')
    console.log('rowStart',rowStart,'rowEnd',rowEnd)
    const rowArr = []
    arr.forEach((elem, index)=>{
      if(index>=rowStart&&index<=rowEnd) {
        rowArr.push( elem)
      }
    })
    return rowArr
  }
  y.autoShipPlacement()
  const startVerses = function(numberOfShips){
    if(numberOfShips!==5) return false

    const right = children(y.name)
    const left = children(x.name)
    //add new class
    //add new addEventListener
    // add win condition
    right.forEach(div =>{
      div.classList.add('inPlay')
      const result = div.className
      const test = result.match(regex)
      console.log(test, logError)
      div.addEventListener('click',()=>{
        if(test===null){
          div.classList = 'hit'
          playerhits++
          winCondition(playerhits,aIHits)
        }else{
          div.classList = 'miss'
        }
      })
    })

  }
  const winCondition = function(playerhits, aIHits){
    if(playerhits===10){
      alert('You Won Matey')
    }else if(aIHits === 20){
      alert('You Won Matey')
    }
  }


})
