// 香水名單（每支被抽中的機率相同）
const perfumes = [
  "白瓷香檀",
  "星萃",
  "星兆",
  "滿月之下",
  "橘青和弦",
  "古木賢者",
  "古木聖焚",
  "闇夜獨步"
];

const stage = document.querySelector(".stage");
const result = document.getElementById("result");
const drawBtn = document.getElementById("drawBtn");

drawBtn.addEventListener("click", function () {
  // 動畫進行中先鎖住按鈕，避免連點
  drawBtn.disabled = true;

  // 1. 先把上一次的開箱狀態收回去（盒蓋蓋上、卡片收起）
  stage.classList.remove("opened");

  // 2. 等 0.9 秒收完後，才換新名字並開始搖晃，避免舊卡片閃出新名字
  setTimeout(function () {
    // 隨機抽一支：Math.random() 產生 0~1，乘上數量後無條件捨去
    const index = Math.floor(Math.random() * perfumes.length);
    result.textContent = perfumes[index];
    stage.classList.add("shaking");
  }, 900);

  // 3. 搖晃 0.7 秒後開箱（盒蓋先開，卡片再升起，CSS 已設定好延遲）
  setTimeout(function () {
    stage.classList.remove("shaking");
    stage.classList.add("opened");
  }, 1600);

  // 4. 整段動畫結束後，按鈕改成「再抽一次」
  setTimeout(function () {
    drawBtn.disabled = false;
    drawBtn.textContent = "再抽一次";
  }, 3900);
});

// ===== 訂閱表單 =====
const form = document.getElementById("subscribeForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const scentInput = document.getElementById("scent");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
  // 阻止表單預設的換頁動作
  event.preventDefault();

  // 把訂閱者存在這台瀏覽器裡（沒有後端，所以只存本機）
  const list = JSON.parse(localStorage.getItem("subscribers") || "[]");
  const email = emailInput.value.trim();

  if (list.some(function (item) { return item.email === email; })) {
    message.textContent = "這個 Email 已經訂閱過囉";
  } else {
    // 每位訂閱者存成一筆：姓名、Email、感興趣的香調
    list.push({ name: nameInput.value.trim(), email: email, scent: scentInput.value });
    localStorage.setItem("subscribers", JSON.stringify(list));
    message.textContent = "訂閱成功，感謝你的支持";
  }
  form.reset();
});
