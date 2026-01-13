/* script.js - 2026 最終完整版 (含商品頁數量選擇 + 專業頁尾支援 + 手機版型修正) */

/* =========================
   1. 基礎工具
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const money = (n) => `NT$ ${Number(n || 0).toLocaleString("zh-Hant-TW")}`;
const clampText = (s = "", max = 50) => (s.length > max ? s.slice(0, max) + "…" : s);

function getQS(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

/* =========================
   2. 商品資料庫
========================= */
const PRODUCTS = [
  { id: "p001", name: "超強去污洗車精", cat: "洗車清潔", price: 680, badge: "熱銷冠軍", img: "assets/img/products/p001.jpg", icon: "fa-solid fa-bottle-droplet", desc: "中性配方、泡沫綿密、溫和不傷鍍膜。", spec: { 容量: "1000ml", 適用: "全車", 特色: "高潤滑" }, how: ["稀釋比例 1:200", "全車潑濕後噴灑泡沫", "使用海綿由上而下刷洗"] },
  { id: "p002", name: "奈米鍍光棕櫚蠟", cat: "外觀保養", price: 1280, badge: "亮度升級", img: "assets/img/products/p002.jpg", icon: "fa-solid fa-gem", desc: "提升車漆光澤與潑水性，手感滑順、好整理。" },
  { id: "p003", name: "專業洗車海綿", cat: "洗車工具", price: 320, badge: "不易刮傷", img: "assets/img/products/p003.jpg", icon: "fa-solid fa-soap", desc: "高密度泡棉，抓污力佳、手感好、降低細紋風險。" },
  { id: "p004", name: "輪框深層清潔劑", cat: "洗車清潔", price: 450, badge: "深層去汙", img: "assets/img/products/p004.jpg", icon: "fa-solid fa-circle-notch", desc: "有效分解輪框煞車粉與油汙，清潔更省力。" },
  { id: "p005", name: "速效玻璃鍍膜劑", cat: "外觀保養", price: 880, badge: "雨季必備", img: "assets/img/products/p005.jpg", icon: "fa-solid fa-cloud-rain", desc: "時速 60km 水珠自動飛走，視線清晰。" },
  { id: "p006", name: "超細纖維擦拭巾", cat: "洗車工具", price: 250, badge: "收尾必備", img: "assets/img/products/p006.jpg", icon: "fa-solid fa-rug", desc: "高吸水、低摩擦，適合擦乾與拋亮收尾。" },
  { id: "p007", name: "羊毛洗車手套", cat: "洗車工具", price: 450, badge: "工具類", img: "assets/img/products/p007.jpg", icon: "fa-solid fa-hand-sparkles", desc: "澳洲進口羊毛，大幅降低洗車刮傷風險。", spec: { 材質: "天然羊毛", 適用: "車身" } },
  { id: "p008", name: "塑料還原劑", cat: "外觀保養", price: 520, badge: "質感升級", img: "assets/img/products/p008.jpg", icon: "fa-solid fa-wand-magic-sparkles", desc: "恢復塑料與飾條黑亮感，形成保護層，降低泛白。" },
  { id: "p009", name: "柏油去除劑", cat: "洗車清潔", price: 580, badge: "去汙必備", img: "assets/img/products/p009.jpg", icon: "fa-solid fa-spray-can", desc: "快速溶解柏油、油污與黏著汙點。" },
  { id: "p010", name: "專業用輪胎刷", cat: "洗車工具", price: 260, badge: "輪胎專用", img: "assets/img/products/p010.jpg", icon: "fa-solid fa-brush", desc: "高密度刷毛深入胎紋，搭配清潔劑快速帶走髒污。" },
  { id: "p011", name: "電動泡沫壺", cat: "洗車工具", price: 890, badge: "效率提升", img: "assets/img/products/p011.jpg", icon: "fa-solid fa-shower", desc: "一鍵打泡，泡沫綿密覆蓋車身，提高潤滑降低刮傷風險。" },
  { id: "p012", name: "輪胎光澤劑", cat: "外觀保養", price: 420, badge: "高亮防護", img: "assets/img/products/p012.jpg", icon: "fa-solid fa-sun", desc: "恢復輪胎黑亮質感，形成保護層，降低褪色與乾裂。" }
];

