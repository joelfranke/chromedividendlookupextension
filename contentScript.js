//Capture the links of the page as array, note: does not work on pages with content in frames
var linksArray = [].slice.call(document.querySelectorAll("a"));
var links = linksArray.map(function(elem) {return elem.getAttribute('href');});
var regExLinks = /.+[\\\/|\/|=]\b([A-Z]{1,4})\b[^\-\>\/\<\ \=]/g;
   
//Create array to hold matches
var output = [];
  
//Evaluate links
var pageSymbolLinks = regExLinks.exec(links);

// test start
// var linkString = links.toString();
// console.log(linkString);
// var myArray;
// while ((myArray = regExLinks.exec(linkString)) !== null) {
//	var msg = 'Found ' + myArray[0] + '. ';
//  msg += 'Next match starts at ' + regExLinks.lastIndex;
//  console.log(linkString);}
// test end


//Iterate over links matches and write to output
while (pageSymbolLinks !== null) {
    
	// matched text: pageSymbolLinks[0]
    // match start: pageSymbolLinks.index
    // capturing group n: pageSymbolLinks[n]
	 output.push(pageSymbolLinks[1]);
	pageSymbolLinks = regExLinks.exec(links);
}

// RegEx against which to evaluate body text
// var regEx = /\"\)\s\(([A-Z]{1,4})\)|[^>]\b([A-Z]{1,4})[\=|\:|\. ]{1,2}[A-Z]{1,6}[^\.\,\;\-\>\< ]\b/g;

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