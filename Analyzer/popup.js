document.getElementById('analyze').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: analyzeProducts
    });
  });
});

function analyzeProducts() {
  const elements = document.querySelectorAll('.ProductAttribute__ProductAttributes-sc-dyoysr-2.hsIFeK');
  const productTexts = Array.from(elements).map(element => element.innerText);
  console.log(productTexts); // Log all collected texts
  console.log("Analysis initiated...");
}