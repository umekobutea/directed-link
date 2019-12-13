const arrow = (ctx, x, y, size, dir) => {
  const a = size / 2;
  const [x1, x2] = dir === 'left' ? [x - a, x + a] : [x + a, x - a];
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y - a);
  ctx.lineTo(x2, y + a);
  ctx.fill();
};

registerPaint(
  'directed-link',
  class {
    static get inputProperties() {
      return ['--directed-link-anchor-size', '--directed-link-color'];
    }

    static get inputArguments() {
      return ['top | bottom | none', 'right | left | none'];
    }

    paint(ctx, size, properties, args) {
      ctx.lineWidth = 1;
      ctx.fillStyle = properties.get('--directed-link-color');
      const anchorSize = properties.get('--directed-link-anchor-size').value;
      const o = anchorSize / 2;
      const w = size.width - o;
      const h = size.height - o;
      const v = String(args[0]);
      const s = String(args[1]);

      const [x1, x2] = s === 'left' ? [w, o] : [o, w];
      const [y1, y2] = v === 'top' ? [h, o] : [o, h];

      if (v !== 'none' && s !== 'none') {
        const [cx1, cy1, cx2, cy2] = [x2, y1, x1, y2];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
        ctx.stroke();

        arrow(ctx, x2, y2, anchorSize, s);
      }
      ctx.beginPath();
      ctx.arc(x1, y1, o, 0, 2 * Math.PI);
      ctx.fill();
    }
  },
);
