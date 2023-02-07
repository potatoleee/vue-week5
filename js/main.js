const {createApp} = Vue;
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });
  // 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});
import productModal from "./components/productModal.js";
const app = Vue.createApp({
    data(){
        return{
          productListData:[],
          productId:"",
          cart: {},
          loadingItem:"",//loading效果項目暫存區
          orderData:{
              "user": {
                  "name": "",
                  "email": "",
                  "tel": "",
                  "address": ""
                },
                "message": ""
          },
          tempProduct:{},
        }
    },
    methods: {
        getProductList() {
          axios.get(`${api_url}/api/${api_path}/products/all`)
            .then(res => {
              this.productListData = res.data.products;
              console.log(this.productListData);
            })
            .catch(error => {
              alert(error.data.message);
            })
        },
        openProductModal(id) {
          console.log('產品id:',id);
          this.loadingItem = id;
          axios.get(`${api_url}/api/${api_path}/product/${id}`)
          .then(res => {
            console.log('單一產品列表',res.data.product);
            this.tempProduct = res.data.product;
            this.$refs.productModal.show();
            this.loadingItem = "";//清空loading暫存
          })
          .catch(error => {
            alert(error.data.message);
          })
        },
        addToCart(product_id, qty = 1) {
          const data = {
            product_id,
            qty,
          };
          this.loadingItem = product_id;
          axios.post(`${api_url}/api/${api_path}/cart`,{data})//{data:data}同名可以縮寫
            .then(res => {
              console.log("加入購物車",res.data);
              this.$refs.productModal.hide();
              this.getCartList();
              this.loadingItem = "";//清空loading暫存
            })
            .catch(error => {
              alert(error.response.data.message);
            })
        },
        getCartList() {
          axios.get(`${api_url}/api/${api_path}/cart`)
            .then(res => {
              console.log("購物車列表",res.data.data);
              this.cart = res.data.data;
            })
            .catch(error => {
              alert(error.response.data.message);
            })
        },
        updateCartItem(cartItem) { //購物車的id 產品的id
          const data = {
            product_id:cartItem.product_id,
            qty:cartItem.qty
          };
          this.loadingItem = cartItem.id;
          axios.put(`${api_url}/api/${api_path}/cart/${cartItem.id}`,{data})//{data:data}同名可以縮寫
            .then(res => {
              console.log("更新購物車",res.data);
              this.getCartList();
              this.loadingItem = "";
            })
            .catch(error => {
              alert(error.response.data.message);
            })
        },
        deleteCartItem(cartItem) {
          this.loadingItem = cartItem.id;
          axios.delete(`${api_url}/api/${api_path}/cart/${cartItem.id}`)//{data:data}同名可以縮寫
            .then(res => {
              console.log("刪除購物車品項",res.data);
              this.getCartList();
              this.loadingItem = "";
            })
            .catch(error => {
              alert(error.response.data.message);
            })
        },
        deleteAllCartItem() {
          axios.delete(`${api_url}/api/${api_path}/carts`)
            .then(res => {
              console.log("刪除全部購物車品項",res.data);
              this.getCartList();
            })
            .catch(error => {
              alert(error.response.data.message);
            })
        },
        isPhone(value) {
          const phoneNumber = /^(09)[0-9]{8}$/
          return phoneNumber.test(value) ? true : '請填寫正確的電話號碼格式'
        },
        createOrder() {
          axios.post(`${api_url}/api/${api_path}/order`,{data:this.orderData})
              .then(res => {
                  console.log(res.data);
                  alert("訂單提交成功");
                  this.$refs.form.resetForm();//清空表單
                  this.getCartList();
              })
              .catch(error => {
                  console.log(error);
                  
              })
      },
    },
    components:{
      productModal
    },
    mounted() {
      this.getProductList();
      this.getCartList();
      let loader = this.$loading.show();
    // simulate AJAX
    setTimeout(() => {
        loader.hide()
    }, 1000)
    },
});
console.log(VueLoading);
app.use(VueLoading.LoadingPlugin);//loading 以插件方式
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');