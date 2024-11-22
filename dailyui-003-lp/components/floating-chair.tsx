"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

function Chair({
	position,
	rotationOffset = 0,
}: { position: [number, number, number]; rotationOffset?: number }) {
	const chair = useRef<Group>(null);
	const { nodes } = useGLTF("/scene.gltf");

	useFrame((state) => {
		if (chair.current) {
			// Add a subtle rotation with offset for variety
			chair.current.rotation.y =
				Math.sin(state.clock.getElapsedTime() * 0.5 + rotationOffset) * 0.1;
		}
	});

	return (
		<Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
			<group ref={chair} dispose={null} position={position}>
				<primitive object={nodes.Sketchfab_Scene} />
			</group>
		</Float>
	);
}

useGLTF.preload("/scene.gltf");

export function FloatingChairs() {
	return (
		<div className="w-full h-screen">
			<Canvas
				camera={{
					position: [8, 5, 8], // Moved camera back to see all chairs
					fov: 40,
				}}
			>
				<color attach="background" args={["#f0f0f0"]} />

				{/* Lighting */}
				<ambientLight intensity={0.5} />
				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					intensity={1}
					castShadow
				/>

				{/* Four Chairs arranged in a square */}
				<Chair position={[-2, 0, -2]} rotationOffset={0} />
				<Chair position={[2, 0, -2]} rotationOffset={Math.PI / 2} />
				<Chair position={[-2, 0, 2]} rotationOffset={Math.PI} />
				<Chair position={[2, 0, 2]} rotationOffset={Math.PI * 1.5} />

				{/* Environment and Controls */}
				<Environment preset="studio" />
				<OrbitControls
					enablePan={false}
					enableZoom={true}
					minPolarAngle={Math.PI / 4}
					maxPolarAngle={Math.PI / 2}
				/>
			</Canvas>
		</div>
	);
}
