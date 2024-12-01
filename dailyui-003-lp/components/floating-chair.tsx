"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

function Chair({
	position,
	rotation,
	rotationOffset = 0,
}: {
	position: [number, number, number];
	rotation: [number, number, number];
	rotationOffset?: number;
}) {
	const chair = useRef<Group>(null);
	const { scene } = useGLTF("/scene.gltf");

	const clonedScene = scene.clone();

	useFrame((state) => {
		if (chair.current) {
			chair.current.rotation.y =
				Math.sin(state.clock.getElapsedTime() * 0.5 + rotationOffset) * 0.1;
		}
	});

	return (
		<Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
			<group ref={chair} dispose={null} position={position} rotation={rotation}>
				<primitive object={clonedScene} />
			</group>
		</Float>
	);
}

useGLTF.preload("/scene.gltf");

function Sphere({
	position,
	color,
	size,
}: { position: [number, number, number]; color: string; size: number }) {
	return (
		<mesh position={position}>
			<sphereGeometry args={[size, 32, 32]} />
			<meshLambertMaterial color={color} />
		</mesh>
	);
}

export function FloatingChairs() {
	return (
		<div className="w-full h-screen">
			<Canvas
				camera={{
					position: [7, 12, 8],
					fov: 22,
				}}
			>
				<color attach="background" args={["#B3C8CF"]} />
				<ambientLight intensity={1} />
				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					intensity={2}
					castShadow
				/>
				<directionalLight position={[-5, 5, 5]} intensity={1.5} />
				<Chair position={[2, 1, 3]} rotation={[0, 0, 0]} rotationOffset={0} />
				<Chair
					position={[1, 2, -1]}
					rotation={[-0.5, 1, 0.5]}
					rotationOffset={Math.PI / 2}
				/>
				<Chair
					position={[-1, 1, 4]}
					rotation={[1.5, 15, -3.5]}
					rotationOffset={Math.PI}
				/>
				<Chair
					position={[1, 0, 1]}
					rotation={[-0.2, 6, 1]}
					rotationOffset={Math.PI * 1.5}
				/>
				<Sphere position={[3, 1, 0]} color="#86AB89" size={0.5} />
				<Sphere position={[-2, 2, 1]} color="#F1EEDC" size={0.7} />
				<Sphere position={[1, -1, -2]} color="#FF8A8A" size={0.3} />
				<Environment preset="studio" />
				<OrbitControls
					enablePan={true}
					enableZoom={true}
					minPolarAngle={Math.PI / 6}
					maxPolarAngle={Math.PI * 0.75}
				/>
			</Canvas>
		</div>
	);
}
