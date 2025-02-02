import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,

    permissions: [
      "tabs",
      "storage",
      "contextMenus",
      "unlimitedStorage",
      "bookmarks",
      "activeTab",
      "history",
      "identity",
      "alarms",
    ],
   
    action: {
      default_icon: './assets/icon-512.png',
      default_popup: './dist/popup/index.html',
      default_title: pkg.name
    },

    options_ui: {
      page: 'dist/options/index.html',
      open_in_tab: true,
    },
 
    background: {
      service_worker: 'dist/background/background.js',
    },

    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    
    content_scripts: [
      {
        "matches": ["<all_urls>"],
        js: ['dist/contentScripts/index.global.js'],
        run_at: "document_idle",
        all_frames: false
      },
    ],

    content_security_policy : {
      extension_pages: "script-src 'self'; object-src 'self'; ",
    },
    
    web_accessible_resources: [
      {
        "resources": ["*"],
        "matches": ["<all_urls>"]
      }
    ]
     
  }

  if (0 && isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    // delete manifest.content_scripts
    manifest.permissions?.push('webNavigation') 

    // this is required on dev for Vite script to load
   manifest.content_security_policy.extension_pages = `script-src \'self\' http://localhost:${port};  object-src 'self'; `
    // manifest.content_security_policy.extension_pages = `script-src \'self\' http://localhost:${port}; object-src \'self\'; worker-src \'self\'`;    
  }

  return manifest
}
