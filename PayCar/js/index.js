//包装单件商品额外需要的数据
class UIGoods {
  constructor(g) {
    this.data = g
    this.choose = 0
  }
  //总价函数
  getTotalPrice() {
    return this.data.price * this.choose
  }
  //是否选中商品
  isChoose() {
    return this.choose > 0
  }
  //选中数量+1
  increase() {
    this.choose++
  }
  //选中数量-1
  decrease() {
    if (this.choose === 0) {
      return
    }
    this.choose--
  }
}

//包装整个界面额外需要的数据
class UIData {
  constructor() {
    let uiGoods = []
    for (let i = 0; i < goods.length; i++) {
      let uig = new UIGoods(goods[i])
      uiGoods.push(uig)
    }
    this.uiGoods = uiGoods
    this.deliveryThreshold = 30
    this.deliveryPrice = 5
  }
  getTotalPrice() {
    let sum = 0
    for (let i = 0; i < this.uiGoods.length; i++) {
      sum += this.uiGoods[i].getTotalPrice()
    }
    return sum;
  }
  increase(index) {
    this.uiGoods[index].increase()
  }
  decrease(index) {
    this.uiGoods[index].decrease()
  }
  getTotalChooseNumber() {
    let sum = 0;
    for (let i = 0; i < this.uiGoods.length; i++) {
      sum += this.uiGoods[i].choose
    }
    return sum
  } 
  //购物车中有没有东西
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0;
  }
  //是否满足配送标准
  isCrossDeliveryThreshold(){
    return this.getTotalPrice()>=this.deliveryThreshold;
  }
  isChoose(index){
    return this.uiGoods[index].isChoose();
  }
}

//整个UI
class UI{
  constructor(){
    this.uiData=new UIData();
    this.doms={
      goodsContainer:document.querySelector('.goods-list'),
      deliveryPrice:document.querySelector('.footer-car-tip'),
      footerPay:document.querySelector('.footer-pay')
    }
    this.createHTML();
    this.updateFooter();
  }
  //根据商品数据创建页面
  createHTML(){
    let html='';
    for(let i=0;i<this.uiData.uiGoods.length;i++){
      let g=this.uiData.uiGoods[i];
      html+=`<div class="goods-item">
      <img src="${g.data.pic}" alt="" class="goods-pic" />
      <div class="goods-info">
        <h2 class="goods-title">${g.data.title}</h2>
        <p class="goods-desc">
          ${g.data.desc}
        </p>
        <p class="goods-sell">
          <span>月售 ${g.data.sellNumber}</span>
          <span>好评率${g.data.favorRate}</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${g.data.price}</span>
          </p>
          <div class="goods-btns">
            <i class="iconfont i-jianhao"></i>
            <span>${g.choose}</span>
            <i class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`
    }
    this.doms.goodsContainer.innerHTML=html;
  }
  increase(index){
    this.uiData.increase(index);
    this.updateGoodsItem(index);
  }
  decrease(index){
    this.uiData.decrease(index);
    this.updateGoodsItem(index);
  }
  //更新单个商品状态
  updateGoodsItem(index){
    let goodsDom=this.doms.goodsContainer.children[index];
    if(this.uiData.isChoose(index)){
      goodsDom.classList.add('active');
    }else{
      goodsDom.classList.remove('active');
    }
    let span=goodsDom.querySelector('.goods-btns span');
    span.textContent=this.uiData.uiGoods[index].choose;
  }
  //更新页脚
  updateFooter(){
    this.doms.deliveryPrice.textContent=`配送费￥${this.uiData.deliveryPrice}`;
    if(this.uiData.isCrossDeliveryThreshold()){
      //到达起送费
      this.doms.footerPay
    }
  }
}

let ui = new UI()
console.log(ui)
