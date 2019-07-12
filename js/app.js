const gridLength = 10
// let i = 0
// let randomStart = Math.floor(Math.random() * gridLength ** 2)
document.addEventListener('DOMContentLoaded',()=>{
// Add grid to boards
  const boards = document.querySelectorAll('.boards')
  for(let j = 0; j < boards.length; j++){
    for(let i = 0; i < (gridLength**2); i++){
      const div = document.createElement('div')
      div.className = 'block'
      div.textContent = '~~'
      boards[j].appendChild(div)
    }
  }

})
