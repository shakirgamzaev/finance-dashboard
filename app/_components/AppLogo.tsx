"use client";
import { useEffect, useRef } from "react";

interface Props {
  width: number;
  height: number;
  className: string
}

function toRadians(degrees: number) {
  return (Math.PI / 180) * degrees;
}

function setCorrectPixels(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
) {
  const dpr = window.devicePixelRatio || 1;

  // the props are the logical (CSS) size; scale the buffer up for retina
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  // get the context AFTER resizing (resizing clears all context state)
  const ctx = canvas.getContext("2d");
  // scale so all drawing uses CSS logical-pixel coordinates
  ctx?.scale(dpr, dpr);

  // hand back the scaled context + logical size to draw with
  return { ctx, width: cssWidth, height: cssHeight };
}

export default function AppLogo({ width, height, className }: Props) {
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasElement.current;
    if (!canvas) return;

    const {
      ctx,
      width: logicalWidth,
      height: logicalHeight,
    } = setCorrectPixels(canvas, width, height);
    if (!ctx) return;

    // set canvas to use the cartesian coordinate system from now on
    ctx.translate(0, logicalHeight);
    ctx.scale(1, -1);

    // pick how far the ring reaches from its center (its outer edge)
    const outerRadius = Math.min(logicalHeight / 2, 30);

    // clamp thickness so the inner hole never collapses:
    // capping lineWidth at 60% of outerRadius keeps at least ~40% as a hole
    const desiredLineWidth = 11;
    const lineWidth = Math.min(desiredLineWidth, outerRadius * 0.6);

    // centerline radius: pull in by half the stroke so the outer edge lands
    // exactly at `outerRadius` (no edge clipping)
    const radius = outerRadius - lineWidth / 2;

    // pad reachable edges by `outerRadius` so the stroke stays fully inside
    const centerX = outerRadius;
    const centerY = logicalHeight / 2;

    //draw the logo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRadians(90), toRadians(-180), true);
    ctx.strokeStyle = `rgb(255 255 255)`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    //draw "Finance" text
    const text = "Finance";
    const gap = 14;
    // the ring's bounding circle spans x = 0 .. 2 * outerRadius, so text
    // starts `gap` logical units past the ring's right edge
    const textStartX = outerRadius * 2 + gap;
    // the text fills whatever width is left in the canvas
    const availableTextWidth = logicalWidth - textStartX;

    // text would render upside-down in the y-flipped cartesian system,
    // so locally undo the flip back to a top-left, y-down system
    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(0, -logicalHeight);

    // measure at a reference size, then scale the font so the text width
    // exactly fills the remaining width
    const referenceFontSize = 100;
    ctx.font = `${referenceFontSize}px sans-serif`;
    const measuredWidth = ctx.measureText(text).width;
    const fontSize = referenceFontSize * (availableTextWidth / measuredWidth);
    ctx.font = `${fontSize}px sans-serif`;

    ctx.fillStyle = `rgb(255 255 255)`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, textStartX, logicalHeight / 2);
    ctx.restore();
  }, [width, height]);

  // `width`/`height` props set the CSS display size in CSS pixels
  return <canvas ref={canvasElement} style={{ width, height }} className={className}></canvas>;
}
