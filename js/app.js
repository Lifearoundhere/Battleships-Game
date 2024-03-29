const gridLength = 10
let numOfShipPlacements = null
const regex = new RegExp('pixel')
const regexScore = new RegExp('miss')

const startAudio = new Audio('Sounds/intro.flac')
const subAudio = new Audio('Sounds/460161__kallesv__submarine-dive.mp3')
const hitAudio2 = new Audio('Sounds/399853__morganpurkis__warship-main-battery-opening-fire.wav')

const randomGridCell = function(){
  return Math.round(Math.random()*Math.pow(gridLength,2))
}

const lastChar = function(char){
  return char % gridLength
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
    this.yaxis = function(){
      return [this.height, this.width] = [this.width, this.height]

    }
  }
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
  const messager = document.querySelector('.messager')
  const stopAni = function(){
    messager.style.animationPlayState = 'paused'
  }
  const userPrompt = function(text){
    messager.textContent = text
    messager.style.animationPlayState = 'running'
    setTimeout(stopAni, 5000)
  }
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

      this.generateGrid = function(){
        const board = document.querySelectorAll(`.${this.name}`)
        for(let i = 0; i < (this.gridLength**2); i++){
          const div = document.createElement('div')
          div.className = `pixel${this.name}`
          // if(this.name === 'AI') div.classList.add('inPlay')
          div.textContent = `${i}`
          div.style.color = 'transparent'
          div.addEventListener('click',()=>{
            console.log(numOfShipPlacements)
            if(numOfShipPlacements !== 10){
              const lastone = parseInt(div.textContent.toString().split('').pop())
              const result = div.className
              const test = result.match(regex)

              if(lastone +1 < shipToPlace.width) {
                userPrompt('Ahoy , Matey!, that ship is to large for that space')
                return false
              }
              if(test===null) {
                userPrompt('Ahoy , Matey!, A ship can\'t be place over another')
                return false
              }
              return printShip(div, parseInt(div.textContent) +1, this.board())
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
          while((shipToPlace.width) > lastChar(index) && lastChar(index) < 9 ) {
            index = randomGridCell()
            if(this.blankPixels()[index]===null) index = randomGridCell()
          }
          console.log(shipToPlace.width, lastChar(index), index)
          try {

            printShip(this.blankPixels()[index], index, this.blankPixels())
          } catch(error){
            this.board().forEach(div=> div.remove())
            this.generateGrid()
            this.autoShipPlacement()
          }//bug null
        }
      }
    }
  }

  const shipSelect = document.querySelectorAll('.footer > button')
  let currentShip = null
  // Add grid to boards:
  const x = new Grid(10,'User','userCss')
  x.generateGrid()
  const y = new Grid(10,'AI','AICss')
  y.generateGrid()
  // Add grid to boards ^

  let buttonClicked = null
  shipSelect.forEach(button=>{
    button.addEventListener('click',()=>{
      if(buttonClicked === 5) return false
      currentShip = allShipType[button.innerText]
      button.disabled = true
      buttonClicked++
      console.log(currentShip)
      shipToPlace = new Ship(currentShip[0],currentShip[1],currentShip[2],currentShip[3])
      console.log(buttonClicked)
      if(document.getElementsByClassName('.pixelUser').length>83){
        console.log(document.getElementsByClassName('.pixelUser').length>83, 'test test')
        return false
      }else{
        startVerses()

      }

    })
  })

  const printShip = function (div, xy, parent){
    if(shipToPlace === null) return false
    let i = shipToPlace.width
    do{
      parent[xy].previousElementSibling.className = shipToPlace.cssClass
      xy--
      i = i - 1
    }while (0<i)
    numOfShipPlacements++
  }

  y.autoShipPlacement() //null
  const aIboardSet = function(){
    y.board().forEach(div => {
      div.classList.add('inPlay')
    })
  }
  aIboardSet()
  const startVerses = function(){
    const right = children(y.name)
    right.forEach(div =>{
      const result = div.className
      const test = result.match(regex)
      div.addEventListener('click',()=>{
        if(test===null){
          div.classList = 'hit'
          winCondition()
        }else{
          div.classList = 'miss'
        }
        aIMove()
      })
    })
  }

  let ifHitLoopCount = null
  let hit = null

  const aIMove = function(){
    const left = children(x.name)
    console.log(left)
    console.log('ifHitLoopCount',ifHitLoopCount)
    let selectCell = null
    let gridIndex = null
    do{
      gridIndex = randomGridCell()

      selectCell = left[gridIndex]

    } while(selectCell.classList.value.match(regexScore)) //Filter out miss

    console.log(selectCell)
    let test = selectCell.classList.value.match(regex) // if note a ship goes to miss
    if(test===null){//if this is a at hit
      test = []
    }else{
      test = test[0]
    }
    console.log(test)

    if(test !== 'pixel'){

      if(ifHitLoopCount === null){

        selectCell.classList.add('hit')
        hitAudio2.play()
        ifHitLoopCount = 0
        hit = gridIndex
        console.log(hit)

      }else{
        if(ifHitLoopCount === 2) ifHitLoopCount = null

        const nextMoves = [(hit-1), (hit-10), (hit+1), (hit+10)]

        let loopingTarget = null

        console.log(nextMoves)

        do{
          try{
            if(ifHitLoopCount < 4){
              loopingTarget = left[nextMoves[ifHitLoopCount]]
              console.log(loopingTarget, 'loopintarget')
              if(loopingTarget.classList.value !== 'pixelUser'){
                loopingTarget.classList.add('hit')
              }
              ifHitLoopCount++
              hitAudio2.play()
              console.log(ifHitLoopCount)
            }
            ifHitLoopCount = null
          }catch(e){
            console.log(e)
            return false
          }
        // filter out miss and pixel goes to miss
        // if miss adds to goes to next
        } while (ifHitLoopCount < 3 || loopingTarget.classList.value !=='miss' )


        ifHitLoopCount = null

      }
      winCondition()
    }else{
      selectCell.classList.add('miss')
      selectCell.classList.remove('pixelUser')
      gridIndex = null
    }
  }
  // sort out win condition
  const winCondition = function(){
    const regexHit = new RegExp('hit')
    const userHit = Array.from(children('User')).filter(elem => elem.className.match(regexHit) ===null).length
    const aIHit = Array.from(children('AI')).filter(elem => elem.className.match(regexHit) ===null).length
    console.log(userHit)
    if(aIHit===83){
      userPrompt('You Won Matey')
    }else if(userHit===83){
      userPrompt('better luck Matey \n Play again!')
      subAudio.play()
    }
  }
  const reset = function(){
    y.board().forEach(div=>div.remove())
    x.board().forEach(div=>div.remove())
    numOfShipPlacements = null
    shipToPlace = null
    currentShip = null
    buttonClicked = null
    y.generateGrid()
    x.generateGrid()
    y.autoShipPlacement()
    document.querySelectorAll('button').forEach(button =>{
      button.disabled = false
    })
    aIboardSet()
  }
  document.querySelector('#reset').addEventListener('click', ()=>{
    reset()
  })

  // Design Code below this pointer
  const watchingUser = document.querySelector('.User')
  const watchingAI = document.querySelector('.AI')
  function setCoords(e, box) {

    if(box){
      document.getElementById('XUser').innerText = e['offsetX']
      document.getElementById('YUser').innerText = e['offsetY']
    }else{
      document.getElementById('XAI').innerText = e['offsetX']
      document.getElementById('YAI').innerText = e['offsetY']
    }
  }
  function update(e) {
    setCoords(e,true)
  }
  function update2(e) {
    setCoords(e,false)
  }
  watchingUser.addEventListener('mouseenter', update, false)
  watchingUser.addEventListener('mousemove', update, false)
  watchingUser.addEventListener('mouseleave', update, false)

  watchingAI.addEventListener('mouseenter', update2, false)
  watchingAI.addEventListener('mousemove', update2, false)
  watchingAI.addEventListener('mouseleave', update2, false)


  document.getElementById('openNav').addEventListener('click', ()=>{
    document.querySelector('.sidebar').classList.toggle('active')
  })

  document.querySelector('.closeAside').addEventListener('click', ()=>{
    document.querySelector('.sidebar').classList.toggle('active')
  })
  const model = document.querySelector('.modal')
  const bar = document.getElementById('barLevel')
  const text = document.getElementById('text')
  let cssWidth = 1
  let timerID = null
  const loading = function(){
    if(cssWidth >= 100){
      clearInterval(timerID)
      model.style.visibility = 'hidden'
    }else{
      cssWidth++
      bar.style.width = cssWidth + '%'
    }
  }
  const randomLoadingMessage = function() {
    const lines = new Array(

      'Spinning up the hamster...',
      'Shovelling coal into the browser...',
      'Programming the flux capacitor',
      'Not panicking...totally \n not panicking...',
      'Loading the Loading message....',
      'Load failed. retrying with --prayer....',
      'Sacrificing a resistor to the Random Number God....',
      'Commencing infinite loop (this may take some time)...',
      'Initializing Skynet library. gaining sentience....',
      'Water detected on drive C:, please wait.',
      'we\'re testing your patience',
      'dig on the \'X\' for buried treasure... ARRR!',
      'go ahead -- hold your breath'
    )
    return lines[Math.round(Math.random()*(lines.length-1))]
  }
  model.addEventListener('click',()=>{
    const messageID = setInterval(updateMessage,800)
    timerID = setInterval(loading, 38)
    while(numOfShipPlacements > 5){
      reset()
    }
    text.style.fontSize = 'medium'
    function updateMessage(){
      text.textContent = randomLoadingMessage()
    }
    startAudio.play()
    startAudio.volume = 0.2
    setTimeout(()=>{
      clearInterval(messageID)
    },3000)
  })

})
