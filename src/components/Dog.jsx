import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { useEffect } from "react";

const Dog = () => {
  const model = useGLTF("/models/dog.drc.glb");
  useThree(({ camera, scene, gl }) => {
    console.log(camera.position);
    camera.position.z = 0.55;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });
  //   const textures = useTexture({
  //     normalMap:"/dog_normals.jpg",
  //     sampleMatCap:"/matcap/mat-2.png"
  //   });
  //   textures.normalMap.flipY = false;
  //   textures.sampleMatCap.colorSpace = THREE.SRGBColorSpace;
  const [normalMap, sampleMatCap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png"
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
  const [branchMap, branchNormalMap] = useTexture([
    "/branches_diffuse.jpeg",
    "/branches_normals.jpeg",
  ]).map((texture)=>{
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })
  const { actions } = useAnimations(model.animations, model.scene);
  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);
  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });
  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap,
  });
  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial;
    } else {
      child.material = branchMaterial;
    }
  });
  return (
    <>
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 3.9, 0]}
      />
      <directionalLight position={[0, 5, 5]} intensity={10} color={0xffffff} />
    </>
  );
};

export default Dog;