const BUNDLES = [
  { id: "b001", name: "新手三件套", cat: "組合包", price: 1150, badge: "新手首選", img: "assets/img/products/b001.jpg", desc: "洗車精 + 海綿 + 大毛巾，一次備齊。", includes: ["p001", "p003", "p006"] },
  { id: "b002", name: "亮澤封膜套", cat: "組合包", price: 1380, badge: "極致亮度", img: "assets/img/products/b003.jpg", desc: "棕櫚蠟 + 大毛巾，追求極致亮度。", includes: ["p002", "p006"] },
  { id: "b003", name: "玻璃雨天安全套", cat: "組合包", price: 1040, badge: "雨季對策", img: "assets/img/products/b003.jpg", desc: "玻璃鍍膜 + 大毛巾，解決視線模糊。", includes: ["p005", "p006"] },
  { id: "b004", name: "輪框深層套", cat: "組合包", price: 625, badge: "細節清潔", img: "assets/img/products/b002.jpg", desc: "清潔劑 + 輪胎刷，專攻煞車粉。", includes: ["p004", "p010"] },
  { id: "b005", name: "柏油蟲屍救援套", cat: "組合包", price: 1150, badge: "去汙救星", img: "assets/img/products/b004.jpg", desc: "柏油去除劑 + 羊毛手套 + 毛巾。", includes: ["p009", "p007", "p006"] },
  { id: "b006", name: "外觀復活套", cat: "組合包", price: 710, badge: "老車翻新", img: "assets/img/products/b004.jpg", desc: "塑料還原劑 + 毛巾，搶救白化。", includes: ["p008", "p006"] },
  { id: "b007", name: "泡沫洗車套", cat: "組合包", price: 1820, badge: "效率洗車", img: "assets/img/products/b005.jpg", desc: "電動泡沫壺 + 洗車精 + 羊毛手套。", includes: ["p011", "p001", "p007"] },
  { id: "b008", name: "輪胎黑亮套", cat: "組合包", price: 625, badge: "輪胎護理", img: "assets/img/products/b006.jpg", desc: "光澤劑 + 輪胎刷，讓輪胎黑得發亮。", includes: ["p012", "p010"] }
];

const CATALOG = [...PRODUCTS, ...BUNDLES];

/* =========================
   3. 資料存取 (LocalStorage)
========================= */
const LS_CART = "csp_cart";
const LS_ORDERS = "csp_orders";
const LS_USER = "csp_user";

function getCart() { try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); } catch { return []; } }
function saveCart(cart) { localStorage.setItem(LS_CART, JSON.stringify(cart)); updateCartUI(); }
function getOrders() { try { return JSON.parse(localStorage.getItem(LS_ORDERS) || "[]"); } catch { return []; } }
function saveOrders(orders) { localStorage.setItem(LS_ORDERS, JSON.stringify(orders)); }
function findItem(id) { return CATALOG.find(x => x.id === id); }

/* =========================
   4. 全域功能
========================= */
// 商品篩選
window.filterProducts = function(cat, btn) {
  if(btn) { 
    $$("#catChips .btn").forEach(b => b.className = "btn ghost"); 
    btn.className = "btn primary"; 
  }
  const grid = $("#productsGrid");
  const bundleGrid = $("#bundlesGrid");
  const q = $("#searchInput")?.value.toLowerCase() || "";
  const filterFn = (item) => (cat === "全部" || item.cat === cat) && (item.name + item.desc).toLowerCase().includes(q);
  if (grid) grid.innerHTML = PRODUCTS.filter(filterFn).map(createCard).join("");
  if (bundleGrid) bundleGrid.innerHTML = BUNDLES.filter(filterFn).map(createCard).join("");
};

