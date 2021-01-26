function showFilterOptions() {
  const expandedFilter = document.querySelector(".filter__expanded-filter")
  if (expandedFilter) {
    expandedFilter.style.display = "block"
  } else {
    const newExpandedFilter = document.createElement("div")
    newExpandedFilter.classList.add("filter__expanded-filter", "expanded-filter")
    const optionsHTML = `<ul class="options"><li class="option"><h3 class="option__title">CATEGORY</h3><ul class="sub-options"><li class="sub-options__option">Accessories</li><li class="sub-options__option">Bags</li><li class="sub-options__option">Denim</li><li class="sub-options__option">Hoodies & Sweatshirts</li><li class="sub-options__option">Jackets & Coats</li><li class="sub-options__option">Polos</li><li class="sub-options__option">Shirts</li><li class="sub-options__option">Shoes</li><li class="sub-options__option">Sweaters & Knits</li><li class="sub-options__option">T-Shirts</li><li class="sub-options__option">Tanks</li></ul></li><li class="option"><h3 class="option__title">BRAND</h3></li> <li class="option"><h3 class="option__title">DESIGNER</h3></li></ul>`
    newExpandedFilter.insertAdjacentHTML("beforeend", optionsHTML)

    const hideBtn = document.createElement("button")
    hideBtn.classList.add("expanded-filter-button")
    hideBtn.innerHTML = `<span class="expanded-filter-button__text">FILTER</span> <svg class="expanded-filter-button__icon" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.833333 10H4.16667C4.625 10 5 9.625 5 9.16667C5 8.70833 4.625 8.33333 4.16667 8.33333H0.833333C0.375 8.33333 0 8.70833 0 9.16667C0 9.625 0.375 10 0.833333 10ZM0 0.833333C0 1.29167 0.375 1.66667 0.833333 1.66667H14.1667C14.625 1.66667 15 1.29167 15 0.833333C15 0.375 14.625 0 14.1667 0H0.833333C0.375 0 0 0.375 0 0.833333ZM0.833333 5.83333H9.16667C9.625 5.83333 10 5.45833 10 5C10 4.54167 9.625 4.16667 9.16667 4.16667H0.833333C0.375 4.16667 0 4.54167 0 5C0 5.45833 0.375 5.83333 0.833333 5.83333Z" fill="black" /></svg>`
    hideBtn.addEventListener("click", (event) => {
      newExpandedFilter.style.display = "none";
    })
    newExpandedFilter.prepend(hideBtn)

    this.parentElement.prepend(newExpandedFilter)
  }
}

const btn = document.querySelector(".filter-button");

btn.addEventListener("click", showFilterOptions)
