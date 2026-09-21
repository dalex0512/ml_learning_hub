"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PaperCraftScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lights (Warm notebook desk lighting)
    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeed6, 1.8);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0xfceacb, 0.8, 10);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Materials - Matte Paper & Warm Wood / Craft
    const paperMatWarm = new THREE.MeshLambertMaterial({
      color: 0xfdf8ee, // Cream paper
    });
    const paperMatSticky = new THREE.MeshLambertMaterial({
      color: 0xf6df88, // Sticky yellow
    });
    const woodMat = new THREE.MeshLambertMaterial({
      color: 0xd98246, // Pencil body wood/orange
    });
    const graphiteMat = new THREE.MeshLambertMaterial({
      color: 0x33312e, // Pencil tip
    });
    const eraserMat = new THREE.MeshLambertMaterial({
      color: 0xd65353, // Red accent eraser
    });
    const clipMat = new THREE.MeshStandardMaterial({
      color: 0x827a69, // Metal paperclip
      metalness: 0.6,
      roughness: 0.3,
    });

    // 1. Notebook Paper Sheet (folded corner)
    const sheetGeo = new THREE.BoxGeometry(2.4, 3.2, 0.03);
    const sheetMesh = new THREE.Mesh(sheetGeo, paperMatWarm);
    sheetMesh.rotation.z = -0.08;
    sheetMesh.rotation.y = 0.15;
    sheetMesh.position.set(-0.3, 0.1, -0.2);
    sheetMesh.castShadow = true;
    mainGroup.add(sheetMesh);

    // 2. Sticky Note on top of paper
    const stickyGeo = new THREE.BoxGeometry(1.2, 1.2, 0.04);
    const stickyMesh = new THREE.Mesh(stickyGeo, paperMatSticky);
    stickyMesh.rotation.z = 0.18;
    stickyMesh.position.set(0.6, -0.5, 0.05);
    stickyMesh.castShadow = true;
    mainGroup.add(stickyMesh);

    // 3. Low-Poly Pencil
    const pencilGroup = new THREE.Group();
    // Body (hexagonal cylinder)
    const pencilBodyGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.2, 6);
    const pencilBody = new THREE.Mesh(pencilBodyGeo, woodMat);
    pencilGroup.add(pencilBody);
    // Tip wood cone
    const tipWoodGeo = new THREE.ConeGeometry(0.09, 0.35, 6);
    const tipWood = new THREE.Mesh(
      tipWoodGeo,
      new THREE.MeshLambertMaterial({ color: 0xedd4a8 })
    );
    tipWood.position.y = 1.275;
    pencilGroup.add(tipWood);
    // Graphite lead tip
    const tipLeadGeo = new THREE.ConeGeometry(0.04, 0.15, 6);
    const tipLead = new THREE.Mesh(tipLeadGeo, graphiteMat);
    tipLead.position.y = 1.4;
    pencilGroup.add(tipLead);
    // Eraser on back
    const eraserGeo = new THREE.CylinderGeometry(0.088, 0.088, 0.25, 12);
    const eraser = new THREE.Mesh(eraserGeo, eraserMat);
    eraser.position.y = -1.2;
    pencilGroup.add(eraser);

    pencilGroup.position.set(1.1, 0.6, 0.3);
    pencilGroup.rotation.z = -0.75;
    pencilGroup.rotation.x = 0.3;
    mainGroup.add(pencilGroup);

    // 4. Low-poly paper clip ring
    const clipGeo = new THREE.TorusGeometry(0.28, 0.04, 8, 24);
    const clipMesh = new THREE.Mesh(clipGeo, clipMat);
    clipMesh.position.set(-1.1, 1.3, 0.1);
    clipMesh.rotation.x = 0.4;
    clipMesh.rotation.y = 0.3;
    mainGroup.add(clipMesh);

    // Mouse parallax interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      mainGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15 + mouseX * 0.4;
      mainGroup.rotation.x = Math.cos(elapsedTime * 0.4) * 0.08 - mouseY * 0.3;
      pencilGroup.rotation.y = Math.sin(elapsedTime * 1.2) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[320px] sm:h-[400px] cursor-grab active:cursor-grabbing relative flex items-center justify-center"
      aria-label="3D Papercraft Desk Scene"
    >
      <span className="absolute bottom-2 right-4 font-hand text-xs text-text-sub select-none">
        di chuột để xoay giấy & bút ✍️
      </span>
    </div>
  );
}

