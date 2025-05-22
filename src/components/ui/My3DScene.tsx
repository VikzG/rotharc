import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

interface My3DSceneProps {
  path: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  rotationSpeed?: number;
}

const My3DScene: React.FC<My3DSceneProps> = ({
  path,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  rotationSpeed = 0.01,
}) => {
  const { scene, error, isLoading } = useGLTF(path);
  const ref = useRef<Group>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(`Error loading model at ${path}: `, error);
      setIsError(true);
    }
  }, [error]);

  useFrame(() => {
    if (ref.current && !isError) {
      ref.current.rotation.y += rotationSpeed;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Erreur lors du chargement du modèle 3D.</div>;
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
};

export default My3DScene;
