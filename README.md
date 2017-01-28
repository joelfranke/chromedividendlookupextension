# Chrome Extension - Stock Screener
This extension uses an API to provide information related to stocks.

## Search
In a search box, any number of symbols can be entered into a search box. These symbols are then passed to a web service which returns a result or a null result. Those results are written as rows into a table with the appropriate variables displayed in the columns of that table.

## Search on current tab
As tabs are loaded, all hyperlinks on the page are aggregated and evaluated against a regular expression. Any unique matches from this regular expression evaluation are written into a variable and passed to a web service as symbols. The web service then returns a result or null result. Those results are written as rows into a table with the appropriate variables displayed in the columns of that table.

## Search watchlist
On the options page, there is a field that captures a list of comma delimited symbols that are stored as a watchlist. This field in its entirety is passed to a web service which returns a result or a null result. Those results are written as rows into a table with the appropriate variables displayed in the columns of that table.

## Options
The options page currently only includes a watchlist field. This field captures a list of comma-delimimted symbols which are searched when "Search watchlist" is clicked.

## Notice
Disclaimer.

# To be done
- RegEx: DOI RegEx harvester updated to 1) evaluate and write symbols from all links into the relevant variable and 2) evaluate all TEXT variables from the press release format into relevant variable.
- JS: Create link function to be consolidated based on any and all actions, not seperate functions for each type of action.
- JS: Modify API to use https://intrinio.com/marketplace/apps
- Options: Modify options page to 1) optionally add/change any four variables and 2) accomodate an API token
- Options: Create custom variable expression builder for calculated fields
~~- Popup: Drop hover-over CSS~~
- JS: Add alert on watchlist symbols (via alert or extension logo change)
- JS: Add look-ahead symbol suggestion for search box
- Options: Scrub non-alphabetical characters and all symbols, except comma, from watchlist field.
- Popup: Remove Yahoo! references
