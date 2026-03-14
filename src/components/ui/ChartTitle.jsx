export default function ChartTitle({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white relative inline-block">
        {title}
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-netflix-red" />
      </h2>
      {subtitle && (
        <p className="text-netflix-light-gray mt-4 text-base max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
