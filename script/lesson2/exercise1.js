class GoodsItem {
  constructor(title, price, id, image = "https://placehold.co/600x400", quantity = 5) {
    this.title = title,
      this.price = price,
      this.id = id,
      this.image = image,
      this.quantity = quantity;
  }
  render() {
    return `
    <div class="goods-item">
    <img class="goods-image" src="${this.image}" alt="illustration of product">
    <h3 class="goods-title">${this.title}</h3>
    <p class="goods-text">${this.price}</p>
    <button class="goods-button goods-item__goods-button">Добавить</button>
    </div>`;
  }
  setTitle(title) {
    this.title = title;
  }
  getTitle() {
    return this.title
  }
  buy(count = 1) {
    if (count > this.quantity) {
      return null
    } else {
      const boughtItem = {}
      boughtItem.id = this.id;
      boughtItem.title = this.title;
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
  // id
  // image
  // buy
}

class Catalog {
  constructor() {
    this.goods = [];
  }
  fetchGoods() {
    this.goods = [
      { title: "Shirt", price: 150 },
      { title: "Socks", price: 50 },
      { title: "Jacket", price: 350 },
      { title: "Shoes", price: 250 },
    ];
  }
  // Задание 2: добавьте для Catalog метод, определяющий суммарную стоимость всех товаров.
  countTotalPrice() {
    let totalPrice = this.goods.reduce((sum, item) => sum + item.price, 0)
    return totalPrice
  }
  render() {
    let listHtml = "";
    this.goods.forEach((good) => {
      const goodItem = new GoodsItem(good.title, good.price);
      listHtml += goodItem.render();
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
   * @param {*} title - наименование товара
   * @param {*} price - цена товара
   * @param {*} quantity - количество закупаемого товара
   * @param {*} image - ссылка на файл с изображением товара
   */
  constructor(productId, title, price, quantity, image = "https://placehold.co/600x400") {
    this.productId = productId,
      this.title = title,
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
    <h3 class="cart-item_title">${this.title}</h3>
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
  constructor(products = []) {
    this.products = products
    this.quantity = this.countQuantity()
    this.amount = this.countAmount()
  }
  /**
   * Получение количества уникальных позиций товаров, добавленных в корзину
   * @return {number} количество уникальных позиций
   */
  countQuantity() {
    this.quantity = this.products.length
    return this.quantity
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
   * Добавление нового товара в корзину
   * @param {number} productId уникальный идентификатор товара
   * @param {string} title наименование товара
   * @param {number} price цена товара
   * @param {number} quantity количество товара
   * @param {string} image ссылка на файл с изображением товара
   */
  addItem(productId, title, price, quantity, image) {
    const cartItem = new CartItem(productId, title, price, quantity, image)
    this.products.splice(productId, 0, cartItem)
    this.countQuantity()
    this.countAmount()
    // ToDO: добавить проверку на уникальность ID. Если товар с заданным ID уже имеется, то к товару в корзине добавляется количество от нового товара и пересчитывается amount. 
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
    // this.render()
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
    // this.render()
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
    // this.render()
  }
  /**
   * Удаление определенной позиции товара из корзины и пересчет итоговых значений
   * @param {number} productId - ID товара
   */
  removeItem(productId) {
    let itemToRemove = this.products.findIndex(item => item.id == productId)
    this.products.splice(itemToRemove, 1)
    this.countAmount()
    this.countQuantity()
    // this.render()
  }
  /**
   * Очистка корзины
   */
  clear() {
    this.products = []
    this.quantity = 0
    this.amount = 0
  }
  /**
   * Генерация HTML-верстки корзины
   * @return {string} - HTML-структура корзины, содержащая элементы корзины, значение суммарного количества позиций товаров и итоговую сумму заказа. 
   */
  render() { }
}

const catalog = new Catalog
catalog.fetchGoods()
console.log(catalog.countTotalPrice())

/**
 * ToDo:
 * ? написать функции сравнения для сортировки по возрастанию и убыванию
 * ? вместо countTotalQuantity и countTotalAmount добавить метод updateTotalValues(?) и добавить его в конце метода removeItem
 */