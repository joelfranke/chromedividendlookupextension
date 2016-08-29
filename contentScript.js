//Capture the body of the page as text
var pageContent = $('body').text();

// RegEx to evaluate body against, needs work
var regEx = /.+[\\\/|\/|=]\b([A-Z]{1,4})\b[^\-\>\/\<\ \=]|\"\)\s\(([A-Z]{1,4})\)|[^>]\b([A-Z]{1,4})[\=|\:|\. ]{1,2}[A-Z]{1,6}[^\.\,\;\-\>\< ]\b/g;

//Evaluate body
var pageSymbols = regEx.exec(pageContent);

//Create array to hold matches
var output = [];

//Iterate over matches and write to output
while (pageSymbols != null) {
    // matched text: pageSymbols[0]
    // match start: pageSymbols.index
    // capturing group n: pageSymbols[n]
    output.push(pageSymbols[1]);
	pageSymbols = regEx.exec(pageContent);
	
}

//Array to evaluate duplicate values
var tableCollectedSymbolsArray = [];

//Iterate over output
$.each(output, function(index, item) {

var returnedSymbol = item;
	if (tableCollectedSymbolsArray.indexOf(returnedSymbol) >= 0){
		// break loop
		return true;
		} else
			if(returnedSymbol !=null){
				tableCollectedSymbolsArray.push(returnedSymbol);
			}

	}
)

// write collected symbol(s) variable
if (tableCollectedSymbolsArray != null) {
	var pageCollectedSymbols = tableCollectedSymbolsArray.toString();
}
	else {
		var pageCollectedSymbols;
	}

// Pass the value to the background script via message to be written to storage.sync
chrome.runtime.sendMessage({method: "getLocalStorage", key: pageCollectedSymbols},
function(response) {
  console.log(pageCollectedSymbols);
});
