// jsからproduct変数を取得、それをHTML（h１）に表示する
var product = "Socks";

// elはVueアプリケーションの範囲、Vueの管轄領域を表す。elementの略
// <div id="app"> タグ内部がVueアプリケーションとして認識される
// vmSocks-green.jpg緑の靴下の画像。imageのところを別の画像のパスに設定すれば表示も変わる
var app = new Vue({
  el: '#app',
  data:{
    product: "Socks",
    description: "A pair of warm, fuzzy socks",
    image:"vmSocks-blue.jpg",
    altText:"A pair of socks",
    jump:"https://jp.vuejs.org/index.html",
    inventory:0

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