// 會員相關
window.checkLoginStatus = function() {
  const user = localStorage.getItem(LS_USER);
  const loginBtn = $("#openLogin");
  const logoutBtn = $("#logoutBtn");
  const nameDisplay = $("#memberNameDisplay");
  const settingInput = $("#settingNameInput");
  if (user) {
    if(loginBtn) loginBtn.style.display = "none";
    if(logoutBtn) logoutBtn.style.display = "block";
    if(nameDisplay) nameDisplay.textContent = user;
    if(settingInput) settingInput.value = user;
  } else {
    if(loginBtn) loginBtn.style.display = "block";
    if(logoutBtn) logoutBtn.style.display = "none";
    if(nameDisplay) nameDisplay.textContent = "訪客";
  }
};
window.toggleLogin = (show) => { const m = $("#loginModal"); if(m) m.style.display = show?"grid":"none"; };
window.handleLogin = (e) => { e.preventDefault(); const n = new FormData(e.target).get("email")||"User"; localStorage.setItem(LS_USER, n); toggleLogin(false); checkLoginStatus(); toast(`歡迎回來，${n}！`); setTimeout(()=>window.location.reload(), 800); };
window.handleLogout = () => { localStorage.removeItem(LS_USER); checkLoginStatus(); toast("已登出"); setTimeout(()=>window.location.reload(), 800); };
window.switchTab = (t) => {
  if(!localStorage.getItem(LS_USER)) { toast("請先登入"); toggleLogin(true); return; }
  $("#view-orders").style.display = "none"; $("#view-settings").style.display = "none";
  $("#tab-orders-btn").style.cssText = "background:transparent;color:var(--muted);"; 
  $("#tab-settings-btn").style.cssText = "background:transparent;color:var(--muted);";
  if(t==='orders') { $("#view-orders").style.display="block"; $("#tab-orders-btn").style.cssText = "background:#eff6ff;color:var(--primary);"; }
  else { $("#view-settings").style.display="block"; $("#tab-settings-btn").style.cssText = "background:#eff6ff;color:var(--primary);"; }
};
window.handleSaveSettings = (e) => { e.preventDefault(); const n = $("#settingNameInput").value.trim(); if(n){ localStorage.setItem(LS_USER, n); checkLoginStatus(); toast("設定已更新"); } };

// 購物車操作
window.addToCart = (id, qty = 1) => {
  const item = findItem(id); if(!item) return;
  let cart = getCart(); const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty += qty; else cart.push({id, qty});
  saveCart(cart); openCartSidebar(); toast(`已加入：${item.name} x${qty}`);
};

// 組合包加入 (支援數量)
window.addBundleToCart = (bid, qty = 1) => {
  const b = findItem(bid); if(!b) return;
  if(b.includes) {
    let cart = getCart();
    b.includes.forEach(pid => { 
        const ex = cart.find(i=>i.id===pid); 
        if(ex) ex.qty += qty; 
        else cart.push({id:pid, qty: qty}); 
    });
    saveCart(cart); openCartSidebar(); toast(`已加入組合：${b.name} x${qty}`);
  } else window.addToCart(bid, qty);
};

// 從卡片加入
window.addToCartFromCard = (id) => {
    const el = document.getElementById(`qty-${id}`);
    const qty = el ? parseInt(el.value) : 1;
    if (id.startsWith('b')) {
        addBundleToCart(id, qty);
    } else {
        addToCart(id, qty);
    }
};

// 卡片數量增減
window.updateCardQty = (id, delta) => {
    const el = document.getElementById(`qty-${id}`);
    if(el) {
        let val = parseInt(el.value) || 1;
        val += delta;
        if(val < 1) val = 1;
        el.value = val;
    }
};

window.changeQty = (id, d) => { let c = getCart(); const i = c.find(x=>x.id===id); if(i){ i.qty+=d; if(i.qty<=0) c=c.filter(x=>x.id!==id); saveCart(c); } };
window.setQty = (id, q) => { let c = getCart(); if(q<=0) c=c.filter(x=>x.id!==id); else {const i=c.find(x=>x.id===id); if(i)i.qty=q;} saveCart(c); };
window.openCartSidebar = () => { $("#cartOverlay")?.classList.add("active"); $("#cartSidebar")?.classList.add("active"); };
window.closeCartSidebar = () => { $("#cartOverlay")?.classList.remove("active"); $("#cartSidebar")?.classList.remove("active"); };

