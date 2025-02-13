'use client';

interface CircularProgressProps {
  value: number;
  text: string;
  pathColor: string;
  textColor: string;
  trailColor: string;
}

const CircularProgress = ({ value, text, pathColor, textColor, trailColor }: CircularProgressProps) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="transition-all duration-300"
          stroke={trailColor}
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
        <circle
          className="transition-all duration-300"
          stroke={pathColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
      </svg>
      <span 
        className="absolute text-xl font-bold"
        style={{ color: textColor }}
      >
        {text}
      </span>
    </div>
  );
};

export default CircularProgress; 