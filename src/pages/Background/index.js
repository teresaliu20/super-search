import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

console.log("input WTF IS HAPPENING changed")


// Encode user input for special characters , / ? : @ & = + $ #
function encodeXml(s) {
  var holder = document.createElement('div');
  holder.textContent = s;
  return holder.innerHTML;
}

function navigate(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  });
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function handleTabOnInputChange(text, suggest) {
  chrome.tabs.query({}, function(tabs) {
    const searchQuery = text.split('tab ').pop().trim().toLowerCase()

    const filteredTabs = tabs.filter(tab => tab.title.toLowerCase().includes(searchQuery))
    const tabSuggestions = filteredTabs.map(tab => {
      return {
        content: tab.url +  " · switch to tab " + tab.id,
        description: encodeXml('👉 | ' + tab.title)
      }})

    console.log(tabSuggestions)
    suggest(tabSuggestions)
  })
}

function handleBookmarkOnInputChange(text, suggest) {
  const searchQuery = text.split('bookmark ').pop()
  chrome.bookmarks.search(searchQuery, function(bookmarks) {
    console.log("bookmarks")
    console.log(bookmarks)
    const bookmarkSuggestions = bookmarks.map(bookmark => {
      return {
        content: bookmark.url,
        description: encodeXml('📚 | ' + bookmark.title + ' · ' + bookmark.url)
      }})

    console.log(bookmarkSuggestions)
    suggest(bookmarkSuggestions)
  })
}

function handleHistoryInputChange(text, suggest) {
  const searchQuery = {
    text: text.split('history ').pop(),
    maxResults: 6
  }
  chrome.history.search(searchQuery, function(historyItems) {
    console.log("bookmarks")
    console.log(historyItems)
    const historySuggestions = historyItems.map(historyItem => {
      return {
        content: historyItem.url,
        description: encodeXml('📺 | ' + historyItem.title + ' · ' + historyItem.url)
      }})

    console.log(historySuggestions)
    suggest(historySuggestions)
  })
}

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  if (text.startsWith('tab')) {
    handleTabOnInputChange(text, suggest)
  }
  else if (text.startsWith('bookmark')) {
    handleBookmarkOnInputChange(text, suggest)
  }
  else if (text.startsWith('history')) {
    handleHistoryInputChange(text, suggest)
  }
});

chrome.omnibox.onInputEntered.addListener(function(text) {
  console.log("received enter event")

  if (validURL(text)) {
    navigate(text)
  }
  else if (text.startsWith('· switch to tab ')) {
    const tabId = parseInt(text.split('· switch to tab ').pop())
    chrome.tabs.update(parseInt(tabId), {active: true})
  }
});


