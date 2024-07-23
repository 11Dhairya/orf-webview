import React, { useState, useRef, useEffect } from 'react';
import './CustomAudioPlayer.css';
import playIcon from '../../assets/play.png';
import pauseIcon from '../../assets/pause.png';

const CustomAudioPlayer = ({ src, timer }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(timer || 0); 

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => {
        if (!timer) {
          setDuration(audio.duration);
        }
      };
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [timer]); 

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="custom-audio-player">
      <button className="play-pause-button" onClick={togglePlayPause}>
        <img
          src={isPlaying ? pauseIcon : playIcon}
          alt={isPlaying ? 'Pause' : 'Play'}
          className="icon"
        />
      </button>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
      </div>
      <div className="time-display">{formatTime(currentTime)}</div>
      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default CustomAudioPlayer;
