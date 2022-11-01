import { browser } from "webextension-polyfill";
/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import browser from 'webextension-polyfill'

import { createApp } from 'vue'
import App from './views/App.vue'

var process = process || { env: {} };
process.env.ok = 1;

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
;(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  const root = document.createElement('div')

  /*
  const styleEl = document.createElement('link')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  styleEl.setAttribute('rel', 'stylesheet')
  shadowDOM.appendChild(styleEl)
*/
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  createApp(App).mount(root)
})()
