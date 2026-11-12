import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export default function Typewriter({
  words = [],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
  className = "",
}) {
  const [text, setText]             = useState("");
  const [wordIndex, setWordIndex]   = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (words.length === 0 || reduceMotion) return;

    const currentWord = words[wordIndex];
    const finishedTyping   = !isDeleting && text === currentWord;
    const finishedDeleting = isDeleting && text === "";

    let delay = isDeleting ? deletingSpeed : typingSpeed;
    if (finishedTyping) delay = pauseTime; // hold the full word for a moment

    const timeout = setTimeout(() => {
      if (finishedTyping) {
        setIsDeleting(true);
      } else if (finishedDeleting) {
        // Move to next word after deleting
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        // Type or delete one character at a time
        setText(
          isDeleting
            ? currentWord.substring(0, text.length - 1)
            : currentWord.substring(0, text.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime, reduceMotion]);

  // With "reduce motion" on, show the first word without the typing effect.
  if (reduceMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={className}>
      {/* Screen readers get one stable phrase instead of every keystroke */}
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true">{text}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse align-middle"
      />
    </span>
  );
}
