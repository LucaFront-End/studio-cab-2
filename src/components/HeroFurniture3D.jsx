import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './HeroFurniture3D.css';

// Global cache for loaded GLTF scenes to ensure models are never missing and load instantly
const MODEL_CACHE = {
  sofa: null,
  chairSheen: null,
  chairOval: null
};

export default function HeroFurniture3D({ scrollProgress = 0 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const engineRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    animId: null,
    groundY: -0.32,
    // 4 Pieces of the Living Room ("Sala de estar")
    // Separated generously to prevent collisions, scaled larger for prominent screen presence:
    // 0: Curved velvet sofa (Center Back)
    // 1: Sheen Nordic chair (Right, angled towards center table)
    // 2: Damask capitoné armchair (Left, angled towards center table)
    // 3: Fluted American walnut & brass coffee table (Center Middle)
    pieces: [
      { name: 'sofa', group: null, shadow: null, targetPos: new THREE.Vector3(0, -0.32, -1.15), startPos: new THREE.Vector3(0, -0.32, -0.15), targetRot: new THREE.Euler(0.04, 0, 0), scale: 1.38 },
      { name: 'chairSheen', group: null, shadow: null, targetPos: new THREE.Vector3(1.68, -0.32, 0.08), targetRot: new THREE.Euler(0.04, -0.62, 0.02), scale: 1.22 },
      { name: 'chairOval', group: null, shadow: null, targetPos: new THREE.Vector3(-1.68, -0.32, 0.08), targetRot: new THREE.Euler(0.04, 0.62, -0.02), scale: 1.22 },
      { name: 'table', group: null, shadow: null, targetPos: new THREE.Vector3(0, -0.32, 0.24), targetRot: new THREE.Euler(0.02, 0.45, 0), scale: 1.12 }
    ],
    scrollProgress: 0,
    currentProgress: 0,
    isDragging: false,
    dragRotY: 0,
    targetDragRotY: 0,
    prevPointerX: 0,
    mouseTargetX: 0,
    mouseTargetY: 0,
    mouseCurrentX: 0,
    mouseCurrentY: 0
  });

  // Sync scroll progress
  useEffect(() => {
    engineRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;
    const engine = engineRef.current;
    window.__DEBUG_3D = engine;
    const isMobile = width < 768;

    // Mobile adjustments: separated non-colliding layout tailored for portrait viewports
    if (isMobile) {
      engine.pieces[0].targetPos.set(0, -0.28, -0.95);
      engine.pieces[0].startPos.set(0, -0.28, -0.20);
      engine.pieces[0].scale = 0.95;

      engine.pieces[1].targetPos.set(0.92, -0.28, -0.05);
      engine.pieces[1].targetRot.set(0.04, -0.65, 0);
      engine.pieces[1].scale = 0.88;

      engine.pieces[2].targetPos.set(-0.92, -0.28, -0.05);
      engine.pieces[2].targetRot.set(0.04, 0.65, 0);
      engine.pieces[2].scale = 0.88;

      engine.pieces[3].targetPos.set(0, -0.28, 0.32);
      engine.pieces[3].targetRot.set(0.02, 0.45, 0);
      engine.pieces[3].scale = 0.82;
      engine.groundY = -0.28;
    }

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0, isMobile ? 0.58 : 0.52, isMobile ? 5.2 : 4.15);

    // 2. Renderer with 100% Transparent Background & PBR Studio Settings
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 3. Studio Environment Map for Velvet, Wood & Brass Highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();

    // 4. Soft Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f2ff, 1.4);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffaa40, 1.25);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // Helper: Procedural Soft Ground Shadow Texture
    const createShadowMesh = (radius) => {
      const sCanvas = document.createElement('canvas');
      sCanvas.width = 128;
      sCanvas.height = 128;
      const ctx = sCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
      grad.addColorStop(0, 'rgba(25, 20, 15, 0.44)');
      grad.addColorStop(0.4, 'rgba(25, 20, 15, 0.22)');
      grad.addColorStop(0.8, 'rgba(25, 20, 15, 0.05)');
      grad.addColorStop(1, 'rgba(25, 20, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(sCanvas);
      const geo = new THREE.PlaneGeometry(radius, radius);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = engine.groundY - 0.005;
      scene.add(mesh);
      return mesh;
    };

    engine.pieces[0].shadow = createShadowMesh(isMobile ? 2.5 : 3.4);
    engine.pieces[1].shadow = createShadowMesh(isMobile ? 1.2 : 1.55);
    engine.pieces[2].shadow = createShadowMesh(isMobile ? 1.2 : 1.55);
    engine.pieces[3].shadow = createShadowMesh(isMobile ? 1.1 : 1.45);

    engine.scene = scene;
    engine.camera = camera;
    engine.renderer = renderer;

    // 5. Build Architectural Coffee Table with Lambrín Wood Fluting (Piece 3)
    const buildCoffeeTable = () => {
      const group = new THREE.Group();

      const walnutMat = new THREE.MeshStandardMaterial({
        color: 0x422616,
        roughness: 0.32,
        metalness: 0.04
      });

      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.95
      });

      // Beveled Disc Tabletop
      const topGeo = new THREE.CylinderGeometry(0.54, 0.57, 0.045, 48);
      const topMesh = new THREE.Mesh(topGeo, walnutMat);
      topMesh.position.y = 0.38;
      group.add(topMesh);

      // Gold Brass Inset Ring
      const ringGeo = new THREE.TorusGeometry(0.55, 0.012, 16, 48);
      const ringMesh = new THREE.Mesh(ringGeo, brassMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.38;
      group.add(ringMesh);

      // Slatted / Lambrín Fluted Pedestal Base Core
      const baseGeo = new THREE.CylinderGeometry(0.23, 0.25, 0.36, 32);
      const baseMesh = new THREE.Mesh(baseGeo, walnutMat);
      baseMesh.position.y = 0.18;
      group.add(baseMesh);

      // 20 Individual Vertical Lambrín Slats
      const slatGeo = new THREE.BoxGeometry(0.016, 0.35, 0.024);
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const slatMesh = new THREE.Mesh(slatGeo, walnutMat);
        const radius = 0.245;
        slatMesh.position.set(Math.cos(angle) * radius, 0.18, Math.sin(angle) * radius);
        slatMesh.rotation.y = -angle;
        group.add(slatMesh);
      }

      // Bottom Brass Base Ring
      const footGeo = new THREE.CylinderGeometry(0.28, 0.29, 0.025, 32);
      const footMesh = new THREE.Mesh(footGeo, brassMat);
      footMesh.position.y = 0.0125;
      group.add(footMesh);

      return group;
    };

    const tableGroup = buildCoffeeTable();
    tableGroup.position.set(0, -3.8, 0);
    tableGroup.scale.setScalar(0.001);
    scene.add(tableGroup);
    engine.pieces[3].group = tableGroup;

    // 6. Asynchronously Load GLB Models with caching & frustumCulled=false to prevent any missing pieces
    const gltfLoader = new GLTFLoader();
    let loadedCount = 1; // Table is already built

    const checkReady = () => {
      loadedCount++;
      if (loadedCount >= 4) {
        setLoading(false);
      }
    };

    // Helper: Normalize & Add Model Group with true ground alignment and culling protections
    const setupModel = (root, pieceIdx, isSofa = false) => {
      // Remove lights or camera objects from external models
      const toRemove = [];
      root.traverse((child) => {
        if (child.isLight || (child.type && child.type.includes('Light'))) {
          toRemove.push(child);
        } else if (child.isMesh) {
          // CRITICAL: Disable frustum culling to guarantee meshes never disappear unexpectedly
          child.frustumCulled = false;

          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (!mat) return;
            mat.side = THREE.DoubleSide; // Render both front & back faces
            mat.envMapIntensity = 1.35;
            mat.needsUpdate = true;

            // Material color refinement for the luxury curved velvet sofa
            if (isSofa) {
              const nameLower = (child.name || '').toLowerCase() + ' ' + (mat.name || '').toLowerCase();
              if (nameLower.includes('fabric')) {
                // Warm champagne/ivory architectural velvet
                mat.color.set(0xdfd3c3);
                mat.roughness = 0.65;
                mat.metalness = 0.0;
              } else if (nameLower.includes('legs')) {
                // Dark walnut wood
                mat.color.set(0x2a1d17);
                mat.roughness = 0.35;
              } else if (nameLower.includes('feet')) {
                // Polished brass tips
                mat.color.set(0xd4af37);
                mat.roughness = 0.2;
                mat.metalness = 0.95;
              }
            }
          });
        }
      });
      toRemove.forEach((c) => c.parent && c.parent.remove(c));

      // Measure raw metric bounds
      const box = new THREE.Box3().setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());

      // Center horizontally (X & Z) and align lowest point of feet to Y = 0
      const pivot = new THREE.Group();
      root.position.set(-center.x, -box.min.y, -center.z);
      pivot.add(root);

      // Start below viewport
      pivot.position.set(0, -3.8, 0);
      pivot.scale.setScalar(0.001);
      scene.add(pivot);

      engine.pieces[pieceIdx].group = pivot;
      checkReady();
    };

    // Model 0: Glam Velvet Sofa
    if (MODEL_CACHE.sofa) {
      setupModel(MODEL_CACHE.sofa.clone(), 0, true);
    } else {
      gltfLoader.load(
        '/models/glam-velvet-sofa.glb',
        (gltf) => {
          MODEL_CACHE.sofa = gltf.scene;
          setupModel(gltf.scene, 0, true);
        },
        undefined,
        (err) => {
          console.warn('Fallback sofa', err);
          gltfLoader.load('/models/sheen-wood-sofa.glb', (g2) => {
            setupModel(g2.scene, 0, false);
          });
        }
      );
    }

    // Model 1: Sheen Nordic Chair (Terracotta Mango Velvet & Oak)
    if (MODEL_CACHE.chairSheen) {
      setupModel(MODEL_CACHE.chairSheen.clone(), 1, false);
    } else {
      gltfLoader.load(
        '/models/sheen-chair.glb',
        (gltf) => {
          MODEL_CACHE.chairSheen = gltf.scene;
          setupModel(gltf.scene, 1, false);
        },
        undefined,
        (err) => {
          console.error('[HeroFurniture3D] Error loading sheen-chair:', err);
        }
      );
    }

    // Model 2: Capitoné Damask Armchair
    if (MODEL_CACHE.chairOval) {
      setupModel(MODEL_CACHE.chairOval.clone(), 2, false);
    } else {
      gltfLoader.load(
        '/models/chair-damask.glb',
        (gltf) => {
          MODEL_CACHE.chairOval = gltf.scene;
          setupModel(gltf.scene, 2, false);
        },
        undefined,
        (err) => {
          console.error('[HeroFurniture3D] Error loading chair-damask:', err);
        }
      );
    }

    // 7. Animation Loop (Smooth 60FPS)
    const clock = new THREE.Clock();

    const animate = () => {
      engine.animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth scroll progress interpolation
      engine.currentProgress += (engine.scrollProgress - engine.currentProgress) * 0.08;
      const prog = engine.currentProgress;

      // Smooth cursor parallax & drag interpolation
      engine.mouseCurrentX += (engine.mouseTargetX - engine.mouseCurrentX) * 0.05;
      engine.mouseCurrentY += (engine.mouseTargetY - engine.mouseCurrentY) * 0.05;
      engine.dragRotY += (engine.targetDragRotY - engine.dragRotY) * 0.08;

      camera.position.x = engine.mouseCurrentX * 0.25;
      camera.position.y = (isMobile ? 0.58 : 0.52) - engine.mouseCurrentY * 0.15;
      camera.lookAt(0, -0.05, 0);

      // Subtle ambient hovering waves
      const hoverY0 = Math.sin(elapsed * 1.3) * 0.02;
      const hoverY1 = Math.sin(elapsed * 1.5 + 1.2) * 0.025;
      const hoverY2 = Math.sin(elapsed * 1.2 + 2.5) * 0.025;
      const hoverY3 = Math.sin(elapsed * 1.1 + 3.8) * 0.015;
      const hovers = [hoverY0, hoverY1, hoverY2, hoverY3];

      const groundY = engine.groundY;

      // Sequential Arrival Windows:
      // Piece 0 (Sofa): Always visible. Glides back as other pieces arrive.
      // Piece 1 (Sheen Chair): Rises between prog 0.08 and 0.38 into right side.
      // Piece 2 (Capitoné Chair): Rises between prog 0.38 and 0.68 into left side.
      // Piece 3 (Coffee Table): Rises between prog 0.68 and 0.92 right into center.
      // At prog >= 0.92: The 4 pieces remain fully assembled, floating peacefully in place (no upward disappearance).
      const pieceWindows = [
        [0.00, 0.08],
        [0.08, 0.38],
        [0.38, 0.68],
        [0.68, 0.92]
      ];

      engine.pieces.forEach((piece, idx) => {
        if (!piece.group) return;

        if (idx === 0) {
          // Sofa is ALWAYS visible and floating peacefully from start
          piece.group.visible = true;
          const sofaGlide = Math.min(1, Math.max(0, prog / 0.38));
          const easeGlide = sofaGlide * sofaGlide * (3 - 2 * sofaGlide);
          const curZ = piece.startPos.z + (piece.targetPos.z - piece.startPos.z) * easeGlide;
          const curY = groundY + hovers[0];

          piece.group.position.set(piece.targetPos.x, curY, curZ);
          piece.group.rotation.set(piece.targetRot.x, piece.targetRot.y + engine.dragRotY, piece.targetRot.z);
          piece.group.scale.setScalar(piece.scale);

          if (piece.shadow) {
            piece.shadow.position.set(piece.targetPos.x, groundY - 0.005, curZ);
            piece.shadow.material.opacity = 0.44;
          }
          return;
        }

        const [startP, endP] = pieceWindows[idx];
        const t = Math.min(1, Math.max(0, (prog - startP) / (endP - startP)));
        const ease = t * t * (3 - 2 * t);

        if (t <= 0.001) {
          piece.group.visible = false;
          piece.group.position.y = -3.8;
          if (piece.shadow) piece.shadow.material.opacity = 0;
        } else {
          piece.group.visible = true;

          // Ascend from below the floor (-3.2) to ground level, and stay permanently
          const startY = -3.2;
          const targetY = groundY + hovers[idx];
          const curY = startY + (targetY - startY) * ease;

          // Smooth rotational entrance
          const rotOffset = idx === 1 ? 0.8 : idx === 2 ? -0.8 : 1.2;
          const startRotY = piece.targetRot.y + rotOffset;
          const curRotY = startRotY + (piece.targetRot.y - startRotY) * ease + engine.dragRotY;

          piece.group.position.set(piece.targetPos.x, curY, piece.targetPos.z);
          piece.group.rotation.set(piece.targetRot.x, curRotY, piece.targetRot.z);
          piece.group.scale.setScalar(piece.scale * Math.max(0.001, ease));

          // Contact floor shadow stays permanent when assembled
          if (piece.shadow) {
            piece.shadow.position.set(piece.targetPos.x, groundY - 0.005, piece.targetPos.z);
            piece.shadow.material.opacity = ease * (idx === 3 ? 0.32 : 0.36);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (engine.animId) cancelAnimationFrame(engine.animId);
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  // Pointer & Drag Handlers for 360° Inspection
  const handlePointerDown = (e) => {
    const engine = engineRef.current;
    engine.isDragging = true;
    engine.prevPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerMove = (e) => {
    const engine = engineRef.current;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const w = window.innerWidth;
    const h = window.innerHeight;
    engine.mouseTargetX = (clientX / w - 0.5) * 2;
    engine.mouseTargetY = (clientY / h - 0.5) * 2;

    if (!engine.isDragging) return;
    const deltaX = clientX - engine.prevPointerX;
    engine.targetDragRotY += deltaX * 0.006;
    engine.prevPointerX = clientX;
  };

  const handlePointerUp = () => {
    engineRef.current.isDragging = false;
  };

  return (
    <div
      ref={containerRef}
      className="hero-3d-floating-wrapper"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* 100% Transparent WebGL Canvas */}
      <canvas ref={canvasRef} className="hero-3d-floating-canvas" />

      {/* Loading Indicator */}
      <div className={`hero-3d-floating-loader ${loading ? '' : 'hidden'}`}>
        <div className="hero-3d-floating-spinner" />
        <span className="hero-3d-floating-txt">Cargando Sala de Estar 3D...</span>
      </div>
    </div>
  );
}

