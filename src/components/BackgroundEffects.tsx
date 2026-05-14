import { motion } from 'framer-motion'

const particles = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${(index * 7.2) % 100}%`,
  top: `${(index * 11.7) % 100}%`,
  size: 4 + (index % 5) * 3,
  duration: 6 + (index % 4) * 1.8,
}))

export function BackgroundEffects() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-[-18rem] h-[28rem] bg-[radial-gradient(circle,_rgba(57,208,255,0.22),_transparent_58%)] blur-3xl" />
      <div className="absolute right-[-8rem] top-[22%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(90,124,255,0.18),_transparent_62%)] blur-3xl" />
      <div className="absolute left-[-10rem] top-[52%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(56,244,199,0.12),_transparent_65%)] blur-3xl" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-300/40 shadow-[0_0_18px_rgba(57,208,255,0.45)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.25, 0.7, 0.25],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: particle.id * 0.18,
          }}
        />
      ))}
    </div>
  )
}
