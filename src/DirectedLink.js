import { html, css, LitElement } from 'lit-element';

CSS.registerProperty({
  name: '--directed-link-color',
  syntax: '<color>',
  initialValue: 'rgba(0,0,0,1)',
  inherits: false,
});
CSS.registerProperty({
  name: '--directed-link-anchor-size',
  syntax: '<length>',
  initialValue: '0px',
  inherits: false,
});
CSS.paintWorklet.addModule('../src/DirectedLinkWorklet.js');
export class DirectedLink extends LitElement {
  static get styles() {
    return css`
      :host {
        position: absolute;
        --directed-link-anchor-size: 6px;
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      start: {
        type: Object,
        reflect: true,
        converter: {
          fromAttribute: value => {
            const [x, y] = value.split(' ');
            return { x: Number(x), y: Number(y) };
          },
          toAttribute: value => `${value.x} ${value.y}`,
        },
      },
      end: {
        type: Object,
        reflect: true,
        converter: {
          fromAttribute: value => {
            const [x, y] = value.split(' ');
            return { x: Number(x), y: Number(y) };
          },
          toAttribute: value => `${value.x} ${value.y}`,
        },
      },
    };
  }

  constructor() {
    super();
    this.start = { x: 0, y: 0 };
    this.end = { x: 0, y: 0 };
  }

  render() {
    return html`
      ${this.instanceStyles}
    `;
  }

  get rect() {
    const anchorSize = this.computedStyleMap().get('--directed-link-anchor-size').value;
    const o = anchorSize / 2;
    if (this.start.x === this.end.x && this.start.y === this.end.y) {
      return {
        x: this.start.x - o,
        y: this.start.y - o,
        width: anchorSize,
        height: anchorSize,
      };
    }
    return {
      x: this.start.x < this.end.x ? this.start.x - o : this.end.x,
      y: Math.min(this.start.y, this.end.y) - o,
      width: Math.abs(this.start.x - this.end.x) + o,
      height: Math.abs(this.start.y - this.end.y) + o + o,
    };
  }

  get instanceStyles() {
    const { x, y, width, height } = this.rect;
    let s = this.start.x > this.end.x ? 'left' : 'right';
    let v = this.start.y > this.end.y ? 'top' : 'bottom';
    if (this.start.x === this.end.x && this.start.y === this.end.y) {
      s = 'none';
      v = 'none';
    }
    return html`
      <style>
        :host {
          left: ${x}px;
          top: ${y}px;
          width: ${width}px;
          height: ${height}px;
          background-image: paint(directed-link, ${v}, ${s});
        }
      </style>
    `;
  }
}
