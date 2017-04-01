# Chrome Extension - Stock Screener
This extension provides a customizable snapshot of market data for an indivdual position or a saved watchlist/portfolio.

## Search
In a search box, any number of symbols can be entered into a search box. These symbols are then passed to a web service which returns a result or a null result. Those results are written as rows into a table with the appropriate variables displayed in the columns of that table.

## Search watchlist
On the options page, there is a field that captures a list of comma delimited symbols that are stored as a watchlist. This field in its entirety is passed to a web service which returns a result or a null result. Those results are written as rows into a table with the appropriate variables displayed in the columns of that table.

## Options
The options page currently only includes a watchlist field. This field captures a list of comma-delimimted symbols which are searched when "Search watchlist" is clicked.

## Notice
Disclaimer and notice of terms of use.

# To be done
- ~~JS: Create link function to be consolidated based on any and all actions, not seperate functions for each type of action.~~
- ~~JS: Address null pageItems, fails when trying to resolve data.query.results.quote.~~
- ~~Options: Modify options page to 1) optionally add/change any three variables~~
- ```Options: Create custom variable expression builder for calculated fields```
- ~~Options: Scrub non-alphabetical characters and all symbols, except comma, from watchlist field.~~
- ```Options: Modify attribute selection list to 1) dynamically reflect selectable items based on the items which have already been selected``` ~~and 2) to align with attributes available in the API.~~
- ```Update with a mouseover to indicate how to update the selected fields```
