//Capture the links of the page as array, note: does not work on pages with content in frames
var array = [];
var links = document.getElementsByTagName("a");

// testing variable/alert only
var string = [].map.call( links, function(node){
        return node.childNodes || node.localName || "";
    }).join("");

for(var i=0; i<links.length; i++) {
    array.push(links[i].href);
}
   var pageLinks = array; 
   var regExLinks = /.+[\\\/|\/|=]\b([A-Z]{1,4})\b[^\-\>\/\<\ \=]/g;
   
//Create array to hold matches
var output = [];
  
  //Evaluate links
var pageSymbolLinks = regExLinks.exec(pageLinks);

//Iterate over links matches and write to output
while (pageSymbolLinks !== null) {
    
	// matched text: pageSymbolLinks[0]
    // match start: pageSymbolLinks.index
    // capturing group n: pageSymbolLinks[n]
    output.push(pageSymbolLinks[1]);
	pageSymbolLinks = regExLinks.exec(pageLinks);
}

// RegEx to evaluate body text against
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