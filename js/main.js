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
          isLoading:false,
        }
    },
    methods: {
        getProductList() {
          this.isLoading=true;
          axios.get(`${api_url}/api/${api_path}/products/all`)
            .then(res => {
              this.productListData = res.data.products;
            })
            .catch(error => {
              alert(error.data.message);
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
        openProductModal(id) {
          this.loadingItem = id;
          axios.get(`${api_url}/api/${api_path}/product/${id}`)
          .then(res => {
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
          this.isLoading=true;
          axios.post(`${api_url}/api/${api_path}/cart`,{data})//{data:data}同名可以縮寫
            .then(res => {
              alert(res.data.message);
              this.$refs.productModal.hide();
              this.getCartList();
              this.loadingItem = "";//清空loading暫存
            })
            .catch(error => {
              alert(error.response.data.message);
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
        getCartList() {
          this.isLoading=true;
          axios.get(`${api_url}/api/${api_path}/cart`)
            .then(res => {
              this.cart = res.data.data;
            })
            .catch(error => {
              alert(error.response.data.message);
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
        updateCartItem(cartItem) { //購物車的id 產品的id
          const data = {
            product_id:cartItem.product_id,
            qty:cartItem.qty
          };
          this.loadingItem = cartItem.id;
          axios.put(`${api_url}/api/${api_path}/cart/${cartItem.id}`,{data})//{data:data}同名可以縮寫
            .then(res => {
              this.getCartList();
              this.loadingItem = "";
            })
            .catch(error => {
              alert(error.response.data.message);
            })
        },
        deleteCartItem(cartItem) {
          this.isLoading=true;
          this.loadingItem = cartItem.id;
          axios.delete(`${api_url}/api/${api_path}/cart/${cartItem.id}`)//{data:data}同名可以縮寫
            .then(res => {
              alert(res.data.message);
              this.getCartList();
              this.loadingItem = "";
            })
            .catch(error => {
              alert(error.response.data.message);
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
        deleteAllCartItem() {
          this.isLoading=true;
          axios.delete(`${api_url}/api/${api_path}/carts`)
            .then(res => {
              alert(res.data.message);
              this.getCartList();
            })
            .catch(error => {
              alert(error.response.data.message);
            })
            .finally(() => {
              this.isLoading = false;
            });
        },
        isPhone(value) {
          const phoneNumber = /^(09)[0-9]{8}$/
          return phoneNumber.test(value) ? true : '請填寫正確的手機號碼格式'
        },
        createOrder() {
          this.isLoading=true;
          axios.post(`${api_url}/api/${api_path}/order`,{data:this.orderData})
              .then(res => {
                  alert("訂單提交成功");
                  this.$refs.form.resetForm();//清空表單
                  this.orderData.message = "";
                  this.getCartList();
              })
              .catch(error => {
                alert(error.response.data.message);
                  
              })
              // 無論成功失敗都執行
              .finally(() => {
                this.isLoading = false;
              });
      },
    },
    components:{
      productModal
    },
    mounted() {
      this.getProductList();
      this.getCartList();
    },
});
// app.use(VueLoading.LoadingPlugin);//loading 以插件方式
app.component("loading", VueLoading.Component);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');