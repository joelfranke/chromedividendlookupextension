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
- RegEx: DOI RegEx harvester updated to ```1) evaluate and write symbols from all links into the relevant variable``` and 2) evaluate all TEXT variables from the press release format into relevant variable.
  - ```// \"\)\s\(([A-Z]{1,4})\)``` ("Wendy's" or the "Company") (WEN).
- ~~JS: Create link function to be consolidated based on any and all actions, not seperate functions for each type of action.~~
- ~~JS: Address null pageItems, fails when trying to resolve data.query.results.quote.~~
- ~~JS: Add alert on watchlist symbols (via alert or extension logo change)~~ ```on tab load and retain the persistent count.```
- ~~JS: Modify messaging for page result lookup with no results (not null).~~~
- ~~Options: Modify options page to 1) optionally add/change any three variables and 2) accomodate an API token~~
- ```Options: Create custom variable expression builder for calculated fields```
- ~~Options: Scrub non-alphabetical characters and all symbols, except comma, from watchlist field.~~
- ```Options: Modify attribute selection list to 1) dynamically reflect selectable items based on the items which have already been selected``` ~~and 2) to align with attributes available in the API.~~
- ~~Popup: Drop hover-over CSS~~
