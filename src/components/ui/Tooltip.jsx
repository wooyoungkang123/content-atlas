export default function Tooltip({ x, y, visible, children }) {
  if (!visible || !children) return null

  return (
    <div
      className="absolute pointer-events-none z-50 border-l-4 border-netflix-red bg-black/90 text-white text-sm px-3 py-2 rounded-r shadow-lg max-w-[220px]"
      style={{ left: x, top: y, transform: 'translateY(-50%)' }}
    >
      {children}
    </div>
  )
}
