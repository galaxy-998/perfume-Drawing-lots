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

// Supabase 專案網址與公開金鑰（publishable key 可放前端，資料安全由資料庫的 RLS 規則把關）
const SUPABASE_URL = "https://oshjiunmpqbnhrdukpqe.supabase.co";
const SUPABASE_KEY = "sb_publishable_874bPAok-Zq_Xswyp03tyw_mf5O4k2p";

form.addEventListener("submit", async function (event) {
  // 阻止表單預設的換頁動作
  event.preventDefault();
  message.textContent = "送出中...";

  try {
    // 用 fetch 呼叫 Supabase，把一筆訂閱資料新增到 subscribers 資料表
    const response = await fetch(SUPABASE_URL + "/rest/v1/subscribers", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        scent: scentInput.value
      })
    });

    if (response.ok) {
      message.textContent = "訂閱成功，感謝你的支持";
      form.reset();
    } else if (response.status === 409) {
      // 409 代表 Email 重複（資料表限制 email 不可重複）
      message.textContent = "這個 Email 已經訂閱過囉";
    } else {
      message.textContent = "訂閱失敗，請稍後再試";
    }
  } catch (error) {
    message.textContent = "網路連線失敗，請稍後再試";
  }
});
