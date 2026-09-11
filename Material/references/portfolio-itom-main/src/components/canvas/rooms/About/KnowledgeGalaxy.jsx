import { useMemo, useRef, useState } from 'react';
import { Html, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CLUSTER_LABELS, KNOWLEDGE_TOPICS, TOPIC_LINKS } from './galaxyData';

const TAU = Math.PI * 2;
const SUN_Z = -30;
const CLUSTER_ANGLES = { foundation: 0.15, retrieval: 1.08, agent: 2.15, infra: 3.25, quality: 4.35, career: 5.38 };
const PLANET_PALETTES = [
    ['#2b3138', '#78828a', '#b7a991'], ['#4c4036', '#a17d57', '#d6c39b'],
    ['#172733', '#476c7d', '#a8bbc2'], ['#3e302d', '#815044', '#c28a6b'],
    ['#343839', '#6d7776', '#a7aca7'], ['#202733', '#49556c', '#8b93a3'],
    ['#4b443c', '#857966', '#c2b49a'], ['#292525', '#65413c', '#a86552'],
];

const PLANET_VERTEX = `
varying vec3 vNormalView; varying vec3 vPosition; varying vec3 vViewPosition;
void main(){vPosition=position;vNormalView=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vViewPosition=mv.xyz;gl_Position=projectionMatrix*mv;}`;
const PLANET_FRAGMENT = `
uniform float uTime;uniform float uKind;uniform float uHover;uniform vec3 uColorA;uniform vec3 uColorB;uniform vec3 uColorC;
varying vec3 vNormalView;varying vec3 vPosition;varying vec3 vViewPosition;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.55;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec3(1.7,2.1,1.3);a*=.48;}return v;}
void main(){vec3 p=normalize(vPosition);float t=uTime*.018;float land=fbm(p*3.7+vec3(t,0.,-t*.4));float detail=fbm(p*11.-vec3(0.,t*.35,0.));float bands=sin((p.y+land*.13)*42.+t*3.)*.5+.5;float field=mix(land,bands*.72+detail*.28,step(.5,uKind));vec3 surface=mix(uColorA,uColorB,smoothstep(.25,.72,field));surface=mix(surface,uColorC,smoothstep(.67,.94,detail+land*.24));vec3 n=normalize(vNormalView),l=normalize(vec3(-.55,.62,.85)),v=normalize(-vViewPosition);float diff=max(dot(n,l),0.);float night=smoothstep(-.18,.12,dot(n,l));float rim=pow(1.-max(dot(n,v),0.),3.5);vec3 color=surface*(.13+diff*.92+detail*.08)*night;color+=uColorC*rim*(.14+uHover*.28)+surface*uHover*.12;gl_FragColor=vec4(color,1.);}`;
const ATMOSPHERE_FRAGMENT = `
uniform vec3 uColor;uniform float uOpacity;varying vec3 vNormalView;varying vec3 vViewPosition;
void main(){vec3 v=normalize(-vViewPosition);float f=pow(1.-abs(dot(normalize(vNormalView),v)),4.);gl_FragColor=vec4(uColor,f*uOpacity);}`;
const SUN_FRAGMENT = `
uniform float uTime;varying vec3 vPosition;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){vec3 p=normalize(vPosition);float n=noise(p*7.+vec3(0.,uTime*.16,0.));float n2=noise(p*18.-vec3(uTime*.06,0.,0.));vec3 c=mix(vec3(1.,.36,.06),vec3(1.,.88,.54),smoothstep(.18,.92,n*.72+n2*.35));gl_FragColor=vec4(c,1.);}`;

function seededRandom(seed){let value=seed%2147483647;return()=>{value=value*16807%2147483647;return(value-1)/2147483646;};}
function buildOrbitConfigs(){const counts={};return KNOWLEDGE_TOPICS.map((topic,index)=>{const order=counts[topic.cluster]||0;counts[topic.cluster]=order+1;return{radius:8.5+(index%4)*3.15+Math.floor(order/4)*1.6,angle:CLUSTER_ANGLES[topic.cluster]+order*.19,speed:.011+(index%6)*.0013,inclination:.28+(index%3)*.075,depth:(index%5-2)*1.3};});}
const ORBITS=buildOrbitConfigs();
const TOPIC_INDEX=new Map(KNOWLEDGE_TOPICS.map((topic,index)=>[topic.id,index]));
const tempScale=new THREE.Vector3();
function orbitPosition(index,time,target=new THREE.Vector3()){const orbit=ORBITS[index],angle=orbit.angle+time*orbit.speed;return target.set(Math.cos(angle)*orbit.radius,Math.sin(angle)*orbit.radius*orbit.inclination,SUN_Z+Math.sin(angle*.73+index)*3.2+orbit.depth);}

