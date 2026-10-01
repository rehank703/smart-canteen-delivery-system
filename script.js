const products=[
 {id:1,name:"Masala Chai",cat:"Beverages",price:15,stock:22,icon:"☕",ordered:64,anim:"stir"},
 {id:2,name:"Cold Coffee",cat:"Beverages",price:45,stock:8,icon:"🥤",ordered:52,anim:"shake"},
 {id:3,name:"Fresh Orange Juice",cat:"Beverages",price:35,stock:13,icon:"🍊",ordered:48,anim:"bounce"},
 {id:4,name:"Lemon Iced Tea",cat:"Beverages",price:30,stock:16,icon:"🧋",ordered:39,anim:"shake"},
 {id:5,name:"Mango Smoothie",cat:"Beverages",price:55,stock:11,icon:"🥭",ordered:43,anim:"swirl"},
 {id:6,name:"Hot Chocolate",cat:"Beverages",price:50,stock:7,icon:"🍫",ordered:46,anim:"stir"},
 {id:7,name:"Cold Drink",cat:"Beverages",price:30,stock:18,icon:"🥤",ordered:37,anim:"shake"},
 {id:8,name:"Veg Sandwich",cat:"Food",price:50,stock:14,icon:"🥪",ordered:71,anim:"bite"},
 {id:9,name:"Cheese Pizza",cat:"Food",price:90,stock:4,icon:"🍕",ordered:85,anim:"cheese"},
 {id:10,name:"Veg Burger",cat:"Food",price:70,stock:6,icon:"🍔",ordered:77,anim:"bite"},
 {id:11,name:"Paneer Frankie",cat:"Food",price:75,stock:9,icon:"🌯",ordered:55,anim:"roll"},
 {id:12,name:"Veg Noodles",cat:"Food",price:65,stock:12,icon:"🍜",ordered:49,anim:"slurp"},
 {id:13,name:"Masala Pav",cat:"Food",price:40,stock:8,icon:"🥖",ordered:44,anim:"bite"},
 {id:14,name:"Samosa",cat:"Snacks",price:15,stock:3,icon:"🥟",ordered:96,anim:"bounce"},
 {id:15,name:"French Fries",cat:"Snacks",price:55,stock:10,icon:"🍟",ordered:61,anim:"bounce"},
 {id:16,name:"Paneer Roll",cat:"Snacks",price:65,stock:7,icon:"🌯",ordered:58,anim:"roll"},
 {id:17,name:"Aloo Tikki",cat:"Snacks",price:35,stock:13,icon:"🥔",ordered:42,anim:"bounce"},
 {id:18,name:"Cheese Toast",cat:"Snacks",price:45,stock:5,icon:"🍞",ordered:51,anim:"cheese"},
 {id:19,name:"Vanilla Ice-Cream",cat:"Ice-Creams",price:40,stock:9,icon:"🍨",ordered:34,anim:"melt"},
 {id:20,name:"Chocolate Ice-Cream",cat:"Ice-Creams",price:45,stock:2,icon:"🍦",ordered:69,anim:"melt"},
 {id:21,name:"Mango Ice-Cream",cat:"Ice-Creams",price:45,stock:5,icon:"🥭",ordered:41,anim:"melt"},
 {id:22,name:"Strawberry Sundae",cat:"Ice-Creams",price:65,stock:6,icon:"🍓",ordered:38,anim:"melt"},
 {id:23,name:"Chocolate Brownie",cat:"Desserts",price:55,stock:11,icon:"🍫",ordered:47,anim:"bite"},
 {id:24,name:"Gulab Jamun",cat:"Desserts",price:35,stock:8,icon:"🍩",ordered:53,anim:"bounce"},
 {id:25,name:"Donut",cat:"Desserts",price:45,stock:7,icon:"🍩",ordered:36,anim:"spin"},
 {id:26,name:"Fruit Cup",cat:"Desserts",price:50,stock:10,icon:"🍓",ordered:29,anim:"bounce"},
 {id:27,name:"Mini Meal Combo",cat:"Combos",price:120,stock:6,icon:"🍱",ordered:62,anim:"pop"},
 {id:28,name:"Burger + Fries Combo",cat:"Combos",price:115,stock:5,icon:"🍔",ordered:74,anim:"bite"},
 {id:29,name:"Sandwich + Juice Combo",cat:"Combos",price:80,stock:9,icon:"🥪",ordered:57,anim:"bite"},
 {id:30,name:"Chai + Samosa Combo",cat:"Combos",price:28,stock:12,icon:"☕",ordered:88,anim:"stir"}
];
const $=id=>document.getElementById(id),esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rm=matchMedia("(prefers-reduced-motion: reduce)"),rd=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}},wr=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let user=null,cart={},favs=[],orders=rd("sc_orders",[]),currentOrder=null,activeCat="All",flying=0,lastAdded=null,lastFav=null,cur="menu",tok=0;
const VIEWS=["menu","favorites","cart","checkout","tracking","dashboard"];
const money=n=>"₹"+n.toFixed(2);
function save(){if(user){wr("sc_cart_"+user.id,cart);wr("sc_favs_"+user.id,favs)}wr("sc_orders",orders)}
let toastTimer;
function showToast(msg){const t=$("toast");clearTimeout(toastTimer);t.classList.remove("hide");t.textContent=msg;t.style.display="block";toastTimer=setTimeout(()=>{t.classList.add("hide");setTimeout(()=>{t.style.display="none";t.classList.remove("hide")},250)},2200)}
function categories(){return ["All",...new Set(products.map(p=>p.cat))]}
function renderFilters(){$("filters").innerHTML=categories().map(c=>`<button class="filter ${c===activeCat?'active':''}" onclick="setCat('${c}')">${c}</button>`).join("")}
function setCat(c){activeCat=c;renderFilters();renderMenu()}
function renderMenu(){
 const q=$("search").value.toLowerCase();
 const filtered=products.filter(p=>(activeCat==="All"||p.cat===activeCat)&&p.name.toLowerCase().includes(q));
 const cats=activeCat==="All"?categories().slice(1):[activeCat];
 $("menuContainer").innerHTML=cats.map(cat=>{const arr=filtered.filter(p=>p.cat===cat);if(!arr.length)return "";
  return `<div class="menu-group"><h3><span>${cat}</span><small class="sub">${arr.length} items</small></h3><div class="menu-grid">${arr.map(itemCard).join("")}</div></div>`}).join("")||`<div class="empty">No matching items found.</div>`}
