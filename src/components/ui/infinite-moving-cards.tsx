import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      setStart(true);
    }
  }

  const getSpeed = () => {
    switch (speed) {
      case "fast":
        return "30s";
      case "normal":
        return "40s";
      case "slow":
        return "50s";
      default:
        return "40s";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-5xl overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={
          {
            "--animation-duration": getSpeed(),
            "--animation-direction": direction === "left" ? "forwards" : "reverse",
          } as React.CSSProperties
        }
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[300px] md:w-[400px] max-w-full relative rounded-[25px] flex-shrink-0 bg-[#d9d9d9] px-8 py-6 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]"
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] text-[#443f3f] font-normal [font-family:'Montserrat_Alternates',Helvetica]">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                    {item.name}
                  </span>
                  <span className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};