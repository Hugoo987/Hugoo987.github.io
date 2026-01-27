function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value.trim();
  const result = document.getElementById("result");

  if (!longUrl) {
    result.innerHTML = "❗請輸入網址";
    return;
  }

  // GitHub Pages 導購中繼頁
  const redirectBase =
    "https://shopee.tw/";

  const redirectUrl = redirectBase + encodeURIComponent(longUrl);

  result.innerHTML = `
    <p>導購短網址：</p>
    <a href="${redirectUrl}" target="_blank">${redirectUrl}</a>
    <br/><br/>
    <button onclick="copyToClipboard('${redirectUrl}')">📋 複製</button>
  `;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("已複製到剪貼簿");
}