function itemCard(p){
 const inCart=cart[p.id]||0,available=p.stock-inCart,fav=favs.includes(p.id);
 return `<div class="item${inCart?' in-cart':''}"><button class="fav${fav?' on':''}${lastFav===p.id?' pop':''}" onclick="toggleFav(${p.id},event)" aria-pressed="${fav}" aria-label="${fav?'Remove from':'Add to'} favourites"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></button><div class="item-top"><div class="food-icon anim-${p.anim}">${p.icon}</div><div class="item-info"><h4>${p.name}</h4><div class="price">${money(p.price)}</div><div class="stock ${available<1?'out':available<5?'low':'ok'}">${available<1?'Out of stock':available+' available'}</div></div></div><div class="item-bottom"><span class="hint">${p.ordered>=75?'🔥 Popular • ':''}${inCart?inCart+" in cart":"Ready to order"}</span><button class="add" ${available<1?'disabled':''} onclick="addToCart(${p.id},event)">${inCart?'Add More':'Add to Cart'}</button></div></div>`}
/* fly to cart */
function addToCart(id,ev){
 const p=products.find(x=>x.id===id);if((cart[id]||0)>=p.stock)return showToast("Maximum available quantity reached");
 const ic=ev&&ev.currentTarget.closest(".item").querySelector(".food-icon"),from=ic&&ic.getBoundingClientRect();
 cart[id]=(cart[id]||0)+1;lastAdded=id;save();
 const fly=!!from&&!rm.matches;if(fly)flying++;
 renderAll();if(fly)flyToCart(from,p);showToast(p.name+" added to cart")}
function flyToCart(a,p){fling(a,p.icon,$("dockCart"),"",()=>{flying=Math.max(0,flying-1);renderDock(true);const b=$("dockCart").getBoundingClientRect();for(let i=0;i<9;i++)spark(b.left+b.width/2,b.top+b.height/2,5,1);bump($("dockCart"))})}
function bump(d){d.classList.remove("bump");void d.offsetWidth;d.classList.add("bump")}
function fling(a,glyph,target,cls,done){
 const b=target.getBoundingClientRect(),sx=a.left+a.width/2,sy=a.top+a.height/2,ex=b.left+b.width/2,ey=b.top+b.height/2,dx=ex-sx;
 const cx=sx+dx*.35,cy=Math.min(sy,ey)-Math.max(140,Math.hypot(dx,ey-sy)*.35),sg=dx>=0?1:-1;
 const el=document.createElement("div");el.className="fly "+cls;el.textContent=glyph;document.body.appendChild(el);const h=el.offsetWidth/2;
 const kf=[{offset:0,transform:`translate(${sx-h}px,${sy-h}px)`,opacity:1},{offset:.14,transform:`translate(${sx-h-sg*14}px,${sy-h+8}px) scale(1.22,.86) rotate(${-sg*14}deg)`,opacity:1}];
 for(let i=1;i<=24;i++){const t=i/24,u=1-Math.pow(1-t,1.9),m=1-u,x=m*m*sx+2*m*u*cx+u*u*ex,y=m*m*sy+2*m*u*cy+u*u*ey;
  kf.push({offset:Math.min(1,.14+.86*t),transform:`translate(${x-h}px,${y-h}px) scale(${1.15-.8*u}) rotate(${sg*540*u}deg)`,opacity:Math.max(0,Math.min(1,(1-t)*8))})}
 const trail=setInterval(()=>{const r=el.getBoundingClientRect();spark(r.left+r.width/2,r.top+r.height/2,4+Math.random()*4,0)},45);
 el.animate(kf,{duration:820,easing:"linear",fill:"forwards"}).onfinish=()=>{clearInterval(trail);el.remove();done()}}
function spark(x,y,s,out){const d=document.createElement("i");d.className="spark";d.style.cssText=`left:${x}px;top:${y}px;width:${s}px;height:${s}px`;document.body.appendChild(d);
 const g=Math.random()*6.283,r=out?18+Math.random()*28:3+Math.random()*8;
 d.animate([{transform:"translate(-50%,-50%) scale(1)",opacity:.9},{transform:`translate(calc(-50% + ${Math.cos(g)*r}px),calc(-50% + ${Math.sin(g)*r}px)) scale(0)`,opacity:0}],{duration:out?520:420,easing:"ease-out"}).onfinish=()=>d.remove()}
function renderDock(land){
 if(flying>0&&!land)return;const arr=cartArray().reverse(),n=arr.reduce((a,x)=>a+x.q,0),shown=arr.slice(0,4);
 $("cartDock").classList.toggle("has",n>0);$("dockCount").textContent=n;$("cartDock").setAttribute("aria-label","Open cart, "+n+" items");
 $("dockItems").innerHTML=shown.map(x=>`<span class="chip${land&&x.p.id===lastAdded?' land':''}" title="${x.p.name} × ${x.q}">${x.p.icon}${x.q>1?`<sup>${x.q}</sup>`:''}</span>`).join("")+(arr.length>4?`<span class="chip">+${arr.length-4}</span>`:"");
 $("dockTotal").textContent=n?money(subtotal()):""}
