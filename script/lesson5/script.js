const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

class CatalogItem {
  constructor(
    id,
    product_name,
    price,
    image = "https://placehold.co/360x420",
    quantity = 1
  ) {
    (this.product_name = product_name),
      (this.price = price),
      (this.id_product = id),
      (this.image = image),
      (this.quantity = quantity);
  }

  render() {
    const catalogItemElement = document.createElement("div");
    catalogItemElement.classList.add("catalog__item", "catalog-item");
    catalogItemElement.innerHTML = `<img
    src="../../images/featured/man_coat.jpg"
    alt=""
    class="catalog-item__img"
  />
  <div class="catalog-item__caption">
    <h3 class="catalog-item__title">${this.product_name}</h3>
    <p class="catalog-item__description text">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga placeat ullam ipsa harum animi unde, itaque commodi molestiae incidunt quod!
    </p>
    <p class="catalog-item__price">&#8381;${this.price}</p>
  </div>`;
    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("catalog-item__button");
    addToCartBtn.innerHTML = `Add to Cart`;
    addToCartBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.addToBasket(1);
    });

    catalogItemElement.append(addToCartBtn);
    return catalogItemElement;
  }

  setTitle(product_name) {
    this.product_name = product_name;
  }

  getTitle() {
    return this.product_name;
  }

  /**
   * Добавление нового товара в корзину
   * @param {number} id_product уникальный идентификатор товара
   * @param {number} quantity количество товара
   */
  addToBasket(quantity = 1) {
    /* Пока используется заглушка с GET-запросом
       const product = {}
       product.id_product = id_product
       product.quantity = quantity */
    fetch(`${API_URL}/addToBasket.json`, {
      method: "GET",
      // method: "POST", body: `${JSON.stringify(product)}`
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("Товар добавлен в корзину");
      })
      .catch((answer) => {
        if (answer.errorMessage) {
          const error = new Error(answer.errorMessage);
          console.log(error);
        } else {
          const error = new Error(answer);
          console.log(error);
        }
      });
  }

  add(count = 1) {
    this.quantity += count;
  }
}

const catalog = new Vue({
  el: ".catalog",
  data: {
    items: [],
    filteredItems: [],
    searchLine: "",
    showFilter: false,
    isVisibleCart: false,
  },
  methods: {
    fetchItems() {
      fetch(`${API_URL}/catalogData.json`, {
        method: "GET",
      })
        .then((result) => result.json())
        .then((data) => {
          this.items = data.map(
            (item) =>
              new CatalogItem(item.id_product, item.product_name, item.price)
          );
          this.filteredItems = this.items;
        });
    },

    filterBySearchValue() {
      const value = this.searchLine;
      const regexp = new RegExp(value, "i");
      this.filteredItems = this.items.filter((item) =>
        regexp.test(item.product_name)
      );
    },

    showFilterOptions() {
      this.showFilter = true;
    },

    hideFilterOptions() {
      this.showFilter = false;
    },

    clearFilteredItems() {
      this.filteredItems = this.items;
    },
    showCart() {
      this.isVisibleCart = true;
    },
  },
  mounted() {
    this.fetchItems();
  },
});

console.log(catalog);
