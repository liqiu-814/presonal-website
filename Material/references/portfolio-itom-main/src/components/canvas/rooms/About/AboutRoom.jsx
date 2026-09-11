import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import PaperAirplane from './PaperAirplane';
import KnowledgeGalaxy from './KnowledgeGalaxy';
import { useScene } from '../../../../context/SceneContext';
import { useAchievements } from '../../../../context/AchievementsContext';
import { useAudio } from '../../../../context/AudioManager';

const ROOM_OFFSET = [0, 0, -25];
const MIN_FOV = 32;
const MAX_FOV = 72;
const BASE_FOV = 64;

const AboutRoom = ({ onReady, isExiting, isWarmup }) => {
    const { camera, scene } = useThree();
    const { currentRoom, isTeleporting, overlayContent, openOverlay } = useScene();
    const { unlockAchievement, hidePopup } = useAchievements();
    const { globalVolume, isMuted } = useAudio();
    const roomRef = useRef();
    const airplaneRef = useRef();
    const readyRef = useRef(false);
    const frameCount = useRef(0);
    const dragging = useRef(false);
    const pointer = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: camera.rotation.x, y: camera.rotation.y });
    const movement = useRef({ forward: 0, right: 0, up: 0 });
    const scrollVelocity = useRef(0);
    const flightDistance = useRef(0);
    const currentBank = useRef(0);
    const currentPitch = useRef(0);
    const mobileThrust = useRef(0);
    const keys = useRef(new Set());
    const originalFov = useRef(camera.fov);
    const planePosition = useRef(new THREE.Vector3());
    const planeQuaternion = useRef(new THREE.Quaternion());
    const parentQuaternion = useRef(new THREE.Quaternion());
    const forwardVector = useRef(new THREE.Vector3());
    const rightVector = useRef(new THREE.Vector3());
    const trailRef = useRef();
    const audioRef = useRef();
    const [hoveredTopic, setHoveredTopic] = useState(null);
    const overlayOpen = Boolean(overlayContent);

    useEffect(() => {
        if (isWarmup) return undefined;
        const canvas = document.querySelector('.canvas-wrapper canvas');
        const onPointerDown = (event) => {
            if (currentRoom !== 'about' || overlayOpen || event.button !== 0) return;
            dragging.current = true;
            pointer.current = { x: event.clientX, y: event.clientY };
            canvas?.classList.add('galaxy-steering');
        };
        const onPointerMove = (event) => {
            if (!dragging.current || overlayOpen) return;
            const dx = event.clientX - pointer.current.x;
            const dy = event.clientY - pointer.current.y;
            pointer.current = { x: event.clientX, y: event.clientY };
            targetRotation.current.y -= dx * 0.0032;
            targetRotation.current.x = THREE.MathUtils.clamp(targetRotation.current.x - dy * 0.0027, -1.05, 1.05);
        };
        const endPointer = () => {
            dragging.current = false;
            canvas?.classList.remove('galaxy-steering');
        };
        const onWheel = (event) => {
            if (currentRoom !== 'about' || overlayOpen) return;
            scrollVelocity.current = THREE.MathUtils.clamp(scrollVelocity.current + event.deltaY * 0.0034, -3.8, 3.8);
        };
        const onKeyDown = (event) => keys.current.add(event.key.toLowerCase());
        const onKeyUp = (event) => keys.current.delete(event.key.toLowerCase());
        const onMobileFlight = (event) => { mobileThrust.current = Number(event.detail) || 0; };

        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', endPointer);
        window.addEventListener('pointercancel', endPointer);
        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('galaxy-flight', onMobileFlight);
        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', endPointer);
            window.removeEventListener('pointercancel', endPointer);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('galaxy-flight', onMobileFlight);
            canvas?.classList.remove('galaxy-steering');
            camera.fov = originalFov.current;
            camera.updateProjectionMatrix();
            document.body.style.cursor = '';
        };
    }, [camera, currentRoom, isWarmup, overlayOpen]);

    useEffect(() => {
        if (currentRoom !== 'about') return;
        const center = roomRef.current?.localToWorld(new THREE.Vector3(0, 0, -22));
        if (center) camera.lookAt(center);
        targetRotation.current = { x: camera.rotation.x, y: camera.rotation.y };
        originalFov.current = camera.fov;
        camera.fov = BASE_FOV;
        camera.updateProjectionMatrix();
        scrollVelocity.current = 0;
        flightDistance.current = 0;
        currentBank.current = 0;
        currentPitch.current = 0;
        const previousBackground = scene.background;
        scene.background = new THREE.Color('#01030b');
        return () => { scene.background = previousBackground; };
    }, [camera, currentRoom, scene]);

    useEffect(() => {
        if (isExiting || isTeleporting) hidePopup();
    }, [isExiting, isTeleporting, hidePopup]);

    const handleSelect = (topic) => {
        unlockAchievement('about_fly');
        openOverlay({ ...topic, layout: 'knowledge_planet', platformConfig: { label: 'AI INTERVIEW KNOWLEDGE NODE' } });
    };

    useFrame((state, delta) => {
        if (!readyRef.current) {
            frameCount.current += 1;
            if (frameCount.current >= (isWarmup ? 2 : 18)) {
                readyRef.current = true;
                onReady?.();
            }
        }

        if (currentRoom !== 'about' || isTeleporting || isExiting || isWarmup) return;
        const keyboardSpeed = delta * 4.1;
        const pressed = keys.current;
        movement.current.forward = Number(pressed.has('w') || pressed.has('arrowup')) - Number(pressed.has('s') || pressed.has('arrowdown')) + mobileThrust.current;
        movement.current.right = Number(pressed.has('d') || pressed.has('arrowright')) - Number(pressed.has('a') || pressed.has('arrowleft'));
        movement.current.up = Number(pressed.has('e')) - Number(pressed.has('q'));

        const inertialThrust = overlayOpen ? 0 : scrollVelocity.current;
        scrollVelocity.current *= Math.pow(0.16, delta);
        if (Math.abs(scrollVelocity.current) < 0.002) scrollVelocity.current = 0;
        flightDistance.current += inertialThrust * delta * 6.8;

        const maneuver = Math.sin(flightDistance.current * 0.12) * Math.min(1, Math.abs(inertialThrust));
        const targetPitch = THREE.MathUtils.clamp(-inertialThrust * 0.026, -0.09, 0.09);
        const targetBank = THREE.MathUtils.clamp(-movement.current.right * 0.055 + maneuver * 0.022, -0.1, 0.1);
        currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch, 1 - Math.pow(0.018, delta));
        currentBank.current = THREE.MathUtils.lerp(currentBank.current, targetBank, 1 - Math.pow(0.018, delta));

        camera.rotation.order = 'YXZ';
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.current.y, 1 - Math.pow(0.003, delta));
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.current.x + currentPitch.current, 1 - Math.pow(0.003, delta));
        camera.rotation.z = currentBank.current;

        const targetFov = THREE.MathUtils.clamp(BASE_FOV + Math.abs(inertialThrust) * 2.4, MIN_FOV, MAX_FOV);
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.pow(0.025, delta));
        camera.updateProjectionMatrix();

        if (!overlayOpen && (inertialThrust || movement.current.forward || movement.current.right || movement.current.up)) {
            forwardVector.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
            rightVector.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
            camera.position.addScaledVector(forwardVector.current, inertialThrust * delta * 6.8 + movement.current.forward * keyboardSpeed);
            camera.position.addScaledVector(rightVector.current, movement.current.right * keyboardSpeed);
            camera.position.y += movement.current.up * keyboardSpeed;
            unlockAchievement('about_fly');
        }

        if (airplaneRef.current && roomRef.current) {
            planePosition.current.set(0, -0.62, -2.25).applyMatrix4(camera.matrixWorld);
            roomRef.current.worldToLocal(planePosition.current);
            airplaneRef.current.position.copy(planePosition.current);
            camera.getWorldQuaternion(planeQuaternion.current);
            roomRef.current.getWorldQuaternion(parentQuaternion.current);
            airplaneRef.current.quaternion.copy(parentQuaternion.current.invert().multiply(planeQuaternion.current));
            airplaneRef.current.rotateX(0.08 + currentPitch.current * 2.6);
            airplaneRef.current.rotateZ(-currentBank.current * 2.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.012);
        }
        if (trailRef.current) {
            const intensity = Math.min(0.42, Math.abs(inertialThrust) * 0.14);
            trailRef.current.visible = intensity > 0.015;
            trailRef.current.children.forEach(child => { child.material.opacity = intensity; });
        }
    });

    return (
        <group ref={roomRef} position={ROOM_OFFSET}>
            <KnowledgeGalaxy
                onSelect={handleSelect}
                hoveredTopic={hoveredTopic}
                onHover={setHoveredTopic}
                starCount={isWarmup ? 80 : (window.innerWidth < 700 ? 1300 : 2800)}
                flightSpeedRef={scrollVelocity}
            />
            {!isWarmup && <PositionalAudio ref={audioRef} url="/sounds/szumwiatru.mp3" distanceModel="exponential" refDistance={2} rolloffFactor={0.8} loop autoplay volume={isMuted ? 0 : 1.15 * globalVolume} />}
            <group ref={airplaneRef}>
                <PaperAirplane scale={0.11} color="#d8d7d2" />
                <group ref={trailRef} visible={false}>
                    {[-0.12, 0, 0.12].map((x, index) => (
                        <mesh key={x} position={[x, -0.02 + index * 0.018, 0.27 + index * 0.07]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.004, 0.012, 0.5 + index * 0.16, 5]} />
                            <meshBasicMaterial color="#a9d7e8" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
                        </mesh>
                    ))}
                </group>
            </group>
        </group>
    );
};

export default AboutRoom;