/* favourites */
function toggleFav(id,ev){
 ev.stopPropagation();const p=products.find(x=>x.id===id),i=favs.indexOf(id),card=ev.currentTarget.closest(".item");
 const r=ev.currentTarget.getBoundingClientRect();if(i>-1)favs.splice(i,1);else{favs.push(id);if(!rm.matches)fling(r,"❤️",document.querySelector(".nav [data-view=favorites] em"),"heart",()=>{const e=document.querySelector(".nav [data-view=favorites] em"),b=e.getBoundingClientRect();for(let k=0;k<7;k++)spark(b.left+b.width/2,b.top+b.height/2,5,1);bump(e)})}save();lastFav=id;renderMenu();
 if(i>-1&&cur==="favorites"&&card){card.classList.add("fav-out");setTimeout(renderFavs,280)}else renderFavs();
 lastFav=null;$("favBadge").textContent=favs.length;showToast(p.name+(i>-1?" removed from favourites":" saved to favourites"))}
function renderFavs(){
 const arr=favs.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 $("favContainer").innerHTML=arr.length?`<div class="fav-intro"><b>${arr.length}</b> saved ${arr.length===1?'item':'items'}. Your usual picks, one tap away.</div><div class="menu-grid">${arr.map(itemCard).join("")}</div>`:`<div class="panel empty"><div class="empty-icon">🤍</div><h3>No favourites yet</h3><p>Tap the heart on any item to save it here.</p><button class="add" onclick="navigate('menu')">Browse Menu</button></div>`;
 $("favBadge").textContent=favs.length}
function changeQty(id,d){const p=products.find(x=>x.id===id);cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];if(cart[id]>p.stock)cart[id]=p.stock;save();renderAll()}
function removeItem(id){delete cart[id];save();renderAll()}
function cartArray(){return Object.entries(cart).map(([id,q])=>({p:products.find(p=>p.id==id),q})).filter(x=>x.p)}
function subtotal(){return cartArray().reduce((s,x)=>s+x.p.price*x.q,0)}
/* estimated waiting time */
const PREP={Beverages:3,Food:8,Snacks:6,"Ice-Creams":2,Desserts:3,Combos:10};
const FLOOR_MIN={"Ground Floor":2,"1st Floor":3,"2nd Floor":4,"3rd Floor":5,"4th Floor":6};
const spread=n=>n+Math.max(3,Math.round(n*.25));
function etaFor(floor){
 const arr=cartArray();if(!arr.length)return null;
 const qty=arr.reduce((a,x)=>a+x.q,0),slowest=Math.max(...arr.map(x=>PREP[x.p.cat]||5));
 const make=slowest+Math.min(10,Math.ceil((qty-1)/2));
 const queue=Math.min(12,orders.filter(o=>o.status==="Placed"||o.status==="Being Made").length*2);
 const pack=2,ride=floor&&FLOOR_MIN[floor]!=null?FLOOR_MIN[floor]:null,ready=queue+make+pack;
 return{make,queue,pack,ride,ready,total:ready+(ride||0)}}
function etaRange(e){return{make:e.make,queue:e.queue,ride:e.ride,lo:e.total,hi:spread(e.total),readyLo:e.ready,readyHi:spread(e.ready)}}
const fmtTime=ms=>new Date(ms).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
function etaLiveText(o){
 if(!o.eta)return"";if(o.status==="Delivered")return"Delivered";
 const lo=o.placedAt+o.eta.lo*6e4,hi=o.placedAt+o.eta.hi*6e4,now=Date.now(),left=Math.ceil(((lo+hi)/2-now)/6e4);
 return now>=hi?"Arriving any moment now":`${fmtTime(lo)} to ${fmtTime(hi)} (about ${Math.max(1,left)} min left)`}
function renderEta(){
 const box=$("etaBox");if(!box)return;const f=$("floor").value,e=etaFor(f);
 if(!e){box.innerHTML="";return}
 const r=etaRange(e),now=Date.now();
 let h=`<b>⏱️ Estimated wait</b><br>Your order will be made in about <b>${r.readyLo}–${r.readyHi} min</b>.`;
 if(e.ride!=null){h+=`<br>Delivered to your floor in about <b>${r.lo}–${r.hi} min</b> (around ${fmtTime(now+r.lo*6e4)} to ${fmtTime(now+r.hi*6e4)}).`;
  const m=/^(\d+):(\d+) (AM|PM)$/.exec($("arrival").value||"");
  if(m){const d=new Date();let t=(+m[1]%12+(m[3]==="PM"?12:0))*60+ +m[2];const dist=(t-(d.getHours()*60+d.getMinutes())+1440)%1440;
   if(dist<r.lo)h+=`<br><span style="color:var(--orange);font-weight:700">Your preferred arrival time is earlier than this estimate, so it may arrive a little late.</span>`}}
 else h+=`<br>Select your floor to see the delivery time.`;
 if(e.queue)h+=`<br><small class="sub">Includes about ${e.queue} min for orders already in the queue.</small>`;
 box.innerHTML=h}
