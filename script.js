/**
 * MUZIC.PW - MATERIAL DESIGN 3 MUSIC PLAYER CLIENT
 * Full-featured browser Spotify-like client
 * Features: Android 13/14 Squiggly Progress Bar, Web Audio API Equalizer,
 * Real-time Spectrum Visualizer, Synced Lyrics, Playlist Management, Local File Support.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CATALOG DATA & CURATED TRACK LIBRARY
     ========================================================================== */
  const DEFAULT_TRACKS = [
    {
      id: 'track-1',
      title: 'Neon Horizon',
      artist: 'Kavinsky Wave',
      album: 'Outrun Dreams',
      genre: 'Synthwave',
      duration: 184, // 3:04
      bpm: 118,
      key: 'Am',
      color: '#FF2A85',
      coverArt: null, // Generative MD3 Canvas
      lyrics: [
        { time: 0, text: '♪ (Atmospheric Synth Intro) ♪' },
        { time: 12, text: 'Cruising through the neon city lights' },
        { time: 24, text: 'Electric shadows dancing in the night' },
        { time: 36, text: 'The dashboard glows with vibrant violet dreams' },
        { time: 48, text: 'Nothing is as quiet as it seems' },
        { time: 60, text: 'Lost inside this cybernetic maze' },
        { time: 72, text: 'Catching echoes of a bygone phase' },
        { time: 88, text: '♪ (Synthesizer Solo & Bass Drop) ♪' },
        { time: 110, text: 'We drive into the digital sunrise' },
        { time: 124, text: 'Reflecting neon pink in your eyes' },
        { time: 140, text: 'Accelerate beyond the gridline border' },
        { time: 156, text: 'Where chaos turns into crystal order' },
        { time: 172, text: '♪ (Outro fade out) ♪' }
      ]
    },
    {
      id: 'track-2',
      title: 'Midnight Coffee & Rain',
      artist: 'Lofi Girl Club',
      album: 'Study Session Chill',
      genre: 'Chillhop & Lo-Fi',
      duration: 162, // 2:42
      bpm: 84,
      key: 'Cmaj7',
      color: '#E040FB',
      coverArt: null,
      lyrics: [
        { time: 0, text: '☕ (Soft rain on the windowpane) ☕' },
        { time: 14, text: 'A warm cup in my hands, ticking clock' },
        { time: 28, text: 'Pages turning gently down the block' },
        { time: 42, text: 'Late night melodies to ease the mind' },
        { time: 58, text: 'Leaving all the hectic days behind' },
        { time: 76, text: '♪ (Mellow Vinyl Rhodes Chords) ♪' },
        { time: 94, text: 'Streetlights glimmer on the wet pavement' },
        { time: 110, text: 'Lost in thoughts of peaceful containment' },
        { time: 128, text: 'Breathe in the calm, exhale the noise' },
        { time: 145, text: 'Finding solitude in gentle joys' }
      ]
    },
    {
      id: 'track-3',
      title: 'Cyber Overdrive',
      artist: 'Sector 7',
      album: 'Neural Network 2099',
      genre: 'Cyber Electro',
      duration: 205, // 3:25
      bpm: 128,
      key: 'Fm',
      color: '#FF0055',
      coverArt: null,
      lyrics: [
        { time: 0, text: '⚡ System Diagnostics: Initializing Core... ⚡' },
        { time: 15, text: 'Pulse rate rising in the mainframe wire' },
        { time: 30, text: 'Ignite the overclocking speed and fire' },
        { time: 45, text: 'Breaking firewalls, streaming pure data flux' },
        { time: 60, text: 'High bandwidth thrill, high voltage struck' },
        { time: 75, text: '♪ (Heavy Electro Bassline & Cyber Glitch) ♪' },
        { time: 105, text: 'Overdrive engaged, maximum output' },
        { time: 120, text: 'Feel the neural frequencies input' },
        { time: 140, text: 'Resonating across the synthetic sky' },
        { time: 165, text: 'Speed of light as the bits pass by' },
        { time: 185, text: '⚡ Overclock complete. Stable state. ⚡' }
      ]
    },
    {
      id: 'track-4',
      title: 'Starlight Odyssey',
      artist: 'Andromeda Project',
      album: 'Deep Cosmos',
      genre: 'Ambient Space',
      duration: 218, // 3:38
      bpm: 72,
      key: 'Dmin',
      color: '#7B2CBF',
      coverArt: null,
      lyrics: [
        { time: 0, text: '✨ (Floating through stellar dust) ✨' },
        { time: 20, text: 'Gazing at nebulas millions of miles away' },
        { time: 40, text: 'Where cosmic auroras silently play' },
        { time: 65, text: 'Weightless drifting in gravity free' },
        { time: 90, text: 'Watching galaxies stretch like the sea' },
        { time: 120, text: '♪ (Deep Shimmering Reverb Pads) ♪' },
        { time: 150, text: 'Ancient photons reaching our sensor array' },
        { time: 180, text: 'A beacon guiding travelers on their way' }
      ]
    },
    {
      id: 'track-5',
      title: 'Pink Sunset Drive',
      artist: 'Sunset Boulevard',
      album: 'Pacific Coast High',
      genre: 'Future Bass',
      duration: 174, // 2:54
      bpm: 120,
      key: 'Gmaj',
      color: '#FF4081',
      coverArt: null,
      lyrics: [
        { time: 0, text: '🌴 Warm breeze blowing through the palms 🌴' },
        { time: 15, text: 'Sun descending low into the ocean line' },
        { time: 30, text: 'Golden hour turning into neon pink divine' },
        { time: 46, text: 'Top down, volume turned all the way high' },
        { time: 62, text: 'Chasing the horizon under sunset sky' },
        { time: 78, text: '♪ (Vibrant Future Bass Drop) ♪' },
        { time: 102, text: 'Side by side on the coastal freeway' },
        { time: 118, text: 'Leaving all the worries of yesterday' },
        { time: 135, text: 'This summer evening never has to end' },
        { time: 152, text: 'Around another glorious ocean bend' }
      ]
    },
    {
      id: 'track-6',
      title: 'Velvet Dreamscape',
      artist: 'Tokyo Lo-fi Collective',
      album: 'Shibuya Midnight',
      genre: 'Chillhop & Lo-Fi',
      duration: 190, // 3:10
      bpm: 88,
      key: 'Ebm7',
      color: '#9D4EDD',
      coverArt: null,
      lyrics: [
        { time: 0, text: '🌸 Tokyo midnight streets washed in rain 🌸' },
        { time: 18, text: 'Neon signs reflecting on the train' },
        { time: 36, text: 'A jazz saxophone humming far away' },
        { time: 54, text: 'Memories of another passing day' },
        { time: 80, text: '♪ (Warm Vinyl Crackle & Soft Piano) ♪' },
        { time: 110, text: 'Step into the late night ramen bar' },
        { time: 130, text: 'Watching city life from near and far' },
        { time: 155, text: 'Velvet smooth rhythm guides our feet' },
        { time: 175, text: 'The soothing heartbeat of the street' }
      ]
    }
  ];

  const GENRES_LIST = [
    { name: 'Synthwave & Retrowave', count: '48 mixes', color: 'linear-gradient(135deg, #FF2A85, #8A0044)', icon: 'electric_bolt' },
    { name: 'Chillhop & Lo-Fi', count: '120 tracks', color: 'linear-gradient(135deg, #9D4EDD, #3C096C)', icon: 'coffee' },
    { name: 'Cyber Electro', count: '85 tracks', color: 'linear-gradient(135deg, #FF0055, #4A0018)', icon: 'memory' },
    { name: 'Ambient Space', count: '64 tracks', color: 'linear-gradient(135deg, #3A0CA3, #4361EE)', icon: 'blur_on' },
    { name: 'Future Bass', count: '92 tracks', color: 'linear-gradient(135deg, #F72585, #7209B7)', icon: 'graphic_eq' },
    { name: 'Deep Focus & Flow', count: '110 tracks', color: 'linear-gradient(135deg, #480CA8, #4CC9F0)', icon: 'headphones' },
    { name: 'Workout Power', count: '75 tracks', color: 'linear-gradient(135deg, #D90429, #EF233C)', icon: 'fitness_center' },
    { name: 'Acoustic Soul', count: '53 tracks', color: 'linear-gradient(135deg, #FB8500, #FFB703)', icon: 'nightlife' }
  ];

  /* ==========================================================================
     2. APPLICATION STATE
     ========================================================================== */
  const state = {
    tracks: [...DEFAULT_TRACKS],
    currentTrackIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    shuffle: false,
    repeat: 'off', // 'off', 'all', 'one'
    likedTrackIds: new Set(JSON.parse(localStorage.getItem('muzic_liked_ids') || '["track-1", "track-3"]')),
    playlists: JSON.parse(localStorage.getItem('muzic_custom_playlists') || '[]'),
    currentView: 'home',
    viewHistory: ['home'],
    viewHistoryIndex: 0,
    queue: [],
    lyricsSize: 'normal',
    ambientGlowEnabled: true,
    isDraggingScrubber: false,
    hoverScrubRatio: null,
    isFsDraggingScrubber: false,
    isFullscreen: false,
    currentFilter: 'all',
    searchQuery: '',
    searchTab: 'all',
    // Equalizer gains in dB
    eqGains: [0, 0, 0, 0, 0],
    bassBoost: false,
    normalizer: true,
    // Custom uploaded audio object URLs
    localAudioBlobs: new Map()
  };

  /* ==========================================================================
     3. PROCEDURAL SYNTHESIZER & WEB AUDIO ENGINE
     ========================================================================== */
  class WebAudioMusicEngine {
    constructor() {
      this.ctx = null;
      this.gainNode = null;
      this.analyserNode = null;
      this.eqFilters = [];
      this.compressor = null;
      this.sourceNode = null;
      this.isSynthRunning = false;
      this.synthInterval = null;
      this.synthStep = 0;
      this.audioElement = document.getElementById('audio-element');
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(state.volume, this.ctx.currentTime);

      // Analyser Node for Visualizers
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.85;

      // Dynamics Compressor (Normalizer)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      // 5-Band Equalizer (BiquadFilterNodes)
      const freqs = [60, 230, 910, 3600, 14000];
      const types = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

      this.eqFilters = freqs.map((freq, i) => {
        const filter = this.ctx.createBiquadFilter();
        filter.type = types[i];
        filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
        filter.gain.setValueAtTime(state.eqGains[i], this.ctx.currentTime);
        return filter;
      });

      // Chain EQ Filters together
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }

      // Connect Media Element Source
      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.eqFilters[0]);
      } catch (e) {
        console.warn('Media element source already connected or restricted:', e);
      }

      // Output Chain: Last EQ -> Compressor -> Analyser -> Master Gain -> Destination
      const lastEq = this.eqFilters[this.eqFilters.length - 1];
      lastEq.connect(this.compressor);
      this.compressor.connect(this.analyserNode);
      this.analyserNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
    }

    resumeContext() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setVolume(val) {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.setTargetAtTime(val, this.ctx.currentTime, 0.03);
      }
    }

    setEqGain(bandIndex, gainVal) {
      if (this.eqFilters[bandIndex] && this.ctx) {
        this.eqFilters[bandIndex].gain.setTargetAtTime(gainVal, this.ctx.currentTime, 0.05);
      }
    }

    setBassBoost(enabled) {
      if (this.eqFilters[0] && this.ctx) {
        const baseGain = state.eqGains[0];
        const target = enabled ? baseGain + 8 : baseGain;
        this.eqFilters[0].gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      }
    }

    // High Quality Procedural Music Synthesizer for curated tracks
    startProceduralSynth(track) {
      this.init();
      this.resumeContext();
      this.stopProceduralSynth();

      this.isSynthRunning = true;
      const bpm = track.bpm || 120;
      const stepTimeMs = (60 / bpm / 4) * 1000; // 16th note steps

      // Chord progressions based on track
      const scales = {
        'Am': [440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99],
        'Cmaj7': [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88],
        'Fm': [349.23, 392.00, 415.30, 466.16, 523.25, 554.37, 622.25],
        'Dmin': [293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25],
        'Gmaj': [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99],
        'Ebm7': [311.13, 349.23, 369.99, 415.30, 466.16, 523.25, 554.37]
      };

      const currentScale = scales[track.key] || scales['Am'];

      this.synthInterval = setInterval(() => {
        if (!state.isPlaying || !this.isSynthRunning) return;
        this.renderSynthStep(this.synthStep, currentScale, track);
        this.synthStep = (this.synthStep + 1) % 64;
      }, stepTimeMs);
    }

    renderSynthStep(step, scale, track) {
      const now = this.ctx.currentTime;
      const targetNode = this.eqFilters[0] || this.gainNode;

      // 1. Kick Drum (Steps 0, 8, 16, 24, etc.)
      if (step % 8 === 0) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
        g.gain.setValueAtTime(0.6, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(g);
        g.connect(targetNode);
        osc.start(now);
        osc.stop(now + 0.25);
      }

      // 2. Snare / Clack (Steps 8, 24, 40, 56)
      if (step % 16 === 8) {
        // Noise buffer snare
        const bufferSize = this.ctx.sampleRate * 0.1;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1200, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(targetNode);
        whiteNoise.start(now);
      }

      // 3. Hi-Hat (Every 2 steps)
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000 + Math.random() * 1500, now);
        const vel = (step % 4 === 2) ? 0.08 : 0.04;
        g.gain.setValueAtTime(vel, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(g);
        g.connect(targetNode);
        osc.start(now);
        osc.stop(now + 0.04);
      }

      // 4. Bass Arpeggio
      if (step % 4 === 0) {
        const bassNote = scale[Math.floor((step / 16) % scale.length)] / 4;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassNote, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.2);

        g.gain.setValueAtTime(0.28, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(filter);
        filter.connect(g);
        g.connect(targetNode);
        osc.start(now);
        osc.stop(now + 0.25);
      }

      // 5. Synth Chords & Melody
      if (step % 8 === 0 || (step % 4 === 0 && Math.random() > 0.4)) {
        const noteIndex = (Math.floor(step / 4) * 2 + Math.floor(Math.random() * 3)) % scale.length;
        const melodyFreq = scale[noteIndex];

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(melodyFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(600, now + 0.35);

        g.gain.setValueAtTime(0.18, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(g);
        g.connect(targetNode);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    }

    stopProceduralSynth() {
      this.isSynthRunning = false;
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    }
  }

  const audio = new WebAudioMusicEngine();

  /* ==========================================================================
     4. SIGNATURE ANDROID 13/14 SQUIGGLY PROGRESS BAR RENDERER
     ========================================================================== */
  class SquigglyProgressBarRenderer {
    constructor(canvasId, isFullscreen = false) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.isFullscreen = isFullscreen;
      this.phase = 0;
      this.currentAmplitude = 0;
      this.targetAmplitude = 4.5;
      this.wavelength = 28;
      this.color = '#FF2A85';
      this.unplayedColor = 'rgba(255, 255, 255, 0.14)';
      this.thumbRadius = isFullscreen ? 8 : 6;
      this.lineWidth = isFullscreen ? 5 : 4;
      this.lastFrameTime = performance.now();

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
      if (!this.canvas || !this.ctx || !this.width || !this.height) return;

      const now = performance.now();
      const dt = (now - this.lastFrameTime) / 1000;
      this.lastFrameTime = now;

      // Animate phase and amplitude smoothly
      if (isPlaying) {
        this.phase += 8.5 * dt;
        this.currentAmplitude += (this.targetAmplitude - this.currentAmplitude) * 0.12;
      } else {
        // Flatten wave smoothly on pause
        this.currentAmplitude += (0 - this.currentAmplitude) * 0.1;
      }

      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      const centerY = this.height / 2;
      const progress = duration > 0 ? Math.min(1, Math.max(0, time / duration)) : 0;
      const playedWidth = progress * this.width;

      // 1. Draw Unplayed Line (From playedWidth to Canvas Width)
      if (playedWidth < this.width) {
        ctx.beginPath();
        ctx.strokeStyle = this.unplayedColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.moveTo(Math.max(0, playedWidth), centerY);
        ctx.lineTo(this.width, centerY);
        ctx.stroke();
      }

      // 2. Draw Squiggly Waveform (From 0 to playedWidth)
      if (playedWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Vibrant pink glow
        ctx.shadowColor = 'rgba(255, 42, 133, 0.6)';
        ctx.shadowBlur = 10;

        ctx.moveTo(0, centerY);

        const step = 2; // Pixel resolution
        for (let x = 0; x <= playedWidth; x += step) {
          // Attenuate amplitude near start and end for smooth connection
          const edgeDamp = Math.sin(Math.PI * Math.min(1, x / 24)) *
                           Math.sin(Math.PI * Math.min(1, (playedWidth - x) / 24));
          const amp = this.currentAmplitude * (edgeDamp > 0 ? edgeDamp : 1);
          const y = centerY + amp * Math.sin((x / this.wavelength) * (Math.PI * 2) - this.phase);
          ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw Scrubber Thumb at playedWidth
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 42, 133, 0.9)';
      ctx.shadowBlur = 14;
      ctx.arc(playedWidth, centerY, this.thumbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner pink core of thumb
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(playedWidth, centerY, this.thumbRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Optional Hover Preview Marker
      if (hoverRatio !== null && hoverRatio >= 0 && hoverRatio <= 1) {
        const hoverX = hoverRatio * this.width;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.arc(hoverX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* ==========================================================================
     5. SPECTRUM AUDIO VISUALIZERS (CANVAS)
     ========================================================================== */
  class AudioVisualizer {
    constructor() {
      this.spectrumCanvas = document.getElementById('spectrum-canvas');
      this.fsCanvas = document.getElementById('fs-visualizer-canvas');
      this.sideCanvas = document.getElementById('side-panel-visualizer-canvas');

      this.spectrumCtx = this.spectrumCanvas ? this.spectrumCanvas.getContext('2d') : null;
      this.fsCtx = this.fsCanvas ? this.fsCanvas.getContext('2d') : null;
      this.sideCtx = this.sideCanvas ? this.sideCanvas.getContext('2d') : null;

      this.dataArray = new Uint8Array(64);
      this.animationId = null;
    }

    start() {
      const render = () => {
        if (audio.analyserNode && state.isPlaying) {
          audio.analyserNode.getByteFrequencyData(this.dataArray);
        } else {
          // Subtle resting wave
          for (let i = 0; i < this.dataArray.length; i++) {
            this.dataArray[i] = Math.max(0, this.dataArray[i] * 0.92);
          }
        }

        this.drawSpectrum();
        this.drawFullscreenVisualizer();
        this.drawSideVisualizer();

        this.animationId = requestAnimationFrame(render);
      };
      render();
    }

    drawSpectrum() {
      if (!this.spectrumCtx || !this.spectrumCanvas) return;
      const ctx = this.spectrumCtx;
      const w = this.spectrumCanvas.width;
      const h = this.spectrumCanvas.height;

      ctx.clearRect(0, 0, w, h);

      const numBars = 32;
      const barWidth = (w / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const val = this.dataArray[i] || 0;
        const barHeight = (val / 255) * h * 0.9 + 3;
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // MD3 Gradient (Vibrant Pink to Violet)
        const gradient = ctx.createLinearGradient(0, y, 0, h);
        gradient.addColorStop(0, '#FF2A85');
        gradient.addColorStop(1, '#630538');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
      }
    }

    drawFullscreenVisualizer() {
      if (!this.fsCtx || !this.fsCanvas || !state.isFullscreen) return;
      const ctx = this.fsCtx;
      const w = this.fsCanvas.width;
      const h = this.fsCanvas.height;

      ctx.clearRect(0, 0, w, h);

      const numBars = 48;
      const barWidth = (w / numBars) - 3;

      for (let i = 0; i < numBars; i++) {
        const val = this.dataArray[i] || 0;
        const barHeight = (val / 255) * h * 0.85 + 4;
        const x = i * (barWidth + 3);
        const y = (h - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#FF4797');
        gradient.addColorStop(0.5, '#FF2A85');
        gradient.addColorStop(1, '#9D4EDD');

        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(255, 42, 133, 0.4)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 4) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
      }
    }

    drawSideVisualizer() {
      if (!this.sideCtx || !this.sideCanvas) return;
      const ctx = this.sideCtx;
      const w = this.sideCanvas.width;
      const h = this.sideCanvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.strokeStyle = '#FF2A85';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF2A85';
      ctx.shadowBlur = 6;

      const sliceWidth = w / 32;
      let x = 0;

      for (let i = 0; i < 32; i++) {
        const v = (this.dataArray[i] || 0) / 255.0;
        const y = h - (v * h * 0.85);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
    }
  }

  /* ==========================================================================
     6. UI CONTROLLER & EVENT COORDINATION
     ========================================================================== */
  class MuzicApp {
    constructor() {
      this.squigglyBottom = new SquigglyProgressBarRenderer('squiggly-progress-canvas', false);
      this.squigglyFs = new SquigglyProgressBarRenderer('fs-squiggly-canvas', true);
      this.visualizer = new AudioVisualizer();
      this.activeLyricIndex = -1;
      this.tickerInterval = null;
    }

    init() {
      this.setupGenerativeCovers();
      this.bindDOMElements();
      this.bindEventListeners();
      this.bindKeyboardShortcuts();
      this.renderHome();
      this.renderPlaylistsNav();
      this.renderExplore();
      this.renderLibrary();
      this.loadTrack(0, false);
      this.updateLikedBadge();
      this.updateGreeting();

      // Start animations & visualizers
      this.visualizer.start();
      this.startMainAnimationLoop();

      console.log('Muzic MD3 Client Initialized.');
    }

    setupGenerativeCovers() {
      // Create SVG covers for default tracks
      state.tracks.forEach((track, i) => {
        if (!track.coverArt) {
          const c1 = track.color || '#FF2A85';
          const c2 = '#121217';
          const icons = ['graphic_eq', 'coffee', 'memory', 'blur_on', 'waves', 'album'];
          const icon = icons[i % icons.length];
          track.coverArt = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><radialGradient id="g" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="${encodeURIComponent(c1)}"/><stop offset="100%" stop-color="${encodeURIComponent(c2)}"/></radialGradient></defs><rect width="300" height="300" rx="24" fill="url(%23g)"/><circle cx="150" cy="150" r="80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="3"/><circle cx="150" cy="150" r="40" fill="${encodeURIComponent(c1)}" opacity="0.8"/><text x="150" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${encodeURIComponent(track.title)}</text></svg>`;
        }
      });
    }

    bindDOMElements() {
      // Nav
      this.navDrawer = document.getElementById('nav-drawer');
      this.navItems = document.querySelectorAll('.nav-item');
      this.playlistNavList = document.getElementById('playlist-nav-list');
      this.likedCountBadge = document.getElementById('liked-count-badge');

      // Views
      this.viewPanels = document.querySelectorAll('.view-panel');
      this.searchBar = document.getElementById('global-search-input');
      this.clearSearchBtn = document.getElementById('btn-clear-search');

      // Player Elements
      this.playerThumb = document.getElementById('player-thumb-img');
      this.playerPlaceholder = document.getElementById('player-thumb-placeholder');
      this.playerTitle = document.getElementById('player-title');
      this.playerArtist = document.getElementById('player-artist');
      this.playerHeartBtn = document.getElementById('btn-player-heart');
      this.playPauseIcon = document.getElementById('play-pause-icon');
      this.timeCurrent = document.getElementById('time-current');
      this.timeTotal = document.getElementById('time-total');
      this.scrubTooltip = document.getElementById('scrub-tooltip');
      this.btnShuffle = document.getElementById('btn-shuffle');
      this.btnRepeat = document.getElementById('btn-repeat');
      this.btnVolumeMute = document.getElementById('btn-volume-mute');
      this.volumeIcon = document.getElementById('volume-icon');
      this.volumeFill = document.getElementById('volume-slider-fill');
      this.volumeTrack = document.getElementById('volume-slider-track');
      this.volumeThumb = document.getElementById('volume-slider-thumb');

      // Right Panel
      this.rightPanel = document.getElementById('right-panel');
      this.sideAlbumArt = document.getElementById('side-album-art');
      this.sideArtFallback = document.getElementById('side-art-fallback');
      this.sideNpTitle = document.getElementById('side-np-title');
      this.sideNpArtist = document.getElementById('side-np-artist');
      this.sideNpHeart = document.getElementById('side-np-heart');
      this.sideArtistBio = document.getElementById('side-artist-bio');
      this.queueCurrentItem = document.getElementById('queue-current-item');
      this.queueItemsList = document.getElementById('queue-items-list');
      this.queueCount = document.getElementById('queue-count');

      // Modals
      this.eqModal = document.getElementById('equalizer-modal');
      this.playlistModal = document.getElementById('new-playlist-modal');
      this.shortcutsModal = document.getElementById('shortcuts-modal');
      this.fullscreenOverlay = document.getElementById('fullscreen-overlay');
      this.appSnackbar = document.getElementById('app-snackbar');
      this.snackbarMessage = document.getElementById('snackbar-message');
    }

    bindEventListeners() {
      // View Navigation
      this.navItems.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-view');
          if (target) this.switchView(target);
          if (window.innerWidth <= 800) this.navDrawer.classList.remove('open');
        });
      });

      // Mobile Nav Toggle
      document.getElementById('btn-open-nav')?.addEventListener('click', () => this.navDrawer.classList.add('open'));
      document.getElementById('btn-close-nav')?.addEventListener('click', () => this.navDrawer.classList.remove('open'));

      // Navigation History Back/Forward
      document.getElementById('btn-nav-back')?.addEventListener('click', () => this.navigateHistory(-1));
      document.getElementById('btn-nav-forward')?.addEventListener('click', () => this.navigateHistory(1));

      // Global Search
      this.searchBar?.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        this.clearSearchBtn.style.display = query ? 'flex' : 'none';
        if (query) {
          if (state.currentView !== 'explore') this.switchView('explore');
          this.performSearch(query);
        } else {
          document.getElementById('search-results-section').style.display = 'none';
          document.getElementById('browse-categories-section').style.display = 'block';
        }
      });

      this.clearSearchBtn?.addEventListener('click', () => {
        this.searchBar.value = '';
        this.clearSearchBtn.style.display = 'none';
        document.getElementById('search-results-section').style.display = 'none';
        document.getElementById('browse-categories-section').style.display = 'block';
      });

      // Search Tabs
      document.querySelectorAll('[data-search-tab]').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
          document.querySelectorAll('[data-search-tab]').forEach(b => b.classList.remove('active'));
          tabBtn.classList.add('active');
          state.searchTab = tabBtn.getAttribute('data-search-tab');
          this.performSearch(this.searchBar.value.trim());
        });
      });

      // Home Filter Chips
      document.querySelectorAll('.chips-row .md3-filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.chips-row .md3-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          state.currentFilter = chip.getAttribute('data-filter');
          this.renderFeaturedTracks();
        });
      });

      // Library Filter Chips
      document.querySelectorAll('.library-tabs .md3-filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.library-tabs .md3-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.renderLibrary(chip.getAttribute('data-lib-filter'));
        });
      });

      // Hero Buttons
      document.getElementById('btn-hero-play-featured')?.addEventListener('click', () => this.playTrack(0));
      document.getElementById('btn-hero-explore')?.addEventListener('click', () => this.switchView('explore'));
      document.getElementById('btn-see-all-tracks')?.addEventListener('click', () => this.switchView('explore'));

      // Player Controls
      document.getElementById('btn-play-pause')?.addEventListener('click', () => this.togglePlayPause());
      document.getElementById('btn-prev')?.addEventListener('click', () => this.playPrev());
      document.getElementById('btn-next')?.addEventListener('click', () => this.playNext());
      this.btnShuffle?.addEventListener('click', () => this.toggleShuffle());
      this.btnRepeat?.addEventListener('click', () => this.toggleRepeat());
      this.playerHeartBtn?.addEventListener('click', () => this.toggleLikeCurrentTrack());
      this.sideNpHeart?.addEventListener('click', () => this.toggleLikeCurrentTrack());
      document.getElementById('btn-player-pip')?.addEventListener('click', () => this.toggleFullscreen());

      // Squiggly Progress Scrubber (Bottom Bar)
      const squigglyWrapper = document.getElementById('squiggly-slider-wrapper');
      if (squigglyWrapper) {
        squigglyWrapper.addEventListener('mousemove', (e) => {
          const rect = squigglyWrapper.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          state.hoverScrubRatio = ratio;
          const previewTime = ratio * (state.duration || 1);
          this.scrubTooltip.textContent = this.formatTime(previewTime);
          this.scrubTooltip.style.left = `${ratio * 100}%`;
        });

        squigglyWrapper.addEventListener('mouseleave', () => {
          state.hoverScrubRatio = null;
        });

        squigglyWrapper.addEventListener('mousedown', (e) => {
          state.isDraggingScrubber = true;
          this.handleScrubSeek(e, squigglyWrapper);
        });

        window.addEventListener('mousemove', (e) => {
          if (state.isDraggingScrubber) {
            this.handleScrubSeek(e, squigglyWrapper);
          }
        });

        window.addEventListener('mouseup', () => {
          state.isDraggingScrubber = false;
        });
      }

      // Fullscreen Squiggly Progress Scrubber
      const fsProgressContainer = document.getElementById('fs-progress-container');
      if (fsProgressContainer) {
        fsProgressContainer.addEventListener('mousedown', (e) => {
          state.isFsDraggingScrubber = true;
          this.handleScrubSeek(e, fsProgressContainer);
        });
        window.addEventListener('mousemove', (e) => {
          if (state.isFsDraggingScrubber) {
            this.handleScrubSeek(e, fsProgressContainer);
          }
        });
        window.addEventListener('mouseup', () => {
          state.isFsDraggingScrubber = false;
        });
      }

      // Volume Controls
      this.btnVolumeMute?.addEventListener('click', () => this.toggleMute());
      this.volumeTrack?.addEventListener('click', (e) => this.handleVolumeChange(e));

      // Right Panel Tabs & Toggle
      document.getElementById('tab-now-playing')?.addEventListener('click', () => this.switchRightTab('now-playing'));
      document.getElementById('tab-queue')?.addEventListener('click', () => this.switchRightTab('queue'));
      document.getElementById('btn-close-right-panel')?.addEventListener('click', () => {
        this.rightPanel.style.display = 'none';
      });
      document.getElementById('btn-toggle-queue')?.addEventListener('click', () => {
        this.rightPanel.style.display = this.rightPanel.style.display === 'none' ? 'flex' : 'none';
        this.switchRightTab('queue');
      });
      document.getElementById('btn-clear-queue')?.addEventListener('click', () => {
        state.queue = [];
        this.renderQueue();
        this.showToast('Queue cleared');
      });

      // Modals
      document.getElementById('btn-equalizer-modal')?.addEventListener('click', () => this.openEqModal());
      document.getElementById('btn-toggle-eq-quick')?.addEventListener('click', () => this.openEqModal());
      document.getElementById('btn-close-eq-modal')?.addEventListener('click', () => this.closeEqModal());
      document.getElementById('btn-apply-eq')?.addEventListener('click', () => this.closeEqModal());
      document.getElementById('btn-reset-eq')?.addEventListener('click', () => this.resetEq());

      // EQ Sliders & Presets
      for (let i = 0; i < 5; i++) {
        const slider = document.getElementById(`eq-band-${i}`);
        slider?.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          state.eqGains[i] = val;
          document.getElementById(`eq-gain-val-${i}`).textContent = `${val >= 0 ? '+' : ''}${val}dB`;
          audio.setEqGain(i, val);
        });
      }

      document.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.applyEqPreset(btn.getAttribute('data-preset'));
        });
      });

      document.getElementById('switch-bass-boost')?.addEventListener('change', (e) => {
        state.bassBoost = e.target.checked;
        audio.setBassBoost(state.bassBoost);
      });

      // Playlist Dialog
      document.getElementById('btn-add-playlist')?.addEventListener('click', () => this.openPlaylistModal());
      document.getElementById('btn-library-new-playlist')?.addEventListener('click', () => this.openPlaylistModal());
      document.getElementById('btn-close-playlist-modal')?.addEventListener('click', () => this.closePlaylistModal());
      document.getElementById('btn-cancel-playlist')?.addEventListener('click', () => this.closePlaylistModal());
      document.getElementById('btn-save-playlist')?.addEventListener('click', () => this.createCustomPlaylist());

      // Shortcuts Modal
      document.getElementById('btn-shortcuts-modal')?.addEventListener('click', () => this.openShortcutsModal());
      document.getElementById('btn-close-shortcuts-modal')?.addEventListener('click', () => this.closeShortcutsModal());
      document.getElementById('btn-close-shortcuts-ok')?.addEventListener('click', () => this.closeShortcutsModal());

      // Fullscreen Player Controls
      document.getElementById('btn-fullscreen-toggle')?.addEventListener('click', () => this.toggleFullscreen());
      document.getElementById('btn-exit-fullscreen')?.addEventListener('click', () => this.toggleFullscreen());
      document.getElementById('fs-btn-play')?.addEventListener('click', () => this.togglePlayPause());
      document.getElementById('fs-btn-prev')?.addEventListener('click', () => this.playPrev());
      document.getElementById('fs-btn-next')?.addEventListener('click', () => this.playNext());
      document.getElementById('fs-btn-shuffle')?.addEventListener('click', () => this.toggleShuffle());
      document.getElementById('fs-btn-repeat')?.addEventListener('click', () => this.toggleRepeat());

      // Synced Lyrics Toggle
      document.getElementById('btn-toggle-lyrics')?.addEventListener('click', () => this.switchView('lyrics'));
      document.getElementById('btn-toggle-lyrics-size')?.addEventListener('click', () => this.toggleLyricsSize());

      // Local Audio File Import
      const fileInput = document.getElementById('audio-file-input');
      document.getElementById('btn-upload-file')?.addEventListener('click', () => fileInput?.click());
      fileInput?.addEventListener('change', (e) => this.handleLocalFiles(e.target.files));

      // Drag and Drop Audio anywhere on window
      window.addEventListener('dragover', (e) => e.preventDefault());
      window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleLocalFiles(e.dataTransfer.files);
        }
      });

      // Ambient Lighting Toggle
      document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
        state.ambientGlowEnabled = !state.ambientGlowEnabled;
        const glow = document.getElementById('ambient-glow');
        glow.style.opacity = state.ambientGlowEnabled ? '1' : '0';
        this.showToast(`Ambient Glow ${state.ambientGlowEnabled ? 'Enabled' : 'Disabled'}`);
      });
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        // Ignore typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          if (e.key === 'Escape') e.target.blur();
          return;
        }

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
          case 'KeyL':
            this.switchView('lyrics');
            break;
          case 'KeyE':
            this.openEqModal();
            break;
          case 'KeyF':
            this.toggleFullscreen();
            break;
          case 'KeyS':
            this.toggleShuffle();
            break;
          case 'KeyR':
            this.toggleRepeat();
            break;
          case 'Slash':
            e.preventDefault();
            this.searchBar?.focus();
            break;
          case 'Escape':
            if (state.isFullscreen) this.toggleFullscreen();
            this.closeEqModal();
            this.closePlaylistModal();
            this.closeShortcutsModal();
            break;
        }
      });
    }

    /* ==========================================================================
       7. PLAYBACK LOGIC & AUDIO PIPELINE
       ========================================================================== */
    loadTrack(index, autoPlay = true) {
      if (index < 0 || index >= state.tracks.length) return;
      state.currentTrackIndex = index;
      const track = state.tracks[index];

      state.currentTime = 0;
      state.duration = track.duration || 180;

      // Update UI elements
      this.playerTitle.textContent = track.title;
      this.playerArtist.textContent = track.artist;
      this.timeTotal.textContent = this.formatTime(state.duration);
      this.timeCurrent.textContent = '0:00';

      // Fullscreen elements
      document.getElementById('fs-track-title').textContent = track.title;
      document.getElementById('fs-track-artist').textContent = `${track.artist} • ${track.album}`;
      document.getElementById('fs-time-total').textContent = this.formatTime(state.duration);
      document.getElementById('fs-time-current').textContent = '0:00';

      // Update Artworks
      if (track.coverArt) {
        this.playerThumb.src = track.coverArt;
        this.playerThumb.style.display = 'block';
        this.playerPlaceholder.style.display = 'none';

        this.sideAlbumArt.src = track.coverArt;
        this.sideAlbumArt.style.display = 'block';
        this.sideArtFallback.style.display = 'none';

        document.getElementById('fs-cover-img').src = track.coverArt;
        document.getElementById('fs-cover-img').style.display = 'block';
        document.getElementById('fs-cover-placeholder').style.display = 'none';

        const lyricsThumb = document.getElementById('lyrics-art-thumb');
        if (lyricsThumb) lyricsThumb.style.backgroundImage = `url(${track.coverArt})`;
      }

      // Side metadata
      this.sideNpTitle.textContent = track.title;
      this.sideNpArtist.textContent = track.artist;
      this.sideArtistBio.textContent = `${track.artist} is renowned for pushing sonic boundaries in the ${track.genre} genre. Featured on the hit album "${track.album}".`;

      // Lyrics Header
      document.getElementById('lyrics-track-title').textContent = track.title;
      document.getElementById('lyrics-track-artist').textContent = `${track.artist} — ${track.album}`;

      // Update Liked status
      const isLiked = state.likedTrackIds.has(track.id);
      this.playerHeartBtn.classList.toggle('active', isLiked);
      this.playerHeartBtn.querySelector('.material-symbols-rounded').textContent = isLiked ? 'favorite' : 'favorite_border';
      this.sideNpHeart.querySelector('.material-symbols-rounded').textContent = isLiked ? 'favorite' : 'favorite_border';

      // Update Ambient Glow
      if (track.color && state.ambientGlowEnabled) {
        const glow = document.getElementById('ambient-glow');
        glow.style.background = `radial-gradient(circle, ${track.color}44 0%, rgba(13, 13, 17, 0) 70%)`;
      }

      // Render Synced Lyrics Lines
      this.renderLyrics(track);

      // Render Queue
      this.renderQueue();

      // Highlight active row across tables
      document.querySelectorAll('.track-row').forEach(row => {
        const rowId = row.getAttribute('data-track-id');
        row.classList.toggle('active', rowId === track.id);
      });

      // Update MediaSession API for OS notifications & lockscreen
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: track.album
        });
      }

      if (autoPlay) {
        this.play();
      }
    }

    play() {
      audio.init();
      audio.resumeContext();
      state.isPlaying = true;

      const track = state.tracks[state.currentTrackIndex];

      // If it's a user uploaded file with an audio blob
      if (state.localAudioBlobs.has(track.id)) {
        audio.stopProceduralSynth();
        const url = state.localAudioBlobs.get(track.id);
        const audioElement = document.getElementById('audio-element');
        if (audioElement.src !== url) {
          audioElement.src = url;
        }
        audioElement.currentTime = state.currentTime;
        audioElement.play().catch(e => console.warn(e));
      } else {
        // Built-in Synth & procedural music playback
        audio.startProceduralSynth(track);
      }

      this.updatePlayStateUI(true);
    }

    pause() {
      state.isPlaying = false;
      audio.stopProceduralSynth();
      const audioElement = document.getElementById('audio-element');
      audioElement.pause();
      this.updatePlayStateUI(false);
    }

    togglePlayPause() {
      if (state.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    playNext() {
      if (state.queue.length > 0) {
        const nextTrack = state.queue.shift();
        const idx = state.tracks.findIndex(t => t.id === nextTrack.id);
        if (idx !== -1) {
          this.loadTrack(idx, true);
          return;
        }
      }

      if (state.repeat === 'one') {
        this.seekTo(0);
        this.play();
        return;
      }

      let nextIndex = state.currentTrackIndex + 1;
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.tracks.length);
      } else if (nextIndex >= state.tracks.length) {
        if (state.repeat === 'all') nextIndex = 0;
        else {
          this.pause();
          return;
        }
      }
      this.loadTrack(nextIndex, true);
    }

    playPrev() {
      if (state.currentTime > 3) {
        this.seekTo(0);
        return;
      }
      let prevIndex = state.currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = state.tracks.length - 1;
      this.loadTrack(prevIndex, true);
    }

    seekTo(seconds) {
      state.currentTime = Math.max(0, Math.min(seconds, state.duration));
      const audioElement = document.getElementById('audio-element');
      if (audioElement.src) {
        audioElement.currentTime = state.currentTime;
      }
      this.timeCurrent.textContent = this.formatTime(state.currentTime);
      document.getElementById('fs-time-current').textContent = this.formatTime(state.currentTime);
      this.syncLyricsPosition(state.currentTime);
    }

    seekRelative(delta) {
      this.seekTo(state.currentTime + delta);
    }

    handleScrubSeek(e, container) {
      const rect = container.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.seekTo(ratio * state.duration);
    }

    setVolume(val) {
      state.volume = Math.max(0, Math.min(1, val));
      state.isMuted = state.volume === 0;
      audio.setVolume(state.isMuted ? 0 : state.volume);

      this.volumeFill.style.width = `${state.volume * 100}%`;
      this.volumeIcon.textContent = state.isMuted ? 'volume_off' : (state.volume > 0.5 ? 'volume_up' : 'volume_down');
    }

    toggleMute() {
      state.isMuted = !state.isMuted;
      audio.setVolume(state.isMuted ? 0 : state.volume);
      this.volumeIcon.textContent = state.isMuted ? 'volume_off' : 'volume_up';
      this.volumeFill.style.width = state.isMuted ? '0%' : `${state.volume * 100}%`;
    }

    handleVolumeChange(e) {
      const rect = this.volumeTrack.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.setVolume(ratio);
    }

    toggleShuffle() {
      state.shuffle = !state.shuffle;
      this.btnShuffle.classList.toggle('active', state.shuffle);
      document.getElementById('fs-btn-shuffle')?.classList.toggle('active', state.shuffle);
      this.showToast(`Shuffle ${state.shuffle ? 'On' : 'Off'}`);
    }

    toggleRepeat() {
      const modes = ['off', 'all', 'one'];
      const nextMode = modes[(modes.indexOf(state.repeat) + 1) % modes.length];
      state.repeat = nextMode;

      const isOne = state.repeat === 'one';
      const isActive = state.repeat !== 'off';

      this.btnRepeat.classList.toggle('active', isActive);
      this.btnRepeat.querySelector('.material-symbols-rounded').textContent = isOne ? 'repeat_one' : 'repeat';

      const fsRepeat = document.getElementById('fs-btn-repeat');
      if (fsRepeat) {
        fsRepeat.classList.toggle('active', isActive);
        fsRepeat.querySelector('.material-symbols-rounded').textContent = isOne ? 'repeat_one' : 'repeat';
      }

      this.showToast(`Repeat: ${state.repeat.toUpperCase()}`);
    }

    toggleLikeCurrentTrack() {
      const track = state.tracks[state.currentTrackIndex];
      if (!track) return;
      if (state.likedTrackIds.has(track.id)) {
        state.likedTrackIds.delete(track.id);
        this.showToast(`Removed "${track.title}" from Liked Songs`);
      } else {
        state.likedTrackIds.add(track.id);
        this.showToast(`Saved "${track.title}" to Liked Songs`);
      }
      localStorage.setItem('muzic_liked_ids', JSON.stringify([...state.likedTrackIds]));
      this.updateLikedBadge();
      this.loadTrack(state.currentTrackIndex, state.isPlaying);
      if (state.currentView === 'liked') this.renderLikedView();
    }

    updateLikedBadge() {
      if (this.likedCountBadge) {
        this.likedCountBadge.textContent = state.likedTrackIds.size;
      }
    }

    updatePlayStateUI(playing) {
      this.playPauseIcon.textContent = playing ? 'pause' : 'play_arrow';
      document.getElementById('fs-play-icon').textContent = playing ? 'pause' : 'play_arrow';
      document.getElementById('hero-art-disc')?.style.setProperty('animation-play-state', playing ? 'running' : 'paused');
      document.getElementById('fs-vinyl-disc')?.classList.toggle('spinning', playing);
      document.getElementById('player-thumb-pulse')?.classList.toggle('active', playing);
    }

    startMainAnimationLoop() {
      let lastSecond = Math.floor(state.currentTime);

      const loop = () => {
        if (state.isPlaying) {
          state.currentTime += 1 / 60;
          if (state.currentTime >= state.duration) {
            this.playNext();
          }

          const curSec = Math.floor(state.currentTime);
          if (curSec !== lastSecond) {
            lastSecond = curSec;
            this.timeCurrent.textContent = this.formatTime(state.currentTime);
            document.getElementById('fs-time-current').textContent = this.formatTime(state.currentTime);
            this.syncLyricsPosition(state.currentTime);
          }
        }

        // Render squiggly progress bars
        this.squigglyBottom.render(state.currentTime, state.duration, state.isPlaying, state.hoverScrubRatio);
        if (state.isFullscreen) {
          this.squigglyFs.render(state.currentTime, state.duration, state.isPlaying);
        }

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    /* ==========================================================================
       8. SYNCED LYRICS LOGIC
       ========================================================================== */
    renderLyrics(track) {
      const container = document.getElementById('lyrics-content');
      if (!container) return;
      container.innerHTML = '';

      if (!track.lyrics || track.lyrics.length === 0) {
        container.innerHTML = '<div class="lyric-line active">♪ Instrumental / No lyrics available ♪</div>';
        return;
      }

      track.lyrics.forEach((line, idx) => {
        const div = document.createElement('div');
        div.className = 'lyric-line';
        div.textContent = line.text;
        div.setAttribute('data-time', line.time);
        div.setAttribute('data-idx', idx);

        div.addEventListener('click', () => {
          this.seekTo(line.time);
          if (!state.isPlaying) this.play();
        });

        container.appendChild(div);
      });

      this.activeLyricIndex = -1;
      this.syncLyricsPosition(state.currentTime);
    }

    syncLyricsPosition(time) {
      const track = state.tracks[state.currentTrackIndex];
      if (!track || !track.lyrics || track.lyrics.length === 0) return;

      let currentIndex = -1;
      for (let i = 0; i < track.lyrics.length; i++) {
        if (time >= track.lyrics[i].time) {
          currentIndex = i;
        } else {
          break;
        }
      }

      if (currentIndex === this.activeLyricIndex) return;
      this.activeLyricIndex = currentIndex;

      const lines = document.querySelectorAll('.lyric-line');
      lines.forEach((line, idx) => {
        line.classList.toggle('active', idx === currentIndex);
        line.classList.toggle('passed', idx < currentIndex);
      });

      // Auto-scroll lyrics view to keep active line centered
      if (currentIndex >= 0 && lines[currentIndex]) {
        const scrollContainer = document.getElementById('lyrics-scroll-container');
        if (scrollContainer) {
          const activeEl = lines[currentIndex];
          const offsetTop = activeEl.offsetTop - (scrollContainer.clientHeight / 2) + (activeEl.clientHeight / 2);
          scrollContainer.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }

      // Update Fullscreen lyrics preview box
      const prevLine = currentIndex > 0 ? track.lyrics[currentIndex - 1].text : '...';
      const activeLine = currentIndex >= 0 ? track.lyrics[currentIndex].text : '♪ ♪ ♪';
      const nextLine = currentIndex < track.lyrics.length - 1 ? track.lyrics[currentIndex + 1].text : '...';

      document.getElementById('fs-lyrics-prev').textContent = prevLine;
      document.getElementById('fs-lyrics-active').textContent = activeLine;
      document.getElementById('fs-lyrics-next').textContent = nextLine;
    }

    toggleLyricsSize() {
      const sizes = ['normal', 'large', 'xlarge'];
      const next = sizes[(sizes.indexOf(state.lyricsSize) + 1) % sizes.length];
      state.lyricsSize = next;

      const lines = document.querySelectorAll('.lyric-line');
      const fontSizeMap = { normal: '28px', large: '34px', xlarge: '42px' };
      lines.forEach(l => l.style.fontSize = fontSizeMap[next]);
      this.showToast(`Lyrics Font: ${next.toUpperCase()}`);
    }

    /* ==========================================================================
       9. VIEWS RENDERING & ROUTING
       ========================================================================== */
    switchView(viewName) {
      if (state.currentView === viewName) return;

      // History navigation tracking
      if (state.viewHistory[state.viewHistoryIndex] !== viewName) {
        state.viewHistory = state.viewHistory.slice(0, state.viewHistoryIndex + 1);
        state.viewHistory.push(viewName);
        state.viewHistoryIndex = state.viewHistory.length - 1;
      }
      this.updateHistoryButtons();

      state.currentView = viewName;
      this.viewPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `view-${viewName}`);
      });

      this.navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
      });

      if (viewName === 'liked') this.renderLikedView();
      if (viewName === 'local') this.renderLocalTracksView();
      if (viewName === 'library') this.renderLibrary();
    }

    navigateHistory(direction) {
      const newIndex = state.viewHistoryIndex + direction;
      if (newIndex >= 0 && newIndex < state.viewHistory.length) {
        state.viewHistoryIndex = newIndex;
        const targetView = state.viewHistory[newIndex];
        state.currentView = targetView;
        this.viewPanels.forEach(panel => {
          panel.classList.toggle('active', panel.id === `view-${targetView}`);
        });
        this.navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('data-view') === targetView);
        });
        this.updateHistoryButtons();
      }
    }

    updateHistoryButtons() {
      const backBtn = document.getElementById('btn-nav-back');
      const forwardBtn = document.getElementById('btn-nav-forward');
      if (backBtn) backBtn.disabled = state.viewHistoryIndex <= 0;
      if (forwardBtn) forwardBtn.disabled = state.viewHistoryIndex >= state.viewHistory.length - 1;
    }

    updateGreeting() {
      const hour = new Date().getHours();
      let greeting = 'GOOD EVENING';
      if (hour < 12) greeting = 'GOOD MORNING';
      else if (hour < 18) greeting = 'GOOD AFTERNOON';
      const el = document.getElementById('time-greeting-label');
      if (el) el.textContent = greeting;
    }

    renderHome() {
      // 1. Quick Access (Spotify 6-card grid)
      const quickGrid = document.getElementById('quick-access-grid');
      if (quickGrid) {
        quickGrid.innerHTML = '';
        state.tracks.slice(0, 6).forEach((track, i) => {
          const card = document.createElement('div');
          card.className = 'quick-card';
          card.innerHTML = `
            <div class="quick-card-art" style="background-image: url('${track.coverArt}')"></div>
            <span class="quick-card-title">${track.title}</span>
            <button class="quick-card-play-btn" title="Play">
              <span class="material-symbols-rounded">play_arrow</span>
            </button>
          `;
          card.addEventListener('click', (e) => {
            if (e.target.closest('.quick-card-play-btn')) {
              this.playTrack(i);
            } else {
              this.loadTrack(i, true);
            }
          });
          quickGrid.appendChild(card);
        });
      }

      // 2. Featured Tracks Grid
      this.renderFeaturedTracks();

      // 3. Featured Albums Grid
      const albumsGrid = document.getElementById('featured-albums-grid');
      if (albumsGrid) {
        const albums = [
          { title: 'Outrun Dreams', artist: 'Kavinsky Wave', year: '2024', tracks: 10, color: '#FF2A85' },
          { title: 'Neural Network 2099', artist: 'Sector 7', year: '2025', tracks: 12, color: '#FF0055' },
          { title: 'Study Session Chill', artist: 'Lofi Girl Club', year: '2024', tracks: 16, color: '#9D4EDD' },
          { title: 'Pacific Coast High', artist: 'Sunset Boulevard', year: '2024', tracks: 8, color: '#FF4081' }
        ];

        albumsGrid.innerHTML = '';
        albums.forEach(album => {
          const card = document.createElement('div');
          card.className = 'media-card';
          card.innerHTML = `
            <div class="media-card-art-box" style="background: linear-gradient(135deg, ${album.color}, #1A1A22)">
              <span class="material-symbols-rounded media-card-placeholder-icon">album</span>
              <button class="media-card-fab" title="Play Album">
                <span class="material-symbols-rounded">play_arrow</span>
              </button>
            </div>
            <h4 class="media-card-title">${album.title}</h4>
            <p class="media-card-subtitle">${album.artist} • ${album.year}</p>
          `;
          card.addEventListener('click', () => {
            this.showPlaylistDetails(album.title, `Album by ${album.artist}`, state.tracks.filter(t => t.album === album.title));
          });
          albumsGrid.appendChild(card);
        });
      }

      // 4. Curated Playlists
      const curatedGrid = document.getElementById('curated-playlists-grid');
      if (curatedGrid) {
        const mixes = [
          { title: 'Daily Mix 1', desc: 'Kavinsky Wave, Sector 7, and more synthwave gems', color: '#FF2A85' },
          { title: 'Deep Work Chillhop', desc: 'Gentle beats and soothing vinyl chords for study', color: '#7B2CBF' },
          { title: 'Cyberpunk Run', desc: 'High BPM electronic adrenaline for workout and focus', color: '#F72585' }
        ];
        curatedGrid.innerHTML = '';
        mixes.forEach(mix => {
          const card = document.createElement('div');
          card.className = 'media-card';
          card.innerHTML = `
            <div class="media-card-art-box" style="background: linear-gradient(135deg, ${mix.color}, #121217)">
              <span class="material-symbols-rounded media-card-placeholder-icon">queue_music</span>
              <button class="media-card-fab" title="Play Mix">
                <span class="material-symbols-rounded">play_arrow</span>
              </button>
            </div>
            <h4 class="media-card-title">${mix.title}</h4>
            <p class="media-card-subtitle">${mix.desc}</p>
          `;
          card.addEventListener('click', () => {
            this.showPlaylistDetails(mix.title, mix.desc, state.tracks);
          });
          curatedGrid.appendChild(card);
        });
      }
    }

    renderFeaturedTracks() {
      const grid = document.getElementById('featured-tracks-grid');
      if (!grid) return;
      grid.innerHTML = '';

      let filtered = state.tracks;
      if (state.currentFilter !== 'all') {
        const f = state.currentFilter.toLowerCase();
        filtered = state.tracks.filter(t => t.genre.toLowerCase().includes(f));
      }

      filtered.forEach(track => {
        const idx = state.tracks.findIndex(t => t.id === track.id);
        const card = document.createElement('div');
        card.className = 'media-card';
        card.innerHTML = `
          <div class="media-card-art-box">
            <img src="${track.coverArt}" class="media-card-img" alt="${track.title}">
            <button class="media-card-fab" title="Play">
              <span class="material-symbols-rounded">play_arrow</span>
            </button>
          </div>
          <h4 class="media-card-title">${track.title}</h4>
          <p class="media-card-subtitle">${track.artist}</p>
        `;
        card.addEventListener('click', () => this.playTrack(idx));
        grid.appendChild(card);
      });
    }

    renderExplore() {
      const grid = document.getElementById('genre-cards-grid');
      if (!grid) return;
      grid.innerHTML = '';

      GENRES_LIST.forEach(genre => {
        const card = document.createElement('div');
        card.className = 'genre-card';
        card.style.background = genre.color;
        card.innerHTML = `
          <h3 class="genre-card-title">${genre.name}</h3>
          <span class="material-symbols-rounded genre-card-icon">${genre.icon}</span>
        `;
        card.addEventListener('click', () => {
          const matching = state.tracks.filter(t => t.genre.toLowerCase().includes(genre.name.toLowerCase().split(' ')[0]));
          this.showPlaylistDetails(genre.name, `Top curated tracks in ${genre.name}`, matching.length ? matching : state.tracks);
        });
        grid.appendChild(card);
      });
    }

    performSearch(query) {
      const q = query.toLowerCase();
      const resultsSection = document.getElementById('search-results-section');
      const categoriesSection = document.getElementById('browse-categories-section');
      const resultsList = document.getElementById('search-results-list');
      const heading = document.getElementById('search-query-heading');

      if (!q) {
        resultsSection.style.display = 'none';
        categoriesSection.style.display = 'block';
        return;
      }

      resultsSection.style.display = 'block';
      categoriesSection.style.display = 'none';
      heading.textContent = `Search results for "${query}"`;
      resultsList.innerHTML = '';

      let matches = state.tracks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        resultsList.innerHTML = `<div style="padding: 30px; text-align: center; color: var(--md-sys-color-on-surface-variant);">No results found for "${query}"</div>`;
        return;
      }

      matches.forEach((track, i) => {
        const originalIndex = state.tracks.findIndex(t => t.id === track.id);
        const row = document.createElement('div');
        row.className = `track-row ${originalIndex === state.currentTrackIndex ? 'active' : ''}`;
        row.setAttribute('data-track-id', track.id);
        row.innerHTML = `
          <div class="t-num">${i + 1}</div>
          <div class="t-info">
            <div class="t-thumb" style="background-image: url('${track.coverArt}')"></div>
            <div>
              <div class="t-title">${track.title}</div>
              <div class="t-artist">${track.artist}</div>
            </div>
          </div>
          <div class="t-album">${track.album}</div>
          <div class="t-genre">${track.genre}</div>
          <div class="t-duration">${this.formatTime(track.duration)}</div>
        `;
        row.addEventListener('click', () => this.playTrack(originalIndex));
        resultsList.appendChild(row);
      });
    }

    renderLibrary(filter = 'all') {
      const grid = document.getElementById('library-cards-grid');
      if (!grid) return;
      grid.innerHTML = '';

      // Liked Songs Card
      if (filter === 'all' || filter === 'liked' || filter === 'playlists') {
        const likedCard = document.createElement('div');
        likedCard.className = 'media-card';
        likedCard.innerHTML = `
          <div class="media-card-art-box" style="background: linear-gradient(135deg, #FF2A85, #4A0028);">
            <span class="material-symbols-rounded pink-icon" style="font-size: 54px; color: #fff !important;">favorite</span>
            <button class="media-card-fab" title="Play Liked Songs">
              <span class="material-symbols-rounded">play_arrow</span>
            </button>
          </div>
          <h4 class="media-card-title">Liked Songs</h4>
          <p class="media-card-subtitle">${state.likedTrackIds.size} saved tracks</p>
        `;
        likedCard.addEventListener('click', () => this.switchView('liked'));
        grid.appendChild(likedCard);
      }

      // Custom Playlists
      if (filter === 'all' || filter === 'playlists') {
        state.playlists.forEach(pl => {
          const card = document.createElement('div');
          card.className = 'media-card';
          card.innerHTML = `
            <div class="media-card-art-box" style="background: linear-gradient(135deg, #7B2CBF, #1E1E26);">
              <span class="material-symbols-rounded media-card-placeholder-icon">queue_music</span>
              <button class="media-card-fab" title="Play Playlist">
                <span class="material-symbols-rounded">play_arrow</span>
              </button>
            </div>
            <h4 class="media-card-title">${pl.name}</h4>
            <p class="media-card-subtitle">${pl.trackIds.length} songs • By You</p>
          `;
          card.addEventListener('click', () => {
            const tracks = state.tracks.filter(t => pl.trackIds.includes(t.id));
            this.showPlaylistDetails(pl.name, pl.description || 'Custom playlist by you', tracks.length ? tracks : state.tracks);
          });
          grid.appendChild(card);
        });
      }

      // Local tracks card
      if (filter === 'all' || filter === 'local') {
        const localTracks = state.tracks.filter(t => state.localAudioBlobs.has(t.id));
        const localCard = document.createElement('div');
        localCard.className = 'media-card';
        localCard.innerHTML = `
          <div class="media-card-art-box" style="background: linear-gradient(135deg, #3A0CA3, #1A1A22);">
            <span class="material-symbols-rounded media-card-placeholder-icon">folder_special</span>
            <button class="media-card-fab" title="Play Local Tracks">
              <span class="material-symbols-rounded">play_arrow</span>
            </button>
          </div>
          <h4 class="media-card-title">Local Imported Files</h4>
          <p class="media-card-subtitle">${localTracks.length} custom files</p>
        `;
        localCard.addEventListener('click', () => this.switchView('local'));
        grid.appendChild(localCard);
      }
    }

    renderPlaylistsNav() {
      if (!this.playlistNavList) return;
      this.playlistNavList.innerHTML = '';
      state.playlists.forEach((pl, i) => {
        const btn = document.createElement('button');
        btn.className = 'playlist-nav-btn';
        btn.innerHTML = `
          <span class="material-symbols-rounded" style="font-size: 18px;">playlist_play</span>
          <span>${pl.name}</span>
        `;
        btn.addEventListener('click', () => {
          const plTracks = state.tracks.filter(t => pl.trackIds.includes(t.id));
          this.showPlaylistDetails(pl.name, pl.description || 'Custom playlist', plTracks.length ? plTracks : state.tracks);
        });
        this.playlistNavList.appendChild(btn);
      });
    }

    renderLikedView() {
      const likedTracks = state.tracks.filter(t => state.likedTrackIds.has(t.id));
      this.showPlaylistDetails('Liked Songs', 'Your personal collection of saved favorite tracks.', likedTracks);
    }

    renderLocalTracksView() {
      const localTracks = state.tracks.filter(t => state.localAudioBlobs.has(t.id));
      this.showPlaylistDetails('Local Audio Files', 'Imported audio files from your device.', localTracks);
    }

    showPlaylistDetails(title, description, tracks) {
      this.switchView('details');
      document.getElementById('details-title').textContent = title;
      document.getElementById('details-description').textContent = description;
      document.getElementById('details-count').textContent = `${tracks.length} songs`;

      const totalSec = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
      document.getElementById('details-duration').textContent = `${Math.ceil(totalSec / 60)} min`;

      const rowsContainer = document.getElementById('details-tracklist-rows');
      rowsContainer.innerHTML = '';

      if (tracks.length === 0) {
        rowsContainer.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--md-sys-color-on-surface-variant);">No tracks in this collection yet. Import music or like songs to add them!</div>`;
        return;
      }

      tracks.forEach((track, i) => {
        const originalIndex = state.tracks.findIndex(t => t.id === track.id);
        const row = document.createElement('div');
        row.className = `track-row ${originalIndex === state.currentTrackIndex ? 'active' : ''}`;
        row.setAttribute('data-track-id', track.id);
        row.innerHTML = `
          <div class="t-num">${i + 1}</div>
          <div class="t-info">
            <div class="t-thumb" style="background-image: url('${track.coverArt}')"></div>
            <div>
              <div class="t-title">${track.title}</div>
              <div class="t-artist">${track.artist}</div>
            </div>
          </div>
          <div class="t-album">${track.album}</div>
          <div class="t-genre">${track.genre}</div>
          <div class="t-duration">${this.formatTime(track.duration)}</div>
        `;
        row.addEventListener('click', () => this.playTrack(originalIndex));
        rowsContainer.appendChild(row);
      });

      // Play All / Shuffle Buttons
      document.getElementById('btn-details-play-all').onclick = () => {
        if (tracks.length > 0) {
          const firstIdx = state.tracks.findIndex(t => t.id === tracks[0].id);
          this.playTrack(firstIdx);
        }
      };

      document.getElementById('btn-details-shuffle').onclick = () => {
        if (tracks.length > 0) {
          const randIdx = Math.floor(Math.random() * tracks.length);
          const origIdx = state.tracks.findIndex(t => t.id === tracks[randIdx].id);
          state.shuffle = true;
          this.btnShuffle.classList.add('active');
          this.playTrack(origIdx);
        }
      };
    }

    renderQueue() {
      const cur = state.tracks[state.currentTrackIndex];
      if (this.queueCurrentItem && cur) {
        this.queueCurrentItem.innerHTML = `
          <div class="queue-item" style="border: 1px solid var(--md-sys-color-primary);">
            <div class="q-thumb" style="background-image: url('${cur.coverArt}')"></div>
            <div class="q-text">
              <div class="q-title" style="color: var(--md-sys-color-primary);">${cur.title}</div>
              <div class="q-artist">${cur.artist}</div>
            </div>
            <span class="material-symbols-rounded pink-icon" style="font-size: 20px;">volume_up</span>
          </div>
        `;
      }

      if (this.queueItemsList) {
        this.queueItemsList.innerHTML = '';
        state.queue.forEach((track, i) => {
          const item = document.createElement('div');
          item.className = 'queue-item';
          item.innerHTML = `
            <div class="q-thumb" style="background-image: url('${track.coverArt}')"></div>
            <div class="q-text">
              <div class="q-title">${track.title}</div>
              <div class="q-artist">${track.artist}</div>
            </div>
            <span class="material-symbols-rounded" style="font-size: 18px; color: var(--md-sys-color-on-surface-variant);">drag_handle</span>
          `;
          item.addEventListener('click', () => {
            state.queue.splice(i, 1);
            const origIdx = state.tracks.findIndex(t => t.id === track.id);
            this.playTrack(origIdx);
          });
          this.queueItemsList.appendChild(item);
        });
      }

      if (this.queueCount) {
        this.queueCount.textContent = state.queue.length;
      }
    }

    switchRightTab(tabName) {
      document.getElementById('tab-now-playing')?.classList.toggle('active', tabName === 'now-playing');
      document.getElementById('tab-queue')?.classList.toggle('active', tabName === 'queue');
      document.getElementById('panel-now-playing')?.classList.toggle('active', tabName === 'now-playing');
      document.getElementById('panel-queue')?.classList.toggle('active', tabName === 'queue');
    }

    playTrack(index) {
      this.loadTrack(index, true);
    }

    /* ==========================================================================
       10. LOCAL FILE IMPORT
       ========================================================================== */
    handleLocalFiles(files) {
      if (!files || files.length === 0) return;
      let added = 0;

      Array.from(files).forEach((file, i) => {
        if (!file.type.startsWith('audio/')) return;
        const id = `local-${Date.now()}-${i}`;
        const objectUrl = URL.createObjectURL(file);
        state.localAudioBlobs.set(id, objectUrl);

        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const newTrack = {
          id: id,
          title: fileName,
          artist: 'Local Artist',
          album: 'Imported Files',
          genre: 'Local Audio',
          duration: 180, // Will update when loaded
          coverArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%233A0CA3"/><text x="150" y="160" font-family="sans-serif" font-size="20" fill="white" text-anchor="middle">${encodeURIComponent(fileName)}</text></svg>`,
          lyrics: [
            { time: 0, text: `♪ Now Playing Local Track: ${fileName} ♪` }
          ]
        };

        // Determine exact audio duration
        const tempAudio = new Audio(objectUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
          if (tempAudio.duration && !isNaN(tempAudio.duration)) {
            newTrack.duration = Math.floor(tempAudio.duration);
          }
        });

        state.tracks.unshift(newTrack);
        added++;
      });

      if (added > 0) {
        this.renderHome();
        this.renderLibrary();
        this.showToast(`Imported ${added} audio ${added === 1 ? 'file' : 'files'} successfully!`);
        this.loadTrack(0, true);
      }
    }

    /* ==========================================================================
       11. MODALS & EQUALIZER LOGIC
       ========================================================================== */
    openEqModal() {
      this.eqModal.style.display = 'flex';
      for (let i = 0; i < 5; i++) {
        const slider = document.getElementById(`eq-band-${i}`);
        if (slider) slider.value = state.eqGains[i];
        document.getElementById(`eq-gain-val-${i}`).textContent = `${state.eqGains[i] >= 0 ? '+' : ''}${state.eqGains[i]}dB`;
      }
      document.getElementById('switch-bass-boost').checked = state.bassBoost;
    }

    closeEqModal() {
      this.eqModal.style.display = 'none';
    }

    applyEqPreset(presetName) {
      const presets = {
        flat: [0, 0, 0, 0, 0],
        bass: [7, 5, 1, -1, 0],
        electronic: [5, 3, -1, 3, 5],
        vocal: [-2, -1, 5, 4, 1],
        rock: [5, 2, -2, 3, 4],
        acoustic: [3, 2, 1, 3, 4]
      };
      const curve = presets[presetName] || presets.flat;
      state.eqGains = [...curve];
      for (let i = 0; i < 5; i++) {
        const slider = document.getElementById(`eq-band-${i}`);
        if (slider) slider.value = state.eqGains[i];
        document.getElementById(`eq-gain-val-${i}`).textContent = `${state.eqGains[i] >= 0 ? '+' : ''}${state.eqGains[i]}dB`;
        audio.setEqGain(i, state.eqGains[i]);
      }
      this.showToast(`EQ Preset: ${presetName.toUpperCase()}`);
    }

    resetEq() {
      this.applyEqPreset('flat');
    }

    openPlaylistModal() {
      this.playlistModal.style.display = 'flex';
      document.getElementById('input-playlist-name').value = '';
      document.getElementById('input-playlist-desc').value = '';
      document.getElementById('input-playlist-name').focus();
    }

    closePlaylistModal() {
      this.playlistModal.style.display = 'none';
    }

    createCustomPlaylist() {
      const name = document.getElementById('input-playlist-name').value.trim();
      const desc = document.getElementById('input-playlist-desc').value.trim();
      if (!name) {
        this.showToast('Please enter a playlist name');
        return;
      }

      const newPl = {
        id: `pl-${Date.now()}`,
        name: name,
        description: desc,
        trackIds: [state.tracks[state.currentTrackIndex]?.id || 'track-1']
      };

      state.playlists.push(newPl);
      localStorage.setItem('muzic_custom_playlists', JSON.stringify(state.playlists));
      this.renderPlaylistsNav();
      this.renderLibrary();
      this.closePlaylistModal();
      this.showToast(`Created playlist "${name}"`);
    }

    openShortcutsModal() {
      this.shortcutsModal.style.display = 'flex';
    }

    closeShortcutsModal() {
      this.shortcutsModal.style.display = 'none';
    }

    toggleFullscreen() {
      state.isFullscreen = !state.isFullscreen;
      this.fullscreenOverlay.style.display = state.isFullscreen ? 'flex' : 'none';
      if (state.isFullscreen) {
        this.squigglyFs.resize();
      }
    }

    showToast(message) {
      if (!this.appSnackbar || !this.snackbarMessage) return;
      this.snackbarMessage.textContent = message;
      this.appSnackbar.classList.add('active');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.appSnackbar.classList.remove('active');
      }, 2600);
    }

    formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  }

  // Initialize Application on DOM Ready
  window.addEventListener('DOMContentLoaded', () => {
    const app = new MuzicApp();
    app.init();
    window.muzicApp = app;
  });

})();
