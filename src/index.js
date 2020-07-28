import Mirador from "mirador/dist/es/src/index";
import miradorDownloadPlugin from "mirador-dl-plugin/es/miradorDownloadPlugin";
import miradorDownloadDialogPlugin from "mirador-dl-plugin/es/MiradorDownloadDialog";
import { miradorImageToolsPlugin } from 'mirador-image-tools';


let params = new URL(document.location).searchParams;
let iiifResourceUri = params.get('iiif-content') || params.get('manifest');
let context = params.get("context");
let theme = params.get("theme");

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
    allowClose: false,
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

// if (typeof manifestUris !== 'undefined' && manifestUris.length > 0) {
//   for (var i = 0; i < manifestUris.length; i++) {
//     config.catalog.push({
//       manifestId: manifestUris[i],
//     });
//   }
//   config.workspaceControlPanel.enabled = true;
// }

// An embed context is passed as a url param
if (context) {
  config.workspaceControlPanel.enabled = false;
  config.workspace.type = 'single';
}

if (theme == 'light') {
  config.selectedTheme = 'light';
}

// A iiif resource is passed as a url param
if (iiifResourceUri) {

  config.catalog.push({
    manifestId: iiifResourceUri,
  });

  // Different embed contexts with variations in m3 config:
  if (context !== 'collection') {
    //config.workspace.type = 'mosaic';
    config.windows.push({
      manifestId: iiifResourceUri,
    });
  }
  
  if (context == 'descriptor') {
    config.window.defaultSideBarPanel = 'info';
    //config.thumbnailNavigation.defaultPosition = 'off';
    // config.window.defaultView = 'gallery';
    //Object.assign(config, { galleryView: { height: 150 } });
    //config.galleryView.height = 150;
  }

}

// demo workshop Naples
// Object.assign(config.catalog, {
//   'https://iiif.bodleian.ox.ac.uk/iiif/manifest/748a9d50-5a3a-440e-ab9d-567dd68b6abb.json': { provider:'Bodleian Libraries' },
//   'https://iiif.bodleian.ox.ac.uk/iiif/manifest/79a953b7-40db-4ca0-a781-0f1f5df1b2a6.json': { provider:'Bodleian Libraries' },
//   'https://scta.info/iiif/nhyjhg/cod-yu78uh/manifest': { provider:'SCTA' },
//   'https://www.wdl.org/en/item/10690/manifest': { provider:'Biblioteca Nazionale Vittorio Emanuele III di Napoli' },
//   'https://gallica.bnf.fr/iiif/ark:/12148/btv1b525002505/manifest.json': { provider:'Bibliothèque nationale de France' },
//   'https://regisrob.fr/iiif/manifest/Dioscoride_Codex_vindobonensis.json': { provider:'regisrob.fr / Pl@ntUse images'},
//   'https://demos.biblissima.fr/iiif/metadata/florus-dispersus/manifest.json': { provider:'Biblissima'},
//   'https://manifests.britishart.yale.edu/Osbornfa1': { provider:'Yale University' },
//   'https://iiif.bodleian.ox.ac.uk/iiif/manifest/b924ffc6-3b6d-40d7-99c3-f11a86f456df.json': { provider:'Bodleian Libraries' },
//   'https://www.wdl.org/en/item/20149/manifest': { provider:'Biblioteca Nazionale Vittorio Emanuele III di Napoli' },
//   'https://digi.vatlib.it/iiif/MSS_Vat.lat.3225/manifest.json': { provider:'Biblioteca Apostolica Vaticana' },
//   'https://demos.biblissima.fr/iiif/metadata/BVMM/chateauroux/manifest.json': { provider:'Biblissima'},
//   'https://purl.stanford.edu/hs631zg4177/iiif/manifest': { provider:'Stanford University Libraries' },
//   'https://iiif.durham.ac.uk/manifests/trifle/32150/t1/mz/02/t1mz029p473h/manifest': { provider:'Durham Cathedral Library' },
//   'https://gallica.bnf.fr/iiif/ark:/12148/btv1b10500687r/manifest.json': { provider:'Bibliothèque nationale de France' },
//   'https://iiif.lib.harvard.edu/manifests/drs:5981093': { provider:'Harvard University' },
//   'https://librarylabs.ed.ac.uk/iiif/manifest/mahabharataFinal.json': { provider:'University of Edinburgh'}
// });

// demo demos.biblissima.fr
// config.windows.push(
//   {
//     manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/a4b2100c-003f-4868-8587-bc39b685ee47.json',
//     canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/3021e338-c998-4696-b81c-477a0fdd6c60.json',
//     //canvasIndex: 313,
//     thumbnailNavigationPosition: 'off',
//   },
//   {
//     manifestId: 'https://data.getty.edu/museum/api/iiif/1570/manifest.json',
//     thumbnailNavigationPosition: 'off',
//   },
//   {
//     manifestId: 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b52500984v/manifest.json',
//     canvasId: 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b10507217r/canvas/f30',
//     //canvasIndex: 190,
//     thumbnailNavigationPosition: 'off',
//   },
//   {
//     manifestId: 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b8427228j/manifest.json',
//     canvasId: 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b520004567/canvas/f405',
//     //canvasIndex: 219,
//     thumbnailNavigationPosition: 'off',
//   },
// );

Mirador.viewer(config, [
  miradorDownloadDialogPlugin,
  miradorDownloadPlugin,
  ...miradorImageToolsPlugin,
]);