function renderCart(){
 const arr=cartArray();
 $("cartItems").innerHTML=arr.length?arr.map((x,i)=>`<div class="cart-row" style="animation-delay:${i*45}ms"><div class="cart-info"><div class="mini-icon">${x.p.icon}</div><div><b>${x.p.name}</b><div class="sub">${money(x.p.price)} each</div></div></div><div class="qty"><button onclick="changeQty(${x.p.id},-1)">−</button><b>${x.q}</b><button onclick="changeQty(${x.p.id},1)">+</button></div><div><b>${money(x.p.price*x.q)}</b><br><button class="remove" onclick="removeItem(${x.p.id})">Delete</button></div></div>`).join(""):`<div class="empty"><div class="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Select items from the menu to start your order.</p><button class="add" onclick="navigate('menu')">Browse Menu</button></div>`;
 const total=subtotal();
 $("cartSummary").innerHTML=arr.length?`<div class="summary-line"><span>Items</span><b>${arr.reduce((a,x)=>a+x.q,0)}</b></div><div class="summary-line"><span>Subtotal</span><b>${money(total)}</b></div><div class="summary-line"><span>Delivery</span><b>Free</b></div>${(()=>{const e=etaFor("");return e?`<div class="summary-line"><span>Ready in about</span><b>${e.ready}–${spread(e.ready)} min</b></div>`:""})()}<div class="total"><div style="display:flex;justify-content:space-between"><span>Total</span><span>${money(total)}</span></div></div><button class="primary" onclick="navigate('checkout')">Place Order →</button>`:"<p class='sub'>Your order summary will appear here.</p>";
 $("cartBadge").textContent=arr.reduce((a,x)=>a+x.q,0);renderDock();renderEta()}
