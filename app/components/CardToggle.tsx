import React, { useRef, useState, useEffect, type JSX, useCallback } from "react";
import { ChevronsDown } from "lucide-react";

type CardToggleProps = {
  title: string;
  children: React.ReactNode;
};

export const CardToggle = ({
  title,
  children,
}: CardToggleProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState("auto");
  const [hasActiveDropdown, setHasActiveDropdown] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleCard = (): void => {
    setIsOpen((prev) => !prev);
  };

  const updateHeight = () => {
    if (contentRef.current && isOpen) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(`${scrollHeight}px`);
    }
  };

  useEffect(() => {
    updateHeight(); // Set initial height when open
  }, [isOpen]);

  // Detectar dropdowns activos
  useEffect(() => {
    const content = contentRef.current;
    if (!content || !isOpen) return;

    const checkForDropdowns = () => {
      // Buscar dropdowns activos (elementos con z-10 o z-50 que indican dropdowns)
      const dropdowns = content.querySelectorAll('[class*="z-10"], [class*="z-50"], .dropdown-active');
      setHasActiveDropdown(dropdowns.length > 0);
    };

    // Observe content size change
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
      checkForDropdowns();
    });

    resizeObserver.observe(content);

    // Observe child DOM changes (e.g., append/remove)
    const mutationObserver = new MutationObserver(() => {
      updateHeight();
      checkForDropdowns();
    });

    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Check initially
    checkForDropdowns();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isOpen]);

  return (
    <div className="rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700 bg-white px-4 py-4 dark:bg-gray-800/50">
      <div
        onClick={toggleCard}
        className={`cursor-pointer flex justify-start items-center gap-2 px-2 sm:px-4 pb-2 ${
          isOpen ? "border-b" : ""
        } border-gray-300 dark:border-gray-600`}
      >
        <ChevronsDown
          className={`w-6 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
        <h2 className="md:text-lg sm:text-md font-normal text-zinc-700 dark:text-zinc-200">
          {title}
        </h2>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? height : "0px",
          overflow: (isOpen && hasActiveDropdown) ? "visible" : isOpen ? "visible" : "hidden",
          transition: "max-height 0.4s ease-in-out",
        }}
      >
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
};