class AudioController {
    constructor() {
        this.audio = document.getElementById('audio');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeValue = document.getElementById('volume-value');
        this.muteBtn = document.getElementById('mute-btn');
        this.speedControl = document.getElementById('speed-control');

        this.isMuted = false;
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.seekHandle = document.querySelector('.seek-handle');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.duration');
        this.trackTitle = document.getElementById('track-title');

        this.isDragging = false;
        this.isPlaying = false;

        this.init();
    }

    init() {
        // Load audio metadata
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        // Play/pause toggle
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Stop
        this.stopBtn.addEventListener('click', () => this.stop());

        // Mute control
        this.muteBtn.addEventListener('click', () => this.toggleMute());

        // Volume control
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Playback speed
        this.speedControl.addEventListener('change', (e) => {
            this.audio.playbackRate = parseFloat(e.target.value);
        });

        // Progress bar click to seek
        this.progressBar.addEventListener('click', (e) => this.seek(e));

        // Drag handle for seeking
        this.seekHandle.addEventListener('mousedown', () => {
            this.isDragging = true;
        });

        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Load initial track info
        this.updateTrackInfo();
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.playPauseBtn.innerHTML = '▶';
        this.isPlaying = false;
    }

    setVolume(value) {
        const volume = value / 100;
        this.audio.volume = volume;
        this.volumeValue.textContent = value + '%';
    }

    seek(e) {
        if (this.isDragging) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.audio.currentTime = percent * this.audio.duration;
        this.updateProgress();
    }

    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = percent + '%';
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    onPlay() {
        this.playPauseBtn.innerHTML = '⏸';
        this.isPlaying = true;
    }

    onPause() {
        this.playPauseBtn.innerHTML = '▶';
        this.isPlaying = false;
    }

    onEnded() {
        this.playPauseBtn.innerHTML = '▶';
        this.isPlaying = false;
    }

    updateTrackInfo() {
        this.trackTitle.textContent = 'Sample Track';
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.audio.currentTime += 5;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.audio.currentTime -= 5;
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        
        this.muteBtn.innerHTML = this.isMuted ? '🔇' : '🔊';
        
        // Restore volume display when unmuting
        if (!this.isMuted) {
            const volPercent = Math.round(this.audio.volume * 100);
            this.volumeValue.textContent = volPercent + '%';
        }
    }

    // Playlist methods (placeholder for future expansion)
    prevTrack() {
        console.log('Previous track');
    }

    nextTrack() {
        console.log('Next track');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AudioController();
});
