export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-netflix-dark z-50">
      <svg viewBox="0 0 111 30" className="w-32 mb-8" aria-label="Netflix">
        <path
          fill="#E50914"
          d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.947-10.604-4.054 9.454c-1.675-.268-3.332-.51-5.02-.729l6.584-14.929L94.1 0h5.037l3.66 9.195L106.57 0h5.12zm-30.01 13.55c3.875.154 7.763.39 11.633.682V23.6h-6.507V.001h4.874zm-13.058-9.624v3.47c1.764 0 4.97-.043 6.862-.043v4.456c-1.998 0-5.02.016-6.862.063V30c-1.632-.1-3.27-.177-4.915-.237V.001h13.609v4.205zm-15.543 9.066c0 4.944 0 10.014.17 15.2-1.636-.06-3.271-.088-4.915-.088V.001h4.745zm-12.27-13.07v27.785c-1.7 0-3.385.025-5.07.086V4.206H23.1V.001zm-22.14 27.08c-1.665.125-3.32.287-4.963.476v-12.57L1.933 16.666V30C1.289 30.112.645 30.237 0 30.374V0h4.963v11.87l5.174-11.87H15.4L9.04 14.03z"
        />
      </svg>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-netflix-red animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-netflix-gray mt-4 text-sm tracking-widest uppercase">
        Loading dataset
      </p>
    </div>
  )
}
