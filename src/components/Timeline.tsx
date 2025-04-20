"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineItem {
  year: number;
  content: string;
}

const SlidingTimeline: React.FC = () => {
  const TimelineData = useMemo<TimelineItem[]>(
    () => [
      {
        year: 2025,
        content:
          "We launched our revolutionary new parking technology, ParkMatrix at BAU München 2025!",
      },
      {
        year: 2019,
        content: "Relocated R&D Center to a new building in Üsküdar, Istanbul.",
      },
      {
        year: 2017,
        content:
          "We've exported our first fully automated parking system to Madrid, Spain, and have been granted the first and only 'R&D center' license in Turkey for the Automatic Parking sector.",
      },
      {
        year: 2016,
        content:
          "Launched Turkey's largest public fully automated parking system for Manisa Municipality, with a capacity of 560 vehicles.",
      },
      {
        year: 2015,
        content:
          "Developed and installed the first fully automated parking system using proprietary technology for İzmir Municipality, offering 280 parking spaces.",
      },
      {
        year: 2013,
        content:
          "Opened Yalova factory, Turkey's first facility dedicated to manufacturing automated parking systems.",
      },
      {
        year: 2010,
        content:
          "Rebranded as Otomatik Otopark Sistemleri A.Ş. with the trademark Parkolay.",
      },
      {
        year: 2008,
        content:
          "Introduced its first semi-automated parking system in Istanbul, accommodating 112 vehicles.",
      },
      {
        year: 2003,
        content:
          "Completed its first fully automated parking system in Istanbul, with a capacity of 612 vehicles.",
      },
      {
        year: 2002,
        content:
          "Implemented its first mechanical parking system in a residential project in Göztepe, Istanbul.",
      },
      {
        year: 1998,
        content:
          "Established as Turkey's first company specializing in automatic parking systems.",
      },
    ],
    []
  );

  const [activeYear, setActiveYear] = useState<number>(2025);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const yearMarkerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const firstMarkerPosition = Math.max(100, containerWidth * 0.1);
  const markerSpacing = 390;
  const totalWidth =
    Math.max(
      containerWidth,
      firstMarkerPosition +
        (TimelineData.length - 1) * markerSpacing +
        firstMarkerPosition
    ) + 70;

  const activeIndex = TimelineData.findIndex(
    (item) => item.year === activeYear
  );
  const detailPosition =
    activeIndex === -1
      ? firstMarkerPosition
      : firstMarkerPosition + activeIndex * markerSpacing;

  // Animation variants
  const animations = {
    lShape: {
      initial: { opacity: 0, scaleY: 0, originY: 0 },
      animate: { opacity: 1, scaleY: 1, transition: { duration: 0.25 } },
      exit: {
        opacity: 0,
        scaleY: 0,
        originY: 0,
        transition: { duration: 0.2 },
      },
    },
    content: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
      exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
    },
  };

  const getNextYear = useCallback(() => {
    const currentIndex = TimelineData.findIndex(
      (item) => item.year === activeYear
    );
    const nextIndex = (currentIndex + 1) % TimelineData.length;
    return TimelineData[nextIndex].year;
  }, [activeYear, TimelineData]);

  const handleTimelineInteraction = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    setUserInteracted(true);
    setIsAutoPlaying(false);
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    inactivityTimerRef.current = setTimeout(() => {
      if (isInView) {
        setUserInteracted(false);
        setIsAutoPlaying(true);
      }
    }, 5000);
  }, [isInView]);

  const scrollToYear = useCallback((year: number) => {
    if (!scrollContainerRef.current || !yearMarkerRefs.current[year]) return;

    const markerElement = yearMarkerRefs.current[year];
    const scrollContainer = scrollContainerRef.current;

    if (markerElement) {
      const markerRect = markerElement.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const targetScrollLeft =
        scrollContainer.scrollLeft +
        markerRect.left -
        containerRect.left -
        containerRect.width / 2 +
        markerRect.width / 2;

      scrollContainer.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    autoPlayIntervalRef.current = setInterval(() => {
      if (!userInteracted && isInView && !isAnimating) {
        const nextYear = getNextYear();
        setActiveYear(nextYear);
        setIsAnimating(true);
        scrollToYear(nextYear);
      }
    }, 4000);
  }, [userInteracted, isInView, isAnimating, getNextYear, scrollToYear]);

  const handleYearClick = useCallback(
    (year: number) => {
      handleTimelineInteraction();
      if (year !== activeYear && !isAnimating) {
        setActiveYear(year);
        setIsAnimating(true);
        scrollToYear(year);
      }
    },
    [activeYear, isAnimating, handleTimelineInteraction, scrollToYear]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handleTimelineInteraction();
      if (!scrollContainerRef.current) return;

      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);

      if (containerRef.current) {
        containerRef.current.style.cursor = "grabbing";
        containerRef.current.style.userSelect = "none";
      }
    },
    [handleTimelineInteraction]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
      containerRef.current.style.userSelect = "auto";
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !scrollContainerRef.current) return;

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        if (isInView) {
          setUserInteracted(false);
          setIsAutoPlaying(true);
        }
      }, 5000);

      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft, isInView]
  );

  useEffect(() => {
    // Clean up both timers when component unmounts
    return () => {
      if (autoPlayIntervalRef.current)
        clearInterval(autoPlayIntervalRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Update container width on resize
    const updateWidth = () => {
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    // Set up intersection observer
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isNowInView = entry.isIntersecting;
          setIsInView(isNowInView);

          if (isNowInView && isAutoPlaying && !userInteracted) {
            startAutoPlay();
          } else if (!isNowInView && autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isAutoPlaying, userInteracted, startAutoPlay]);

  useEffect(() => {
    // Start autoplay when component enters view
    if (isInView && isAutoPlaying && !userInteracted) {
      startAutoPlay();
    }
  }, [isInView, isAutoPlaying, userInteracted, startAutoPlay]);

  useEffect(() => {
    // Scroll to active year when in view
    if (isInView) {
      const timer = setTimeout(() => scrollToYear(activeYear), 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, activeYear, scrollToYear]);

  useEffect(() => {
    // Add global mouse event listeners
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <div className="w-full overflow-hidden">
      <div
        //   pl-[calc((100%-1132px)/2)]
        className="w-full cursor-grab "
        ref={containerRef}
        onTouchStart={handleTimelineInteraction}
      >
        <div
          className="timeline-scroll overflow-x-auto"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="relative h-[400px] pt-10 ">
            <div
              className="relative ml-0"
              style={{ width: `${totalWidth + 300}px` }}
            >
              {/* Timeline horizontal and vertical lines */}
              <div
                className="h-[2px] bg-[#B2B1B1] absolute top-6"
                style={{ width: `${totalWidth}px` }}
              ></div>
              <div className="absolute -top-1 left-0 w-[4px] h-[60px] bg-[#B2B1B1]"></div>
              <div
                className="absolute -top-1 w-[4px] h-[60px] bg-[#B2B1B1]"
                style={{ left: `${totalWidth}px` }}
              ></div>

              <div className="relative -top-11 z-20">
                {TimelineData.map((item, index) => (
                  <div
                    key={item.year}
                    className="absolute flex flex-col items-center cursor-pointer"
                    style={{
                      left: `${firstMarkerPosition + index * markerSpacing}px`,
                    }}
                    onClick={() => handleYearClick(item.year)}
                  >
                    <div
                      className={`${
                        activeYear === item.year
                          ? "text-cyan"
                          : "text-dark-gray"
                      } text-[35px]`}
                    >
                      {item.year}
                    </div>
                    <div
                      className="mb-3"
                      ref={(el) => {
                        yearMarkerRefs.current[item.year] = el;
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="82.402"
                        height="41.922"
                        viewBox="0 0 84 43"
                        fill="none"
                      >
                        <path
                          d="M4.79033 0.332275C5.36175 0.332275 5.95049 0.453488 6.48728 0.713227C17.6561 5.90802 29.6734 8.52273 42.1755 8.52273C54.6776 8.52273 66.6776 5.8907 77.8637 0.713227C78.4178 0.453488 78.9893 0.332275 79.5607 0.332275C80.7555 0.332275 81.9156 0.851754 82.6602 1.80413C83.7511 3.22404 83.578 5.16343 82.262 6.39286L44.8768 41.2153C44.1668 41.8906 43.1971 42.2542 42.1755 42.2542C41.1539 42.2542 40.2015 41.8733 39.4742 41.2153L2.08903 6.39286C0.773013 5.16343 0.599861 3.22404 1.69077 1.80413C2.43535 0.851754 3.59552 0.332275 4.79033 0.332275Z"
                          fill={
                            activeYear === item.year ? "#09A5B6" : "#B2B1B1"
                          }
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence
                mode="wait"
                onExitComplete={() => setIsAnimating(false)}
              >
                {isInView && (
                  <motion.div
                    key={activeYear}
                    className="absolute z-10 top-[42px] pointer-events-none"
                    style={{ left: `${detailPosition}px` }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex">
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="69"
                        height="133"
                        viewBox="0 0 69 133"
                        fill="none"
                        className="min-w-16 ml-[41px]"
                        variants={animations.lShape}
                      >
                        <path
                          d="M1.17969 0.766357V131.363H68.0366"
                          stroke="#B2B1B1"
                          strokeWidth="1.7316"
                        />
                      </motion.svg>

                      <motion.div
                        className="text-[30px] text-dark-gray max-w-[509px] pl-2 pt-[105px]"
                        variants={animations.content}
                      >
                        {
                          TimelineData.find((item) => item.year === activeYear)
                            ?.content
                        }
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SlidingTimeline };
