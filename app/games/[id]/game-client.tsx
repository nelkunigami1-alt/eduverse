'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type Game = { id: string; title: string; description: string; category: string | null }
const questions = [
  ['Which action protects biodiversity?', ['Deforestation', 'Restoring habitats', 'Overhunting'], 1],
  ['What is a food web?', ['Connected food chains', 'A weather map', 'A mineral'], 0],
  ['What can drought reduce?', ['Available water', 'Gravity', 'Sunlight forever'], 0],
  ['What helps a river ecosystem?', ['Dumping waste', 'Removing all plants', 'Reducing pollution'], 2],
  ['Why are ecosystems important?', ['Species depend on one another', 'They stop all storms', 'They remove nutrients'], 0]
] as const

export default function GameClient({ game }: { game: Game }) {
  const [step, setStep] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const answer = (choice: number) => {
    const next = correct + (choice === questions[step][2] ? 1 : 0)
    if (step + 1 === questions.length) { setCorrect(next); setUnlocked(next >= 4); setStep(step + 1) }
    else { setCorrect(next); setStep(step + 1) }
  }
  if (!unlocked && step < questions.length) return <section className="card"><p className="eyebrow">{game.category ?? 'LEARNING'} UNLOCK</p><h1>{game.title}</h1><p>{questions[step][0]}</p>{questions[step][1].map((option, i) => <button className="button" key={option} onClick={() => answer(i)}>{option}</button>)}</section>
  if (!unlocked) return <section className="card"><h1>Not unlocked</h1><p>You need 4 correct answers out of 5.</p><button className="button" onClick={() => { setStep(0); setCorrect(0) }}>Retry</button></section>
  return <section className="card"><h1>{game.title}</h1><p>{game.description}</p><ThreeArcade gameId={game.id} onFinish={(value) => { setScore(value); setFinished(true) }} />{finished && <p>Final score: <strong>{score}</strong>. Your score was saved.</p>}</section>
}

function ThreeArcade({ gameId, onFinish }: { gameId: string; onFinish: (score: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [score, setScore] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const host = ref.current; const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07111f)
    const camera = new THREE.PerspectiveCamera(55, 1.8, .1, 100); camera.position.set(0, 3, 12)
    const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setSize(800, 450); host.appendChild(renderer.domElement)
    scene.add(new THREE.AmbientLight(0xffffff, .8)); const light = new THREE.DirectionalLight(0x7dd3fc, 2); light.position.set(4, 8, 6); scene.add(light)
    const player = new THREE.Mesh(new THREE.ConeGeometry(.7, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x082f49 })); player.rotation.x = Math.PI / 2; player.position.set(0, 0, 5); scene.add(player)
    const bullets: THREE.Mesh[] = []; const enemies: THREE.Mesh[] = []; let points = 0; let lives = 3; let left = false; let right = false; let firing = false; let last = 0; let ended = false
    const fire = () => { const b = new THREE.Mesh(new THREE.SphereGeometry(.13, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15 })); b.position.copy(player.position); b.position.z -= 1; scene.add(b); bullets.push(b) }
    const spawn = () => { const e = new THREE.Mesh(new THREE.IcosahedronGeometry(.65, 1), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x450a0a })); e.position.set((Math.random() - .5) * 13, 0, -18); scene.add(e); enemies.push(e) }
    const key = (event: KeyboardEvent, down: boolean) => { if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') left = down; if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') right = down; if (event.key === ' ') firing = down }
    const kd = (e: KeyboardEvent) => key(e, true), ku = (e: KeyboardEvent) => key(e, false); window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)
    const animate = (time: number) => { if (ended) return; requestAnimationFrame(animate); const dt = Math.min((time - last) / 16, 3); last = time; if (left) player.position.x -= .18 * dt; if (right) player.position.x += .18 * dt; player.position.x = Math.max(-6, Math.min(6, player.position.x)); if (firing && time % 8 < 1) fire(); if (Math.random() < .018 * dt) spawn(); bullets.forEach(b => b.position.z -= .5 * dt); enemies.forEach(e => e.position.z += .08 * dt); for (let i = enemies.length - 1; i >= 0; i--) { if (enemies[i].position.z > 7) { scene.remove(enemies[i]); enemies.splice(i, 1); lives--; if (lives <= 0) { ended = true; onFinish(points); break } } }
      for (let i = bullets.length - 1; i >= 0; i--) for (let j = enemies.length - 1; j >= 0; j--) if (bullets[i].position.distanceTo(enemies[j].position) < 1) { scene.remove(bullets[i]); scene.remove(enemies[j]); bullets.splice(i, 1); enemies.splice(j, 1); points += 10; setScore(points); break }
      renderer.render(scene, camera) }; requestAnimationFrame(animate)
    return () => { ended = true; window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); renderer.dispose(); host.replaceChildren() }
  }, [onFinish])
  useEffect(() => { if (score <= 0) return; const body = new FormData(); body.set('game_id', gameId); body.set('score', String(score)); fetch('/api/scores', { method: 'POST', body }) }, [score, gameId])
  return <><p>Score: {score} · Controls: A/D or arrows to move, Space to fire</p><div ref={ref} className="game-frame" /></>
}
