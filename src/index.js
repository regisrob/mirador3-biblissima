import Mirador from 'mirador/dist/es/src/index';
import miradorDownloadPlugin from 'mirador-dl-plugin/es/miradorDownloadPlugin';
import miradorDownloadDialogPlugin from 'mirador-dl-plugin/es/MiradorDownloadDialog';
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
          main: '#3C474C'
        },
        secondary: {
          main: '#3C474C',
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

// A iiif resource is passed as a url param
if (iiifResource) {

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

Mirador.viewer(config, [
  miradorDownloadDialogPlugin,
  miradorDownloadPlugin,
  ...miradorImageToolsPlugin,
]);
