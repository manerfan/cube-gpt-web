
const BackgroundBaanderole: React.FC = () => {
  return (
    <div className="absolute z-1 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="flex-none flex justify-end">
          <picture>
            <source
              srcSet="/bg/top_bg.avif"
              type="image/avif"
              className="flex-none max-w-none"
            />
            <img
              src="/bg/top_bg.png"
              alt=""
              className="flex-none max-w-none"
              decoding="async"
            />
          </picture>
        </div>
      </div>
  );
};

export default BackgroundBaanderole;