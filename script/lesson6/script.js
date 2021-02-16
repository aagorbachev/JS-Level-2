const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

Vue.component("catalog-items", {
  template: `<div class="catalog__items">
        <catalog-item v-for="(item, id) in filterItems" :key="\`items_\${id}\`" :name="item.product_name" :price="item.price"></catalog-item>
    </div>`,
  data() {
    return {
      items: [],
    };
  },
  props: ["filter"],
  computed: {
    filterItems() {
      const regexp = new RegExp(this.filter, "i");
      return this.filter
        ? [...this.items.filter((item) => regexp.test(item.product_name))]
        : [...this.items];
    },
  },

  mounted() {
    fetch(`${API_URL}/catalogData.json`, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((items) => {
        this.items = items;
      });
  },
});

Vue.component("catalog-item", {
  template: `<div class="catalog__item catalog-item">
    <img
    src="../../images/featured/man_coat.jpg"
    alt=""
    class="catalog-item__img"
  />
  <div class="catalog-item__caption">
    <h3 class="catalog-item__title"> {{ name }} </h3>
    <p class="catalog-item__description text">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga placeat ullam ipsa harum animi unde, itaque commodi molestiae incidunt quod!
    </p>
    <p class="catalog-item__price">&#8381; {{ price }}</p>
  </div>
  <add-to-cart @click="">Add to Cart</add-to-cart>
</div>`,
  props: ["name", "price"],
});

Vue.component("add-to-cart", {
  template: `<button class="catalog-item__button">Add to Cart</button>`,
  methods: {
    addToBasket() {
      console.log(this);
    },
  },
});

Vue.component("search", {
  template: `
  <div class="catalog__search catalog-search">
          <input
            type="text"
            class="catalog-search__input"
            v-model="search"
          />
          <button
            class="catalog-search__submit-button"
            type="button"
            @click="filterItems"
          >
            <svg
              class="catalog-search__submit-icon"
              width="26"
              height="27"
              viewBox="0 0 27 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="catalog-search__submit-icon-path"
                d="M19.0596 17.6259C20.6713 15.8658 21.6282 13.6048 21.7698 11.2225C21.9113 8.84018 21.2288 6.48173 19.8369 4.54318C18.445 2.60463 16.4285 1.20404 14.126 0.576619C11.8234 -0.0508009 9.3751 0.13316 7.19217 1.09761C5.00923 2.06205 3.22463 3.74825 2.13804 5.87302C1.05145 7.9978 0.729054 10.4318 1.225 12.7661C1.72094 15.1005 3.00501 17.1932 4.86158 18.6927C6.71814 20.1922 9.03413 21.0072 11.4206 21.0009C13.673 21.004 15.8645 20.27 17.6606 18.9109L25.4086 26.7179C25.4941 26.807 25.5965 26.8781 25.7099 26.927C25.8232 26.9759 25.9452 27.0017 26.0686 27.0029C26.1923 27.0033 26.3148 26.9782 26.4283 26.9292C26.5419 26.8801 26.6441 26.8082 26.7286 26.7179C26.9025 26.537 26.9997 26.2958 26.9997 26.0449C26.9997 25.794 26.9025 25.5528 26.7286 25.3719L19.0596 17.6259ZM2.88662 10.5009C2.89946 8.81563 3.41094 7.17187 4.35659 5.77685C5.30224 4.38183 6.63972 3.29801 8.20044 2.662C9.76115 2.02599 11.4752 1.86627 13.1266 2.20298C14.7779 2.53969 16.2926 3.35775 17.4797 4.55404C18.6668 5.75033 19.4732 7.27129 19.7972 8.92519C20.1212 10.5791 19.9483 12.2919 19.3002 13.8476C18.6522 15.4034 17.5581 16.7325 16.1559 17.6674C14.7536 18.6023 13.1059 19.1011 11.4206 19.1009C9.14916 19.0901 6.97482 18.1784 5.37484 16.566C3.77486 14.9537 2.87998 12.7724 2.88662 10.5009Z"
                fill="#E8E8E8"
              />
            </svg>
          </button>
        </div>`,
  data() {
    return {
      search: "",
    };
  },
  methods: {
    filterItems() {
      this.$emit("search", this.search);
    },
  },
});

Vue.component("cart", {
  template: `<section class="catalog__cart cart">
  <div class="cart__items">
    <cart-item v-for="(product, id) in products" :name="product.product_name" :price="product.price" :key="\`products_\${id}\`" :on-click="() => removeItem(id)""></cart-item>
  </div>
  <clear></clear>
  <continue></continue>
  <shipping v-on:getShippingCost="onShippingButtonPushed""></shipping>
 <total :subTotal="countAmount" :grandTotal="countTotalAmount"></total>
 <error v-if="fetched == false" :errorMessage="error"></error>
</section>`,
  data() {
    return {
      products: [],
      amount: 0,
      quantity: 0,
      shipping: 0,
      totalAmount: 0,
      fetched: true,
      error: "",
    };
  },
  computed: {
    countGoods() {
      return (this.quantity = this.products.length);
    },

    countAmount() {
      const value = this.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      return value;
    },

    countTotalAmount() {
      this.totalAmount = this.countAmount + this.shipping;
      return this.totalAmount;
    },
  },

  methods: {
    onShippingButtonPushed(value) {
      this.shipping = value;
    },

    removeItem(id) {
      fetch(`${API_URL}/deleteFromBasket.json`, { method: "GET" }).then((res) =>
        this.products.splice(id, 1)
      );
    },
  },
  mounted() {
    fetch(`${API_URL}/getBasket.json`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((cart) => {
        this.fetched = true;
        this.amount = cart.amount;
        this.quantity = cart.countGoods;
        this.products = cart.contents;
      })
      .catch((response) =>
        response.json().then((message) => {
          this.fetched = false;
          this.error = message.errorMessage;
        })
      );
  },
});

Vue.component("cart-item", {
  template: `<div class="cart-item" @click="onClick">
  <picture class="cart-item__image-container">
    <source srcset="../../images/cart/hoodie_140w.jpg" media="(max-width: 767px)">
    <source srcset="../../images/cart/hoodie_260w.jpg" media="(min-width: 768px)">
      <img
      src="../../images/cart/hoodie_140w.jpg"
      alt="Hoodie"
      class="cart-item__image"
    />
  </picture>
  <div class="cart-item__description">
    <h2 class="cart-item__title">{{ name }}</h2>
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
      <p class="cart-item__attribute price">Price: <span class="price__value">&#8381;{{ price }}</span></p>
      <p class="cart-item__attribute color">Color: <span class="color__value">Red</span></p>
      <p class="cart-item__attribute size">Size: <span class="size-value">XI</span></p>
      <p class="cart-item__attribute quantity">Quantity:
        <input class="quantity__value" type="number" name="quantity" id="1" min="0" max="100" /></p>
      </p>
    </div>
  </div>
</div>`,
  props: ["name", "price", "id", "onClick"],
});

Vue.component("shipping", {
  template: `<div class="cart__shipping shipping">
  <h2 class="shipping__title">SHIPPING ADRESS</h2>
  <form class="shipping__form shipping-form" action="#">
    <input
      type="text"
      class="shipping-form__field"
      placeholder="Bangladesh"
    />
    <input
      type="text"
      class="shipping-form__field"
      placeholder="State"
      value="State"
    />
    <input
      type="text"
      class="shipping-form__field"
      placeholder="Postcode / Zip"
      value="Postcode / Zip"
    />
    <button class="shipping-form__submit" type="submit" @click="countShipping">Get a quote</button>
  </form>
</div>`,
  data() {
    return {
      shipping: 500,
    };
  },
  methods: {
    countShipping() {
      this.$emit("getShippingCost", this.shipping);
    },
  },
});

Vue.component("total", {
  template: `<div class="cart__total total">
  <div class="total__sub-container">
    <p class="total__sub-title">SUB TOTAL</p>
    <p class="total__sub-value">&#8381;{{ subTotal }}</p>
  </div>
  <div class="total__grand-container">
    <p class="total__grand-title">GRAND TOTAL</p>
    <p class="total__grand-value">&#8381;{{ grandTotal }}</p>
  </div>
    <div class="total__line"></div>
  <button class="total__checkout-btn">PROCEED TO CHECKOUT</button>
</div>`,
  props: ["grand-total", "sub-total"],
});

Vue.component("error", {
  template: `<div class="error">
  <h2 class="error__message">Не удалось получить данные от сервера. {{ errorMessage }}</h2>
  </div>`,
  props: ["error-message"],
});

const app = new Vue({
  el: "#root",
  data: {
    search: "",
    showFilter: false,
    isVisibleCart: true,
  },
  methods: {
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

    filterItems(search) {
      this.search = search;
    },
  },
});
