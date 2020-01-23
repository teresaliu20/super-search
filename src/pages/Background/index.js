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

function handleTabOnInputChange(text, suggest) {
  chrome.tabs.query({}, function(tabs) {
    const searchQuery = text.split('tab').pop().trim().toLowerCase()

    const filteredTabs = tabs.filter(tab => tab.title.toLowerCase().includes(searchQuery))
    const tabSuggestions = filteredTabs.map(tab => {
      const content = {
        type: 'tab',
        tabId: tab.id
      }
      return {
        content: JSON.stringify(content),
        description: encodeXml('👉 TAB ' + tab.title)
      }})

    console.log(tabSuggestions)
    suggest(tabSuggestions)
  })
}

function handleBookmarkOnInputChange(text, suggest) {
  const searchQuery = text.split('bookmark').pop()
  chrome.bookmarks.search(searchQuery, function(bookmarks) {
    console.log("bookmarks")
    console.log(bookmarks)
    const bookmarkSuggestions = bookmarks.map(bookmark => {
      const content = {
        type: 'bookmark',
        url: bookmark.url
      }
      return {
        content: JSON.stringify(content),
        description: encodeXml('📚 BOOKMARK ' + bookmark.title + ' · ' + bookmark.url)
      }})

    console.log(bookmarkSuggestions)
    suggest(bookmarkSuggestions)
  })
}

function handleTabOnInputEntered(content) {
  chrome.tabs.update(parseInt(content.tadId), {active: true})
}

function handleBookmarkOnInputEntered(content) {
  navigate(content.url)
}

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  if (text.startsWith('tab')) {
    handleTabOnInputChange(text, suggest)
  }
  if (text.startsWith('bookmark')) {
    handleBookmarkOnInputChange(text, suggest)
  }
});

chrome.omnibox.onInputEntered.addListener(function(text) {
  console.log("received enter event")
  const content = JSON.parse(text)
  console.log(content)

  if (content.type === 'tab') {
    handleTabOnInputEntered(content)
  }
  if (content.type === 'bookmark') {
    handleBookmarkOnInputEntered(content)
  }
});
