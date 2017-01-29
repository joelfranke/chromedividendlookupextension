
// write the scraped page symbols string to storage.sync

    //chrome.browserAction.setBadgeText({"text":"ABCD","tabId":tabId});
	// This variable from chrome storage represents the stored watchlist
var storedPortfolio;
chrome.storage.sync.get('portfolio', function(localdata) {
    storedPortfolio = JSON.stringify(localdata.portfolio).toUpperCase();
    }
);

// This variable from chrome storage represents the symbols found on the page
var pageItems;
chrome.storage.sync.get('onpagesymbols', function(contentdata) {
    pageItems = JSON.stringify(contentdata.onpagesymbols).toUpperCase();
	var watchlistCheck = [];
	var storedArray = [];
	var badgeCount = [];

	if (pageItems =='""'){
		console.log('No page items to check against watchlist.');
		} else if (storedPortfolio == '""') {
		console.log('No watchlist saved.');
		} else {
			watchlistCheck = pageItems.replace(/['"]+/g, '').split(",");
			storedArray = storedPortfolio.replace(/['"]+/g, '').split(",");
				//Compare found items on page vs. watchlist
				$.each(watchlistCheck, function(index, founditems) {

					var foundItem = founditems;
					if (storedArray.indexOf(foundItem) >= 0){
					console.log('Watchlist item(s) found on the current tab.');
					badgeCount.push(foundItem);
					badgeCountLength = badgeCount.length.toString()
					//write number of items found into badgetext in real time for all tabs
					//http://stackoverflow.com/questions/32168449/how-can-i-get-different-badge-value-for-every-tab-on-chrome
					chrome.browserAction.setBadgeBackgroundColor({ color: [11, 61, 0, 142] });
					chrome.browserAction.setBadgeText({text: badgeCountLength});
					} else{
					console.log('No matches found against watchlist.');
					}

				}
				)
		}
	
	}
);



// This variable from chrome storage is to be used in the API request
var apiToken;
chrome.storage.sync.get('token', function(localdata) {
    apiToken = JSON.stringify(localdata.token);
    }
);

// This variable from chrome storage will be written into the first column of the table
var attribute1;
chrome.storage.sync.get('attribute1', function(localdata) {
    attribute1 = JSON.stringify(localdata.attribute1);
    }
);

// This variable from chrome storage will be written into the second column of the table
var attribute2;
chrome.storage.sync.get('attribute2', function(localdata) {
    attribute2 = JSON.stringify(localdata.attribute2);
    }
);

// This variable from chrome storage will be written into the third column of the table
var attribute3;
chrome.storage.sync.get('attribute3', function(localdata) {
    attribute3 = JSON.stringify(localdata.attribute3);
    }
);

var apiUrl;
var tableCreated;
var tableSymbolsArray = [];
var selectionType;
var nullMessage;


function getData() {

// Make API request:
if (selectionType == "watchlist"){
	apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" + storedPortfolio + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	nullMessage =" returns no result. Please update your saved portfolio to stop seeing this message.";
} else if (selectionType == "box"){
	var collectedSymbols = $("#symbol").val().toUpperCase();
	apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + collectedSymbols + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	nullMessage =" returns no result.";
} else {
	apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" + pageItems + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	nullMessage ="No results on this page.";
}

// Build HTML table
var tableStructure ="<thead><th>Stock Symbol</th><th>Company Name</th><th>Daily Performance</th><th>Dividend Pay Date</th><th>Dividend</th></thead><tbody></tbody>"

if (selectionType == "page" && pageItems =='""'){
		alert('No symbols found on this page.');
	} else {

// Post request
jQuery.getJSON(apiUrl, function(data) {
  // If only one symbol, make array
  var count = data.query.count;
  var results = data.query.results.quote;
  
  if (count == 1) {
  var results = [results]
  };
	
  var checkItems = 0;
  	
  // Iterate through results
  $.each(results, function(index, item) {

    var nameForLink = item.Name;
	var symbolForLink = JSON.stringify(item.Symbol);
    
	// Check for valid symbols and set checkItems, otherwise break loop
	if (nameForLink == null) {
        if (selectionType == "page") {
			alert('No symbols found on this page.');
			return true;
		}
			else {
			alert(symbolForLink + nullMessage);
			return true;}
      } else {
        checkItems = 1;
      }

	if (tableSymbolsArray.indexOf(symbolForLink) >= 0){
			alert(symbolForLink + ' already exists in the table.');
			return true;
		} else {tableSymbolsArray.push(symbolForLink);}
		
	if (tableCreated == null){
	$("#symbols").append($(tableStructure))
	tableCreated = "yes";
		
  }
	
	// Define variables
    var quarterlyDividend = "$" + item.DividendShare / 4;
    var date = Date.parse(item.ExDividendDate);
	var lastPrice = item.LastTradePriceOnly;
	var change = item.Change;
	var pctChange = item.ChangeinPercent;
	var chg200 = item.ChangeFromTwoHundreddayMovingAverage;
	var pctChg200 = item.PercentChangeFromTwoHundreddayMovingAverage;
	var chg50 = item.ChangeFromFiftydayMovingAverage;
	var pctChg50 = item.PercentChangeFromFiftydayMovingAverage;
	var priceUpdated = item.LastTradeDate + " - " +item.LastTradeTime;	
	var stockQuoteLink = "<td>" + "<a href='http://finance.yahoo.com/q?s=" + symbolForLink.replace(/['"]+/g, '') + "' TARGET='_blank'>" + nameForLink + "</a>" + "</td>";
	var changeDetails = "<td>" + change + " ("+ pctChange +")" + "</td>";

    // Append rows/columns to table #symbols
	$("#symbols").append($('<tr/>')
		.append($('<td/>').text(item.Symbol))
        .append($(stockQuoteLink))
        .append($(changeDetails))
		.append($('<td/>').text(item.DividendPayDate))
        .append($('<td/>').text(quarterlyDividend))
      );
    })
}

);

//end of if nesting
}
};

function clickHandler(e) {
	selectionType = "box";
  setTimeout(getData, 1000);
  
}
function clickHandlerSaved(e) {
		selectionType = "watchlist";
  setTimeout(getData, 1000);
}
function clickHandlerPage(e) {
		selectionType = "page";
  setTimeout(getData, 1000);
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('form-input-submit').addEventListener('click', clickHandler);
	getData();
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('search-portfolio-link').addEventListener('click', clickHandlerSaved);
  getData();
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('get-from-page').addEventListener('click', clickHandlerPage);
  getData();
});

document.getElementById("symbol")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("form-input-submit").click();
    }
});