// UI Helpers
function createCard(item) {
  const btnAction = `addToCartFromCard('${item.id}')`;
  const badgeHTML = item.badge ? `<div class="pill">${item.badge}</div>` : `<div class="pill">${item.cat}</div>`;
  const imgHtml = `<img src="${item.img}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`;
  
  return `
    <article class="card">
      <div class="thumb">
        ${imgHtml}
        <i class="${item.icon || 'fa-solid fa-box'}" style="display:none; font-size:60px; color:#cbd5e1;"></i>
      </div>
      <div class="body">
        <div style="margin-bottom:10px;">${badgeHTML}</div>
        <div class="title">${item.name}</div>
        <div class="desc">${clampText(item.desc, 40)}</div>
        <div class="price">${money(item.price)}</div>

        <div class="card-qty-row">
           <div class="qty-selector">
             <button onclick="updateCardQty('${item.id}', -1)">-</button>
             <input type="number" id="qty-${item.id}" value="1" readonly>
             <button onclick="updateCardQty('${item.id}', 1)">+</button>
           </div>
        </div>

        <div class="actions">
          <a class="btn ghost full" href="product-detail.html?id=${item.id}">查看</a>
          <button class="btn primary full" onclick="${btnAction}">加入</button>
        </div>
      </div>
    </article>`;
}

function toast(msg) {
  let box = $("#toast-container"); 
  if(!box) { box=document.createElement("div"); box.id="toast-container"; box.style.cssText="position:fixed;bottom:20px;right:20px;z-index:9999;display:grid;gap:10px;"; document.body.appendChild(box); }
  const t = document.createElement("div"); t.textContent = msg;
  t.style.cssText = "background:rgba(15,23,42,0.9);color:white;padding:12px 24px;border-radius:99px;animation:fadeIn 0.3s;font-weight:700;";
  box.appendChild(t); setTimeout(()=>t.remove(), 2000);
}

function updateCartUI() {
  const cart = getCart(); let totalQty=0, totalPrice=0;
  const wrap = $("#cartItems");
  if(wrap) {
    wrap.innerHTML = cart.length ? "" : `<div style="text-align:center;padding:30px;color:#94a3b8;">購物車是空的</div>`;
    cart.forEach(ci => {
      const p = findItem(ci.id); if(!p) return;
      totalQty += ci.qty; totalPrice += p.price * ci.qty;
      wrap.innerHTML += `
        <div style="display:flex;gap:12px;margin-bottom:16px;align-items:center;">
          <div style="width:50px;height:50px;background:#f1f5f9;border-radius:8px;overflow:hidden;flex-shrink:0;">
             <img src="${p.img}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
          </div>
          <div style="flex:1;">
            <div style="font-weight:700;font-size:14px;">${p.name}</div>
            <div style="color:#2563eb;font-size:13px;font-weight:700;">${money(p.price)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button class="icon-btn" style="width:28px;height:28px;" onclick="changeQty('${ci.id}', -1)">-</button>
            <span style="font-size:13px;font-weight:600;min-width:20px;text-align:center;">${ci.qty}</span>
            <button class="icon-btn" style="width:28px;height:28px;" onclick="changeQty('${ci.id}', 1)">+</button>
          </div>
        </div>`;
    });
  } else { cart.forEach(ci => { const p = findItem(ci.id); if(p) { totalQty+=ci.qty; totalPrice+=p.price*ci.qty; } }); }

  const badge = $("#cartBadge"); if(badge) { badge.textContent=totalQty; badge.style.display=totalQty>0?"grid":"none"; }
  const shipping = totalPrice >= 1500 ? 0 : (totalPrice===0?0:60);
  if($("#cartSubtotal")) $("#cartSubtotal").textContent = money(totalPrice);
  if($("#cartShipping")) $("#cartShipping").textContent = shipping===0?"免運費":money(shipping);
  if($("#cartTotal")) $("#cartTotal").textContent = money(totalPrice+shipping);
  renderCartPage(cart); renderCheckoutSummary(cart);
}

