var storedPortfolio;
chrome.storage.sync.get('portfolio', function(localdata) {
    storedPortfolio = JSON.stringify(localdata.portfolio).toUpperCase();
	console.log(storedPortfolio);
    });
	
var pageItems;
chrome.storage.sync.get('onpagesymbols', function(contentdata) {
    pageItems = JSON.stringify(contentdata.onpagesymbols).toUpperCase();
	console.log(pageItems);
    });


var tableCreated;
var tableSymbolsArray = [];

function getData() {

var collectedSymbols = $("#symbol").val().toUpperCase();
// Make API request:
var apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + collectedSymbols + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

// Set date variables
var dateObj = new Date();
today = Date.parse(dateObj);

var tableStructure ="<thead><th>Stock Symbol</th><th>Company Name</th><th>Ex-dividend Date</th><th>Dividend Pay Date</th><th>Dividend</th></thead><tbody></tbody>"

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


    // Check for valid symbols and set checkItems, otherwise break loop
    var symbolForLink = JSON.stringify(item.Symbol);  
	if (nameForLink == null) {
        alert(symbolForLink + ' returns no result.');
		return true;
      } else {
        checkItems = 1;
      }
	if (tableCreated == null){
	$("#symbols").append($(tableStructure))
	tableCreated = "yes";
		
  }
	
      
	if (tableSymbolsArray.indexOf(symbolForLink) >= 0){
			alert(symbolForLink + ' already exists in the table.');
			return true;
		} else {tableSymbolsArray.push(symbolForLink);}

      var stockQuoteLink = "<td>" + "<a href='http://finance.yahoo.com/q?s=" + symbolForLink.replace(/['"]+/g, '') + "' TARGET='_blank'>" + nameForLink + "</a>" + "</td>";

      var quarterlyDividend = "$" + item.DividendShare / 4;

      var date = Date.parse(item.ExDividendDate);
	var lastPrice = JSON.stringify(item.LastTradePriceOnly);
	var chg200 = JSON.stringify(item.ChangeFromTwoHundreddayMovingAverage);
	var pctChg200 = JSON.stringify(item.PercentChangeFromTwoHundreddayMovingAverage);
	var chg50 = JSON.stringify(item.ChangeFromFiftydayMovingAverage);
	var pctChg50 = JSON.stringify(item.PercentChangeFromFiftydayMovingAverage);
	var priceUpdated = JSON.stringify(item.LastTradeDate + " - " + item.LastTradeTime);	
	console.log(priceUpdated);
		

      //logic for date check to highlight cells using greencell id via css
      if (date >= today) {
        var divDateRow = "<td id='greencell'>"  + item.ExDividendDate + "</td>";
      } else {
        var divDateRow = "<td>" + item.ExDividendDate + "</td>";
      }

      // Append rows/columns to table #symbols
      $("#symbols").append($('<tr/>')
        .append($('<td/>').text(item.Symbol))
        .append($(stockQuoteLink))
        .append($(divDateRow))
        .append($('<td/>').text(item.DividendPayDate))
        .append($('<td/>').text(quarterlyDividend))

      );

    })

  
});
}
function getDataSaved() {


// Make API request:
var apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" + storedPortfolio + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

// Set date variables
var dateObj = new Date();
today = Date.parse(dateObj);

var tableStructure ="<thead><th>Stock Symbol</th><th>Company Name</th><th>Ex-dividend Date</th><th>Dividend Pay Date</th><th>Dividend</th></thead><tbody></tbody>"

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
        alert(symbolForLink + ' returns no result. Please update your saved portfolio to stop seeing this message.');
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
     

      var quarterlyDividend = "$" + item.DividendShare / 4;

      var date = Date.parse(item.ExDividendDate);
	var lastPrice = JSON.stringify(item.LastTradePriceOnly);
	var chg200 = JSON.stringify(item.ChangeFromTwoHundreddayMovingAverage);
	var pctChg200 = JSON.stringify(item.PercentChangeFromTwoHundreddayMovingAverage);
	var chg50 = JSON.stringify(item.ChangeFromFiftydayMovingAverage);
	var pctChg50 = JSON.stringify(item.PercentChangeFromFiftydayMovingAverage);
	var priceUpdated = JSON.stringify(item.LastTradeDate + " - " +item.LastTradeTime);	
	
	//build this out with html/css to show data in popup
	var popupInfo = "<span>"+nameForLink+"</br>"+symbolForLink+"</br>"+lastPrice+"</span>";
	
	
	var stockQuoteLink = "<td>" + "<a href='http://finance.yahoo.com/q?s=" + symbolForLink.replace(/['"]+/g, '') + "' TARGET='_blank'>" + nameForLink + popupInfo +"</a>" + "</td>";
	console.log(priceUpdated);
      //logic for date check to highlight cells using greencell id via css
      if (date >= today) {
        var divDateRow = "<td id='greencell'>"  + item.ExDividendDate + "</td>";
      } else {
        var divDateRow = "<td>" + item.ExDividendDate + "</td>";
      }

      // Append rows/columns to table #symbols
      $("#symbols").append($('<tr/>')
        .append($('<td/>').text(item.Symbol))
        .append($(stockQuoteLink))
        .append($(divDateRow))
        .append($('<td/>').text(item.DividendPayDate))
        .append($('<td/>').text(quarterlyDividend))

      );

    })
});
}
function getDataForPage() {


// Make API request:
var apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" + pageItems + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

// Set date variables
var dateObj = new Date();
today = Date.parse(dateObj);

var tableStructure ="<thead><th>Stock Symbol</th><th>Company Name</th><th>Ex-dividend Date</th><th>Dividend Pay Date</th><th>Dividend</th></thead><tbody></tbody>"

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
        alert(symbolForLink + ' returns no result. Please update your saved portfolio to stop seeing this message.');
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
     
	 var stockQuoteLink = "<td>" + "<a href='http://finance.yahoo.com/q?s=" + symbolForLink.replace(/['"]+/g, '') + "' TARGET='_blank'>" + nameForLink + "</a>" + "</td>";

      var quarterlyDividend = "$" + item.DividendShare / 4;

      var date = Date.parse(item.ExDividendDate);
	var lastPrice = JSON.stringify(item.LastTradePriceOnly);
	var chg200 = JSON.stringify(item.ChangeFromTwoHundreddayMovingAverage);
	var pctChg200 = JSON.stringify(item.PercentChangeFromTwoHundreddayMovingAverage);
	var chg50 = JSON.stringify(item.ChangeFromFiftydayMovingAverage);
	var pctChg50 = JSON.stringify(item.PercentChangeFromFiftydayMovingAverage);
	var priceUpdated = JSON.stringify(item.LastTradeDate + " - " +item.LastTradeTime);	
	console.log(priceUpdated);
      //logic for date check to highlight cells using greencell id via css
      if (date >= today) {
        var divDateRow = "<td id='greencell'>"  + item.ExDividendDate + "</td>";
      } else {
        var divDateRow = "<td>" + item.ExDividendDate + "</td>";
      }

      // Append rows/columns to table #symbols
      $("#symbols").append($('<tr/>')
        .append($('<td/>').text(item.Symbol))
        .append($(stockQuoteLink))
        .append($(divDateRow))
        .append($('<td/>').text(item.DividendPayDate))
        .append($('<td/>').text(quarterlyDividend))

      );

    })
});
}

function clickHandler(e) {
  setTimeout(getData, 1000);
}
function clickHandlerSaved(e) {
  setTimeout(getDataSaved, 1000);
}
function clickHandlerPage(e) {
  setTimeout(getDataForPage, 1000);
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
  getDataSaved();
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('get-from-page').addEventListener('click', clickHandlerPage);
  getDataForPage();
});

document.getElementById("symbol")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("form-input-submit").click();
    }
});

