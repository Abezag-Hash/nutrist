chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeNutrition",
    title: "Analyze Nutrition Info",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeNutrition") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: analyzeProductDetailsText
    }, async (results) => {
      const productDetailsText = results[0]?.result;

      if (productDetailsText) {
        try {
          const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: productDetailsText })
          });
          
          if (!response.ok) {
            console.log("hatta")
            throw new Error('Network response was not ok');
            
          }

          const data = await response.json();
          console.log(data.message);
          showPopup(tab.id, data.text);
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to analyze product details. Please try again.');
        }
      } else {
        console.log('No product details found.');
        alert('No product details were detected on the page.');
      }
    });
  }
});

// Function to analyze product details and return the text
function analyzeProductDetailsText() {
  const element = document.querySelector('.ProductDetails__ProductDetailsContainer-sc-z5f4ag-0.fRMVCN');
  return element ? element.innerText : null;
}

// Function to show the popup with the AI response
function showPopup(tabId, text) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: displayPopup,
    args: [text]
  });
}

// Function to create the popup on the webpage
function displayPopup(text) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '10px';
  popup.style.right = '10px';
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid black';
  popup.style.padding = '10px';
  popup.style.zIndex = 10000;
  popup.innerHTML = `
    <h3>Nutritional Analysis</h3>
    <p>${text}</p>
    <button id="closePopup">Close Analysis</button>
  `;
  document.body.appendChild(popup);

  document.getElementById('closePopup').addEventListener('click', () => {
    document.body.removeChild(popup);
  });
}