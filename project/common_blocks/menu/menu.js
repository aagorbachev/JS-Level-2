const animateCSS = (element, animation, prefix = 'animate__') => {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  })
}

const applyOverlay = (element) => {
  const parent = element.parentNode
  const checkOverlay = (parent) => parent.querySelector(".overlay")
  const exists = checkOverlay(parent)
  if (!exists) {
    const overlay = document.createElement("div")
    overlay.classList.add("overlay")
    overlay.setAttribute("style", "width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); position: absolute; left: 0; right: 0; z-index: 2;")
    parent.style.position = "relative"
    parent.prepend(overlay)
  }
}

const removerOverlay = (element) => {
  const overlay = document.querySelector(".overlay")
  const parent = overlay.parentNode
  parent.removeAttribute("style")
  parent.removeChild(overlay)
}

const hideMenu = (menuElement) => menuElement.classList.remove("menu_showed")

const menu = document.querySelector(".menu")
const closeButton = document.querySelector(".menu__close-button")
const menuButton = document.querySelector(".menu-button")


menuButton.addEventListener("click", (event) => {
  menu.classList.add("menu_showed")
  animateCSS(".menu", "slideInRight")
  applyOverlay(menu)
})

closeButton.addEventListener("click", (event) => {
  animateCSS(".menu", "slideOutRight").then((message) => {
    hideMenu(menu)
    removerOverlay(menu)
  })
})
