declare module 'react-cytoscapejs' {
  import Cytoscape from 'cytoscape';
  import { Component } from 'react';

  interface CytoscapeComponentProps {
    elements?: Cytoscape.ElementDefinition[];
    stylesheet?: Cytoscape.Stylesheet[] | Cytoscape.StylesheetCSS[];
    style?: React.CSSProperties;
    cy?: (cy: Cytoscape.Core) => void;
    layout?: Cytoscape.LayoutOptions;
    pan?: Cytoscape.Position;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    autoungrabify?: boolean;
    autounselectify?: boolean;
    boxSelectionEnabled?: boolean;
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