function StarField({count=2400,flightSpeedRef}){
    const pointsRef=useRef(),materialRef=useRef();
    const positions=useMemo(()=>{const random=seededRandom(81427),array=new Float32Array(count*3);for(let i=0;i<count;i++){const radius=25+random()*100,theta=random()*TAU,phi=Math.acos(2*random()-1);array[i*3]=radius*Math.sin(phi)*Math.cos(theta);array[i*3+1]=radius*Math.cos(phi)*.68;array[i*3+2]=SUN_Z+radius*Math.sin(phi)*Math.sin(theta);}return array;},[count]);
    useFrame((state,delta)=>{if(pointsRef.current)pointsRef.current.rotation.y+=delta*.0025;if(materialRef.current){const speed=Math.min(1,Math.abs(flightSpeedRef?.current||0)/2.5);materialRef.current.opacity=.66+speed*.25+Math.sin(state.clock.elapsedTime*.8)*.025;materialRef.current.size=.105+speed*.07;}});
    return <points ref={pointsRef} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/></bufferGeometry><pointsMaterial ref={materialRef} size={.105} color="#d9e5ec" transparent opacity={.72} sizeAttenuation depthWrite={false} fog={false}/></points>;
}

function DustDisc(){
    const ref=useRef();
    const positions=useMemo(()=>{const random=seededRandom(32016),count=1800,array=new Float32Array(count*3);for(let i=0;i<count;i++){const radius=4+Math.pow(random(),.65)*25,angle=random()*TAU;array[i*3]=Math.cos(angle)*radius;array[i*3+1]=(random()-.5)*(1.2+radius*.1);array[i*3+2]=SUN_Z+Math.sin(angle)*radius*.34;}return array;},[]);
    useFrame((_,delta)=>{if(ref.current)ref.current.rotation.y+=delta*.006;});
    return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3}/></bufferGeometry><pointsMaterial size={.045} color="#8e8170" transparent opacity={.24} sizeAttenuation depthWrite={false} fog={false}/></points>;
}

function KnowledgeSun(){
    const meshRef=useRef();
    const shader=useMemo(()=>new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:PLANET_VERTEX,fragmentShader:SUN_FRAGMENT}),[]);
    useFrame((state,delta)=>{shader.uniforms.uTime.value=state.clock.elapsedTime;if(meshRef.current)meshRef.current.rotation.y+=delta*.045;});
    return <group position={[0,0,SUN_Z]}><pointLight color="#f6c67a" intensity={34} distance={62} decay={1.65}/><mesh ref={meshRef} material={shader}><sphereGeometry args={[2.75,64,64]}/></mesh><mesh scale={1.18}><sphereGeometry args={[2.75,48,48]}/><shaderMaterial vertexShader={PLANET_VERTEX} fragmentShader={ATMOSPHERE_FRAGMENT} uniforms={{uColor:{value:new THREE.Color('#e9953f')},uOpacity:{value:.45}}} transparent blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} fog={false}/></mesh><Text position={[0,-3.65,0]} fontSize={.48} color="#e9e5dc" anchorX="center" anchorY="middle" font="/fonts/CabinSketch-Bold.ttf" outlineWidth={.025} outlineColor="#030508">QIU ZHUO · ME</Text><Text position={[0,-4.18,0]} fontSize={.18} color="#968b79" anchorX="center" anchorY="middle" font="/fonts/CabinSketch-Regular.ttf">KNOWLEDGE GRAVITY CENTER</Text></group>;
}

function OrbitPaths(){
    const geometries=useMemo(()=>[8.5,11.65,14.8,17.95].map(radius=>{const points=[];for(let i=0;i<=180;i++){const angle=i/180*TAU;points.push(new THREE.Vector3(Math.cos(angle)*radius,Math.sin(angle)*radius*.34,SUN_Z+Math.sin(angle)*2.1));}return new THREE.BufferGeometry().setFromPoints(points);}),[]);
    return geometries.map((geometry,index)=><line key={index} geometry={geometry}><lineBasicMaterial color="#52606a" transparent opacity={.1-index*.012} blending={THREE.AdditiveBlending} depthWrite={false} fog={false}/></line>);
}

function KnowledgeLinks(){
    const lineRef=useRef();
    const geometry=useMemo(()=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(TOPIC_LINKS.length*6),3));return geo;},[]);
    useFrame(state=>{if(!lineRef.current)return;const array=lineRef.current.geometry.attributes.position.array,a=new THREE.Vector3(),b=new THREE.Vector3();TOPIC_LINKS.forEach(([from,to],i)=>{orbitPosition(TOPIC_INDEX.get(from),state.clock.elapsedTime,a);orbitPosition(TOPIC_INDEX.get(to),state.clock.elapsedTime,b);array.set([a.x,a.y,a.z,b.x,b.y,b.z],i*6);});lineRef.current.geometry.attributes.position.needsUpdate=true;lineRef.current.material.opacity=.075+Math.sin(state.clock.elapsedTime*.55)*.018;});
    return <lineSegments ref={lineRef} geometry={geometry}><lineBasicMaterial color="#87a1ae" transparent opacity={.08} blending={THREE.AdditiveBlending} depthWrite={false} fog={false}/></lineSegments>;
}

