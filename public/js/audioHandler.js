class AudioHandler {
    constructor() {
        this.audioContext = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordings = [];
        this.isRecording = false;
        this.isPlaying = false;
        this.bpm = 120;
        this.loopLength = 4; // in bars
        
        this.initializeAudio();
        this.setupLoopControls();
    }

    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.setupMediaRecorder(stream);
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    setupLoopControls() {
        const bpmInput = document.getElementById('bpm');
        const loopLengthInput = document.getElementById('loopLength');

        bpmInput.addEventListener('change', (e) => {
            this.bpm = parseInt(e.target.value);
        });

        loopLengthInput.addEventListener('change', (e) => {
            this.loopLength = parseInt(e.target.value);
        });
    }

    setupMediaRecorder(stream) {
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            this.recordings.push({
                url: audioUrl,
                blob: audioBlob,
                audio: await this.createAudioElement(audioUrl)
            });
            this.audioChunks = [];
            this.addTrackToUI(this.recordings.length - 1);
        };
    }

    async createAudioElement(url) {
        const audio = new Audio(url);
        await new Promise(resolve => {
            audio.addEventListener('loadeddata', resolve, { once: true });
        });
        return audio;
    }

    startRecording() {
        if (this.mediaRecorder && !this.isRecording) {
            this.mediaRecorder.start();
            this.isRecording = true;
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
    }

    addTrackToUI(index) {
        const tracksList = document.getElementById('tracksList');
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        
        // Create track controls container
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'track-controls';

        // Add audio element
        const audio = document.createElement('audio');
        audio.src = this.recordings[index].url;
        audio.controls = true;
        
        // Create loop button
        const loopBtn = document.createElement('button');
        loopBtn.className = 'btn loop-btn';
        loopBtn.textContent = 'Loop';
        loopBtn.addEventListener('click', () => {
            const isLooping = audio.loop;
            audio.loop = !isLooping;
            loopBtn.classList.toggle('active');
            loopBtn.textContent = isLooping ? 'Loop' : 'Looping';
        });

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            this.deleteTrack(index, trackDiv);
        });

        // Add all elements to track div
        controlsDiv.appendChild(loopBtn);
        controlsDiv.appendChild(deleteBtn);
        trackDiv.appendChild(audio);
        trackDiv.appendChild(controlsDiv);
        tracksList.appendChild(trackDiv);
    }

    deleteTrack(index, trackDiv) {
        // Remove from DOM
        trackDiv.remove();
        
        // Release memory
        URL.revokeObjectURL(this.recordings[index].url);
        this.recordings[index].audio.pause();
        
        // Remove from recordings array
        this.recordings.splice(index, 1);
    }
} 