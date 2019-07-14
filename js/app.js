const gridLength = 10
const regex = new RegExp('pixel')
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
// let i = 0
// let randomStart = Math.floor(Math.random() * gridLength ** 2)
document.addEventListener('DOMContentLoaded',()=>{
  class Grid {
    constructor(gridLength=gridLength, name, cssClass) {
      this.name = name
      this.gridLength = gridLength
      this.cssClass = cssClass
      this.board = function(){
        const box = document.querySelector('.User')
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
            console.log(nodeList(div.textContent,this.blankPixels()))
            return printShip(div, parseInt(div.textContent) +1, div.parentNode.childNodes)
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
    }
  }
  const shipSelect = document.querySelectorAll('button')
  let currentShip = null
  // Add grid to boards:
  const x = new Grid(10,'User','userCss')
  x.generateGrid()
  const y = new Grid(10,'AI','AICss')
  y.generateGrid()
  // Add grid to boards ^

  shipSelect.forEach(button=>{
    button.addEventListener('click',()=>{
      currentShip = allShipType[button.innerText]
      button.disabled = true
      console.log(currentShip)
      shipToPlace = new Ship(currentShip[0],currentShip[1],currentShip[2],currentShip[3])
      console.log(shipToPlace)
    })
  })
  const printShip = function (div, xy, parent){
    if(shipToPlace === null) return false
    // const freespace = nodeList(div.textContent)
    // console.log('freespace1', freespace)
    // let arrFree = []
    // freespace.forEach(function(item,index) {
    //   if(item.classList.value==='pixel0') {
    //     console.log(index , item)
    //     arrFree.push(index)
    //   }
    // })
    // console.log('freespace2', arrFree)

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
    console.log(x.blankPixels())
    // return shipToPlace.cssClass
  }


  const nodeList = function(id,arr){
    // const arrParent = document.querySelector('.User')
    // const cellArr = arrParent.querySelectorAll('div')
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
    // }
  }
  console.log()
})
