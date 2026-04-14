interface Props {
  stars: number; // 1–3
}

export function StarRating({ stars }: Props) {
  return (
    <div className="flex gap-5 justify-center">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={`text-5xl sm:text-6xl leading-none ${
            i <= stars ? 'animate-star-pop' : 'opacity-20 grayscale'
          }`}
          style={
            i <= stars
              ? { animationDelay: `${(i - 1) * 200}ms`, animationFillMode: 'both' }
              : undefined
          }
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