function renderCartPage(cart) {
  const box = $("#cartPageList"); if(!box) return;
  box.innerHTML = cart.length ? "" : `<div style="text-align:center;padding:50px;color:#94a3b8;">購物車空空如也</div>`;
  let total=0;
  cart.forEach(ci => {
    const p = findItem(ci.id); if(!p) return;
    total += p.price * ci.qty;
    box.innerHTML += `
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap;">
        <img src="${p.img}" style="width:80px;height:80px;object-fit:cover;border-radius:12px;background:#f8fafc;" onerror="this.style.display='none'">
        <div style="flex:1;">
          <div style="font-weight:700;">${p.name}</div>
          <div style="color:#64748b;font-size:13px;">${p.cat||""}</div>
        </div>
        <div style="font-weight:700;color:#2563eb;">${money(p.price)}</div>
        <div style="display:flex;align-items:center;gap:8px;">
           <button class="btn ghost" style="padding:4px 10px;" onclick="changeQty('${ci.id}', -1)">-</button>
           <span style="font-weight:600;width:24px;text-align:center;">${ci.qty}</span>
           <button class="btn ghost" style="padding:4px 10px;" onclick="changeQty('${ci.id}', 1)">+</button>
           <button class="btn ghost" style="padding:4px 10px;color:#ef4444;" onclick="setQty('${ci.id}', 0)">×</button>
        </div>
      </div>`;
  });
  const shipping = total >= 1500 ? 0 : (total===0?0:60);
  if($("#cartPageTotal")) $("#cartPageTotal").textContent = money(total+shipping);
}

// [修正] 結帳頁面下單區：防止手機版文字重疊 (Flexbox 優化)
function renderCheckoutSummary(cart) {
  const box = $("#checkoutSummary"); if(!box) return;
  let total=0, html="";
  cart.forEach(ci => {
    const p = findItem(ci.id); if(!p) return;
    total += p.price * ci.qty;
    // 使用 min-width:0 與 flex-wrap 確保文字不會撐破版面
    html += `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; font-size:14px; gap:12px; border-bottom:1px dashed #f1f5f9; padding-bottom:8px;">
        <div style="flex:1; min-width:0;">
            <div style="line-height:1.4; color:var(--text); word-break:break-word;">${p.name}</div>
            <div style="font-size:12px; color:var(--muted);">數量: ${ci.qty}</div>
        </div>
        <div style="font-weight:700; white-space:nowrap; text-align:right;">
            <div>${money(p.price*ci.qty)}</div>
        </div>
      </div>`;
  });
  const shipping = total>=1500 ? 0 : (total===0?0:60);
  html += `
    <div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span>小計</span><span>${money(total)}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span>運費</span><span>${shipping===0?"免運費":money(shipping)}</span></div>
    <div class="hr"></div>
    <div style="display:flex;justify-content:space-between;font-weight:800;font-size:18px;color:#2563eb;"><span>總計</span><span>${money(total+shipping)}</span></div>`;
  box.innerHTML = html;
}

