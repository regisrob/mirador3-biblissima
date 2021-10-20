import Mirador from 'mirador/dist/es/src/index';
import miradorDownloadPlugin from 'mirador-dl-plugin/es/miradorDownloadPlugin';
import miradorDownloadDialogPlugin from 'mirador-dl-plugin/es/MiradorDownloadDialog';
import CustomGalleryButton from './plugin/CustomGalleryButton';
import { miradorImageToolsPlugin } from 'mirador-image-tools';


let params = new URL(document.location).searchParams;
let iiifResource = params.get('iiif-content') || params.get('manifest');
let initializedManifest = params.get('manifest');
let context = params.get('context'); // possible values are: descriptor, collection
let theme = params.get('theme');

const config = {
  id: 'm3',
  language: 'fr',
  selectedTheme: 'dark',
  themes: {
    dark: {
      palette: {
        type: "dark",
        primary: {
          main: "#fec810",  // Controls the color of the Add button and current window indicator
        },
        secondary: {
          main: "#fec810", // Controls the color of Selects and FormControls
        },
        section_divider: "rgba(255, 255, 255, 0.3)",
        shades: { // Shades that can be used to offset color areas of the Workspace / Window
          dark: "#000000",
          main: "#3C474C",
          light: "#5f676d"
        },
        background: {
          paper: "#435055",
          default: "#ffffff"
        }
      },
      typography: {
        fontFamily: '"Source Sans Pro", "Arial", "Helvetica", sans-serif'
      }
    },
    light: {
      palette: {
        type: 'light',
        primary: {
          main: '#2f4b60'
        },
        secondary: {
          main: '#2f4b60',
        },
        shades: {
          dark: '#dddddd',
          main: "#ffffff",
          light: "#f5f5f5",
        },
        background: {
          paper: "#ffffff",
          default: "#f5f5f5"
        }
      },
    },
  },
  theme: {
    palette: {
      highlights: {
        primary: '#fee387',
        secondary: '#00BFFF',
      },
    },
  },
  displayAllAnnotations: false,
  thumbnailNavigation: {
    defaultPosition: 'off',
  },
  window: {
    allowClose: true,
    allowMaximize: false,
    allowFullscreen: true,
    sideBarOpen: true,
    sideBarPanel: null,
    defaultView: 'single',
    panels: {
      info: true,
      attribution: true,
      canvas: true,
      annotations: true,
      search: true,
      layers: true,
    },
    views: [
      { key: 'single' /*behaviors: ['individuals']*/ },
      { key: 'book' /*behaviors: ['paged']*/ },
      { key: 'scroll', behaviors: ['continuous'] },
      { key: 'gallery' },
    ],
    // mirador-image-tools plugin
    imageToolsEnabled: true,
    imageToolsOpen: false
  },
  workspace: {
    showZoomControls: true,
    type: 'mosaic',
  },
  workspaceControlPanel: {
    enabled: true,
  },
  catalog: [],
  windows: [],
  miradorDownloadPlugin: { restrictDownloadOnSizeDefinition: false }
}


if (theme == 'light') {
  config.selectedTheme = 'light';
}

// resource is an encoded iiif content state
if (iiifResource && !iiifResource.startsWith('http') && !iiifResource.startsWith('{')) {
  if (!iiifResource.startsWith('http') && !iiifResource.startsWith('{')) {
    let json = decodeContentState(iiifResource);
    let contentState = JSON.parse(json);
    let target = contentState.target;
    if (Array.isArray(target)) {
      config.workspaceControlPanel.enabled = true;
      for (var i=0; i<target.length; i++) {
        let item = target[i];
        switch(item.type) {
          case 'Manifest':
            config.windows.push({
              manifestId: item.id,
            });
          case 'Canvas':
            if (item.partOf && item.partOf[0].type == 'Manifest') {
              config.windows.push({
                manifestId: item.partOf[0].id,
                canvasId: item.id,
              });
            }
        }
      }
    }
  }
}

// resource is a iiif url
if (iiifResource && iiifResource.startsWith('http')) {

  // populate the catalog
  config.catalog.push({
    manifestId: iiifResource,
  });

  config.window.defaultView = 'gallery';

  // Case of a single resource (no workspace)
  if (context !== 'collection') {
    config.window.allowClose = false;
    config.workspace.type = 'single';
    config.workspaceControlPanel.enabled = false;
    config.windows.push({
      manifestId: iiifResource,
    });
  }

  if (context == 'collection') {
    // if a manifest is passed
    if (initializedManifest) {
      // display it in a single window
      config.windows.push({
        manifestId: initializedManifest,
      });
    } else {
      // display the collection window w/ modal
      config.windows.push({
        manifestId: iiifResource,
      });
    }
  }
  
  if (context == 'descriptor') {
    config.window.defaultSideBarPanel = 'info'; // display the info panel by default
    // config.thumbnailNavigation.defaultPosition = 'off';
    // config.window.defaultView = 'gallery';
    // Object.assign(config, { galleryView: { height: 150 } });
    // config.galleryView.height = 150;
  }
}

function decodeContentState(encodedContentState) {
  let base64url = restorePadding(encodedContentState);
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  let base64Decoded = atob(base64);               // using built in function
  let uriDecoded = decodeURI(base64Decoded);      // using built in function
  return uriDecoded;
}

function restorePadding(s) {
  let pad = s.length % 4;
  if (pad) {
      if (pad === 1) {
          throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      s += new Array(5 - pad).join('=');
  }
  return s;
}

Mirador.viewer(config, [
  miradorDownloadDialogPlugin,
  miradorDownloadPlugin,
  miradorCustomGalleryButton,
  ...miradorImageToolsPlugin,
]);
