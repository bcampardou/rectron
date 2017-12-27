const {desktopCapturer, ipcRenderer} = require('electron')
const domify = require('domify')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[name=types]').forEach(
    (item) => { item.addEventListener('change', sourceTypeChanged) }
  )
})

document.onkeydown = function (evt) {
  evt = evt || window.event
  // Press esc key.
  if (evt.key === "Escape") {
    ipcRenderer.send('source-id-selected', null)
  }
}

ipcRenderer.on('get-sources', (event, options) => {
  console.log('get-sources')
  getSources(options)
})

function sourceTypeChanged(event) {
  clearSources()
  getSources({ types: [event.target.value] })
}

function clearSources() {
  let sourcesList = document.querySelector('.capturer-list')
  sourcesList.innerHTML = ''
}

function getSources(options) {
  desktopCapturer.getSources(options, (error, sources) => {
    if (error) throw error
    let sourcesList = document.querySelector('.capturer-list')
    for (let source of sources) {
      let thumb = source.thumbnail.toDataURL()
      if (!thumb) continue
      let title = source.name.slice(0, 20)
      let item = `<li><a href="#"><img src="${thumb}"><span>${title}</span></a></li>`
      sourcesList.appendChild(domify(item))
    }
    let links = sourcesList.querySelectorAll('a')
    for (let i = 0; i < links.length; ++i) {
      let closure = (i) => {
        return (e) => {
          e.preventDefault()
          ipcRenderer.send('source-id-selected', sources[i].id)
          sourcesList.innerHTML = ''
        }
      }
      links[i].onclick = closure(i)
    }
  })
}