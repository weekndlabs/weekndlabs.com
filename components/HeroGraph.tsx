'use client';

import { useEffect, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LinearFilter,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';

/**
 * What the hero is describing, drawn.
 *
 * Agents on the left, one gateway in the middle, tools on the right, and a
 * stream of requests flowing through it. That is Selat's flow, so the picture
 * carries the same claim as the paragraph beside it rather than decorating it.
 * See issue #29.
 *
 * The traffic is a particle field rather than a handful of dots on a line,
 * which is the one thing worth taking from the reference site: density reads as
 * a system under load, six dots read as a diagram.
 *
 * Named imports, not `import * as THREE`. The namespace form defeats webpack's
 * tree shaking and pulls loaders, controls and the whole material library into
 * the bundle for a scene made of spheres and points.
 */

const GATEWAY = new Vector3(0, 0, 0);

// Uneven y and z on purpose. A symmetric fan reads as a logo; a slightly
// irregular one reads as infrastructure.
const AGENTS = [
  new Vector3(-5.2, 2.7, -0.9),
  new Vector3(-5.2, 0.95, 0.7),
  new Vector3(-5.2, -0.95, -0.45),
  new Vector3(-5.2, -2.7, 0.8),
];

const TOOLS = [
  new Vector3(5.2, 3.0, 0.6),
  new Vector3(5.2, 1.5, -0.8),
  new Vector3(5.2, 0, 0.45),
  new Vector3(5.2, -1.5, -0.6),
  new Vector3(5.2, -3.0, 0.9),
];

const PARTICLES = 950;

/** How much of each end of a path the request fades in and out over. */
const FADE = 0.12;

/**
 * A white radial fade, for anything that has to be round and soft.
 *
 * White because every material here multiplies it by a colour of its own. The
 * particles take a tight falloff and read as dots; the gateway glow takes a
 * long one and reads as light. A sphere cannot do the second: it has a hard
 * silhouette, which drew two visible concentric discs.
 */
function radialTexture(stops: [number, number][]): CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [offset, alpha] of stops) {
      gradient.addColorStop(offset, `rgba(255,255,255,${alpha})`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  // No mipmaps. A scaled-down level averages the transparent corners into the
  // edge and leaves a faint square outline around the glow, which is visible on
  // the dark theme.
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  return texture;
}

/**
 * A design token, in a form WebGL will take.
 *
 * The package emits `oklch()`. THREE.Color cannot parse it, warns, and leaves
 * the material white, which is how the first version of this looked: white
 * blobs on an off-white page.
 *
 * Assigning it to fillStyle and reading the property back does not fix it,
 * because Chrome serialises `oklch()` as `oklch()`. Painting one pixel and
 * reading it does: getImageData always answers in sRGB bytes, whatever colour
 * space went in. An unparseable value leaves the fallback in place.
 */
function tokenColor(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!ctx || !raw) return fallback;
  ctx.fillStyle = fallback;
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  // Indexed, not destructured: tsconfig sets no `target`, so it defaults to ES5
  // and TS refuses to iterate a Uint8ClampedArray.
  const px = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${px[0]}, ${px[1]}, ${px[2]})`;
}

export default function HeroGraph() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      // No WebGL context. The hero copy stands on its own, so leaving the box
      // empty beats shipping a broken-image placeholder.
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 15.5);

    const graph = new Group();
    scene.add(graph);

    const nodeMaterial = new MeshBasicMaterial();
    const gatewayMaterial = new MeshBasicMaterial();
    const edgeMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.16 });

    const nodeGeometry = new SphereGeometry(0.15, 20, 20);
    const gatewayGeometry = new SphereGeometry(0.44, 28, 28);

    const dot = radialTexture([[0, 1], [0.4, 0.9], [1, 0]]);
    const glow = radialTexture([[0, 0.8], [0.3, 0.32], [0.65, 0.07], [1, 0]]);

    for (const position of [...AGENTS, ...TOOLS]) {
      const node = new Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      graph.add(node);
    }

    const gateway = new Mesh(gatewayGeometry, gatewayMaterial);
    graph.add(gateway);

    // Two sprites instead of a bloom pass: a post-processing chain for one glow
    // would cost more than the whole rest of this scene. depthWrite off, or the
    // glow punches a hole in the traffic passing behind it, which is exactly
    // what the sphere version did.
    const haloMaterial = new SpriteMaterial({ map: glow, transparent: true, opacity: 0.42, depthWrite: false });
    const wideHaloMaterial = new SpriteMaterial({ map: glow, transparent: true, opacity: 0.16, depthWrite: false });
    const halo = new Sprite(haloMaterial);
    halo.scale.setScalar(4.4);
    const wideHalo = new Sprite(wideHaloMaterial);
    wideHalo.scale.setScalar(8.2);
    graph.add(halo, wideHalo);

    const edgeGeometry = new BufferGeometry();
    edgeGeometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        [
          ...AGENTS.flatMap((a) => [a.x, a.y, a.z, GATEWAY.x, GATEWAY.y, GATEWAY.z]),
          ...TOOLS.flatMap((t) => [GATEWAY.x, GATEWAY.y, GATEWAY.z, t.x, t.y, t.z]),
        ],
        3
      )
    );
    graph.add(new LineSegments(edgeGeometry, edgeMaterial));

    // One request per particle: which agent it came from, which tool it is
    // headed for, how fast, where in the journey it started, and how far off the
    // straight line it drifts. Fixed at setup, so the frame loop only lerps.
    const traffic = Array.from({ length: PARTICLES }, (_, i) => ({
      from: AGENTS[i % AGENTS.length],
      to: TOOLS[i % TOOLS.length],
      speed: 0.1 + Math.random() * 0.11,
      phase: Math.random(),
      drift: new Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 1.15,
        (Math.random() - 0.5) * 1.15
      ),
    }));

    // BufferAttribute, not Float32BufferAttribute. The typed subclass runs
    // `new Float32Array(array)` on whatever it is handed, so writes to the array
    // you passed in land on a copy nothing uploads.
    const trafficPosition = new BufferAttribute(new Float32Array(PARTICLES * 3), 3);
    const trafficColor = new BufferAttribute(new Float32Array(PARTICLES * 3), 3);
    const trafficGeometry = new BufferGeometry();
    trafficGeometry.setAttribute('position', trafficPosition);
    trafficGeometry.setAttribute('color', trafficColor);

    const trafficMaterial = new PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      map: dot,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });
    const trafficCloud = new Points(trafficGeometry, trafficMaterial);
    // The bounding sphere is computed once, from positions that are all zero at
    // that point, and never recomputed as the particles travel.
    trafficCloud.frustumCulled = false;
    graph.add(trafficCloud);

    const brand = new Color();
    const ground = new Color();
    const tint = new Color();

    const paintTokens = () => {
      brand.set(tokenColor('--wl-ring', '#3b82f6'));
      // Particles fade by being mixed toward the page rather than by alpha:
      // PointsMaterial has one opacity for the whole cloud, and the background
      // is a known opaque colour, so this reads identically and costs nothing.
      ground.set(tokenColor('--wl-background', '#fafafa'));
      const ink = tokenColor('--wl-muted-foreground', '#71717a');
      nodeMaterial.color.set(ink);
      // Not --wl-border. That token is a hairline against a solid surface and
      // disappears into the page at this size.
      edgeMaterial.color.set(ink);
      gatewayMaterial.color.copy(brand);
      haloMaterial.color.copy(brand);
      wideHaloMaterial.color.copy(brand);
    };
    paintTokens();

    // The toggle flips data-theme on <html>, so every token under it changes
    // without a remount. Without this the graph keeps the palette it booted on.
    const themeWatcher = new MutationObserver(paintTokens);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const resize = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const sizeWatcher = new ResizeObserver(resize);
    sizeWatcher.observe(el);
    resize();

    // Where the pointer wants the graph, and where it currently is. Easing the
    // second toward the first is what keeps it from snapping.
    const aim = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const track = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      aim.x = ((e.clientX - box.left) / box.width - 0.5) * 2;
      aim.y = ((e.clientY - box.top) / box.height - 0.5) * 2;
    };
    const release = () => {
      aim.x = 0;
      aim.y = 0;
    };
    el.addEventListener('pointermove', track);
    el.addEventListener('pointerleave', release);

    const at = new Vector3();

    const drawAt = (seconds: number) => {
      eased.x += (aim.x - eased.x) * 0.05;
      eased.y += (aim.y - eased.y) * 0.05;

      graph.rotation.y = Math.sin(seconds * 0.22) * 0.16 + eased.x * 0.3;
      graph.rotation.x = Math.sin(seconds * 0.16) * 0.07 + eased.y * 0.16;
      gateway.scale.setScalar(1 + Math.sin(seconds * 1.6) * 0.06);
      halo.scale.setScalar(4.4 * (1 + Math.sin(seconds * 1.6 + 0.6) * 0.06));
      wideHalo.scale.setScalar(8.2 * (1 + Math.sin(seconds * 1.1 + 1.2) * 0.05));

      const positions = trafficPosition.array as Float32Array;
      const colors = trafficColor.array as Float32Array;

      for (let i = 0; i < PARTICLES; i += 1) {
        const request = traffic[i];
        const journey = (seconds * request.speed + request.phase) % 1;
        // First half of the journey is agent to gateway, second half is gateway
        // to tool, so every particle actually passes through the middle.
        const leg = journey < 0.5;
        const local = leg ? journey * 2 : (journey - 0.5) * 2;
        at.lerpVectors(leg ? request.from : GATEWAY, leg ? GATEWAY : request.to, local);
        // Drift peaks mid-leg and vanishes at both ends, so streams have body
        // in between and still converge exactly on the nodes.
        at.addScaledVector(request.drift, Math.sin(local * Math.PI));
        at.toArray(positions, i * 3);

        // Fade in leaving the agent and out arriving at the tool. Nothing pops.
        const presence = Math.min(1, journey / FADE, (1 - journey) / FADE);
        tint.copy(ground).lerp(brand, presence);
        tint.toArray(colors, i * 3);
      }

      trafficPosition.needsUpdate = true;
      trafficColor.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;

    const loop = () => {
      frame = requestAnimationFrame(loop);
      drawAt(performance.now() / 1000);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    // Three conditions gate the loop, and any one of them is enough to stop it:
    // a reduced-motion preference, a hidden tab, and a canvas scrolled past.
    const settle = () => {
      const shouldRun = visible && !document.hidden && !stillness.matches;
      if (shouldRun && !frame) loop();
      if (!shouldRun) {
        stop();
        drawAt(0);
      }
    };

    const viewWatcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      settle();
    });
    viewWatcher.observe(el);

    document.addEventListener('visibilitychange', settle);
    stillness.addEventListener('change', settle);
    settle();

    return () => {
      stop();
      el.removeEventListener('pointermove', track);
      el.removeEventListener('pointerleave', release);
      document.removeEventListener('visibilitychange', settle);
      stillness.removeEventListener('change', settle);
      viewWatcher.disconnect();
      sizeWatcher.disconnect();
      themeWatcher.disconnect();
      nodeGeometry.dispose();
      gatewayGeometry.dispose();
      edgeGeometry.dispose();
      trafficGeometry.dispose();
      dot.dispose();
      glow.dispose();
      nodeMaterial.dispose();
      gatewayMaterial.dispose();
      haloMaterial.dispose();
      wideHaloMaterial.dispose();
      edgeMaterial.dispose();
      trafficMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      role="img"
      aria-label="Agents on the left send a steady stream of requests through a single gateway to the tools on the right."
      className="h-full w-full"
    />
  );
}
