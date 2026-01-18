const TornBackground = () => {
  return (
    <>
      <svg width="0" height="0" className="absolute hidden">
        <filter id="wavy">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.025"
            numOctaves="4"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="fixed  inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2" style={{ backgroundColor: "var(--user-cream-orange)" }} />
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-white" />
        <div
          className="absolute left-[-5%] top-1/2 w-[110%] h-[120px] bg-orange-100 -translate-y-1/2"
          style={{
            filter: "url(#wavy)",
            backgroundColor: "var(--user-cream-orange)"
          }}
        />
      </div>
    </>
  );
};

export default TornBackground;
