const app = new Vue({
  el: ".element",
  data: {
    // name: "Alex",
    // names: ["Dmitriy", "Marina", "Alexander", "Igor"],
    items: [],
    search: "",
  },
  methods: {
    handleClick(event) {
      console.log("click", event)
    },
    deleteItem(id) {
      console.log(id);
      this.items.splice(id, 1)
    },
    filterGoods() {
      this.items = this.search ? this.items.filter(({ product_name }) => product_name.includes(this.search)) : this.items;

    }
  },
  mounted() {
    fetch(
      `https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json`
    ).then(res => res.json()).then(res => {
      this.items = [...res, ...res, ...res]
      console.log(this.items)
    })
  }
});

console.log(app)

const arr = [1, 2, 3]
console.log(arr)

