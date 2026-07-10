import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Dog = () => {
  gsap.registerPlugin(useGSAP());
  gsap.registerPlugin(ScrollTrigger);

  const model = useGLTF("/models/dog.drc.glb");
  useThree(({ camera, scene, gl }) => {
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
    "/matcap/mat-2.png",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
  const [branchMap, branchNormalMap] = useTexture([
    "/branches_diffuse.jpeg",
    "/branches_normals.jpeg",
  ]).map((texture) => {
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
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

  const dogModel = useRef(model);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-3",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
    tl
    .to(dogModel.current.scene.position,{
      z: "-=0.75",
      y: "+=0.1"
    })
    .to(dogModel.current.scene.rotation,{
      x:`+=${Math.PI/15}`
    })
    .to(dogModel.current.scene.rotation,{
      y:`-=${Math.PI}`,
    },"third")
    .to(dogModel.current.scene.position,{
      x: "-=0.5",
      z: "+=0.6",
      y: "-=0.05"
    },"third") //tagged animations run together or share the same slice of time...
  }, []);

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
