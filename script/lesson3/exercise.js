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
  constructor(id, product_name, price, image = "https://placehold.co/600x400", quantity = 1) {
    this.product_name = product_name,
      this.price = price,
      this.id_product = id,
      this.image = image,
      this.quantity = quantity;
  }
  render() {
    return `
    <div class="goods-item">
    <img class="goods-image" src="${this.image}" alt="illustration of product">
    <h3 class="goods-title">${this.product_name}</h3>
    <p class="goods-text">${this.price}</p>
    <button class="goods-button goods-item__goods-button">Добавить</button>
    </div>`;
  }
  setTitle(product_name) {
    this.product_name = product_name;
  }
  getTitle() {
    return this.product_name
  }
  /**
 * Добавление нового товара в корзину
 * @param {number} productId уникальный идентификатор товара
 * @param {string} product_name наименование товара
 * @param {number} price цена товара
 * @param {number} quantity количество товара
 * @param {string} image ссылка на файл с изображением товара
 */
  addToBasket(id_product, quantity) {
    fetch(`${API_URL}/addToBasket.json`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(
        rawResponse => {
          console.log(rawResponse)
        })
      .catch(message => {
        const error = new Error(message)
        console.log(error)
      })
  }
  buy(count = 1) {
    if (count > this.quantity) {
      return null
    } else {
      const boughtItem = {}
      boughtItem.id = this.id;
      boughtItem.product_name = this.product_name;
      boughtItem.price = this.price;
      boughtItem.image = this.image;
      boughtItem.quantity = count;
      this.quantity -= count
      return boughtItem;
    }
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
    fetch(`${API_URL}/catalogData.json`, {
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
    let listHtml = "";
    this.goods.forEach((good) => {
      listHtml += good.render();
    });
    document.querySelector(".goods-list").innerHTML = listHtml;
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
  constructor(productId, product_name, price, quantity, image = "https://placehold.co/600x400") {
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
    <img class="cart-item_image" src="${this.image}" alt="illustration of product">
    <h3 class="cart-item_title">${this.product_name}</h3>
    <p class="cart-item_id">${this.productId}<p>
    <p class="cart-item_price">${this.price}</p>
    <p class="cart-item_quantity">${this.quantity}</p>
    <p class="cart-item_amount">${this.amount}</p>
    </div>`
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
   * @param {number} productId - ID товара
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
      })
      .catch(message => {
        const error = new Error(message)
        console.log(error)
      })
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
    document.querySelector(".cart").innerHTML = listHtml;
  }
}
