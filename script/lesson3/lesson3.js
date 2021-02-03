/* 1. Переделайте makeGETRequest() так, чтобы она использовала промисы.

Функция до:
function makeGETRequest(url, callback) {

  const xhr;

  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      callback(xhr.responseText);
    }
  }

  xhr.open('GET', url, true);
  xhr.send();
} 

Функция после: 
function makeGETRequest(url) {
  return new Promise((resolve, reject) => {
    var xhr;

    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open('GET', url, true);
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send();
  })
}
*/



const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class CatalogItem {
  constructor(id, product_name, price, image = "https://placehold.co/360x420", quantity = 1) {
    this.product_name = product_name,
      this.price = price,
      this.id_product = id,
      this.image = image,
      this.quantity = quantity;
  }

  render() {
    const catalogItemElement = document.createElement("div")
    catalogItemElement.classList.add("catalog__item", "catalog-item")
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
</div>`
    const addToCartBtn = document.createElement("button")
    addToCartBtn.classList.add("catalog-item__button")
    addToCartBtn.innerHTML = `Add to Cart`
    addToCartBtn.addEventListener("click", (event) => {
      event.preventDefault()
      this.addToBasket(1)
    })

    catalogItemElement.append(addToCartBtn)
    return catalogItemElement
  }

  setTitle(product_name) {
    this.product_name = product_name;
  }

  getTitle() {
    return this.product_name
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
      method: "GET"
      // method: "POST", body: `${JSON.stringify(product)}`
    })
      .then(response => response.json())
      .then(jsonData => {
        console.log("Товар добавлен в корзину")
      })
      .catch(answer => {
        if (answer.errorMessage) {
          const error = new Error(answer.errorMessage)
          console.log(error)
        } else {
          const error = new Error(answer)
          console.log(error)
        }
      })
  }

  add(count = 1) {
    this.quantity += count;
  }
}

class Catalog {
  constructor() {
    this.goods = [];
  }
  fetchGoods() {
    fetch(`${API_URL}/catalogData.json`,
      {
        method: 'GET'
      }
    ).then(result => result.json())
      .then(data => {
        this.goods = data.map(item => new CatalogItem(item.id_product, item.product_name, item.price))
        this.render()
      })
    // makeGETRequest(`${API_URL}/catalogData.json`).then((goods) => {
    //   this.goods = JSON.parse(goods);
    //   this.render()
    // })
  }

  countTotalPrice() {
    let totalPrice = this.goods.reduce((sum, item) => sum + item.price, 0)
    return totalPrice
  }

  render() {
    let contentHTML = document.createElement("div");
    contentHTML.classList.add("catalog__content")
    this.goods.forEach((good) => {
      contentHTML.append(good.render());
    });

    const contentActual = document.querySelector(".catalog__content")
    contentActual.replaceWith(contentHTML)
  }
}

/**
 * Класс, представляющий элемент корзины
 */
class CartItem {
  /**
   * Создает экземпляр элемента корзины
   * @param {number} productId - уникальный идентификатор товара
   * @param {*} product_name - наименование товара
   * @param {*} price - цена товара
   * @param {*} quantity - количество закупаемого товара
   * @param {*} image - ссылка на файл с изображением товара
   */
  constructor(productId, product_name, price, quantity, image = "https://placehold.co/260x300") {
    this.productId = productId,
      this.product_name = product_name,
      this.price = price,
      this.quantity = quantity,
      this.image = image,
      this.amount = this.price * this.quantity
  }
  /**
   * Подсчет совокупной стоимости всего количества закупаемого твоара
   * @return {number} - итоговая стоимость
   */
  countAmount() {
    this.amount = this.price * this.quantity
    return this.amount
  }
  /**
   * Генерация HTML-верстки элемента корзины
   * @return {string} - HTML-структура элемента корзины, содержащая изображение, наименование, ID, цену, количество и итоговую стоимость выбранного товара
   */
  render() {
    return `<div class="cart-item">
        <img
        src="${this.image}"
        alt="${this.product_name}"
        class="cart-item__image"
      />
    <div class="cart-item__description">
      <h2 class="cart-item__title">${this.product_name}</h2>
      <button class="cart-item__close-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="none"
        >
          <path
            d="M6.21133 5.73193L9.66221 1.87065C9.82599 1.68772 9.91811 1.43948 9.91832 1.18055C9.91852 0.921615 9.82679 0.673196 9.6633 0.489941C9.49981 0.306686 9.27796 0.203606 9.04655 0.203377C8.81513 0.203148 8.59312 0.30579 8.42934 0.488722L4.97846 4.35L1.52758 0.488722C1.3638 0.305467 1.14167 0.202515 0.910056 0.202515C0.678439 0.202515 0.456309 0.305467 0.292531 0.488722C0.128753 0.671977 0.0367432 0.920525 0.0367432 1.17969C0.0367432 1.43885 0.128753 1.6874 0.292531 1.87065L3.74341 5.73193L0.292531 9.5932C0.128753 9.77646 0.0367432 10.025 0.0367432 10.2842C0.0367432 10.5433 0.128753 10.7919 0.292531 10.9751C0.456309 11.1584 0.678439 11.2613 0.910056 11.2613C1.14167 11.2613 1.3638 11.1584 1.52758 10.9751L4.97846 7.11386L8.42934 10.9751C8.59312 11.1584 8.81525 11.2613 9.04687 11.2613C9.27848 11.2613 9.50061 11.1584 9.66439 10.9751C9.82817 10.7919 9.92018 10.5433 9.92018 10.2842C9.92018 10.025 9.82817 9.77646 9.66439 9.5932L6.21133 5.73193Z"
            fill="#575757"
          />
        </svg>
      </button>
      <div class="cart-item__attributes">
        <p class="cart-item__attribute price">Price: <span class="price__value">&#8381;${this.price}</span></p>
        <p class="cart-item__attribute quantity">Quantity:
          <input class="quantity__value" type="number" name="quantity" id="1" min="0" max="100" value="${this.quantity}"/></p>
        </p>
        <p class="cart-item__attribute size">Amount: <span class="size-value">&#8381;${this.amount}</span></p>
      </div>
    </div>
    </div>`
    // return `<div class="cart-item">
    // <img class="cart-item_image" src="${this.image}" alt="illustration of product">
    // <h3 class="cart-item_title">${this.product_name}</h3>
    // <p class="cart-item_id">${this.productId}<p>
    // <p class="cart-item_price">${this.price}</p>
    // <p class="cart-item_quantity">${this.quantity}</p>
    // <p class="cart-item_amount">${this.amount}</p>
    // </div>`
  }
}