/* =========================
   6. 頁面初始化
========================= */
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  checkLoginStatus();

  $("#openCartBtn")?.addEventListener("click", window.openCartSidebar);
  $("#closeCartBtn")?.addEventListener("click", window.closeCartSidebar);
  $("#cartOverlay")?.addEventListener("click", window.closeCartSidebar);
  $("#menuBtn")?.addEventListener("click", () => $("#mobileMenu")?.classList.toggle("show"));

  // 導覽列高亮
  const path = window.location.pathname.split("/").pop() || "index.html";
  $$(".navlinks a, .mobile-menu a").forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'product-detail.html' && href === 'products.html')) link.classList.add('active');
  });

  // 首頁渲染
  const homeGrid = $("#homeFeatured");
  if (homeGrid) {
    const featured = ["p001", "p005", "p007"].map(findItem).filter(Boolean);
    homeGrid.innerHTML = featured.map(createCard).join("");
  }

  // 商品頁渲染
  const chips = $("#catChips");
  if (chips) {
    const cats = ["全部", ...new Set([...PRODUCTS, ...BUNDLES].map(p => p.cat))];
    chips.innerHTML = cats.map(c => `<button class="btn ${c==='全部'?'primary':'ghost'}" onclick="filterProducts('${c}', this)">${c}</button>`).join(" ");
    window.filterProducts("全部");
    $("#searchInput")?.addEventListener("input", () => window.filterProducts($(".btn.primary", chips).innerText));
  }

  // 詳情頁渲染
  const detailHost = $("#detailHost");
  if (detailHost) {
    const id = getQS("id");
    const p = findItem(id);
    if (!p) { detailHost.innerHTML = `<div style="text-align:center;padding:50px;">請先選擇商品</div>`; } 
    else {
      const badgeHTML = p.badge ? `<span class="pill" style="background:var(--primary); color:#fff;">${p.badge}</span>` : `<span class="pill">${p.cat}</span>`;
      
      let specHTML = '';
      if(p.spec) {
        specHTML = Object.entries(p.spec).map(([k,v]) => 
          `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #e2e8f0; font-size:14px;">
             <span style="color:var(--muted);">${k}</span>
             <span style="font-weight:600; color:var(--text);">${v}</span>
           </div>`
        ).join('');
      }

      const featuresHTML = `
        <div style="margin-top:30px; display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div style="background:#f8fafc; padding:16px; border-radius:12px; text-align:center;">
            <i class="fa-solid fa-truck-fast" style="color:var(--primary); font-size:24px; margin-bottom:8px;"></i>
            <div style="font-size:13px; font-weight:700;">快速出貨</div>
          </div>
          <div style="background:#f8fafc; padding:16px; border-radius:12px; text-align:center;">
            <i class="fa-solid fa-shield-halved" style="color:var(--primary); font-size:24px; margin-bottom:8px;"></i>
            <div style="font-size:13px; font-weight:700;">品質保證</div>
          </div>
        </div>
      `;

      detailHost.innerHTML = `
        <div class="hero-grid" style="align-items:start; gap:50px;">
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:24px; padding:40px; display:flex; justify-content:center; align-items:center; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
             <img src="${p.img}" style="width:100%; max-width:400px; object-fit:contain;" onerror="this.style.display='none'">
             <i class="${p.icon||'fa-solid fa-box'}" style="display:none; font-size:100px; color:#cbd5e1;"></i>
          </div>
          <div>
            <div style="margin-bottom:16px;">${badgeHTML} <span style="font-size:13px; color:var(--muted); margin-left:8px;">${p.cat}</span></div>
            <h1 class="h2" style="font-size:32px; margin-bottom:16px;">${p.name}</h1>
            <div style="font-size:32px; font-weight:800; color:var(--primary); margin-bottom:20px;">${money(p.price)}</div>
            <p class="p" style="font-size:16px; line-height:1.8;">${p.desc}</p>
            <div style="margin:24px 0;">${specHTML}</div>

            <div style="display:flex; gap:16px; margin-top:30px;">
              <div style="display:flex; align-items:center; border:1px solid #e2e8f0; border-radius:12px; height:56px;">
                <button class="btn ghost" style="border:none; height:100%; padding:0 20px;" onclick="let n=$('#qtyInput'); if(n.value>1) n.value--;">-</button>
                <input id="qtyInput" type="number" value="1" style="width:50px; text-align:center; border:none; font-weight:700; font-size:18px;" readonly>
                <button class="btn ghost" style="border:none; height:100%; padding:0 20px;" onclick="let n=$('#qtyInput'); n.value++;">+</button>
              </div>
              <button class="btn primary full" style="height:56px; font-size:18px; border-radius:12px;" onclick="addToCart('${p.id}', parseInt($('#qtyInput').value))">
                <i class="fa-solid fa-cart-plus"></i> 加入購物車
              </button>
            </div>
            ${featuresHTML}
            ${p.includes ? `<div style="margin-top:30px; padding:20px; background:#eff6ff; border-radius:12px; border:1px solid #dbeafe;"><div style="font-weight:700; color:#1e40af; margin-bottom:8px;"><i class="fa-solid fa-gift"></i> 組合內容</div><div style="font-size:14px; color:#1e3a8a;">${p.includes.map(pid => findItem(pid)?.name).join(" + ")}</div></div>` : ''}
          </div>
        </div>
      `;
    }
  }

  $("#checkoutForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) { alert("購物車是空的"); return; }
    const total = cart.reduce((acc, ci) => acc + (findItem(ci.id)?.price || 0) * ci.qty, 0);
    const order = { id: "ORD-" + Date.now().toString().slice(-6), date: new Date().toLocaleString("zh-Hant-TW"), status: "處理中", items: cart, total: total + (total>=1500?0:60) };
    const orders = getOrders(); orders.unshift(order); saveOrders(orders); saveCart([]); 
    alert("訂單已建立！"); window.location.href = "member.html";
  });

  // [修正] 會員中心近期訂單：手機版商品清單改為條列式，避免擠成一坨
  const ordersBox = $("#ordersBox");
  if (ordersBox) {
    const user = localStorage.getItem(LS_USER);
    if (!user) {
      ordersBox.innerHTML = `
        <div style="text-align:center; padding:60px 0; color:var(--muted);">
          <i class="fa-solid fa-lock" style="font-size:48px; opacity:0.3; margin-bottom:16px;"></i>
          <p class="h3">請先登入</p>
          <p>登入後即可查看您的歷史訂單紀錄。</p>
          <button class="btn primary" onclick="toggleLogin(true)" style="margin-top:16px;">立即登入</button>
        </div>`;
    } else {
      const orders = getOrders();
      if (orders.length === 0) {
        ordersBox.innerHTML = `
          <div style="text-align:center; padding:40px 0; color:var(--muted);">
            <i class="fa-solid fa-box-open" style="font-size:48px; opacity:0.3; margin-bottom:16px;"></i>
            <p>目前沒有訂單紀錄</p>
          </div>`;
      } else {
        ordersBox.innerHTML = "";
        orders.forEach(o => {
          // [優化] 商品清單 HTML 生成邏輯
          const itemsHtml = o.items.map(i => {
             const p = findItem(i.id);
             if(!p) return '';
             return `<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; font-size:14px; color:#475569; margin-bottom:6px; padding-bottom:6px; border-bottom:1px dashed #f1f5f9;">
                       <div style="flex:1; min-width:0;">
                           <div style="line-height:1.4; font-weight:500; word-break:break-word;">${p.name}</div>
                           <div style="font-size:12px; color:#94a3b8;">數量: ${i.qty}</div>
                       </div>
                       <div style="font-weight:600; white-space:nowrap; color:#334155;">${money(p.price * i.qty)}</div>
                     </div>`;
          }).join('');

          ordersBox.innerHTML += `
            <div class="panel pad" style="margin-bottom:16px;">
              <div class="row"><span style="font-weight:800;">#${o.id}</span><span class="pill">${o.status}</span></div>
              <div class="hr"></div>
              <div style="color:#64748b; font-size:14px; margin-bottom:12px;">${o.date}</div>
              
              <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:12px;">
                 ${itemsHtml}
              </div>

              <div style="text-align:right; font-weight:800; color:#2563eb;">總計 ${money(o.total)}</div>
            </div>`;
        });
      }
    }
  }

  injectFooterSafe();
});

async function injectFooterSafe() {
  const mount = document.getElementById("siteFooter");
  if (!mount) return;
  const footerUrl = "footer.html"; 
  try {
    const res = await fetch(footerUrl);
    if (!res.ok) throw new Error("Footer fetch failed");
    const html = await res.text();
    mount.innerHTML = html;
    const y = mount.querySelector("#cspFooterYear");
    if (y) y.textContent = new Date().getFullYear();
  } catch (e) { console.warn(e); }
}