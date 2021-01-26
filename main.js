// product-reviewコンポーネントからproductへイベントを通知、フォームデータの送信
// コンポーネント間で情報を送信できるグローバルイベントバスと呼ばれるもの
// オプションが渡されていない単なるVueインスタンス
var eventBus = new Vue()

Vue .component('product-tabs',{
  props:{
    reviews:{
      type:Array,
      required:false
    }
  },
  // レビューの表示部分をこのコンポーネントに持ってきたが、reviews自体はproductにある
  // propsを介してこっちに送信する必要があるので上記のように記述、受け取る形を定義しておく
  template:`
  <div>
    <div>
      <ul>
        <span class="tabs"
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab,index) in tabs"
              @click="selectedTab = tab"
              :key ="tab"
              >{{ tab }}</span>
      </ul>
    </div>

    <div v-show="selectedTab === 'Reviews'">
     <p v-if="!reviews.length">There are no reviews yet.</p>
     <ul v-else>
       <li v-for="review in reviews">
       <p>{{ review.name }}</p>
       <p>Rating: {{ review.rating }}</p>
       <p>{{ review.review }}</p>
       </li>
     </ul>
    </div>

    <div v-show="selectedTab === 'Make a Review'">
      <product-review></product-review>
    </div>

  </div>
  `,
  data(){
    return{
      tabs:['Reviews','Make a Review'],
      selectedTab:'Reviews'
    }
  }
})
// コンポーネント登録。product-detailsって名前のコンポーネント。2つ目の引数はオプションのオブジェクト
Vue.component('product-details',{
  props:{
    details:{
      type:Array,
      required:true
    }
  },
  template:`
  <ul>
   <li v-for="detail in details">{{ detail }}</li>
  </ul>
  `
})

