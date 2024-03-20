import { useEffect, createContext, useContext, useRef } from "react";
import { Context } from "../App"
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const context = createContext()

function Record(){

    const streamCapture = useRef(null)
    const record = useRef(null)
    const recorder = useRef(null)
    const recordingInterval = useRef(null)
    const card = useRef(null)
    const videoPreviewContainer = useRef(null)
    const videoPreview = useRef(null)
    const ffmpegRef = useRef(new FFmpeg());
    const { messageCard, setMessageCard } = useContext(Context)

    useEffect(() => {
        record.current = document.querySelector(".record-button")
        card.current = document.querySelector(".card")
        videoPreviewContainer.current = document.querySelector(".video-preview")
        videoPreview.current = document.querySelector(".video-preview video")
        // load()

        if (recorder.current){
            record.current.textContent = "Enregistrer"
        }
        console.log(recorder.current)

    }, [])

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        console.log(ffmpeg)
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
        });
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
        await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        const videoURL = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
        const downloadLink = document.createElement('a');
        downloadLink.href = videoURL;
        downloadLink.download = 'screen-recording.mp4';
        downloadLink.click();
    }

    const captureScreen = async () => {
        if (recorder.current && recorder.current.state === "recording"){
            recorder.current.stop()
            clearTimeout(recordingInterval.current)
            record.current.textContent = "Enregistrer"
            return
        }
        
        streamCapture.current = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
            preferCurrentTab: false,
            width: 1280,
            height: 720,
            frameRate: { ideal: 30 },
            systemAudio: "include"
        });
        
        const videoBlobs = []
        
        recorder.current = new MediaRecorder(streamCapture.current);
        recorder.current.ondataavailable = async (e) => {
            const videoBlob = e.data;
            // Sauvegarder le blob vidéo...
        
            videoBlobs.push(videoBlob);

            // const blob = new Blob([mp4File], { type: 'video/mp4' });
            // const url = URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'video.mp4';
            // a.click();

            const videoURL = URL.createObjectURL(new Blob(videoBlobs, { type: 'video/mp4' }));
            videoPreviewContainer.current.classList.remove("hidden")
            videoPreview.current.src = videoURL

            //console.log(videoURL)
        
            // const ffmpeg = ffmpegRef.current;
            // await ffmpeg.writeFile('input.mp4', await fetchFile(videoURL));
            // let time = 0
            // const timeInterval = setInterval(() => {time++}, 1000)
            // await ffmpeg.exec(['-i', 'input.mp4', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', 'output.mp4']);
            // const data = await ffmpeg.readFile('output.mp4');
            // clearInterval(timeInterval)
            // console.log(time)
            // const videoConvertedURL = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
            // const downloadLink = document.createElement('a');
            // downloadLink.href = videoConvertedURL;
            // downloadLink.download = 'screen-recording.mp4';
            // downloadLink.click();
        
            //URL.revokeObjectURL(videoURL);
            //URL.revokeObjectURL(videoConvertedURL);
        };
        
        console.log(recorder.current)
        
        recorder.current.start();
        record.current.textContent = "Arrêter l'enregistrement"
        
        setMessageCard({
            message: "La vidéo s'arrêtera automatiquement dans 15 minutes.",
            type: "info"
        })

        /** class selector in ./Cards.jsx */
        card.current.classList.add("shown")
        setTimeout(() => {
            card.current.classList.remove("shown")
        }, 5000)
        
        recordingInterval.current = setTimeout(() => { 
            recorder.current.stop() 
        }, 900000)
        
    }

    return(
        <div>
            <button onClick={captureScreen} className="record-button">Enregistrer</button>
        </div>
    )
}

export default Record