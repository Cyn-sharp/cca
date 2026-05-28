import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[wordIndex];
    let timeout;

    if (!isDeleting && text === currentWord) {
      // Pause when full word is typed
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      // Move to next word after deleting
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      // Type or delete one character at a time
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting
            ? currentWord.substring(0, prev.length - 1)
            : currentWord.substring(0, prev.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
    </span>
  );
}