// コンポーネント登録。productって名前のコンポーネント。2つ目の引数はオプションのオブジェクト
Vue.component('product',{
  props:{
    premium:{
      type:Boolean,
      required:true
    }
  },
  template:`
  <div class="product">
    <div class="product-image">
      <p>User is premium:{{ premium }}</p>
      <img v-bind:src="image" v-bind:alt="altText"/>
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p><h1>{{ description }}</h1></p>
      <p v-if="inStock">In Stock</p>
      <p v-else="!inStock ">Out of Stock</p>

      <p v-if="inventory > 10">In Stock</p>
      <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
      <p v-else
         :class="{ outOfStock: inventory==0 }"
          >Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <p>{{ sale }}</p>
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
      <h3>size</h3>
      <ul>
        <li  class="size" v-for="size in sizes">{{ size }}</li>
      </ul>

      <div class="color-box"
      　　　v-for="(variant,index) in variants"
      　　　:key="variant.variantId"
           :style="{ backgroundColor:variant.variantColor }"
           @mouseover="updateProduct(index)"
           >

      </div>
      <button v-on:click="removeFromCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >Remove from cart
      </button>
      <button v-on:click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >Add to cart
      </button>

    </div>
    <product-tabs :reviews="reviews"></product-tabs>
  </div>
  `,
  // dateメソッドとして扱うことで、再利用可能にする
  data(){
    return{
      product: "Socks",
      brand:"Vue Mastery",
      description: "A pair of warm, fuzzy socks",
      // image:"vmSocks-blue-onWhite.jpg",したでimage()を定義したので削除（こいつがあると機能しない）
      altText:"A pair of socks",
      jump:"https://jp.vuejs.org/index.html",
      // inStock:true,下で色ごとの在庫を指定するようにしたので削除（こいつがあると機能しない）
      inventory:0,
      selectedVariant:0,
      details:["80% cotton","20% polyester",  "Gender-neutral"],
      sizes:["S","M","L"],
      variants:[
        {
          variantId:2234,
          variantColor:"green",
          variantImage:"vmSocks-green-onWhite.jpg",
          variantQuantity:10
        },
        {
          variantId:2235,
          variantColor:"blue",
          variantImage:"vmSocks-blue-onWhite.jpg",
          variantQuantity:12
        }
      ],
      // cart:0,
      onSale:true,
      reviews:[]

    }
  },
  methods:{
    addToCart(){
      this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId)
    },
    removeFromCart(){
      this.$emit('remove-from-cart',this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index){
      this.selectedVariant = index
    }
    // addReview(productReview){
    //   this.reviews.push(productReview)
    // }
  },
  computed:{
    title(){
      return this.brand + ' ' + this.product
    },
    image(){
      // selectedVariantが更新されるので指定する配列の要素も代わる。その中のvariantImageを指定する
      return this.variants[this.selectedVariant].variantImage
    },
    inStock(){
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale(){
      if(this.onSale){
        return this.brand + ' ' + this.product + ' are on sale!'
      }
      return this.brand + ' ' + this.product + ' are not on sale'
    },
    shipping(){
      if(this.premium){
        return "Free"
      }else{
        return 2.99
      }
    }
    },
    mounted(){
      // イベントバスでreview-submittedの通知とレビューデータ（productReview）を送信
        eventBus.$on('review-submitted', productReview => {
          this.reviews.push(productReview)
        })
      }
    })
// 今まで→v-bindでデータからテンプレートに関連づけ
// ここではテンプレートからデータに関連づけをする
// v-modelで双方向の関連づけができる。入力でもデータ変更からでも更新される
 Vue.component('product-review',{
   // preventはイベント修飾子、送信イベントがページを再読み込みしないようにするために使用
   // レビューの一覧は、靴下の販売ページにあればいいので親の方には情報はなげない。
   // ＠review-submittedがproductからアナウンスされて、product-reviewでonSubmit()が動く
  // だからproductにreviews:[]がある
   template:`
   <form class="review-form" @submit.prevent="onSubmit">
   <p v-if="errors.length">
     <b>Please correct the following error(s):</b>
     <ul>
       <li v-for="error in errors">{{ error }}</li>
     </ul>

   </p>


     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name">
     </p>

     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>

     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>

     <p>
       <input type="submit" value="Submit">
     </p>
   </form>
   `,
   data(){
     return{
       name:null,
       review:null,
       rating:null,
       errors:[]
     }
   },
   methods:{
     onSubmit(){
       if(this.name && this.review && this.rating){
       // 入力された値を格納したオブジェクトを作成する
       // $emitで作成したオブジェクトをproductになげ、それぞれの値をnullにリセットする
       let productReview = {
         name:this.name,
         review:this.review,
         rating:this.rating
       }
       eventBus.$emit('review-submitted',productReview)
       this.name = null
       this.review = null
       this.rating = null
     }else{
       // 必須項目入力なしでエラーをerrors：[]に格納、HTMLで表示
       if(!this.name) this.errors.push("Name required.")
       if(!this.review) this.errors.push("Review required.")
       if(!this.rating) this.errors.push("Rating required.")
     }
     }
   }
 })

// jsからproduct変数を取得、それをHTML（h１）に表示する
var product = "Socks";


// elはVueアプリケーションの範囲、Vueの管轄領域を表す。elementの略
// <div id="app"> タグ内部がVueアプリケーションとして認識される
// vmSocks-green.jpg緑の靴下の画像。imageのところを別の画像のパスに設定すれば表示も変わる
var app = new Vue({
  el: '#app',
  data:{
    premium: true,
    cart:[]
  },
  methods:{
    updateCart(id){
      this.cart.push(id)
    },
    // selectedVariantの数値によってidは変化する（カーソルによる選択）
    // idが同じものはカート内から削除する（同じidがあったらi番目から1つ削除を繰り返す）
    removeItem(id){
      for(var i = this.cart.length - 1;i >= 0; i--){
        if(this.cart[i]===id){
          this.cart.splice(i,1);
        }
      }

    }
  }
  // data:{
  //   product: "Socks",
  //   brand:"Vue Mastery",
  //   description: "A pair of warm, fuzzy socks",
  //   // image:"vmSocks-blue-onWhite.jpg",したでimage()を定義したので削除（こいつがあると機能しない）
  //   altText:"A pair of socks",
  //   jump:"https://jp.vuejs.org/index.html",
  //   // inStock:true,下で色ごとの在庫を指定するようにしたので削除（こいつがあると機能しない）
  //   inventory:0,
  //   selectedVariant:0,
  //   details:["80% cotton","20% polyester",  "Gender-neutral"],
  //   sizes:["S","M","L"],
  //   variants:[
  //     {
  //       variantId:2234,
  //       variantColor:"green",
  //       variantImage:"vmSocks-green-onWhite.jpg",
  //       variantQuantity:10
  //     },
  //     {
  //       variantId:2235,
  //       variantColor:"blue",
  //       variantImage:"vmSocks-blue-onWhite.jpg",
  //       variantQuantity:0
  //     }
  //   ],
  //   cart:0,
  //   onSale:true
  // },
  // // selectedVariant:0　0はカーソルを上に置いたとき.インデックスの値に基づいて設定する
  // // dataの外にメソッド
  // methods:{
  //   addToCart(){
  //     // thisがないとカートが定義されていないというエラーになる。thisでインスタンスのcartを参照
  //     this.cart+=1
  //   },
  //   remove(){
  //     this.cart-=1
  //   },
  //   // imageをvariantImageに更新する
  //   // this.image = variantImage
  //   // this.imageを更新する代わりにthis.selectedVariantを更新する
  //   updateProduct(index){
  //   // selectedVariantの初期値は0（dataで定義）HTMLの方でvarientとindexが紐付けられてる
  //   // variants配列の0個目は緑の靴下の画像が格納されているため、それが表示されてる
  //   // カーソルをボックスの上に持っていくとselectedVariantが更新され、
  //   // その配列の要素と関連づけられた画像に切り替わる
  //     this.selectedVariant = index
  //   }
  // },
  // computed:{
  //   title(){
  //     return this.brand + ' ' + this.product
  //   },
  //   image(){
  //     // selectedVariantが更新されるので指定する配列の要素も代わる。その中のvariantImageを指定する
  //     return this.variants[this.selectedVariant].variantImage
  //   },
  //   inStock(){
  //     return this.variants[this.selectedVariant].variantQuantity
  //   },
  //   sale(){
  //     if(this.onSale){
  //       return this.brand + ' ' + this.product + ' are on sale!'
  //     }
  //     return this.brand + ' ' + this.product + ' are not on sale'
  //   }
  // }
  //
})
// Vueインスタンスはアプリケーションのroot
// ここにオプションオブジェクトを渡すことで作成される
// ここで渡すオブジェクトには、インスタンスにデータを保存してアクションを実行する機能を実行する
// さまざまなオプション情報がある
// var app = new Vue({options})
// optionsについて
// el: '#app',はHTMLのid=appのdivの中でオプションをアクティブ化
// インスタンスのdataには、インスタンスが接続されている要素（divとかの範囲）の内部からアクセスできる
