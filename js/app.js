const gridLength = 10
class ship {
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
// let i = 0
// let randomStart = Math.floor(Math.random() * gridLength ** 2)
document.addEventListener('DOMContentLoaded',()=>{
  const shipSelect = document.querySelectorAll('button')
  let currentShip = null

  // Add grid to boards
  const boards = document.querySelectorAll('.boards')
  for(let j = 0; j < boards.length; j++){
    for(let i = 0; i < (gridLength**2); i++){
      const div = document.createElement('div')
      div.className = `pixel${j}`
      div.textContent = `${i}`
      div.addEventListener('click',()=>{
        console.log(div)
        nodeList(div.textContent)
        return printShip(div, parseInt(div.textContent) +1, div.parentNode.childNodes)
      })
      boards[j].appendChild(div)
    }
  }
  shipSelect.forEach(button=>{
    button.addEventListener('click',()=>{
      currentShip = allShipType[button.innerText]
      button.disabled = true
      console.log(currentShip)
      shipToPlace = new ship(currentShip[0],currentShip[1],currentShip[2],currentShip[3])
      console.log(shipToPlace)
    })
  })
  const printShip = function (div, xy, parent){
    if(shipToPlace === null) return false
    // const xCoordinate = xy % gridLength
    // const yCoordinate = Math.floor(xy/gridLength)
    div.className = shipToPlace.cssClass
    let i = shipToPlace.width - 1
    if(parseInt((xy - i).toFixed().match(/[0-9]$/g)) < i){
      console.log('%',parseInt((xy - i).toFixed().match(/[0-9]$/g)))
    }
    do{
      parent[xy].previousElementSibling.className = shipToPlace.cssClass
      xy--
      i = i - 1
      console.log(i,':',xy)
    }while (0<i)
    // return shipToPlace.cssClass
  }

  const nodeList = function(id){
    const arrParent = document.querySelector('.User')
    const cellArr = arrParent.querySelectorAll('div')
    const xCoord = id % gridLength
    const yCoord = parseInt(id.toString().match(/^[0-9]/g))/*Math.floor(id/gridLength)*/
    const rowStart = parseInt(yCoord+'0')
    const rowEnd = parseInt(yCoord+'9')
    console.log('rowStart',rowStart,'rowEnd',rowEnd)
    const rowArr = []
    cellArr.forEach((elem, index)=>{
      if(index>=rowStart&&index<=rowEnd) {
        rowArr.push( elem)
      }
    })
    console.log(rowArr)
    return rowArr
    // }
  }

})
