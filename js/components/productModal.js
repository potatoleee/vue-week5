export default {
    //當id 變動時，取得遠端資料，並開啟對應modal
    props:['addToCart','tempProduct'],
    template:`
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalLabel" aria-hidden="true" ref="productModal">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>{{ tempProduct.title }}</span>
      </h5>
        <button type="button" class="btn-close"
                data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-6">
            <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
      </div>
          <div class="col-sm-6">
            <span class="badge bg-primary rounded-pill">{{  }}</span>
            <p>商品描述：{{ tempProduct.description }}</p>
            <p>商品內容：{{ tempProduct.content }}</p>

            <div class="h5" v-if="tempProduct.price === tempProduct.origin_price" >{{ tempProduct.price }} 元</div>
            <div v-else>
                <del class="h6">原價 {{ tempProduct.origin_price }} 元</del>
                <div class="h5">現在只要 {{ tempProduct.price }} 元</div>
            </div>
            <div>
              <div class="input-group">
                <select class="form-control" v-model="qty">
                    <option :value="i" v-for="i in 20" :key="i" >{{i}}</option>
                </select>
                <button type="button" class="btn btn-primary" @click="addToCart(tempProduct.id, qty)">加入購物車</button>
      </div>
      </div>
      </div>
          <!-- col-sm-6 end -->
      </div>
      </div>
      </div>
      </div>
      </div>
    `,
    data() {
        return {
            productModal:'',
            // tempProduct:{},
            qty:1//必須要定義原始值
        }
    },
    methods: {
        show(){
            this.productModal.show();
        },
        hide(){
            this.productModal.hide();
        },
    },
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.productModal);
      },
}