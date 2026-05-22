import { motion } from 'framer-motion'

export function GameShell({ title, subtitle, children, crest }) {
  return (
    <div className="min-h-dvh flex flex-col bg-[#0a0608] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(139,26,43,0.15) 0%, transparent 40%)',
        }}
      />
      <header className="relative z-10 px-4 pt-6 pb-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl text-[#c9a227] tracking-widest"
        >
          {crest ?? '⚜'} {title}
        </motion.div>
        {subtitle && (
          <p className="mt-2 text-[#e8dcc4]/70 text-sm md:text-base">{subtitle}</p>
        )}
      </header>
      <main className="relative z-10 flex-1 flex flex-col px-4 pb-8 max-w-lg mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
