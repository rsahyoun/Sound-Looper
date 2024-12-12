document.addEventListener('DOMContentLoaded', () => {
    const audioHandler = new AudioHandler();
    
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');

    recordButton.addEventListener('click', () => {
        audioHandler.startRecording();
        recordButton.disabled = true;
        stopButton.disabled = false;
    });

    stopButton.addEventListener('click', () => {
        audioHandler.stopRecording();
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}); 