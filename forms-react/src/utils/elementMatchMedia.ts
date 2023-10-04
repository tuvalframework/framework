function elementMatchMedia(element, mediaQueryString) {

    // Element is either a reference to a DOM node, or a CSS selector
    element = element instanceof Element
      ? element
      : document.querySelector(element)
  
    // Media query string is a string
    mediaQueryString = mediaQueryString || 'screen'
  
    // Look for <iframe id=match-media>…
    var iframe: any = document.querySelector('iframe#match-media')
  
    // If it doesn't exist, create it and attach it to the document
    if (iframe === null) {
      iframe = document.createElement('iframe')
      iframe.id = 'match-media'
      iframe.style.border = 'none'
      iframe.style.position = 'fixed'
      iframe.style.transform = 'translate(-100vw, -100vh)'
      document.documentElement.appendChild(iframe)
    }
  
    // Check iframe dimensions
    var dimensions = element.getBoundingClientRect()
  
    // For both width & height, make iframe match element size
    ;['width', 'height'].forEach(function(dimension) {
      return iframe[dimension] = dimensions[dimension]
    })
  
    // Why do we have to trigger something here?
    iframe.offsetWidth
  
    // Return result of window.matchMedia() from the window inside the iframe
    return iframe.contentWindow.matchMedia(mediaQueryString)
  }