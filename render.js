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

function isSearchPage(id = 'lst-ib') {
  return document.getElementById(id) != null
}

function getQueryWord(id = 'lst-ib') {
  return document.getElementById(id).value || ''
}

function prefixHref(data) {
  return data.replace(/href="/g, 'href="https://gist.github.com')
}

function createHeader() {
  const header = document.createElement('header')

  const logo = document.createElement('div')
  logo.innerText = 'GitHub Gist Search'
  logo.className = 'branding'
  header.appendChild(logo)

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
