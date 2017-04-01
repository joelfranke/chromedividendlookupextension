// remove all page scraping references
// clean up code, comment


// write the scraped page symbols string to storage.sync

// This variable from chrome storage represents the stored watchlist
var storedPortfolio;
chrome.storage.sync.get('portfolio', function(localdata) {
    storedPortfolio = JSON.stringify(localdata.portfolio).toUpperCase();
    }
);

var fields = [];

// This variable from chrome storage will be written into the first column of the table
var attribute1;
chrome.storage.sync.get('attribute1', function(localdata) {
    attribute1 = JSON.stringify(localdata.attribute1);
	fields.push(attribute1);
    }
);

// This variable from chrome storage will be written into the second column of the table
var attribute2;
chrome.storage.sync.get('attribute2', function(localdata) {
    attribute2 = JSON.stringify(localdata.attribute2);
	fields.push(attribute2);
    }
);

// This variable from chrome storage will be written into the third column of the table
var attribute3;
chrome.storage.sync.get('attribute3', function(localdata) {
    attribute3 = JSON.stringify(localdata.attribute3);
	fields.push(attribute3);
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

	// array of keys:values based on possible selections
	var availTableFields = {'lastPrice':'Price','changeDetails':'Daily Performance','quarterlyDividend':'Quarterly Dividend','DividendYield':'Dividend Yield','divDate':'Dividend Pay Date','chg50':'+/- 50d Average','pctChg50':'% +/- 50d Average','chg200':'+/- 200d Average','pctChg200':'% +/- 200d Average','EarningsShare':'Earnings/share','DaysRange':'Range (day)','YearRange':'Range (year)','ChangeFromYearLow':'+/- Year Low','PercentChangeFromYearLow':'% +/- Year Low','ChangeFromYearHigh':'+/- Year High','PercebtChangeFromYearHigh':'% +/- Year High','MarketCapitalization':'Market Capitalization'};

	// create for loop to iterate through array of attributes from options to match against array of attributes 
	// and write these to new array for header
	var fieldArrayLength = fields.length;
	var tableHeader = [];
	
	for (var f = 0; f < fieldArrayLength; f++) {
		
		for (var key in availTableFields) {
		if (JSON.stringify(key) == fields[f]) 
			tableHeader.push(availTableFields[key]);
		}
	}
	
// Builds HTML table
// Update with a mouseover to indicate how to update the selected fields
var tableStructure ="<thead><th>Stock Symbol</th><th>Company Name</th><th>" + tableHeader[0] + "</th><th>" + tableHeader[1] + "</th><th>" + tableHeader[2] + "</th></thead><tbody></tbody>"

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
    var quarterlyDividend = "<td>" + "$" + item.DividendShare / 4 + "</td>";
	var divDate = item.DividendPayDate;
	if (item.DividendPayDate == null) {
		divDate	= "<td>n/a</td>";
	} else {divDate	= "<td>" + item.DividendPayDate + "</td>";}
	
	var lastPrice = "<td>$" + item.LastTradePriceOnly + "</td>";
	var change = item.Change;
	var DividendYield = "<td>" + item.DividendYield + "%</td>";
	var EarningsShare = "<td>" + item.EarningsShare + "</td>";
	var DaysRange = "<td>" + item.DaysRange + "</td>";
	var YearRange = "<td>" + item.YearRange + "</td>";
	var pctChange = item.ChangeinPercent;
	var ChangeFromYearLow = "<td>" + item.ChangeFromYearLow + "</td>";
	var PercentChangeFromYearLow = "<td>" + item.PercentChangeFromYearLow + "</td>";
	var ChangeFromYearHigh = "<td>" + item.ChangeFromYearHigh + "</td>";
	var PercebtChangeFromYearHigh = "<td>" + item.PercebtChangeFromYearHigh + "</td>";
	var MarketCapitalization = "<td>" + item.MarketCapitalization + "</td>";
	var chg200 = "<td>" + item.ChangeFromTwoHundreddayMovingAverage + "</td>";
	var pctChg200 = "<td>" + item.PercentChangeFromTwoHundreddayMovingAverage + "</td>";
	var chg50 = "<td>" + item.ChangeFromFiftydayMovingAverage + "</td>";
	var pctChg50 = "<td>" + item.PercentChangeFromFiftydayMovingAverage  + "</td>";
	var priceUpdated = "<td>" + item.LastTradeDate + " - " +item.LastTradeTime + "</td>";
	var stockQuoteLink = "<td>" + "<a href='http://finance.yahoo.com/q?s=" + symbolForLink.replace(/['"]+/g, '') + "' TARGET='_blank'>" + nameForLink + "</a>" + "</td>";
	var changeDetails = "<td>" + change + " ("+ pctChange +")" + "</td>";
	
	console.log(changeDetails);
	// array of keys:values based on the above
	var availFields = {'lastPrice':lastPrice,'changeDetails':changeDetails,'quarterlyDividend':quarterlyDividend,'DividendYield':DividendYield,'divDate':divDate,'chg50':chg50,'pctChg50':pctChg50,'chg200':chg200,'pctChg200':pctChg200,'EarningsShare':EarningsShare,'DaysRange':DaysRange,'YearRange':YearRange,'ChangeFromYearLow':ChangeFromYearLow,'PercentChangeFromYearLow':PercentChangeFromYearLow,'ChangeFromYearHigh':ChangeFromYearHigh,'PercebtChangeFromYearHigh':PercebtChangeFromYearHigh,'MarketCapitalization':MarketCapitalization};

	// FOR loop to iterate through array of attributes from options to match against array of attributes 
	// and write these to new array for table
	var fieldArrayLength = fields.length;
	var tableVariables = [];
	
	for (var f = 0; f < fieldArrayLength; f++) {
		
		for (var key in availFields) {
		if (JSON.stringify(key) == fields[f]) 
			tableVariables.push(availFields[key]);
		}
	}

    // Append rows/columns to table #symbols
	$("#symbols").append($('<tr/>')
		.append($('<td/>').text(item.Symbol))
        .append($(stockQuoteLink))
        .append($(tableVariables[0]))
		.append($(tableVariables[1]))
        .append($(tableVariables[2]))
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

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('form-input-submit').addEventListener('click', clickHandler);
	getData();
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('search-portfolio-link').addEventListener('click', clickHandlerSaved);
  getData();
});

document.getElementById("symbol")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("form-input-submit").click();
    }
});


