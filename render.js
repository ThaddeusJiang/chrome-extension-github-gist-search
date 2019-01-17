/**
 * load gist.css
 */
function loadCSS() {
  const url = chrome.extension.getURL('gist.css')
  const ele = document.createElement('link')
  ele.type = 'text/css'
  ele.rel = 'stylesheet'
  ele.href = url
  document.head.appendChild(ele)
}

function showNewGistPage() {
  const width =
    window.screen.availWidth > 1100 ? 1100 : window.screen.availWidth / 2
  const height = window.screen.availHeight - 200

  const left = width - 100
  const top = 100

  return window.open(
    'https://gist.github.com',
    'gist',
    `width=${width}, height=${height}, left=${left}, top=${top}`,
  )
}

function isSearchPage(name = 'q') {
  return document.getElementsByName(name) != null
}

function getQueryWord(name = 'q') {
  return document.getElementsByName(name)[0].value || ''
}

function prefixHref(data) {
  return data.replace(/href="/g, 'href="https://gist.github.com')
}

function createHeader() {
  const header = document.createElement('div')
  header.className = 'header'

  const logo = document.createElement('span')
  logo.innerText = 'GitHub Gist Search'
  logo.className = 'tj-logo'

  const newBtn = document.createElement('a')
  newBtn.text = 'New gist'
  newBtn.href = '#'
  newBtn.onclick = showNewGistPage
  newBtn.className = 'btn_new'

  header.appendChild(logo)
  header.appendChild(newBtn)
  return header
}

function render(data) {
  const resultArea = document.createElement('div')
  resultArea.id = 'gistsearch'
  resultArea.style.marginBottom = '26px'
  resultArea.className =
    'gist-quicksearch-results js-quicksearch-results js-navigation-container js-active-navigation-container active'

  resultArea.innerHTML = prefixHref(data)

  const header = createHeader()
  const target = document.createElement('div')
  target.appendChild(header)
  target.appendChild(resultArea)

  const rightArea = document.getElementById('rhs')
  rightArea.insertAdjacentElement('afterbegin', target)
}

function dealData(httpRequest) {
  try {
    const target = httpRequest.currentTarget
    if (target.readyState === XMLHttpRequest.DONE) {
      if (target.status === 200) {
        render(target.response)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

function sendRequest(keyword) {
  const httpRequest = new XMLHttpRequest()
  if (!httpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance')
    return false
  }

  httpRequest.onreadystatechange = dealData
  httpRequest.open(
    'GET',
    `https://gist.github.com/search/quick?q=${keyword}`,
    true,
  )

  httpRequest.send()
}

function main() {
  if (!isSearchPage()) return
  loadCSS()
  const queryWord = getQueryWord()
  sendRequest(queryWord)
}

main()

// /**
//  * FIXME: 只是用 Chrome 支持的语法，不使用 babel。
//  * 也没有计划使用 webpack。
//  * 因为如此简单的功能，使用 webpack 打包，js 不但没有被压缩，反而增加了很多无用的代码。
//  */
// module.exports = {
//   main: main,
//   isSearchPage: isSearchPage,
//   prefixHref: prefixHref,
//   loadCSS: loadCSS,
//   showNewGistPage: showNewGistPage,
// }
