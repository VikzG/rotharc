import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";

interface ModelProps {
  path: string;
  scale?: number | [number, number, number]; // Ajout de la possibilité de scale différent sur chaque axe
  position?: [number, number, number];
  rotationSpeed?: number;
}

export function Model({ path, scale = 1, position = [0, 0, 0], rotationSpeed = 0.01 }: ModelProps) {
  const { scene } = useGLTF(path);
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Applique la rotation continue sur l'axe Y
      ref.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={scale}
      position={position}
    />
  );
}
