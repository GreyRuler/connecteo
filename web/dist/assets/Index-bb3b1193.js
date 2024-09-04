import{o as N,a as K,u as W,r as M,q as z,c as x,d as v,w as d,v as c,e as l,f as p,F as H,h as O,n as $,t as A,l as h,x as B,b as k,j as C,k as I,m as D,L as P,p as j}from"./index-60ce0b05.js";import{i as G,_ as J}from"./Template-0f6e6b4d.js";import{i as Q}from"./isValidPhoneNumber-0494aa7e.js";const X={class:"flex flex-col gap-y-2"},Y=l("h4",{class:"font-sera_bold text-lg"},"Стратегические сессии",-1),Z=l("span",null,"Подайте заявку и получите возможность разбора вашего бизнеса в формате стратегической сессии на площадке форума 23 мая. Топ-менеджеры и основатели бизнеса помогут за 1.5 часа разработать стратегию для вашего бизнеса и найти точки роста. Количество мест ограничено. Необходимо заполнить анкету и в случае отбора вашего проекта, менеджер свяжется для подготовки вашего участия.",-1),ee=l("span",{class:"pb-2"},"Дата посещения 23 мая",-1),te={class:"flex gap-x-2"},oe={class:"flex flex-col py-2 gap-y-2"},ne=l("span",null,[B("Размер бизнеса"),l("br"),B("(среднегодовой оборот, млн руб)")],-1),le={class:"flex gap-2 flex-wrap"},se=["onClick"],re={class:"flex relative"},ae={class:"absolute text-sm text-text_color right-4 bottom-3"},ie={class:"flex relative"},ue={class:"absolute text-sm text-text_color right-4 bottom-3"},de={__name:"Strategic",emits:["submit"],setup(F,{emit:g}){const u=n=>{n.status!=="cancelled"&&(t.phone=n.responseUnsafe.contact.phone_number)};N(()=>{window.Telegram.WebApp.onEvent("contactRequested",u);const n=document.querySelectorAll("input"),e=document.querySelectorAll("textarea");n&&n.forEach(s=>{s.addEventListener("focus",m),s.addEventListener("blur",i)}),e&&e.forEach(s=>{s.addEventListener("focus",m),s.addEventListener("blur",i)})}),K(()=>{window.Telegram.WebApp.offEvent("contactRequested",u),i();const n=document.querySelectorAll("input"),e=document.querySelectorAll("textarea");n&&n.forEach(s=>{s.removeEventListener("focus",m),s.removeEventListener("blur",i)}),e&&e.forEach(s=>{s.removeEventListener("focus",m),s.removeEventListener("blur",i)})});const m=()=>{if(G()){const n=document.querySelector("body");n&&n.classList.add("pb-80")}},i=()=>{const n=document.querySelector("body");n&&n.classList.remove("pb-80")};W();const b=g,w=[{id:0,title:"До 20 млн руб"},{id:1,title:"До 50"},{id:2,title:"50 - 250"},{id:3,title:"250+"}],t=M({surname:"",name:"",secondName:"",company:"",activity:"",turnover:null,employees:"",problems:"",request:"",phone:""}),a=window.Telegram.WebApp;function E(n){var e=n.replace(/\D/g,"");return e}const y=()=>{if(!t.surname)return a.showAlert("Фамилия не указана");if(!t.name)return a.showAlert("Имя не указано");if(!t.secondName)return a.showAlert("Отчество не указано");if(!Q(t.phone))return a.showAlert("Номер телефона указан неверно");if(!t.company)return a.showAlert("Название компании не указано");if(!t.activity)return a.showAlert("Сфера деятельности не указана");if(!t.turnover)return a.showAlert("Среднегодовой оборот не указан");if(!t.employees)return a.showAlert("Количество сотрудников не указано");if(!t.problems)return a.showAlert("Ключевые проблемы не указаны");if(!t.request)return a.showAlert("Запрос на стратсессию не указан");let n=E(t.phone);t.phone=n,b("submit",t)},r=()=>{window.Telegram.WebApp.requestContact()};return(n,e)=>{const s=z("resize-textarea");return x(),v("div",X,[Y,Z,ee,d(l("input",{onKeyup:e[0]||(e[0]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[1]||(e[1]=o=>t.surname=o),type:"text",placeholder:"Фамилия",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.surname]]),d(l("input",{onKeyup:e[2]||(e[2]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[3]||(e[3]=o=>t.name=o),type:"text",placeholder:"Имя",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.name]]),d(l("input",{onKeyup:e[4]||(e[4]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[5]||(e[5]=o=>t.secondName=o),type:"text",placeholder:"Отчество",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.secondName]]),l("div",te,[d(l("input",{onKeyup:e[6]||(e[6]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[7]||(e[7]=o=>t.phone=o),type:"text",placeholder:"Телефон",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.phone]]),l("button",{onClick:r,class:"rounded-xl px-2 text-sm"},"Поделиться")]),d(l("input",{onKeyup:e[8]||(e[8]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[9]||(e[9]=o=>t.company=o),type:"text",placeholder:"Название компании",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.company]]),d(l("input",{onKeyup:e[10]||(e[10]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[11]||(e[11]=o=>t.activity=o),type:"text",placeholder:"Сфера деятельности",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.activity]]),l("div",oe,[ne,l("div",le,[(x(),v(H,null,O(w,(o,_)=>{var f;return l("button",{onClick:()=>t.turnover=o,class:$(["px-4 py-1.5 rounded-full",((f=t==null?void 0:t.turnover)==null?void 0:f.id)===o.id?"bg-text_color":"bg-hint_color"]),key:_},A(o.title),11,se)}),64))])]),d(l("input",{onKeyup:e[12]||(e[12]=p(o=>o.target.blur(),["enter"])),"onUpdate:modelValue":e[13]||(e[13]=o=>t.employees=o),type:"text",placeholder:"Количество сотрудников",class:"outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full"},null,544),[[c,t.employees]]),l("div",re,[h(s,{class:"outline-none bg-secondary_bg_color !p-4 rounded-xl placeholder:text-text_color w-full",placeholder:"Опишите ключевые проблемы",minHeight:140,maxLength:"200",minLength:"16",modelValue:t.problems,"onUpdate:modelValue":e[14]||(e[14]=o=>t.problems=o)},null,8,["modelValue"]),l("span",ae,A(200-t.problems.length),1)]),l("div",ie,[h(s,{class:"outline-none bg-secondary_bg_color !p-4 rounded-xl placeholder:text-text_color w-full",placeholder:"Опишите ваш запрос на стратсессию",minHeight:140,maxLength:"200",minLength:"16",modelValue:t.request,"onUpdate:modelValue":e[15]||(e[15]=o=>t.request=o)},null,8,["modelValue"]),l("span",ue,A(200-t.request.length),1)]),l("button",{onClick:y,class:$(["transition-all p-3 rounded-full uppercase text-lg"])},"Отправить")])}}},ce={key:0,class:"flex flex-col p-4 gap-y-4"},pe={key:0,class:"flex flex-col gap-y-4"},fe={__name:"Index",setup(F){var y;const g=k(!0),u=W(),m=((y=window.Telegram.WebApp.initDataUnsafe.user)==null?void 0:y.id)||C.BOT.TEST_USER,i=k(null),b=window.Telegram.WebApp,w=I(),t=()=>{w.go(-1)},a=k(null);N(()=>{b.BackButton.show(),b.onEvent("backButtonClicked",t),(async()=>{i.value=await u.getUserData(m),a.value=await u.getSettings(),g.value=!1})()}),K(()=>{b.BackButton.hide(),b.offEvent("backButtonClicked",t)});const E=async r=>{var _,f,T,L,S,V,q,U;let n=((_=window.Telegram.WebApp.initDataUnsafe.user)==null?void 0:_.id)||C.BOT.TEST_USER,e=(f=window.Telegram.WebApp.initDataUnsafe.user)==null?void 0:f.first_name,s={...r,subscriber:i.value.id};s.turnover=r.turnover.title;const o=await u.addStrategic(s);if(o&&(i.value.attributes.strategic_session.data={id:o.id},(S=(L=(T=a.value)==null?void 0:T.data)==null?void 0:L.attributes)!=null&&S.appChat)){const R=`<b>Новая заявка на разбор бизнеса в формате стратегической сессии!</b>
            
<b>ФИО:</b> ${r.surname} ${r.name} ${r.secondName}
<b>Телефон:</b> ${r.phone}
<b>Название компании:</b> ${r.company}
<b>Деятельность:</b> ${r.activity}
<b>Среднегодовой оборот:</b> ${r.turnover.title} млн. рублей
<b>К-во сотрудников:</b> ${r.employees}
<b>TG:</b> <a href='tg://user?id=${n}'>${e}</a>

<b>Ключевые проблемы:</b>

${r.problems}

<b>Запрос:</b>

${r.request}`;await u.sendMessage(R,null,(U=(q=(V=a.value)==null?void 0:V.data)==null?void 0:q.attributes)==null?void 0:U.appChat)}};return(r,n)=>{var e;return g.value?(x(),D(j,{key:1})):(x(),v("div",ce,[h(P),i.value&&!((e=i.value.attributes.strategic_session)!=null&&e.data)?(x(),v("div",pe,[h(de,{onSubmit:E})])):(x(),D(J,{key:1,title:"Поздравляем, вы зарегистрированы!",subTitle:"В ближайшее время с вами свяжется менеджер",buttonText:"Вернуться на главную",to:"/"}))]))}}};export{fe as default};
