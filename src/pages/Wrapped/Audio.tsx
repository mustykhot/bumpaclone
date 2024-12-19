import React, { useEffect, useRef, useState } from "react";

export const Audio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isSoundPaused, setSoundIsPaused] = useState(audioRef.current?.paused);

  const play = () => {
    if (audioRef) {
      audioRef.current?.play();
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  const onControl = () => {
    if (audioRef.current?.paused) {
      play();
      setSoundIsPaused(false);
    } else {
      pause();
      setSoundIsPaused(true);
    }
  };
  useEffect(() => {
    if(audioRef){
      audioRef.current?.play();

      // setSoundIsPaused(audioRef.current?.play());
    }
    // var audio = document.querySelector<HTMLAudioElement>("myAudio");
    // audio?.volume = 0.2;
    // sett
  }, [audioRef]);
  return (
    <div>
      <div>
        <audio id="myAudio" loop ref={audioRef}>
          <source
            src="/audio/ES_ItsintheMist-SpectaclesWalletandWatch.mp3"
            type="audio/mp3"
          />
        </audio>
        <button
          onClick={() => {
            onControl();
          }}
          className="flex gap-x-4 px-5 text-left items-center "
        >
          {!isSoundPaused ? (
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 13.3346V6.66797"
                stroke="#5444F2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 13.3346V2.66797"
                stroke="#5444F2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.5 13.332V9.33203"
                stroke="#5444F2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.50016 14.6654C12.1821 14.6654 15.1668 11.6806 15.1668 7.9987C15.1668 4.3168 12.1821 1.33203 8.50016 1.33203C4.81826 1.33203 1.8335 4.3168 1.8335 7.9987C1.8335 11.6806 4.81826 14.6654 8.50016 14.6654Z"
                stroke="#848484"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.1665 5.33203L11.1665 7.9987L7.1665 10.6654V5.33203Z"
                fill="#848484"
                stroke="#848484"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <div className="flex flex-col ">
            <span className="tags text-black">It’s in the Mist</span>
            {/* <span className="subtitles text-dim-grey">
              {isSoundPaused ? "Paused" : "Playing..."}
            </span> */}
          </div>
        </button>
      </div>
    </div>
  )
}
