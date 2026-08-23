/**
 * MUZIC.PW - FAST & BAREBONES MATERIAL DESIGN 3 MUSIC PLAYER
 * Clean, lightweight, instant-loading browser music player for user audio tracks.
 * Features: Native HTML5 Audio, Android 13/14 Squiggly Progress Bar, Drag-and-Drop Library.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. APPLICATION STATE
     ========================================================================== */
  const state = {
    tracks: [], // { id, name, file, url, duration }
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    shuffle: false,
    repeat: 'off', // 'off', 'all', 'one'
    searchQuery: '',
    isDraggingScrubber: false,
    hoverRatio: null
  };

  /* ==========================================================================
     2. ANDROID 13/14 SQUIGGLY PROGRESS BAR RENDERER (CANVAS)
     ========================================================================== */
  class SquigglyWaveRenderer {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.phase = 0;
      this.currentAmp = 0;
      this.targetAmp = 4;
      this.wavelength = 28;
      this.color = '#FF2A85';
      this.unplayedColor = 'rgba(255, 255, 255, 0.16)';
      this.lastTime = performance.now();

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    render(time, duration, isPlaying, hoverRatio = null) {
      if (!this.canvas || !this.ctx || !this.width) return;

      const now = performance.now();
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;

      // Animate wave phase and amplitude
      if (isPlaying) {
        this.phase += 8.5 * dt;
        this.currentAmp += (this.targetAmp - this.currentAmp) * 0.15;
      } else {
        // Flatten wave smoothly on pause
        this.currentAmp += (0 - this.currentAmp) * 0.12;
      }

      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      const centerY = this.height / 2;
      const progress = duration > 0 ? Math.min(1, Math.max(0, time / duration)) : 0;
      const playedWidth = progress * this.width;

      // 1. Draw Unplayed Track (Right side)
      if (playedWidth < this.width) {
        ctx.beginPath();
        ctx.strokeStyle = this.unplayedColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.moveTo(Math.max(0, playedWidth), centerY);
        ctx.lineTo(this.width, centerY);
        ctx.stroke();
      }

      // 2. Draw Squiggly Wave (Left / Played side)
      if (playedWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(255, 42, 133, 0.5)';
        ctx.shadowBlur = 8;

        ctx.moveTo(0, centerY);

        const step = 2;
        for (let x = 0; x <= playedWidth; x += step) {
          // Dampen wave at start and end for smooth attachment
          const dampStart = Math.min(1, x / 20);
          const dampEnd = Math.min(1, (playedWidth - x) / 20);
          const edgeDamp = Math.sin(dampStart * (Math.PI / 2)) * Math.sin(dampEnd * (Math.PI / 2));
          const amp = this.currentAmp * (edgeDamp > 0 ? edgeDamp : 0);

          const y = centerY + amp * Math.sin((x / this.wavelength) * (Math.PI * 2) - this.phase);
          ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw Thumb at playedWidth
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 42, 133, 0.8)';
      ctx.shadowBlur = 10;
      ctx.arc(playedWidth, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(playedWidth, centerY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Hover indicator
      if (hoverRatio !== null && hoverRatio >= 0 && hoverRatio <= 1) {
        const hoverX = hoverRatio * this.width;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.arc(hoverX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* ==========================================================================
     3. CORE APP CONTROLLER
     ========================================================================== */
  class MuzicApp {
    constructor() {
      this.audio = document.getElementById('audio-player');
      this.squiggly = new SquigglyWaveRenderer('squiggly-canvas');
      this.toastTimeout = null;
    }

    init() {
      this.bindDOMElements();
      this.bindAudioEvents();
      this.bindUIEvents();
      this.bindKeyboardShortcuts();
      this.startLoop();
      this.renderTable();
      this.updateLibraryBadge();
    }

    bindDOMElements() {
      // Header & Actions
      this.fileInput = document.getElementById('audio-file-input');
      this.btnImport = document.getElementById('btn-import-header');
      this.btnClear = document.getElementById('btn-clear-library');
      this.libraryBadge = document.getElementById('library-count-badge');
      this.dropzone = document.getElementById('dropzone-card');
      this.dropzoneClickArea = document.getElementById('dropzone-click-area');
      this.searchInput = document.getElementById('library-search-input');

      // Table & Empty State
      this.tracksTbody = document.getElementById('tracks-tbody');
      this.emptyState = document.getElementById('empty-state');
      this.tracksTable = document.getElementById('tracks-table');

      // Bottom Player
      this.trackTitle = document.getElementById('player-track-title');
      this.trackArtist = document.getElementById('player-track-artist');
      this.artDisc = document.getElementById('player-art-disc');
      this.btnPlayPause = document.getElementById('btn-play-pause');
      this.svgPlay = document.getElementById('svg-play');
      this.svgPause = document.getElementById('svg-pause');
      this.btnPrev = document.getElementById('btn-prev');
      this.btnNext = document.getElementById('btn-next');
      this.btnShuffle = document.getElementById('btn-shuffle');
      this.btnRepeat = document.getElementById('btn-repeat');
      this.svgRepeat = document.getElementById('svg-repeat');
      this.svgRepeatOne = document.getElementById('svg-repeat-one');

      // Scrubber & Volume
      this.timeCurrent = document.getElementById('time-current');
      this.timeTotal = document.getElementById('time-total');
      this.squigglyWrapper = document.getElementById('squiggly-wrapper');
      this.timeTooltip = document.getElementById('time-tooltip');
      this.btnMute = document.getElementById('btn-mute-toggle');
      this.svgVolUp = document.getElementById('svg-vol-up');
      this.svgVolMute = document.getElementById('svg-vol-mute');
      this.volumeTrack = document.getElementById('volume-track');
      this.volumeFill = document.getElementById('volume-fill');

      // Toast
      this.toastSnackbar = document.getElementById('toast-snackbar');
      this.toastMessage = document.getElementById('toast-message');
    }

    bindAudioEvents() {
      // Audio Time Update
      this.audio.addEventListener('timeupdate', () => {
        if (!state.isDraggingScrubber) {
          state.currentTime = this.audio.currentTime;
          this.timeCurrent.textContent = this.formatTime(state.currentTime);
        }
      });

      // Loaded Audio Duration
      this.audio.addEventListener('loadedmetadata', () => {
        state.duration = this.audio.duration || 0;
        this.timeTotal.textContent = this.formatTime(state.duration);
        if (state.currentIndex >= 0 && state.tracks[state.currentIndex]) {
          state.tracks[state.currentIndex].duration = state.duration;
          this.renderTable();
        }
      });

      // Track Ended
      this.audio.addEventListener('ended', () => {
        if (state.repeat === 'one') {
          this.audio.currentTime = 0;
          this.audio.play();
        } else {
          this.playNext();
        }
      });

      // Audio Play / Pause state sync
      this.audio.addEventListener('play', () => {
        state.isPlaying = true;
        this.updatePlayStateUI(true);
      });

      this.audio.addEventListener('pause', () => {
        state.isPlaying = false;
        this.updatePlayStateUI(false);
      });
    }

    bindUIEvents() {
      // File Import Buttons
      this.btnImport?.addEventListener('click', () => this.fileInput?.click());
      this.dropzoneClickArea?.addEventListener('click', () => this.fileInput?.click());
      this.fileInput?.addEventListener('change', (e) => this.handleFiles(e.target.files));

      // Drag & Drop on Dropzone & Window
      ['dragenter', 'dragover'].forEach(eventName => {
        window.addEventListener(eventName, (e) => {
          e.preventDefault();
          this.dropzone?.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        window.addEventListener(eventName, (e) => {
          e.preventDefault();
          this.dropzone?.classList.remove('drag-over');
        });
      });

      window.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFiles(e.dataTransfer.files);
        }
      });

      // Clear Library
      this.btnClear?.addEventListener('click', () => {
        if (confirm('Clear all imported songs from library?')) {
          this.clearLibrary();
        }
      });

      // Live Library Search
      this.searchInput?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTable();
      });

      // Player Controls
      this.btnPlayPause?.addEventListener('click', () => this.togglePlayPause());
      this.btnPrev?.addEventListener('click', () => this.playPrev());
      this.btnNext?.addEventListener('click', () => this.playNext());
      this.btnShuffle?.addEventListener('click', () => this.toggleShuffle());
      this.btnRepeat?.addEventListener('click', () => this.toggleRepeat());

      // Progress Scrubber Interaction
      if (this.squigglyWrapper) {
        this.squigglyWrapper.addEventListener('mousemove', (e) => {
          const rect = this.squigglyWrapper.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          state.hoverRatio = ratio;
          const previewTime = ratio * (state.duration || 0);
          this.timeTooltip.textContent = this.formatTime(previewTime);
          this.timeTooltip.style.left = `${ratio * 100}%`;
        });

        this.squigglyWrapper.addEventListener('mouseleave', () => {
          state.hoverRatio = null;
        });

        this.squigglyWrapper.addEventListener('mousedown', (e) => {
          state.isDraggingScrubber = true;
          this.handleScrubSeek(e);
        });

        window.addEventListener('mousemove', (e) => {
          if (state.isDraggingScrubber) {
            this.handleScrubSeek(e);
          }
        });

        window.addEventListener('mouseup', () => {
          if (state.isDraggingScrubber) {
            state.isDraggingScrubber = false;
            this.audio.currentTime = state.currentTime;
          }
        });
      }

      // Volume Controls
      this.btnMute?.addEventListener('click', () => this.toggleMute());
      this.volumeTrack?.addEventListener('click', (e) => {
        const rect = this.volumeTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.setVolume(ratio);
      });
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;

        switch (e.code) {
          case 'Space':
            e.preventDefault();
            this.togglePlayPause();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.seekRelative(5);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.seekRelative(-5);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.setVolume(Math.min(1, state.volume + 0.05));
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.setVolume(Math.max(0, state.volume - 0.05));
            break;
          case 'KeyM':
            this.toggleMute();
            break;
          case 'KeyS':
            this.toggleShuffle();
            break;
          case 'KeyR':
            this.toggleRepeat();
            break;
        }
      });
    }

    /* ==========================================================================
       4. FILE HANDLING & LIBRARY LOGIC
       ========================================================================== */
    handleFiles(files) {
      if (!files || files.length === 0) return;
      let count = 0;
      const initialEmpty = state.tracks.length === 0;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)) {
          return;
        }

        const url = URL.createObjectURL(file);
        const name = file.name.replace(/\.[^/.]+$/, "");
        const track = {
          id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: name,
          file: file,
          url: url,
          duration: 0
        };

        // Pre-fetch duration
        const temp = new Audio(url);
        temp.addEventListener('loadedmetadata', () => {
          if (temp.duration && !isNaN(temp.duration)) {
            track.duration = temp.duration;
            this.renderTable();
          }
        });

        state.tracks.push(track);
        count++;
      });

      if (count > 0) {
        this.renderTable();
        this.updateLibraryBadge();
        this.showToast(`Added ${count} ${count === 1 ? 'song' : 'songs'} to library`);

        if (initialEmpty && state.tracks.length > 0) {
          this.loadTrack(0, true);
        }
      }
    }

    clearLibrary() {
      state.tracks.forEach(t => URL.revokeObjectURL(t.url));
      state.tracks = [];
      state.currentIndex = -1;
      this.audio.pause();
      this.audio.src = '';
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
      this.trackTitle.textContent = 'No track selected';
      this.trackArtist.textContent = 'Add songs to play';
      this.timeCurrent.textContent = '0:00';
      this.timeTotal.textContent = '0:00';
      this.updatePlayStateUI(false);
      this.renderTable();
      this.updateLibraryBadge();
      this.showToast('Library cleared');
    }

    deleteTrack(index, e) {
      e?.stopPropagation();
      const track = state.tracks[index];
      if (!track) return;

      URL.revokeObjectURL(track.url);
      state.tracks.splice(index, 1);

      if (state.currentIndex === index) {
        if (state.tracks.length > 0) {
          const next = index >= state.tracks.length ? 0 : index;
          this.loadTrack(next, state.isPlaying);
        } else {
          this.clearLibrary();
          return;
        }
      } else if (state.currentIndex > index) {
        state.currentIndex--;
      }

      this.renderTable();
      this.updateLibraryBadge();
      this.showToast(`Removed "${track.name}"`);
    }

    updateLibraryBadge() {
      const len = state.tracks.length;
      if (this.libraryBadge) {
        this.libraryBadge.textContent = `${len} ${len === 1 ? 'song' : 'songs'}`;
      }
      if (this.btnClear) {
        this.btnClear.style.display = len > 0 ? 'inline-flex' : 'none';
      }
    }

    renderTable() {
      if (!this.tracksTbody || !this.emptyState) return;

      const filtered = state.tracks.map((t, idx) => ({ track: t, originalIndex: idx })).filter(item => {
        if (!state.searchQuery) return true;
        return item.track.name.toLowerCase().includes(state.searchQuery);
      });

      if (state.tracks.length === 0) {
        this.tracksTable.style.display = 'none';
        this.emptyState.style.display = 'flex';
        return;
      }

      this.tracksTable.style.display = 'table';
      this.emptyState.style.display = 'none';
      this.tracksTbody.innerHTML = '';

      filtered.forEach(({ track, originalIndex }, i) => {
        const isCurrent = originalIndex === state.currentIndex;
        const row = document.createElement('tr');
        row.className = `track-row ${isCurrent ? 'active' : ''}`;

        row.innerHTML = `
          <td class="t-num-cell">${i + 1}</td>
          <td>
            <div class="t-title-cell">
              <div class="t-mini-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <span class="t-title-text" title="${track.name}">${track.name}</span>
            </div>
          </td>
          <td class="t-duration-cell">${this.formatTime(track.duration)}</td>
          <td class="t-actions-cell">
            <button class="btn-del-track" title="Remove track">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </td>
        `;

        // Row Click: Play song
        row.addEventListener('click', () => {
          this.loadTrack(originalIndex, true);
        });

        // Delete button
        row.querySelector('.btn-del-track').addEventListener('click', (e) => {
          this.deleteTrack(originalIndex, e);
        });

        this.tracksTbody.appendChild(row);
      });
    }

    /* ==========================================================================
       5. PLAYBACK CONTROLLER
       ========================================================================== */
    loadTrack(index, autoPlay = true) {
      if (index < 0 || index >= state.tracks.length) return;
      state.currentIndex = index;
      const track = state.tracks[index];

      this.audio.src = track.url;
      this.trackTitle.textContent = track.name;
      this.trackArtist.textContent = 'Local Audio';

      state.currentTime = 0;
      this.timeCurrent.textContent = '0:00';

      this.renderTable();

      if (autoPlay) {
        this.play();
      }
    }

    play() {
      if (state.currentIndex === -1 && state.tracks.length > 0) {
        this.loadTrack(0, true);
        return;
      }
      this.audio.play().catch(e => console.warn(e));
    }

    pause() {
      this.audio.pause();
    }

    togglePlayPause() {
      if (state.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    playNext() {
      if (state.tracks.length === 0) return;

      if (state.shuffle) {
        const rand = Math.floor(Math.random() * state.tracks.length);
        this.loadTrack(rand, true);
        return;
      }

      let next = state.currentIndex + 1;
      if (next >= state.tracks.length) {
        if (state.repeat === 'all') next = 0;
        else {
          this.pause();
          return;
        }
      }
      this.loadTrack(next, true);
    }

    playPrev() {
      if (state.tracks.length === 0) return;
      if (this.audio.currentTime > 3) {
        this.audio.currentTime = 0;
        return;
      }
      let prev = state.currentIndex - 1;
      if (prev < 0) prev = state.tracks.length - 1;
      this.loadTrack(prev, true);
    }

    handleScrubSeek(e) {
      const rect = this.squigglyWrapper.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      state.currentTime = ratio * (state.duration || 0);
      this.timeCurrent.textContent = this.formatTime(state.currentTime);
    }

    seekRelative(delta) {
      if (!state.duration) return;
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + delta));
    }

    setVolume(val) {
      state.volume = Math.max(0, Math.min(1, val));
      state.isMuted = state.volume === 0;
      this.audio.volume = state.isMuted ? 0 : state.volume;
      this.volumeFill.style.width = `${state.volume * 100}%`;
      this.svgVolUp.style.display = state.isMuted ? 'none' : 'block';
      this.svgVolMute.style.display = state.isMuted ? 'block' : 'none';
    }

    toggleMute() {
      state.isMuted = !state.isMuted;
      this.audio.volume = state.isMuted ? 0 : state.volume;
      this.volumeFill.style.width = state.isMuted ? '0%' : `${state.volume * 100}%`;
      this.svgVolUp.style.display = state.isMuted ? 'none' : 'block';
      this.svgVolMute.style.display = state.isMuted ? 'block' : 'none';
    }

    toggleShuffle() {
      state.shuffle = !state.shuffle;
      this.btnShuffle.classList.toggle('active', state.shuffle);
      this.showToast(`Shuffle ${state.shuffle ? 'On' : 'Off'}`);
    }

    toggleRepeat() {
      const modes = ['off', 'all', 'one'];
      const next = modes[(modes.indexOf(state.repeat) + 1) % modes.length];
      state.repeat = next;

      const isOne = state.repeat === 'one';
      const isActive = state.repeat !== 'off';

      this.btnRepeat.classList.toggle('active', isActive);
      this.svgRepeat.style.display = isOne ? 'none' : 'block';
      this.svgRepeatOne.style.display = isOne ? 'block' : 'none';

      this.showToast(`Repeat: ${state.repeat.toUpperCase()}`);
    }

    updatePlayStateUI(playing) {
      this.svgPlay.style.display = playing ? 'none' : 'block';
      this.svgPause.style.display = playing ? 'block' : 'none';
      this.artDisc.classList.toggle('playing', playing);
    }

    /* ==========================================================================
       6. MAIN SQUIGGLY ANIMATION LOOP
       ========================================================================== */
    startLoop() {
      const loop = () => {
        this.squiggly.render(state.currentTime, state.duration, state.isPlaying, state.hoverRatio);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    showToast(msg) {
      if (!this.toastSnackbar || !this.toastMessage) return;
      this.toastMessage.textContent = msg;
      this.toastSnackbar.classList.add('active');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.toastSnackbar.classList.remove('active');
      }, 2400);
    }

    formatTime(sec) {
      if (isNaN(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  }

  // Initialize on DOM Ready
  window.addEventListener('DOMContentLoaded', () => {
    const app = new MuzicApp();
    app.init();
    window.muzicApp = app;
  });

})();
