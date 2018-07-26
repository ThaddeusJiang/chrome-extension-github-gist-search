const {
  prefixHref,
  loadCSS,
  showNewGistPage,
  isSearchPage,
} = require('./render')

describe('', () => {
  it('test prefix href', () => {
    const data = 'href="/any"'
    expect(prefixHref(data)).toEqual('href="https://gist.github.com/any"')
  })

  it('test load css', () => {
    Object.defineProperty(chrome.extension, 'getURL', {
      value: jest.fn().mockImplementation((name) => `https://${name}`),
    })
    loadCSS()
    expect(document.head.lastChild.href).toEqual('https://gist.css/')
  })

  it('New gist Page width', () => {
    Object.defineProperties(window.screen, {
      availWidth: {
        value: 1200,
        writable: true,
      },
      availHeight: {
        value: 1200,
      },
    })
    // 这个是必须的，jsdom 中没有 window.open()。Error: Not implemented: window.open
    Object.defineProperty(window, 'open', {
      value: jest
        .fn()
        .mockImplementation(
          (url, target, features) => `${url}|${target}|${features}`,
        ),
    })
    expect(showNewGistPage()).toEqual(
      'https://gist.github.com|gist|width=1100, height=1000, left=1000, top=100',
    )
    window.screen.availWidth = 1000

    expect(showNewGistPage()).toEqual(
      'https://gist.github.com|gist|width=500, height=1000, left=400, top=100',
    )
  })

  it('search page', () => {
    let el = document.createElement('div')
    el.setAttribute('id', 'lst-ib')
    document.body.appendChild(el)

    expect(isSearchPage()).toBe(true)

    document.body.removeChild(document.querySelector('#lst-ib'))
    expect(isSearchPage()).toBe(false)
  })
})
