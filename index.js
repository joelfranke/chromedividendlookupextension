var storedPortfolio;
chrome.storage.sync.get('portfolio', function(localdata) {
    storedPortfolio = JSON.stringify(localdata.portfolio).toUpperCase();
	console.log(storedPortfolio);
    }
);
	
var pageItems;
chrome.storage.sync.get('onpagesymbols', function(contentdata) {
    pageItems = JSON.stringify(contentdata.onpagesymbols).toUpperCase();
	console.log(pageItems);
    }
);

// This variable is to be used in the API request
var apiToken;
chrome.storage.sync.get('token', function(localdata) {
    apiToken = JSON.stringify(localdata.token).toUpperCase();
	console.log(apiToken);
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

// Currently not handling null pageItems, fails when trying to resolve data.query.results.quote.
if (selectionType == "page"){
	if (pageItems.length == '""'){
		alert('No symbols found on this page.');
	} else {
		console.log('A symbol is found on this page.')

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
        
		// Messaging for page look-up doesn't make sense here.
		alert(symbolForLink + nullMessage);
		return true;
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

}

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


