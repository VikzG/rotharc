import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface ModelProps {
  modelPath: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function Model({ modelPath, scale = [1, 1, 1], position = [0, 0, 0], rotation = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
}

interface My3DSceneProps {
  modelPath: string;
  sceneProps?: {
    scale?: [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
  };
}

export default function My3DScene({ modelPath, sceneProps }: My3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#2C8DB0]" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <PresentationControls
            global
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Stage
              intensity={0.5}
              environment="city"
              adjustCamera={false}
              shadows={false}
            >
              <Model 
                modelPath={modelPath}
                scale={sceneProps?.scale || [1, 1, 1]}
                position={sceneProps?.position || [0, 0, 0]}
                rotation={sceneProps?.rotation || [0, 0, 0]}
              />
            </Stage>
          </PresentationControls>
        </Canvas>
      </Suspense>
    </div>
  );
}