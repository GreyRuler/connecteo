import{c as n,d as l,t as r,i as a,e,x as o,F as d,h as m,m as _,A as h,q as b}from"./index-60ce0b05.js";function L(){let t=navigator.userAgent;return!!/ios|iphone|ipad|ipod/i.test(t)}const g="/assets/check-021d6659.svg";function p(t){const s=document.createElement("textarea");s.value=t,document.body.appendChild(s),s.select();try{document.execCommand("copy")}catch{return}return document.body.removeChild(s),!0}const x={class:"flex flex-col justify-center items-center gap-y-4 text-center mt-12"},k={key:0,class:"font-druk text-xl"},f={key:1,class:"text-lg font-sera_bold"},y=e("div",{class:"w-24 h-24"},[e("img",{src:g,alt:"check",class:"w-full h-full object-contain"})],-1),w={class:"font-sera_bold underline"},v=e("br",null,null,-1),T=e("br",null,null,-1),S=e("a",{href:"https://megamarket.ru/promo/pravila-akczii-promokody-na-pervyj-zakazmy/?utm_source=sber&utm_medium=partners&utm_campaign=trade_may_msk",target:"_blank",class:"text-button_color underline"},"Правила акции",-1),C=e("a",{href:"https://megamarket.ru/?utm_source=sber&utm_medium=partners&utm_campaign=trade_may_msk",target:"_blank",class:"text-button_color underline"},"на сайте",-1),A=e("br",null,null,-1),j=e("br",null,null,-1),B=e("span",null,null,-1),z=e("span",null,null,-1),N={key:3,class:"text-lg font-sera_bold"},V={class:"flex flex-col items-center justify-center gap-y-0.5"},E=e("span",{class:"bg-text_color w-0.5 h-20"},null,-1),W={__name:"Template",props:{title:String,subTitle:String,answer:String,buttonText:String,to:String,promocode:String},setup(t){const s=t,c=()=>{p(s.promocode),window.Telegram.WebApp.showAlert("Промокод скопирован!")};return(F,O)=>{const i=b("router-link");return n(),l("div",x,[t.title?(n(),l("h1",k,r(t.title),1)):a("",!0),t.subTitle?(n(),l("span",f,r(t.subTitle),1)):a("",!0),y,t.promocode?(n(),l("div",{key:2,onClick:c},[e("p",null,[o("Мы также подготовили для вас промокод "),e("span",w,r(t.promocode),1),o(" от нашего партнера Мегамаркета - скидка 2000 руб. на первый заказ от 4000 руб."),v,T,o("Срок действия промокодов: 10.05.24 – 31.05.2024. "),S,o(". Использовать его можно "),C,o("."),A,o(),j,o("Увидимся на Московском предпринимательском форуме!")])])):a("",!0),B,z,t.answer?(n(),l("span",N,r(t.answer),1)):a("",!0),e("div",V,[E,(n(),l(d,null,m(3,(q,u)=>e("span",{key:u,class:"bg-text_color w-0.5 h-0.5"})),64))]),t.buttonText&&t.to?(n(),_(i,{key:4,to:t.to,class:"transition-all p-3 rounded-full uppercase text-lg bg-button_color text-button_text_color w-full"},{default:h(()=>[o(r(t.buttonText),1)]),_:1},8,["to"])):a("",!0)])}}};export{W as _,L as i};