/** Класс, представляющий корзину интернет-магазина */
class Cart {
  /**
   * Создает объект корзины
   * @param {Array} products коллекция товаров, добавленных в корзину
   */
  constructor() {
    this.products = []
    this.goodsQuantity = this.countGoods()
    this.amount = this.countAmount()
  }
  /**
   * Получение количества уникальных позиций товаров, добавленных в корзину
   * @return {number} количество уникальных позиций
   */
  countGoods() {
    this.goodsQuantity = this.products.length
    return this.goodsQuantity
  }
  /**
   * Возвращает суммарную стоимость товаров в корзине
   * @return {number} суммарная стоимость
   */
  countAmount() {
    this.amount = this.products.reduce(
      (total, product) => total + product.amount, 0);
    return this.amount;
  }

  /**
   * Сортировка корзины по цене в возрастающем порядке
   */
  sortByAscendingPrice() {
    this.products.sort(function (a, b) {
      if (a.price > b.price) return 1;
      if (a.price < b.price) return -1;
      if (a.price == b.price) return 0;
    });
    this.render()
  }

  /**
   * Сортировка корзины по цене в убывающем порядке
   */
  sortByDescendingPrice() {
    this.products.sort(function (a, b) {
      if (a.price > b.price) return -1;
      if (a.price < b.price) return 1;
      if (a.price == b.price) return 0;
    });
    this.render()
  }
  /**
   * Сортировка корзины по ID в возрастающем порядке
   */
  sortById() {
    this.products.sort(function (a, b) {
      if (a.productId > b.productId) return 1;
      if (a.productId < b.productId) return -1;
      if (a.productId == b.productId) return 0;
    });
    this.render()
  }

  /**
   * Удаление определенной позиции товара из корзины и пересчет итоговых значений
   * @param {number} id_product - ID товара
   */
  removeItem(id_product) {
    fetch(`${API_URL}/deleteFromBasket.json`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then((jsonData) => {
        const itemToRemove = this.products.findIndex(item => item.id == id_product)
        this.products.splice(itemToRemove, 1)
        this.countAmount()
        this.countGoods()
        this.render()
      }
      )
      .catch(message => {
        const error = new Error(message)
        console.log(error)
      })
  }

  /**
   * Получение списка товаров корзины
   * @return {String} - список товаров корзины
   */
  getProductList() {
    fetch(`${API_URL}/getBasket.json`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(cart => {
        this.amount = cart.amount
        this.goodsQuantity = cart.countGoods
        this.products = cart.contents.map(item => new CartItem(item.id_product, item.product_name, item.price, item.quantity))
        this.render()
      })
      .catch(message => {
        const error = new Error(message)
        console.log(error)
      })
  }

  /**
   * Очистка корзины
   */
  clear() {
    this.products = []
    this.countGoods = 0
    this.amount = 0
  }

  /**
   * Генерация HTML-верстки корзины
   * @return {string} - HTML-структура корзины, содержащая элементы корзины, значение суммарного количества позиций товаров и итоговую сумму заказа. 
   */
  render() {
    let listHtml = "";
    this.products.forEach((product) => {
      listHtml += product.render();
    });
    document.querySelector(".cart__items").innerHTML = listHtml;

    let totalHtml = `${this.amount}`
    document.querySelector(".total__sub-value").innerHTML = `&#8381; ${totalHtml}`
    document.querySelector(".total__grand-value").innerHTML = `&#8381; ${totalHtml}`
  }
}
