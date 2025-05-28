export const GradientBall = ({ className = "", size = 400 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 400 400"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="ballGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2187E1" stopOpacity="1" />
        <stop offset="50%" stopColor="#2187E1" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2187E1" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="200" cy="200" r="200" fill="url(#ballGradient)" />
  </svg>
);
