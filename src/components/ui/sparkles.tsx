import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Extend THREE to the fiber namespace
extend(THREE);

function SparklesInstance({
  count = 100,
  colors = ["#A6A6A6", "#FFFFFF", "#2C8DB0"],
  minSize = 0.5,
  maxSize = 1.5,
}) {
  const mesh = useRef<THREE.Points>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      const color = new THREE.Color(
        colors[Math.floor(Math.random() * colors.length)]
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, [count, colors, particles]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { factor, speed, x, y, z } = particle;

      const t = particle.time += speed;

      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      const scale = Math.cos(t) * 0.3 + 0.7;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh} geometry={particlesGeometry}>
      <pointsMaterial
        size={Math.random() * (maxSize - minSize) + minSize}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export function SparklesCore({
  minSize = 0.5,
  maxSize = 1.5,
  particleDensity = 100,
  particleColor = "#FFFFFF",
  className,
  background,
}) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 1],
          fov: 75,
          near: 0.1,
          far: 2000,
        }}
        style={{
          background: background || "transparent",
        }}
      >
        <SparklesInstance
          count={particleDensity}
          colors={[particleColor]}
          minSize={minSize}
          maxSize={maxSize}
        />
      </Canvas>
    </div>
  );
}