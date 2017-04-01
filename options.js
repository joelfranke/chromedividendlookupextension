// Saves options to chrome.storage.sync.
function save_options() {
	var portfolio = document.getElementById('portfolio').value;
  
	//scrub the portfolio variable of all numbers and punctuation, except comma (,)
	portfolio = portfolio.replace(/[^A-Za-z,]/g,'');
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

function list_selection () {
	var attribute1 = document.getElementById('attribute1').value;
	var attribute2 = document.getElementById('attribute2').value;
	var attribute3 = document.getElementById('attribute3').value;
	
	chrome.storage.sync.set({
	attribute1: attribute1,
	attribute2: attribute2,
	attribute3: attribute3
	}, function() {
    
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options updated.';
		setTimeout(function() {
		status.textContent = '';
		}, 1000);
	});
   //}	
}

// restore the values stored in chrome.storage.
function restored_options() {
  chrome.storage.sync.get({
	portfolio: null,
	attribute1: null,
	attribute2: null,
	attribute3: null
  }, function(items) {
	document.getElementById('portfolio').value = items.portfolio;
	document.getElementById('attribute1').value = items.attribute1;
	document.getElementById('attribute2').value = items.attribute2;
	document.getElementById('attribute3').value = items.attribute3;
  });
}


document.addEventListener('DOMContentLoaded', restored_options);

document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('attribute1').addEventListener('change',
    list_selection);

document.getElementById('attribute2').addEventListener('change',
    list_selection);

document.getElementById('attribute3').addEventListener('change',
    list_selection);
