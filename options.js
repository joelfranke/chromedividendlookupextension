// Saves options to chrome.storage.sync.
function save_options() {
 
 //var attributes = document.getElementById('attributes').value;
  var portfolio = document.getElementById('portfolio').value;
  
  //scrub the portfolio variable of all numbers and punctuation, except comma (,)
  portfolio = portfolio.replace(/[^A-Za-z,]/g,'');
  console.log(portfolio)
  chrome.storage.sync.set({
	portfolio: portfolio
  }, function() {
    
	// Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// stored in chrome.storage.
function restored_options() {
  chrome.storage.sync.get({
	portfolio: null
  }, function(items) {
	document.getElementById('portfolio').value = items.portfolio;
  });
}
document.addEventListener('DOMContentLoaded', restored_options);
document.getElementById('save').addEventListener('click',
    save_options);