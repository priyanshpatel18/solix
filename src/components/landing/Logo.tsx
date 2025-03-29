interface LogoProps {
  className?: string;
  width: number;
}

export default function Logo({ width, className = "" }: LogoProps) {
  return (
    <svg width={width} height={width} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30 10C18.95 10 10 18.95 10 30C10 41.05 18.95 50 30 50C41.05 50 50 41.05 50 30C50 18.95 41.05 10 30 10ZM30 15C38.28 15 45 21.72 45 30C45 38.28 38.28 45 30 45C21.72 45 15 38.28 15 30C15 21.72 21.72 15 30 15Z" fill="currentColor" className="text-primary" />
      <path d="M30 20C24.48 20 20 24.48 20 30C20 35.52 24.48 40 30 40C35.52 40 40 35.52 40 30C40 24.48 35.52 20 30 20Z" fill="currentColor" className="text-primary" />
    </svg>
  )
}
