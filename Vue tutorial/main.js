// jsからproduct変数を取得、それをHTML（h１）に表示する
var product = "Socks";

// elはVueアプリケーションの範囲、Vueの管轄領域を表す。elementの略
// <div id="app"> タグ内部がVueアプリケーションとして認識される
// vmSocks-green.jpg緑の靴下の画像。imageのところを別の画像のパスに設定すれば表示も変わる
var app = new Vue({
  el: '#app',
  data:{
    product: "Socks",
    brand:"Vue Mastery",
    description: "A pair of warm, fuzzy socks",
    image:"vmSocks-blue-onWhite.jpg",
    altText:"A pair of socks",
    jump:"https://jp.vuejs.org/index.html",
    inStock:true,
    inventory:0,
    details:["80% cotton","20% polyester",  "Gender-neutral"],
    sizes:["S","M","L"],
    variants:[
      {
        variantId:2234,
        variantColor:"#008b8b",
        variantImage:"vmSocks-green-onWhite.jpg"
      },
      {
        variantId:2235,
        variantColor:"blue",
        variantImage:"vmSocks-blue-onWhite.jpg"
      }
    ],
    cart:0,
    selectedVariant:0
  },
  // selectedVariant:0　0はカーソルを上に置いたときのベースになる値。0から。
  // dataの外にメソッド
  methods:{
    addToCart(){
      // thisがないとカートが定義されていないというエラーになる。thisでインスタンスのcartを参照
      this.cart+=1
    },
    removeToCart(){
      this.cart-=1
    },
    updateProduct(variantImage){
      // imageをvariantImageに更新する
      this.image = variantImage
      }
  },
  computed:{
    title(){
      return this.brand + ' ' + this.product
    }
  }

})
// Vueインスタンスはアプリケーションのroot
// ここにオプションオブジェクトを渡すことで作成される
// ここで渡すオブジェクトには、インスタンスにデータを保存してアクションを実行する機能を実行する
// さまざまなオプション情報がある
// var app = new Vue({options})
// optionsについて
// el: '#app',はHTMLのid=appのdivの中でオプションをアクティブ化
// インスタンスのdataには、インスタンスが接続されている要素（divとかの範囲）の内部からアクセスできる
