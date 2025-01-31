import { useEffect, useState } from "react";
import { cn } from "../../../utils/cn";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex].text;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className={cn("inline-flex", className)}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className={cn(
            "absolute opacity-0",
            idx === currentWordIndex && "opacity-100",
            word.className
          )}
        >
          {word.text}
        </span>
      ))}
      <span
        className={cn(
          "ml-1.5 inline-block h-4 w-0.5 animate-blink bg-white",
          cursorClassName
        )}
      />
    </span>
  );
};