function KnowledgePlanet({topic,index,onSelect,onHover}){
    const groupRef=useRef(),surfaceRef=useRef();
    const [hovered,setHovered]=useState(false);
    const palette=PLANET_PALETTES[index%PLANET_PALETTES.length];
    const atmosphereColor=index%4===0?'#91a7b5':index%4===1?'#b99a74':'#718591';
    const shader=useMemo(()=>new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uKind:{value:index%3===0?1:0},uHover:{value:0},uColorA:{value:new THREE.Color(palette[0])},uColorB:{value:new THREE.Color(palette[1])},uColorC:{value:new THREE.Color(palette[2])}},vertexShader:PLANET_VERTEX,fragmentShader:PLANET_FRAGMENT}),[index,palette]);
    useFrame((state,delta)=>{if(!groupRef.current)return;orbitPosition(index,state.clock.elapsedTime,groupRef.current.position);if(surfaceRef.current){surfaceRef.current.rotation.y+=delta*(.05+(index%5)*.012);surfaceRef.current.rotation.z=ORBITS[index].inclination*.45;}shader.uniforms.uTime.value=state.clock.elapsedTime;shader.uniforms.uHover.value=THREE.MathUtils.lerp(shader.uniforms.uHover.value,hovered?1:0,1-Math.pow(.001,delta));tempScale.setScalar(hovered?1.16:1);groupRef.current.scale.lerp(tempScale,1-Math.pow(.003,delta));});
    const setHover=value=>{setHovered(value);onHover(value?topic:null);document.body.style.cursor=value?'pointer':'';};
    return <group ref={groupRef}><mesh ref={surfaceRef} material={shader} onClick={event=>{event.stopPropagation();if(event.delta<7)onSelect({...topic,color:atmosphereColor});}} onPointerOver={event=>{event.stopPropagation();setHover(true);}} onPointerOut={()=>setHover(false)}><sphereGeometry args={[topic.size,48,48]}/></mesh><mesh scale={1.055}><sphereGeometry args={[topic.size,36,36]}/><shaderMaterial vertexShader={PLANET_VERTEX} fragmentShader={ATMOSPHERE_FRAGMENT} uniforms={{uColor:{value:new THREE.Color(atmosphereColor)},uOpacity:{value:hovered ? .72 : .35}}} transparent blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} fog={false}/></mesh>{index%6===1&&<mesh rotation={[Math.PI/2.35,.05,index*.2]}><ringGeometry args={[topic.size*1.28,topic.size*1.85,96]}/><meshBasicMaterial color="#847966" transparent opacity={.32} side={THREE.DoubleSide} depthWrite={false} fog={false}/></mesh>}<Text position={[0,-topic.size-.34,0]} fontSize={hovered ? .29 : .19} color={hovered?'#ffffff':'#99a5aa'} anchorX="center" anchorY="middle" font="/fonts/CabinSketch-Bold.ttf" outlineWidth={.018} outlineColor="#020305">{topic.id} · {topic.title}</Text></group>;
}

function GalaxyHud({hoveredTopic}){
    const portalRef=useRef(document.body);const{size}=useThree();
    const move=direction=>window.dispatchEvent(new CustomEvent('galaxy-flight',{detail:direction}));
    return <Html fullscreen portal={portalRef} calculatePosition={()=>[size.width/2,size.height/2]} zIndexRange={[120,100]} style={{pointerEvents:'none'}}><div className="galaxy-hud" aria-hidden="true"><div className="galaxy-brand"><span className="galaxy-brand__eyebrow">AI INTERVIEW · KNOWLEDGE UNIVERSE</span><strong>知识星系</strong><small>28 个专题 · 697 道面试题</small></div><div className="galaxy-reticle"><i/><span>{hoveredTopic?`${hoveredTopic.id} / ${hoveredTopic.code}`:'DEEP SPACE FLIGHT'}</span></div><div className="galaxy-controls"><span>拖动转向</span><span>滚轮推进 / 后退</span><span>WASD 微调</span><span>点击行星查看</span></div><div className="galaxy-mobile-flight" aria-label="飞行控制"><button type="button" onPointerDown={()=>move(1)} onPointerUp={()=>move(0)} onPointerCancel={()=>move(0)}>推进</button><button type="button" onPointerDown={()=>move(-1)} onPointerUp={()=>move(0)} onPointerCancel={()=>move(0)}>后退</button></div><div className="galaxy-clusters">{Object.entries(CLUSTER_LABELS).map(([key,label])=><span key={key} data-cluster={key}>{label}</span>)}</div></div></Html>;
}

export default function KnowledgeGalaxy({onSelect,hoveredTopic,onHover,starCount=2400,flightSpeedRef}){
    return <group><StarField count={starCount} flightSpeedRef={flightSpeedRef}/><DustDisc/><OrbitPaths/><KnowledgeLinks/><KnowledgeSun/>{KNOWLEDGE_TOPICS.map((topic,index)=><KnowledgePlanet key={topic.id} topic={topic} index={index} onSelect={onSelect} onHover={onHover}/>) }<GalaxyHud hoveredTopic={hoveredTopic}/></group>;
}