function renderTracking(){
 const el=$("trackingContent");
 if(!currentOrder){el.innerHTML=`<div class="panel empty"><div class="empty-icon">📍</div><h2>No active order</h2><p>Place an order to track it here.</p><button class="add" onclick="navigate('menu')">Order Food</button></div>`;return}
 const states=["Placed","Being Made","Packaged","Delivering","Delivered"],idx=states.indexOf(currentOrder.status),o=currentOrder;
 el.innerHTML=`<div class="panel track-card"><h2>Track Order</h2><p class="sub">Order <b>${esc(o.number)}</b> • ${esc(o.name)}</p><div class="steps">${states.map((s,i)=>`<div class="step ${i<idx?'done':i===idx?'active':''}"><div class="dot">${i<idx?'✓':i+1}</div><span>${s}</span></div>`).join("")}</div><div class="info-box"><b>Delivery:</b> ${esc(o.className)}, ${esc(o.room)}, ${esc(o.floor)}<br><b>Arrival:</b> ${esc(o.arrival)} &nbsp; <b>Payment:</b> ${esc(o.payment)}${o.eta?`<br><b>Estimated delivery:</b> <span id="etaLive">${etaLiveText(o)}</span>`:""}</div><h3 style="margin-top:25px">Items</h3>${o.items.map(x=>`<div class="list-row"><span>${x.name} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("")}<div class="total" style="margin-top:15px;display:flex;justify-content:space-between"><span>Total</span><span>${money(o.total)}</span></div>${idx<4?`<button class="primary" onclick="advanceOrder()">Demo: Advance Order Status</button>`:"<p style='text-align:center;color:#16a34a;font-weight:800;margin-top:18px'>Order delivered successfully.</p>"}</div>`}
function advanceOrder(){const st=["Placed","Being Made","Packaged","Delivering","Delivered"],i=st.indexOf(currentOrder.status);if(i<4){currentOrder.status=st[i+1];save();renderTracking();renderDashboard();showToast("Order status: "+currentOrder.status)}}
function placeOrder(e){
 e.preventDefault();if(!cartArray().length){showToast("Your cart is empty");navigate("menu");return}
 if($("payment").value==="UPI"&&!payOk){openPay();return}
 const num="SC-"+new Date().getFullYear()+"-"+String(Math.floor(100000+Math.random()*900000));
 currentOrder={number:num,enroll:user.id,name:$("name").value,className:$("className").value,floor:$("floor").value,room:$("room").value,arrival:$("arrival").value,payment:payOk?"UPI · Txn "+payTxn:$("payment").value,payTxn:payOk?payTxn:"",placedAt:Date.now(),eta:etaFor($("floor").value)?etaRange(etaFor($("floor").value)):null,note:$("note").value,status:"Placed",total:subtotal(),items:cartArray().map(x=>({name:x.p.name,qty:x.q,price:x.p.price}))};
 orders.unshift(currentOrder);orders=orders.slice(0,10);payOk=false;payTxn="";cart={};save();renderAll();navigate("tracking");showToast("Order "+num+" placed")}
function renderDashboard(){
 const low=products.filter(p=>p.stock<5);
 $("stats").innerHTML=[["🍽️","Total Menu Items",products.length],["⚠️","Low Stock Items",low.length],["🔥","Orders Today",orders.length],["💰","Current Order Value",money(orders.reduce((s,o)=>s+o.total,0))]].map(x=>`<div class="stat"><small>${x[0]} ${x[1]}</small><div class="num">${x[2]}</div></div>`).join("");
 $("lowStock").innerHTML=low.map(p=>`<div class="list-row"><span>${p.icon} ${p.name}</span><span class="pill low">${p.stock} left</span></div>`).join("")||"<p class='sub'>No low-stock items.</p>";
 $("popular").innerHTML=[...products].sort((a,b)=>b.ordered-a.ordered).slice(0,6).map((p,i)=>`<div class="list-row"><span>${i+1}. ${p.icon} ${p.name}</span><span class="pill hot">${p.ordered} orders</span></div>`).join("");
 $("recentOrders").innerHTML=orders.length?orders.map(o=>`<div class="list-row" role="button" tabindex="0" title="View full order" onclick="openOrder('${esc(o.number)}')" onkeydown="if(event.key==='Enter')openOrder('${esc(o.number)}')"><div><b>${esc(o.number)}</b><div class="sub">${esc(o.name)} • ${esc(o.className)} • ${esc(o.status)}</div></div><b>${money(o.total)}</b></div>`).join(""):"<p class='sub'>No orders yet.</p>"}
/* section transitions */
const TITLES={menu:"Canteen Menu",favorites:"Favourites",cart:"Your Cart",checkout:"Checkout",tracking:"Order Tracking",dashboard:"Canteen Dashboard"};
function prep(v){if(v==="checkout")renderEta();if(v==="cart")renderCart();if(v==="tracking")renderTracking();if(v==="dashboard")renderDashboard();if(v==="favorites")renderFavs()}
function navigate(view){
 const my=++tok,from=document.querySelector(".view.active"),to=$(view),dir=VIEWS.indexOf(view)>=VIEWS.indexOf(cur)?1:-1,all=[...document.querySelectorAll(".view")];
 all.forEach(v=>{if(v!==from&&v!==to)v.classList.remove("active","enter-r","enter-l","leave-l","leave-r")});
 document.querySelectorAll(".nav button").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
 cur=view;document.body.dataset.view=view;prep(view);
 const pt=$("pageTitle");pt.textContent=TITLES[view];pt.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"none"}],{duration:380,easing:"ease-out"});
 window.scrollTo({top:0,behavior:"smooth"});
 if(from===to){to.classList.remove("leave-l","leave-r");return}
 const show=()=>{if(my!==tok)return;from&&from.classList.remove("active","leave-l","leave-r");to.classList.add("active","enter-"+(dir>0?"r":"l"));setTimeout(()=>{if(my===tok)to.classList.remove("enter-r","enter-l")},560)};
 if(from&&!rm.matches){from.classList.add("leave-"+(dir>0?"l":"r"));setTimeout(show,190)}else show()}
function jump(v){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active","enter-r","enter-l","leave-l","leave-r"));$(v).classList.add("active");cur=v;document.body.dataset.view=v;$("pageTitle").textContent=TITLES[v];document.querySelectorAll(".nav button").forEach(x=>x.classList.toggle("active",x.dataset.view===v))}
document.querySelectorAll(".nav button").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$("search").addEventListener("input",renderMenu);$("checkoutForm").addEventListener("submit",placeOrder);
/* themes */
const THEMES=[
{id:"",name:"Classic Blue",e:"🍽️",tag:"Clean and familiar",bg:"linear-gradient(135deg,#60a5fa,#2563eb)"},
{id:"theme-cafe",name:"Café",e:"☕",tag:"Warm and cozy",bg:"linear-gradient(135deg,#f59e0b,#ea580c)"},
{id:"theme-mint",name:"Mint",e:"🥗",tag:"Fresh and light",bg:"linear-gradient(135deg,#34d399,#0d9488)"},
{id:"theme-night",name:"Night",e:"🌙",tag:"Easy on the eyes",bg:"linear-gradient(135deg,#312e81,#0f766e)",dark:1},
{id:"theme-galaxy",name:"Milky Way",e:"🪐",tag:"For space lovers",bg:"radial-gradient(circle at 70% 25%,#ec4899,transparent 45%),linear-gradient(135deg,#312e81,#05030f)",dark:1,glass:1,fx:"galaxy",h:"Fuel up for liftoff"},
{id:"theme-jungle",name:"Jungle",e:"🌴",tag:"For nature lovers",bg:"radial-gradient(circle at 25% 20%,#bef264,transparent 45%),linear-gradient(135deg,#166534,#03110a)",dark:1,glass:1,fx:"jungle",h:"Fresh from the canteen jungle"},
{id:"theme-ocean",name:"Ocean",e:"🐠",tag:"For sea lovers",bg:"linear-gradient(135deg,#a5e8f5,#0e7490)",glass:1,fx:"ocean",h:"Dive into today's menu"},
{id:"theme-sakura",name:"Sakura",e:"🌸",tag:"Soft and dreamy",bg:"linear-gradient(135deg,#fbcfe8,#e11d48)",glass:1,fx:"sakura",h:"Something sweet today?"},
{id:"theme-cyber",name:"Neon Arcade",e:"🎮",tag:"For gamers and coders",bg:"linear-gradient(135deg,#c026d3,#0e7490)",dark:1,glass:1,fx:"cyber",h:"Press start to order"},
{id:"theme-spidey",name:"Spider-Man",e:"🕷️",tag:"Your friendly neighbourhood canteen",bg:"linear-gradient(135deg,#e11d2e 48%,#1a3fb0 52%)",dark:1,glass:1,fx:"spidey",h:"With great hunger comes great lunch"}];
let theme="";
$("themeGrid").innerHTML=THEMES.map(t=>`<button class="t-tile" data-id="${t.id}" onclick="setTheme('${t.id}',event)"><div class="t-prev" style="background:${t.bg}">${t.e}</div><b>${t.name}</b><small>${t.tag}</small></button>`).join("");
function applyTheme(id){
 const t=THEMES.find(x=>x.id===id)||THEMES[0];theme=t.id;
 document.body.classList.remove(...THEMES.map(x=>x.id).filter(Boolean),"dark","glass");
 if(t.id)document.body.classList.add(t.id);if(t.dark)document.body.classList.add("dark");if(t.glass)document.body.classList.add("glass");
 localStorage.setItem("sc_theme",t.id);$("heroTitle").textContent=t.h||"What would you like today?";
 document.querySelectorAll(".themeEmoji").forEach(x=>x.textContent=t.e);
 document.querySelectorAll(".t-tile").forEach(x=>x.classList.toggle("active",x.dataset.id===t.id));fxSet(t.fx||"")}
function setTheme(id,ev){
 if(id===theme)return;if(!document.startViewTransition||rm.matches)return applyTheme(id);
 const x=ev.clientX,y=ev.clientY,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
 document.startViewTransition(()=>applyTheme(id)).ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:750,easing:"cubic-bezier(.4,0,.2,1)",pseudoElement:"::view-transition-new(root)"})).catch(()=>{})}
function openThemes(btn,ev){ev.stopPropagation();const p=$("themePop");if(p.classList.toggle("open")){const r=btn.getBoundingClientRect();p.style.top=r.bottom+10+"px";p.style.right=Math.max(12,innerWidth-r.right)+"px"}}
function closeThemes(){$("themePop").classList.remove("open")}
document.addEventListener("click",e=>{if(!e.target.closest("#themePop"))closeThemes()});
/* background effects */
const cv=$("fx"),cx=cv.getContext("2d"),R=(a,b)=>a+Math.random()*(b-a);let FW,FH,FM="",FP=[],FT=0,FL=0,FR=0,SS=null,SN=3;
function fxSize(){const d=Math.min(devicePixelRatio||1,2);FW=innerWidth;FH=innerHeight;cv.width=FW*d;cv.height=FH*d;cx.setTransform(d,0,0,d,0,0);spawn()}
function spawn(){const n=Math.round(Math.min(1.6,Math.max(.5,FW*FH/1e6))*({galaxy:150,jungle:34,ocean:34,sakura:34,cyber:40,spidey:26}[FM]||0));FP=Array.from({length:n},()=>({x:R(0,FW),y:R(0,FH),r:R(.4,1.7),a:R(0,6.3),s:R(.6,2.2),v:R(15,50),w:R(8,30),g:Math.random()}))}
function fxSet(m){FM=m;cancelAnimationFrame(FR);cx.clearRect(0,0,FW,FH);if(!m)return;spawn();FL=performance.now();rm.matches?fxDraw(0):FR=requestAnimationFrame(fxLoop)}
function fxLoop(t){const dt=Math.min(.05,(t-FL)/1e3);FL=t;FT+=dt;fxDraw(dt);FR=requestAnimationFrame(fxLoop)}
function fxDraw(dt){
 cx.clearRect(0,0,FW,FH);const T=FT,W=FW,H=FH,TAU=6.2832;
 if(FM==="cyber"){const h=H*.58;cx.lineWidth=1;cx.strokeStyle="rgba(236,72,153,.32)";for(let k=-14;k<=14;k++){cx.beginPath();cx.moveTo(W/2+k*W*.012,h);cx.lineTo(W/2+k*W*.11,H);cx.stroke()}
  const o=(T*.3)%1;for(let i=0;i<14;i++){const p=(i+o)/14,y=h+(H-h)*p*p;cx.strokeStyle=`rgba(34,211,238,${.08+.4*p})`;cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke()}}
 if(FM==="spidey"){[[.58,0],[.9,2.1]].forEach(([fx,ph])=>{const x=W*fx,L=70+H*.12*(.5+.5*Math.sin(T*.4+ph));cx.strokeStyle="rgba(255,255,255,.7)";cx.lineWidth=1.2;cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,L);cx.stroke();cx.font="24px serif";cx.textAlign="center";cx.fillText("\u{1F577}\uFE0F",x,L+20)})}
 for(const p of FP){
  if(FM==="galaxy"){p.x+=p.r*2*dt;if(p.x>W+3)p.x=-3;const a=.3+.7*(.5+.5*Math.sin(T*p.s+p.a));cx.fillStyle=`rgba(${p.g<.6?"255,255,255":p.g<.8?"200,215,255":"255,215,240"},${a})`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,TAU);cx.fill()}
  else if(FM==="jungle"){p.y-=p.v*.15*dt;if(p.y<-20)p.y=H+20;const x=p.x+Math.sin(T*p.s*.6+p.a)*p.w,y=p.y+Math.cos(T*p.s*.5+p.a)*p.w*.6,a=.3+.7*Math.pow(Math.max(0,Math.sin(T*p.s+p.a)),2),r=p.r*4+3,g=cx.createRadialGradient(x,y,0,x,y,r*2);g.addColorStop(0,`rgba(253,240,120,${a})`);g.addColorStop(.3,`rgba(190,242,100,${a*.35})`);g.addColorStop(1,"rgba(190,242,100,0)");cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r*2,0,TAU);cx.fill()}
  else if(FM==="ocean"){p.y-=p.v*dt;if(p.y<-20){p.y=H+20;p.x=R(0,W)}const x=p.x+Math.sin(T*.9+p.a)*p.w*.5,r=p.r*5;cx.fillStyle="rgba(255,255,255,.16)";cx.strokeStyle="rgba(255,255,255,.75)";cx.lineWidth=1.3;cx.beginPath();cx.arc(x,p.y,r,0,TAU);cx.fill();cx.stroke();cx.fillStyle="rgba(255,255,255,.85)";cx.beginPath();cx.arc(x-r*.35,p.y-r*.35,Math.max(1,r*.2),0,TAU);cx.fill()}
  else if(FM==="sakura"){p.y+=p.v*.8*dt;p.x+=Math.sin(T*.8+p.a)*16*dt+8*dt;if(p.y>H+20){p.y=-20;p.x=R(0,W)}if(p.x>W+20)p.x=-20;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a+T*p.s*.4);cx.scale(1,.55+.45*Math.cos(T*p.s+p.a));cx.fillStyle="rgba(249,168,212,.85)";cx.beginPath();cx.ellipse(0,0,p.r*6+3,p.r*3.4+2,0,0,TAU);cx.fill();cx.restore()}
  else if(FM==="spidey"){p.y-=p.v*.2*dt;if(p.y<-5){p.y=H+5;p.x=R(0,W)}const a=.25+.5*Math.abs(Math.sin(T*p.s*.5+p.a));cx.fillStyle=p.g>.5?`rgba(255,80,90,${a})`:`rgba(120,170,255,${a})`;cx.beginPath();cx.arc(p.x+Math.sin(T*.6+p.a)*p.w*.4,p.y,p.r*1.3,0,TAU);cx.fill()}
  else if(FM==="cyber"){p.y-=p.v*.3*dt;if(p.y<-5)p.y=H+5;cx.fillStyle=p.g>.5?"rgba(236,72,153,.7)":"rgba(34,211,238,.7)";cx.fillRect(p.x,p.y,p.r*2.2,p.r*2.2)}}
 if(FM==="galaxy"){SN-=dt;if(SN<=0){SN=R(3,7);SS={x:R(W*.35,W),y:R(0,H*.35),vx:-R(520,820),vy:R(240,420),l:0}}
  if(SS){SS.l+=dt;SS.x+=SS.vx*dt;SS.y+=SS.vy*dt;const k=SS.l/1;if(k>=1)SS=null;else{const an=Math.atan2(SS.vy,SS.vx),tx=SS.x-Math.cos(an)*140,ty=SS.y-Math.sin(an)*140,g=cx.createLinearGradient(SS.x,SS.y,tx,ty);g.addColorStop(0,`rgba(255,255,255,${1-k})`);g.addColorStop(1,"rgba(255,255,255,0)");cx.strokeStyle=g;cx.lineWidth=1.8;cx.beginPath();cx.moveTo(SS.x,SS.y);cx.lineTo(tx,ty);cx.stroke()}}}}
let rzT;addEventListener("resize",()=>{clearTimeout(rzT);rzT=setTimeout(fxSize,150)});
/* about */
let lastFocus;function openAbout(){lastFocus=document.activeElement;const m=$("aboutModal");m.classList.add("open");m.setAttribute("aria-hidden","false");setTimeout(()=>m.querySelector(".modal-x").focus(),50)}
function closeAbout(){const m=$("aboutModal");m.classList.remove("open");m.setAttribute("aria-hidden","true");lastFocus&&lastFocus.focus&&lastFocus.focus()}
$("aboutModal").addEventListener("click",e=>{if(e.target.id==="aboutModal")closeAbout()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAbout();closeThemes()}});
/* login */
let mode="login",fails=0,lockUntil=0;
function setMode(m){mode=m;$("authCard").dataset.mode=m;$("tabLogin").setAttribute("aria-selected",m==="login");$("tabSignup").setAttribute("aria-selected",m==="signup");$("authBtn").textContent=m==="login"?"Log in":"Create account";$("aPw").autocomplete=m==="login"?"current-password":"new-password";$("authErr").textContent=""}
async function hashPw(pw,salt){const d=new TextEncoder().encode(salt+":"+pw);if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest("SHA-256",d);return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}return btoa(salt+":"+pw)}
function authErr(m){$("authErr").textContent=m;const c=$("authCard");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake")}
$("authForm").addEventListener("submit",async e=>{
 e.preventDefault();const id=$("aId").value.trim().toUpperCase(),pw=$("aPw").value,name=$("aName").value.trim(),users=rd("sc_users",{});
 if(Date.now()<lockUntil)return authErr("Too many attempts. Try again in "+Math.ceil((lockUntil-Date.now())/1e3)+"s.");
 if(!/^[A-Z0-9-]{4,20}$/.test(id))return authErr("Enrollment ID should be 4 to 20 letters or numbers.");
 if(pw.length<6)return authErr("Password must be at least 6 characters.");
 let u;
 if(mode==="signup"){
  if(name.length<2)return authErr("Enter your full name.");if(pw!==$("aPw2").value)return authErr("Passwords don't match.");
  if(users[id])return authErr("This Enrollment ID already has an account. Log in instead.");
  const salt=Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,"0")).join("");
  u=users[id]={id,name,salt,hash:await hashPw(pw,salt)};wr("sc_users",users)}
 else{u=users[id];if(!u)return authErr("No account for this Enrollment ID. Create one first.");
  if(await hashPw(pw,u.salt)!==u.hash){if(++fails>=5){fails=0;lockUntil=Date.now()+3e4;return authErr("Too many attempts. Locked for 30 seconds.")}return authErr("Incorrect password.")}}
 fails=0;(($("aRemember").checked)?localStorage:sessionStorage).setItem("sc_session",u.id);enterApp(u,true)});
function enterApp(u,anim){
 user={id:u.id,name:u.name};cart=rd("sc_cart_"+u.id,{});favs=rd("sc_favs_"+u.id,[]);
 Object.keys(cart).forEach(k=>{const p=products.find(x=>x.id==k);if(!p)delete cart[k];else if(cart[k]>p.stock)cart[k]=p.stock});
 currentOrder=orders.find(o=>o.enroll===u.id)||null;
 $("userPill").innerHTML=`🎓 ${esc(u.name)} <span class="pid sub">· ${esc(u.id)}</span>`;$("name").value=u.name;
 $("authForm").reset();setMode("login");jump("menu");renderAll();
 const done=()=>{document.body.classList.remove("locked");$("auth").classList.remove("leaving");$("appRoot").animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:500,easing:"ease-out"})};
 if(anim&&!rm.matches){$("auth").classList.add("leaving");setTimeout(done,380)}else done()}
function logout(){localStorage.removeItem("sc_session");sessionStorage.removeItem("sc_session");user=null;cart={};favs=[];currentOrder=null;flying=0;closeThemes();document.body.classList.add("locked");jump("menu");renderAll()}
function renderAll(){renderFilters();renderMenu();renderCart();renderTracking();renderDashboard();renderFavs()}

/* order details + UPI */
let payOk=false;
const openM=id=>{const m=$(id);m.classList.add("open");m.setAttribute("aria-hidden","false")},closeM=id=>{const m=$(id);m.classList.remove("open");m.setAttribute("aria-hidden","true")};
["orderModal","payModal"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target.id===id)closeM(id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeM("orderModal");closeM("payModal")}});
function openOrder(num){
 const o=orders.find(x=>x.number===num);if(!o)return;
 $("orderBody").innerHTML=`<h2 style="margin:0 0 6px">Order ${esc(o.number)}</h2><span class="status-pill">${esc(o.status)}</span>
 <div class="info-box" style="margin:16px 0"><div class="ord-row"><span>Student</span><b>${esc(o.name)}</b></div><div class="ord-row"><span>Class</span><b>${esc(o.className)}</b></div><div class="ord-row"><span>Delivery</span><b>${esc(o.room)}, ${esc(o.floor)}</b></div><div class="ord-row"><span>Arrival</span><b>${esc(o.arrival)}</b></div>${o.eta?`<div class="ord-row"><span>Estimated time</span><b>${o.eta.lo}–${o.eta.hi} min</b></div>`:""}<div class="ord-row"><span>Payment</span><b>${esc(o.payment)}</b></div>${o.note?`<div class="ord-row"><span>Note</span><b>${esc(o.note)}</b></div>`:""}</div>
 <h3 style="margin:0 0 6px">Items</h3>${o.items.map(x=>`<div class="ord-row"><span style="color:inherit">${esc(x.name)} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("")}
 <div class="total" style="margin-top:12px;display:flex;justify-content:space-between"><span>Total</span><span>${money(o.total)}</span></div>`;
 openM("orderModal")}
const UPI_ID="matlubansari58-1@okhdfcbank",UPI_NAME="Farhan Ansari";
let payAmt=0,payTxn="",payRef="";
function upiLink(){return"upi://pay?pa="+UPI_ID+"&pn="+encodeURIComponent(UPI_NAME)+"&am="+payAmt.toFixed(2)+"&cu=INR&tn="+encodeURIComponent("Canteen "+payRef)}
function drawQR(){
 const u=upiLink(),q=qrcode(0,"M");q.addData(u);q.make();const n=q.getModuleCount();let d="";
 for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c} ${r}h1v1h-1z`;
 $("qrBox").innerHTML=`<svg viewBox="-3 -3 ${n+6} ${n+6}" shape-rendering="crispEdges" role="img" aria-label="UPI QR code for ${money(payAmt)}"><path d="${d}" fill="#111"/></svg>`;$("payOpen").href=u}
function setPayMsg(t,ok){const e=$("payErr");e.textContent=t;e.className="auth-err"+(ok?" pay-ok":"")}
function openPay(){
 payAmt=subtotal();payRef="SC"+Math.floor(1e5+Math.random()*9e5);payTxn="";
 $("payAmt").textContent=money(payAmt);$("payTo").textContent=UPI_NAME;$("payIn").value="";setPayMsg("");$("payBtn").disabled=false;drawQR();openM("payModal");setTimeout(()=>$("payIn").focus(),80)}
function finishPay(){if(payOk)return;setPayMsg("✓ Transaction ID received",true);$("payBtn").disabled=true;payOk=true;setTimeout(()=>{closeM("payModal");placeOrder({preventDefault(){}})},300)}
function confirmPay(){
 const v=$("payIn").value.replace(/\s/g,"");
 if(!/^\d{12}$/.test(v)){setPayMsg("Enter the 12-digit UPI transaction ID shown in your payment app.");return}
 payTxn=v;finishPay()}
$("payIn").addEventListener("keydown",e=>{if(e.key==="Enter")confirmPay()});
fxSize();applyTheme(localStorage.getItem("sc_theme")??"theme-spidey");renderAll();
(()=>{const H=$("tpH"),M=$("tpM"),P=$("tpP");
 H.innerHTML=Array.from({length:12},(_,i)=>`<option>${i+1}</option>`).join("");M.innerHTML=Array.from({length:60},(_,i)=>`<option>${String(i).padStart(2,"0")}</option>`).join("");
 const sync=()=>$("arrival").value=`${H.value}:${M.value} ${P.value}`;
 const auto=()=>{const d=new Date(),n=d.getHours()*60+d.getMinutes(),base=(H.value%12)*60+ +M.value,dist=x=>(x-n+1440)%1440;P.value=dist(base)<=dist(base+720)?"AM":"PM";sync()};
 H.onchange=M.onchange=auto;P.onchange=sync;
 const t=new Date(Date.now()+15*6e4),h=t.getHours();P.value=h>=12?"PM":"AM";H.value=h%12||12;M.value=String(t.getMinutes()).padStart(2,"0");sync()})();
const sid=localStorage.getItem("sc_session")||sessionStorage.getItem("sc_session"),us=rd("sc_users",{});if(sid&&us[sid])enterApp(us[sid],false);
["floor","tpH","tpM","tpP"].forEach(id=>$(id).addEventListener("change",renderEta));
setInterval(()=>{const e=$("etaLive");if(e&&currentOrder)e.textContent=etaLiveText(currentOrder)},15000);
