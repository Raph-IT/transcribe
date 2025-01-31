import { useEffect, useState } from "react";
import { cn } from "../../../utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, words]);

  return (
    <div className={cn("font-bold", className)}>
      {displayedText}
      {currentIndex < words.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
};
