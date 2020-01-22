import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';
import * as d3 from 'd3';
import 'dagre-d3/dist/dagre-d3';

/**
 * `<dagre-d3-component>` Web Component wrapper for Dagre D3
 *
 * ```html
 * <dagre-d3-component></dagre-d3-component>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--dagre-d3-width` | Width of SVG | `500px`
 * `--dagre-d3-height` | Height of SVG | `500px`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `svg` | SVG element used for rendering the graph
 *
 * @memberof Vaadin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @demo demo/index.html
 */
class DagreD3Component extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;

          --dagre-d3-width: 500px;
          --dagre-d3-height: 500px;
        }
        svg {
          width: var(--dagre-d3-width);
          height: var(--dagre-d3-height);
          overflow: hidden;
        }
      </style>

      <div class="card">
        <svg id="svg"><g id="inner" /></svg>
      </div>
    `;
  }

  static get is() {
    return 'dagre-d3-component';
  }

  static get version() {
    return '0.1.0';
  }

  static get properties() {
    return {};
  }

  ready() {
    super.ready();
    const svg = d3.select(this.$.svg);
    const inner = d3.select(this.$.inner);
    const zoom = d3.zoom().on('zoom', () => {
      inner.attr('transform', d3.event.transform);
    });

    svg.call(zoom);

    // Create and configure the renderer
    const render = dagreD3.render();

    // Create the input graph
    const g = new dagreD3.graphlib.Graph().setGraph({});

    // Add nodes and edges
    // json.nodes.forEach(node => g.setNode(node.id, { ...node }));
    // json.edges.forEach(edge => g.setEdge(edge.from, edge.to, { ...edge }));

    // Set margins, if not present
    if (!g.graph().hasOwnProperty('marginx') && !g.graph().hasOwnProperty('marginy')) {
      g.graph().marginx = 20;
      g.graph().marginy = 20;
    }

    g.graph().transition = selection => {
      return selection.transition().duration(500);
    };

    // Render the graph into svg g
    d3.select(this.$.inner).call(render, g);
  }
}

customElements.define(DagreD3Component.is, DagreD3Component);

/**
 * @namespace Vaadin
 */
window.Vaadin.DagreD3Component = DagreD3Component;
