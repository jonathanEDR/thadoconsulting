interface BackgroundImageProps {
  imageUrl: string | null;
  alt: string;
}

export const BackgroundImage = ({ imageUrl, alt }: BackgroundImageProps) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
      style={{
        backgroundImage: `url(${imageUrl})`,
        opacity: 1
      }}
      role="img"
      aria-label={alt || 'Value Added background'}
    />
  );
};
