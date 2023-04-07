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
    return sum
  }
  increase(index) {
    this.uiGoods[index].increase()
  }
  decrease(index) {
    this.uiGoods[index].decrease()
  }
  getTotalChooseNumber() {
    let sum = 0
    for (let i = 0; i < this.uiGoods.length; i++) {
      sum += this.uiGoods[i].choose
    }
    return sum
  }
  //购物车中有没有东西
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0
  }
  //是否满足配送标准
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold
  }
  isChoose(index) {
    return this.uiGoods[index].isChoose()
  }
}

//整个UI
class UI {
  constructor() {
    this.uiData = new UIData()
    this.doms = {
      goodsContainer: document.querySelector('.goods-list'),
      deliveryPrice: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPayInnerSpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      car: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge')
    }
    //一开始就算好抛物线动画的终点（固定不变）
    let carRect = this.doms.car.getBoundingClientRect();
    let jumpTarget = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5,
    };
    this.jumpTarget = jumpTarget;

    this.createHTML()
    this.updateFooter()
    this.ListenEven()
  }

  //监听各种事件
  ListenEven() {
    this.doms.car.addEventListener('animationend', function () {
      this.classList.remove('animate')
    })
  }

  //根据商品数据创建页面
  createHTML() {
    let html = ''
    for (let i = 0; i < this.uiData.uiGoods.length; i++) {
      let g = this.uiData.uiGoods[i]
      html += `<div class="goods-item">
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
            <i index="${i}" class="iconfont i-jianhao"></i>
            <span>${g.choose}</span>
            <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`
    }
    this.doms.goodsContainer.innerHTML = html
  }
  increase(index) {
    this.uiData.increase(index)
    this.updateGoodsItem(index)
    this.updateFooter()
    this.jump(index)
  }
  decrease(index) {
    this.uiData.decrease(index)
    this.updateGoodsItem(index)
    this.updateFooter()
  }
  //更新单个商品状态
  updateGoodsItem(index) {
    let goodsDom = this.doms.goodsContainer.children[index]
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add('active')
    } else {
      goodsDom.classList.remove('active')
    }
    let span = goodsDom.querySelector('.goods-btns span')
    span.textContent = this.uiData.uiGoods[index].choose
  }
  //更新页脚
  updateFooter() {
    //总价
    let total = this.uiData.getTotalPrice()
    this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
    if (this.uiData.isCrossDeliveryThreshold()) {
      //到达起送费
      this.doms.footerPay.classList.add('active')
    } else {
      this.doms.footerPay.classList.remove('active')
      //还差多少
      let dis = this.uiData.deliveryThreshold - total
      dis = Math.round(dis)
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`
    }
    //设置总价
    this.doms.totalPrice.textContent = total.toFixed(2)
    //设置购物车样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.car.classList.add('active')
    } else {
      this.doms.car.classList.remove('active')
    }
    //设置购物车数量
    this.doms.badge.textContent = this.uiData.getTotalChooseNumber()
  }
  //购物车动画
  carAnimate() {
    this.doms.car.classList.add('animate')
  }
  //跳跃动画
  jump(index){
    // 找到对应商品的加号
    let btnAdd = this.doms.goodsContainer.children[index].querySelector(
      '.i-jiajianzujianjiahao'
    );
    let rect = btnAdd.getBoundingClientRect();
    let start = {
      x: rect.left,
      y: rect.top,
    };
    //添加div，div里添加i
    let div = document.createElement('div');
    div.className = 'add-to-car';
    let i = document.createElement('i');
    i.className = 'iconfont i-jiajianzujianjiahao';
    //设置起始位置
    div.style.transform=`translate(${start.x}px)`;
    i.style.transform = `translateY(${start.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);
    //获取div宽度以至于强行渲染
    div.clientWidth;
    //设置结束位置
    div.style.transform=`translate(${this.jumpTarget.x}px)`;
    i.style.transform = `translateY(${this.jumpTarget.y}px)`;

    div.addEventListener(
      'transitionend',
      ()=> {
        div.remove();
        this.carAnimate();
      },
      {
        once: true, // 事件仅触发一次
      }
    )
  }
}

let ui = new UI()

// 事件
ui.doms.goodsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('i-jiajianzujianjiahao')) {
    var index = +e.target.getAttribute('index');
    ui.increase(index);
  } else if (e.target.classList.contains('i-jianhao')) {
    var index = +e.target.getAttribute('index');
    ui.decrease(index);
  }
});

window.addEventListener('keypress', function (e) {
  if (e.code === 'Equal') {
    ui.increase(0);
  } else if (e.code === 'Minus') {
    ui.decrease(0);
  }
});

