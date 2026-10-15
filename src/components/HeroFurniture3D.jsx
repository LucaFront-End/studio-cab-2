import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './HeroFurniture3D.css';


export default function HeroFurniture3D({ scrollProgress = 0 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const engineRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    animId: null,
    groundY: -0.40,
    // 4 Pieces of the Commercial Showroom ("Espacio Comercial")
    // Full grand scale:
    // 0: Curved velvet reception sofa (Center Back)
    // 1: Commercial retail shelving unit (Right, angled towards center)
    // 2: Architectural custom closet with fluted lambrín (Left, angled towards center)
    // 3: Fluted American walnut & brass coffee table (Center Front)
    pieces: [
      { name: 'sofa', group: null, shadow: null, targetPos: new THREE.Vector3(0, -0.40, -1.45), targetRot: new THREE.Euler(0.04, 0, 0), scale: 1.50 },
      { name: 'shelf', group: null, shadow: null, targetPos: new THREE.Vector3(2.10, -0.40, -0.10), targetRot: new THREE.Euler(0.04, -0.42, 0), scale: 1.20 },
      { name: 'closet', group: null, shadow: null, targetPos: new THREE.Vector3(-2.10, -0.40, -0.10), targetRot: new THREE.Euler(0.04, 0.42, 0), scale: 1.20 },
      { name: 'table', group: null, shadow: null, targetPos: new THREE.Vector3(0, -0.40, 0.42), targetRot: new THREE.Euler(0.02, 0.45, 0), scale: 1.26 }
    ],
    isDragging: false,
    dragRotY: 0,
    targetDragRotY: 0,
    prevPointerX: 0,
    mouseTargetX: 0,
    mouseTargetY: 0,
    mouseCurrentX: 0,
    mouseCurrentY: 0
  });

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
      engine.pieces[0].targetPos.set(0, -0.34, -1.40);
      engine.pieces[0].scale = 1.05;

      engine.pieces[1].targetPos.set(1.15, -0.34, -0.10);
      engine.pieces[1].targetRot.set(0.04, -0.38, 0);
      engine.pieces[1].scale = 0.84;

      engine.pieces[2].targetPos.set(-1.15, -0.34, -0.10);
      engine.pieces[2].targetRot.set(0.04, 0.38, 0);
      engine.pieces[2].scale = 0.84;

      engine.pieces[3].targetPos.set(0, -0.34, 0.44);
      engine.pieces[3].targetRot.set(0.02, 0.45, 0);
      engine.pieces[3].scale = 0.88;
      engine.groundY = -0.34;
    }

    // 1. Scene & Perspective Camera with generous presence for large prominent models
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    camera.position.set(0, isMobile ? 0.60 : 0.40, isMobile ? 6.2 : 4.70);

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

    engine.pieces[0].shadow = createShadowMesh(isMobile ? 2.8 : 3.6);
    engine.pieces[1].shadow = createShadowMesh(isMobile ? 1.4 : 1.7);
    engine.pieces[2].shadow = createShadowMesh(isMobile ? 1.6 : 1.9);
    engine.pieces[3].shadow = createShadowMesh(isMobile ? 1.25 : 1.55);

    engine.scene = scene;
    engine.camera = camera;
    engine.renderer = renderer;

    // 5a. Build Commercial Retail Shelving Unit / Estante Exhibidor (Piece 1)
    const buildCommercialShelf = () => {
      const group = new THREE.Group();

      const steelMat = new THREE.MeshStandardMaterial({
        color: 0x181818,
        roughness: 0.35,
        metalness: 0.85
      });

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

      const ceramicMat = new THREE.MeshStandardMaterial({
        color: 0xded8cf,
        roughness: 0.75,
        metalness: 0.0
      });

      const terracottaMat = new THREE.MeshStandardMaterial({
        color: 0xa8533b,
        roughness: 0.7,
        metalness: 0.0
      });

      const charcoalMat = new THREE.MeshStandardMaterial({
        color: 0x2b2b2b,
        roughness: 0.6,
        metalness: 0.1
      });

      const totalH = 1.54;
      const shelfW = 0.88;
      const shelfD = 0.34;
      const legX = 0.44;
      const legZ = 0.17;

      // 4 Matte Black Square Steel Uprights
      const legGeo = new THREE.BoxGeometry(0.022, totalH, 0.022);
      const footGeo = new THREE.CylinderGeometry(0.016, 0.018, 0.03, 16);

      [-legX, legX].forEach((x) => {
        [-legZ, legZ].forEach((z) => {
          const leg = new THREE.Mesh(legGeo, steelMat);
          leg.position.set(x, totalH / 2, z);
          group.add(leg);

          const foot = new THREE.Mesh(footGeo, brassMat);
          foot.position.set(x, 0.015, z);
          group.add(foot);
        });
      });

      // Top steel perimeter framing
      const topRailWGeo = new THREE.BoxGeometry(shelfW, 0.022, 0.022);
      [-legZ, legZ].forEach((z) => {
        const rail = new THREE.Mesh(topRailWGeo, steelMat);
        rail.position.set(0, totalH - 0.011, z);
        group.add(rail);
      });

      const topRailDGeo = new THREE.BoxGeometry(0.022, 0.022, legZ * 2);
      [-legX, legX].forEach((x) => {
        const rail = new THREE.Mesh(topRailDGeo, steelMat);
        rail.position.set(x, totalH - 0.011, 0);
        group.add(rail);
      });

      // Structural X-Brace on Back Frame (Architectural Steel Rods)
      const xLength = Math.hypot(legX * 2, totalH * 0.65);
      const rodGeo = new THREE.CylinderGeometry(0.005, 0.005, xLength, 12);
      const angle = Math.atan2(totalH * 0.65, legX * 2);

      const rod1 = new THREE.Mesh(rodGeo, steelMat);
      rod1.position.set(0, 0.88, -legZ);
      rod1.rotation.z = Math.PI / 2 - angle;
      group.add(rod1);

      const rod2 = new THREE.Mesh(rodGeo, steelMat);
      rod2.position.set(0, 0.88, -legZ);
      rod2.rotation.z = -(Math.PI / 2 - angle);
      group.add(rod2);

      const centerRing = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 12, 24), brassMat);
      centerRing.position.set(0, 0.88, -legZ + 0.005);
      group.add(centerRing);

      // Base Retail Cabinet (Enclosed Lower Storage Box)
      const cabinetH = 0.34;
      const cabY = 0.06 + cabinetH / 2;
      const cabCarcass = new THREE.Mesh(new THREE.BoxGeometry(shelfW - 0.04, cabinetH, shelfD - 0.04), walnutMat);
      cabCarcass.position.set(0, cabY, 0);
      group.add(cabCarcass);

      // Cabinet Door Panels with fine shadow reveal
      const doorW = (shelfW - 0.05) / 2;
      const doorGeo = new THREE.BoxGeometry(doorW - 0.006, cabinetH - 0.02, 0.015);
      const leftDoor = new THREE.Mesh(doorGeo, walnutMat);
      leftDoor.position.set(-doorW / 2 - 0.003, cabY, (shelfD - 0.04) / 2 + 0.008);
      group.add(leftDoor);

      const rightDoor = new THREE.Mesh(doorGeo, walnutMat);
      rightDoor.position.set(doorW / 2 + 0.003, cabY, (shelfD - 0.04) / 2 + 0.008);
      group.add(rightDoor);

      // Brass Minimalist Pulls for Cabinet
      const cabPullGeo = new THREE.BoxGeometry(0.008, 0.075, 0.012);
      const leftPull = new THREE.Mesh(cabPullGeo, brassMat);
      leftPull.position.set(-0.025, cabY, (shelfD - 0.04) / 2 + 0.02);
      group.add(leftPull);

      const rightPull = new THREE.Mesh(cabPullGeo, brassMat);
      rightPull.position.set(0.025, cabY, (shelfD - 0.04) / 2 + 0.02);
      group.add(rightPull);

      // 3 Floating Walnut Shelves Above Base
      const shelfYPositions = [0.68, 1.04, 1.40];
      const shelfSlabGeo = new THREE.BoxGeometry(shelfW - 0.02, 0.025, shelfD - 0.02);
      const bracketGeo = new THREE.BoxGeometry(0.024, 0.015, 0.024);

      shelfYPositions.forEach((y) => {
        const shelf = new THREE.Mesh(shelfSlabGeo, walnutMat);
        shelf.position.set(0, y, 0);
        group.add(shelf);

        // Brass corner support brackets
        [-legX + 0.011, legX - 0.011].forEach((bx) => {
          [-legZ + 0.011, legZ - 0.011].forEach((bz) => {
            const brk = new THREE.Mesh(bracketGeo, brassMat);
            brk.position.set(bx, y - 0.018, bz);
            group.add(brk);
          });
        });
      });

      // Curated Commercial Retail Display Accents:
      // Shelf 1 (Y = 0.68): Matte Ceramic Minimalist Vase + Swatch Catalogues
      const vaseGeo = new THREE.CylinderGeometry(0.048, 0.062, 0.20, 24);
      const vase = new THREE.Mesh(vaseGeo, ceramicMat);
      vase.position.set(-0.24, 0.68 + 0.0125 + 0.10, 0);
      group.add(vase);

      const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.025, 0.15), charcoalMat);
      book1.position.set(0.18, 0.68 + 0.0125 + 0.0125, 0);
      book1.rotation.y = 0.08;
      group.add(book1);

      const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.022, 0.14), terracottaMat);
      book2.position.set(0.18, 0.68 + 0.0125 + 0.036, 0);
      book2.rotation.y = -0.05;
      group.add(book2);

      const book3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.13), walnutMat);
      book3.position.set(0.18, 0.68 + 0.0125 + 0.056, 0);
      book3.rotation.y = 0.12;
      group.add(book3);

      // Shelf 2 (Y = 1.04): Geometric Sculpture + Luxury Display Pedestal
      const torusGeo = new THREE.TorusGeometry(0.060, 0.014, 16, 32);
      const sculpt = new THREE.Mesh(torusGeo, terracottaMat);
      sculpt.position.set(-0.20, 1.04 + 0.0125 + 0.07, 0);
      sculpt.rotation.y = 0.35;
      group.add(sculpt);

      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.062, 0.032, 24), brassMat);
      pedestal.position.set(0.18, 1.04 + 0.0125 + 0.016, 0);
      group.add(pedestal);

      const flacon = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.09, 20), ceramicMat);
      flacon.position.set(0.18, 1.04 + 0.0125 + 0.032 + 0.045, 0);
      group.add(flacon);

      // Shelf 3 (Y = 1.40): Brass Bookend & Architectural Binders + Minimalist Bowl
      const bookend = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.14, 0.11), brassMat);
      bookend.position.set(-0.16, 1.40 + 0.0125 + 0.07, 0);
      group.add(bookend);

      const binder1 = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.16, 0.15), charcoalMat);
      binder1.position.set(-0.12, 1.40 + 0.0125 + 0.08, 0);
      group.add(binder1);

      const binder2 = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.15, 0.14), walnutMat);
      binder2.position.set(-0.09, 1.40 + 0.0125 + 0.075, 0);
      group.add(binder2);

      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.048, 0.038, 24), charcoalMat);
      bowl.position.set(0.20, 1.40 + 0.0125 + 0.019, 0);
      group.add(bowl);

      return group;
    };

    const shelfGroup = buildCommercialShelf();
    shelfGroup.position.set(0, -3.8, 0);
    shelfGroup.scale.setScalar(0.001);
    scene.add(shelfGroup);
    engine.pieces[1].group = shelfGroup;

    // 5b. Build Architectural Custom Closet / Armario sobre Diseño (Piece 2)
    const buildArchitecturalCloset = () => {
      const group = new THREE.Group();

      const walnutMat = new THREE.MeshStandardMaterial({
        color: 0x3d2214,
        roughness: 0.34,
        metalness: 0.04
      });

      const slatMat = new THREE.MeshStandardMaterial({
        color: 0x482918,
        roughness: 0.38,
        metalness: 0.03
      });

      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x19110d,
        roughness: 0.5,
        metalness: 0.0
      });

      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.95
      });

      const closetW = 1.04;
      const closetH = 1.56;
      const closetD = 0.48;
      const plinthH = 0.07;
      const bodyH = closetH - plinthH;

      // 1. Recessed Shadow Plinth Base (Zócalo Remetido)
      const plinthW = closetW - 0.06;
      const plinthD = closetD - 0.05;
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(plinthW, plinthH, plinthD), darkMat);
      plinth.position.set(0, plinthH / 2, 0);
      group.add(plinth);

      // Brass Corner Glides / Leveling Pads
      const padGeo = new THREE.BoxGeometry(0.04, 0.01, 0.04);
      [-plinthW / 2 + 0.03, plinthW / 2 - 0.03].forEach((px) => {
        [-plinthD / 2 + 0.03, plinthD / 2 - 0.03].forEach((pz) => {
          const pad = new THREE.Mesh(padGeo, brassMat);
          pad.position.set(px, 0.005, pz);
          group.add(pad);
        });
      });

      // 2. Main Cabinet Carcass
      const carcassY = plinthH + bodyH / 2;
      const carcass = new THREE.Mesh(new THREE.BoxGeometry(closetW, bodyH, closetD), walnutMat);
      carcass.position.set(0, carcassY, 0);
      group.add(carcass);

      // Top Crown Cap with Micro Shadow Reveal
      const topCap = new THREE.Mesh(new THREE.BoxGeometry(closetW + 0.015, 0.025, closetD + 0.015), walnutMat);
      topCap.position.set(0, closetH + 0.0125, 0);
      group.add(topCap);

      const topReveal = new THREE.Mesh(new THREE.BoxGeometry(closetW - 0.02, 0.008, closetD - 0.02), darkMat);
      topReveal.position.set(0, closetH - 0.004, 0);
      group.add(topReveal);

      // 3. Double Front Doors with Fine Central Reveal
      const doorW = (closetW - 0.05) / 2;
      const doorH = bodyH - 0.06;
      const doorD = 0.024;
      const doorFrontZ = closetD / 2 + doorD / 2;
      const doorCenterY = plinthH + 0.03 + doorH / 2;

      const doorBaseGeo = new THREE.BoxGeometry(doorW - 0.006, doorH, doorD);

      const leftDoorBase = new THREE.Mesh(doorBaseGeo, walnutMat);
      leftDoorBase.position.set(-doorW / 2 - 0.003, doorCenterY, doorFrontZ);
      group.add(leftDoorBase);

      const rightDoorBase = new THREE.Mesh(doorBaseGeo, walnutMat);
      rightDoorBase.position.set(doorW / 2 + 0.003, doorCenterY, doorFrontZ);
      group.add(rightDoorBase);

      // 4. Lambrín Wood Fluting / Slats on Both Doors (10 Vertical Slats Per Door)
      const slatCount = 10;
      const slatW = 0.018;
      const slatH = doorH - 0.04;
      const slatD = 0.012;
      const slatGeo = new THREE.BoxGeometry(slatW, slatH, slatD);
      const slatZ = doorFrontZ + doorD / 2 + slatD / 2;

      for (let i = 0; i < slatCount; i++) {
        const sx = (-doorW - 0.003) + (i + 0.5) * (doorW / slatCount);
        const slat = new THREE.Mesh(slatGeo, slatMat);
        slat.position.set(sx, doorCenterY, slatZ);
        group.add(slat);
      }

      for (let i = 0; i < slatCount; i++) {
        const sx = 0.003 + (i + 0.5) * (doorW / slatCount);
        const slat = new THREE.Mesh(slatGeo, slatMat);
        slat.position.set(sx, doorCenterY, slatZ);
        group.add(slat);
      }

      // 5. Signature Luxury Long Champagne Brass Pull Handles
      const handleLength = 0.68;
      const handleW = 0.014;
      const handleD = 0.024;
      const handleGeo = new THREE.BoxGeometry(handleW, handleLength, handleD);
      const standoffGeo = new THREE.BoxGeometry(0.012, 0.018, 0.020);

      const leftHandle = new THREE.Mesh(handleGeo, brassMat);
      leftHandle.position.set(-0.022, doorCenterY, slatZ + slatD / 2 + handleD / 2 + 0.012);
      group.add(leftHandle);

      const rightHandle = new THREE.Mesh(handleGeo, brassMat);
      rightHandle.position.set(0.022, doorCenterY, slatZ + slatD / 2 + handleD / 2 + 0.012);
      group.add(rightHandle);

      [-0.022, 0.022].forEach((hx) => {
        [-handleLength / 2 + 0.05, handleLength / 2 - 0.05].forEach((hy) => {
          const standoff = new THREE.Mesh(standoffGeo, brassMat);
          standoff.position.set(hx, doorCenterY + hy, slatZ + slatD / 2 + 0.008);
          group.add(standoff);
        });
      });

      // 6. Architectural Brass Trim Inset
      const trimGeo = new THREE.BoxGeometry(closetW, 0.008, 0.008);
      const bottomTrim = new THREE.Mesh(trimGeo, brassMat);
      bottomTrim.position.set(0, plinthH + 0.004, closetD / 2);
      group.add(bottomTrim);

      return group;
    };

    const closetGroup = buildArchitecturalCloset();
    closetGroup.position.set(0, -3.8, 0);
    closetGroup.scale.setScalar(0.001);
    scene.add(closetGroup);
    engine.pieces[2].group = closetGroup;

    // 5c. Build Architectural Coffee Table with Lambrín Wood Fluting (Piece 3)
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

    // 6. Asynchronously Load GLB Sofa Model (Piece 0)
    // Global in-memory cache for pristine, unmutated GLTF scenes so re-mounts are 0ms instant
    if (!window.__STUDIO_CAB_GLTF_CACHE) {
      window.__STUDIO_CAB_GLTF_CACHE = {};
    }
    const CACHE = window.__STUDIO_CAB_GLTF_CACHE;

    const loadSingleModel = (path) => {
      if (CACHE[path]) {
        return Promise.resolve(CACHE[path]);
      }
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          path,
          (gltf) => {
            CACHE[path] = gltf;
            resolve(gltf);
          },
          undefined,
          (err) => reject(err)
        );
      });
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
          child.visible = true;

          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (!mat) return;
            mat.side = THREE.DoubleSide; // Render both front & back faces
            mat.envMapIntensity = 1.45;
            mat.needsUpdate = true;

            // Material color refinement for the luxury curved velvet sofa
            if (isSofa) {
              const nameLower = (child.name || '').toLowerCase() + ' ' + (mat.name || '').toLowerCase();
              if (nameLower.includes('fabric')) {
                // Bright, elegant ivory velvet that stands out crisp against the warm background
                mat.color.set(0xf8f2e8);
                mat.roughness = 0.52;
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

      // Reset root transforms before measuring bounds to guarantee 100% deterministic geometry box
      root.position.set(0, 0, 0);
      root.rotation.set(0, 0, 0);
      root.scale.set(1, 1, 1);
      root.updateMatrixWorld(true);

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
    };

    // Load Velvet Sofa (Piece 0)
    loadSingleModel('/models/glam-velvet-sofa.glb')
      .catch((err) => {
        console.warn('Fallback sofa', err);
        return loadSingleModel('/models/sheen-wood-sofa.glb');
      })
      .then((sofaGltf) => {
        if (sofaGltf) setupModel(sofaGltf.scene.clone(true), 0, true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[HeroFurniture3D] Critical model load error:', err);
        setLoading(false);
      });

    // 7. Animation Loop (Smooth 60FPS)
    const clock = new THREE.Clock();
    let entranceStart = null;

    const animate = () => {
      engine.animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (entranceStart === null) {
        entranceStart = elapsed;
      }
      const timeSinceStart = Math.max(0, elapsed - entranceStart);

      // Smooth cursor parallax & drag interpolation
      engine.mouseCurrentX += (engine.mouseTargetX - engine.mouseCurrentX) * 0.05;
      engine.mouseCurrentY += (engine.mouseTargetY - engine.mouseCurrentY) * 0.05;
      engine.dragRotY += (engine.targetDragRotY - engine.dragRotY) * 0.08;

      camera.position.x = engine.mouseCurrentX * 0.25;
      camera.position.y = (isMobile ? 0.60 : 0.40) - engine.mouseCurrentY * 0.15;
      camera.lookAt(0, 0.20, 0);

      // Subtle ambient hovering waves
      const hoverY0 = Math.sin(elapsed * 1.3) * 0.02;
      const hoverY1 = Math.sin(elapsed * 1.5 + 1.2) * 0.025;
      const hoverY2 = Math.sin(elapsed * 1.2 + 2.5) * 0.025;
      const hoverY3 = Math.sin(elapsed * 1.1 + 3.8) * 0.015;
      const hovers = [hoverY0, hoverY1, hoverY2, hoverY3];

      const groundY = engine.groundY;

      // Staggered Entrance from below on page load (No scroll required!):
      // 0: Velvet Sofa (Center Back): t = 0.05s - 0.85s
      // 1: Commercial Shelf (Right): t = 0.18s - 0.98s
      // 2: Architectural Closet (Left): t = 0.30s - 1.12s
      // 3: Coffee Table (Center Front): t = 0.45s - 1.28s
      // After t >= 1.28s, all 4 pieces remain permanently assembled and floating together.
      const entranceWindows = [
        [0.05, 0.85],
        [0.18, 0.98],
        [0.30, 1.12],
        [0.45, 1.28]
      ];

      engine.pieces.forEach((piece, idx) => {
        if (!piece.group) return;

        const [tStart, tEnd] = entranceWindows[idx];
        const t = Math.min(1, Math.max(0, (timeSinceStart - tStart) / (tEnd - tStart)));
        // Premium architectural cubic ease-out
        const ease = 1 - Math.pow(1 - t, 3.2);

        // Ascend smoothly from below the floor (-3.2) to ground level + hover
        const startY = -3.2;
        const targetY = groundY + hovers[idx];
        const curY = startY + (targetY - startY) * ease;

        // Fluid rotational entrance into resting alignment
        const rotOffset = idx === 1 ? -0.35 : idx === 2 ? 0.35 : idx === 3 ? 0.65 : 0.0;
        const startRotY = piece.targetRot.y + rotOffset;
        const curRotY = startRotY + (piece.targetRot.y - startRotY) * ease + engine.dragRotY;

        piece.group.visible = t > 0.001;
        piece.group.position.set(piece.targetPos.x, curY, piece.targetPos.z);
        piece.group.rotation.set(piece.targetRot.x, curRotY, piece.targetRot.z);
        piece.group.scale.setScalar(piece.scale * Math.max(0.001, ease));

        // Soft ground contact shadow rises into place
        if (piece.shadow) {
          piece.shadow.position.set(piece.targetPos.x, groundY - 0.005, piece.targetPos.z);
          piece.shadow.material.opacity = ease * (idx === 3 ? 0.32 : idx === 2 ? 0.38 : idx === 1 ? 0.35 : 0.44);
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
        <span className="hero-3d-floating-txt">Cargando Espacio Comercial 3D...</span>
      </div>
    </div>
  );
}

