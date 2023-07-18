import Mirador from 'mirador/dist/es/src/index';
import miradorDownloadPlugin from 'mirador-dl-plugin/es/miradorDownloadPlugin';
import miradorDownloadDialogPlugin from 'mirador-dl-plugin/es/MiradorDownloadDialog';
import CustomGalleryButton from './plugin/CustomGalleryButton';
import { miradorImageToolsPlugin } from 'mirador-image-tools';
//import imageCropperPlugin from 'mirador-imagecropper/es';

// get URL params
let params = new URL(document.location).searchParams;
let iiifResource = params.get('iiif-content') || params.get('manifest');
let initializedManifest = params.get('manifest');
let mode = params.get('context') || params.get('mode'); // possible values are: single | workspace (default)
let theme = params.get('theme');
let panel = params.get('panel');

// set enabled plugins
const plugins = [
  miradorDownloadDialogPlugin,
  miradorDownloadPlugin,
  CustomGalleryButton,
  ...miradorImageToolsPlugin,
  //...imageCropperPlugin,
];

// set default config
var config = {
  id: 'm3',
  language: 'fr',
  selectedTheme: 'light',
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
    defaultView: 'gallery',
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
    imageToolsOpen: false,
    // plugin image-cropper not functional, so disabled
    // imageCropper: {
    //   active: false,
    //   enabled: true, 
    // },
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
  requests: {
    postprocessors: []
  },
  miradorDownloadPlugin: { restrictDownloadOnSizeDefinition: false },
}

// initialize Mirador instance
const miradorInstance = Mirador.viewer(config, plugins);

// set theme
if (theme == 'dark') {
  config.selectedTheme = 'dark';
}

//------ case 1: resource is an encoded iiif content state
if (iiifResource && !iiifResource.startsWith('http') && !iiifResource.startsWith('{')) {
  if (!iiifResource.startsWith('http') && !iiifResource.startsWith('{')) {
    let json = decodeContentState(iiifResource);
    let contentState = JSON.parse(json);
    let target = contentState.target;
    if (Array.isArray(target)) {
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

//------ case 2: resource is a iiif url
if (iiifResource && iiifResource.startsWith('http')) {

  // default mode (workspace): add resource to the catalog and display it in workspace mode
  if (!mode) {
    config.catalog.push({
      manifestId: iiifResource,
    });
    config.windows.push({
      manifestId: iiifResource,
    });
  }

  // single mode: a standalone resource, without workspace ("zen mode")
  if (mode == 'single') {
    config.workspace.type = 'single';
    config.workspaceControlPanel.enabled = false;
    config.window.allowClose = false;
    config.catalog.push({
      manifestId: iiifResource,
    });
    config.windows.push({
      manifestId: iiifResource,
    });
  }

  // workspace mode (only used for "Book" pages on Biblissima portal)
  // if resource is a IIIF Collection: bypass the collection modal and populate the catalog window directly with all the manifests (this is the same behavior as the old Mirador2 "Load window")
  // WARNING: this mode is not suitable for large collections because of the performance penalty
  if (mode == 'workspace') {
    config.catalog.push({
      manifestId: iiifResource,
    });
    config.workspace.isWorkspaceAddVisible = true; // Catalog/Workspace add window feature visible by default
    // then postprocess to retrieve collection items and add them to the catalog window
    config.requests.postprocessors.push((url, action) => {
      if (action.type === "mirador/RECEIVE_MANIFEST") {
        var json = action.manifestJson;
        if (json['@type'] == 'sc:Collection') {
          if (json.members || json.manifests) {
            let items = json.members || json.manifests;
            items.forEach((member) => {
              let memberId = member['@id'] || member.id;
              let addMember = Mirador.actions.addResource(memberId);
              miradorInstance.store.dispatch(addMember);
            });
            // remove the initialized collection from the catalog
            let removeCollection = Mirador.actions.removeResource(iiifResource);
            miradorInstance.store.dispatch(removeCollection);
          }
        }
        return {
          ...action,
          // manifestJson: {},
        };
      }
    });
  }

  // panels display
  if (panel == 'info') {
    config.window.defaultSideBarPanel = 'info'; // display the info panel by default
  }

  // dispatch updated config
  miradorInstance.store.dispatch(Mirador.actions.importConfig(config));
}

function decodeContentState(encodedContentState) {
  let base64url = restorePadding(encodedContentState);
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  let base64Decoded = atob(base64); // using built in function
  let uriDecoded = decodeURI(base64Decoded); // using built in function
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
