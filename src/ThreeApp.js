import React, { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'


// Args: {rot_mat: Array of 9, size: number}
function AxesFromRotation(props) {
  /* Tranform = [R | -z] */
  const T = new THREE.Matrix4();
  const rot_mat = props.rot_mat;
  T.set(
    rot_mat[0], rot_mat[1], rot_mat[2], - rot_mat[2],
    rot_mat[3], rot_mat[4], rot_mat[5], - rot_mat[5],
    rot_mat[6], rot_mat[7], rot_mat[8], - rot_mat[8],
    0, 0, 0, 1
  );
  /* Has to do decompose() in R3F */
  let pos = new THREE.Vector3();
  let quat = new THREE.Quaternion();
  let scale = new THREE.Vector3();
  T.decompose(pos, quat, scale);
  return <axesHelper args={[props.size]}
    position={[pos.x, pos.y, pos.z]}
    quaternion={[quat.x, quat.y, quat.z, quat.w]} />
}

// Args: {rot_mats: Array of Nx9, nums: int, size: number }
// Output: Array of N AxesHelpers
function BatchAxesFromRotations(props) {
  const rot_mats = props.rot_mats;
  const size = props.size;
  const nums = props.nums;
  let res = [];
  for (let i = 0; i < nums; ++i) {
    res.push(
      <AxesFromRotation key={i} rot_mat={rot_mats.slice(9*i, 9*i+9)} size={size}/>
      );
  }
  return <>{res}</>;
}

function WireSphere() {
  const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  const opacity = isMobile ? 0.1 : 0.05;
  return <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[1, 32, 16]} />
    <meshStandardMaterial depthTest={false} wireframe={true} transparent={true}
      color={0xffffff} opacity={opacity}/>
  </mesh>
}

function MainGroup(props) {
  const ref = useRef();
  const rotRef = useRef();
  const onClick = () => { rotRef.rot = false; }
  useEffect(() => { rotRef.rot = true; })
  useFrame((state, delta) => {
    if (rotRef.rot) { ref.current.rotation.y += 0.5 * delta; }
  });
  return <group ref={ref} onClick={onClick}>
    <WireSphere />
    <BatchAxesFromRotations rot_mats={props.rot_mats.dataSync()} nums={props.num_rots} size={0.05} />
  </group>
}

function MainCamera(props) {
  const defaultRadius = 2.5;
  const { camera } = useThree();
  function ang_to_xyz(theta, phi) {
    let vec = new THREE.Vector3();
    vec.x = defaultRadius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    vec.y = defaultRadius * Math.sin(phi * Math.PI / 360);
    vec.z = defaultRadius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    return vec;
  }
  useEffect(() => {
    camera.fov = 75;
    camera.near = 0.1;
    camera.far = 1000;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.lookAt(0, 0, 0);
    const pos = ang_to_xyz(0, 120);
    camera.position.set(pos.x, pos.y, pos.z);
  })
  return null;
}

function MainCanvas(props) {
  return (
    <Canvas >
      <color args={[0x000000]} attach="background" />
      <ambientLight />

      <OrbitControls enablePan={false} maxPolarAngle={Math.PI/2} minDistance={0.5} maxDistance={10}/>
      <MainCamera />

      <MainGroup rot_mats={props.rot_mats} num_rots={props.num_rots}/>
    </Canvas>
  );
}

export default MainCanvas;