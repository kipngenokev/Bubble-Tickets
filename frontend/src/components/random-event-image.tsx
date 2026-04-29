import { useMemo } from "react";

const IMAGE_COUNT = 4;

interface RandomEventImageProps {
  seed?: string;
  alt?: string;
}

const hashSeed = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const RandomEventImage: React.FC<RandomEventImageProps> = ({
  seed,
  alt = "Event banner",
}) => {
  const imageSrc = useMemo(() => {
    const index = seed
      ? (hashSeed(seed) % IMAGE_COUNT) + 1
      : Math.floor(Math.random() * IMAGE_COUNT) + 1;
    return `/event-image-${index}.webp`;
  }, [seed]);

  return (
    <img src={imageSrc} alt={alt} className="object-cover w-full h-full" />
  );
};

export default RandomEventImage;
