'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useUserAccess } from '../hooks/useUserAccess';
import { useAuth } from '../contexts/AuthContext';
import styles from './CustomVideoPlayer.module.css';

interface CustomVideoPlayerProps {
  lessonId: string;
  title?: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ lessonId, title }) => {
  const { user } = useAuth();
  const { accessData, loading, error } = useUserAccess(lessonId);
  
  console.log('🔍 CustomVideoPlayer Debug:');
  console.log('- User:', user);
  console.log('- AccessData:', accessData);
  console.log('- AccessData?.hasAccess:', accessData?.hasAccess);
  console.log('- !accessData?.hasAccess:', !accessData?.hasAccess);
  console.log('- Loading:', loading);
  console.log('- Error:', error);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);

  // Auto hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Update buffered
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered((bufferedEnd / duration) * 100);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const newRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Sprawdzanie dostępu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorText}>Błąd: {error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginOverlay}>
          <div className={styles.loginIcon}>🔐</div>
          <h3 className={styles.loginTitle}>Zaloguj się</h3>
          <p className={styles.loginDescription}>Aby oglądać lekcje, musisz być zalogowany</p>
          <button className={styles.loginButton}>
            Zaloguj się
          </button>
        </div>
      </div>
    );
  }

  if (!accessData?.hasAccess) {
    return (
      <div className={styles.subscriptionContainer}>
        <div className={styles.subscriptionOverlay}>
          <div className={styles.subscriptionIcon}>👑</div>
          <h3 className={styles.subscriptionTitle}>Dostęp Premium</h3>
          <p className={styles.subscriptionDescription}>Ta lekcja wymaga aktywnej subskrypcji Premium</p>
          <button className={styles.subscriptionButton}>
            Kup Subskrypcję Premium
          </button>
        </div>
      </div>
    );
  }

  // User has access - show custom video player
  return (
    <div className={styles.playerContainer}>
      {title && <h2 className={styles.playerTitle}>{title}</h2>}
      
      <div 
        className={styles.videoWrapper}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {accessData?.lesson?.videoUrl ? (
          <>
            <video
              ref={videoRef}
              className={styles.video}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onClick={togglePlay}
            >
              <source src={accessData.lesson.videoUrl} type="video/mp4" />
              Twoja przeglądarka nie obsługuje odtwarzacza wideo.
            </video>

            {/* Play/Pause Overlay */}
            <div 
              className={`${styles.playOverlay} ${showControls ? styles.visible : styles.hidden}`}
              onClick={togglePlay}
            >
              <button className={styles.playButton}>
                <div className={styles.playIcon}>
                  {isPlaying ? '⏸️' : '▶️'}
                </div>
              </button>
            </div>

            {/* Custom Controls */}
            <div className={`${styles.controls} ${showControls ? styles.visible : styles.hidden}`}>
              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div 
                  className={styles.progressBar}
                  onClick={handleSeek}
                >
                  {/* Buffered Progress */}
                  <div 
                    className={styles.bufferedProgress}
                    style={{ width: `${buffered}%` }}
                  />
                  {/* Current Progress */}
                  <div 
                    className={styles.currentProgress}
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  {/* Progress Thumb */}
                  <div 
                    className={styles.progressThumb}
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls Row */}
              <div className={styles.controlsRow}>
                <div className={styles.controlsLeft}>
                  {/* Play/Pause */}
                  <button 
                    onClick={togglePlay}
                    className={styles.controlButton}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>

                  {/* Volume */}
                  <div className={styles.volumeControl}>
                    <button 
                      onClick={toggleMute}
                      className={styles.controlButton}
                    >
                      {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className={styles.volumeSlider}
                    />
                  </div>

                  {/* Time Display */}
                  <div className={styles.timeDisplay}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className={styles.controlsRight}>
                  {/* Playback Speed */}
                  <button 
                    onClick={changePlaybackRate}
                    className={styles.speedButton}
                  >
                    {playbackRate}x
                  </button>

                  {/* Fullscreen */}
                  <button 
                    onClick={toggleFullscreen}
                    className={styles.controlButton}
                  >
                    ⛶
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noVideoContainer}>
            <div className={styles.noVideoContent}>
              <div className={styles.noVideoIcon}>📹</div>
              <p className={styles.noVideoText}>Brak dostępnego wideo</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomVideoPlayer;