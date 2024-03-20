import { useEffect, createContext, useContext, useRef } from "react";
import { Context } from "../App"

const context = createContext()

function Webcam(){
    
    const videoElement = useRef(null)
    const webcam = useRef(null)
    const streamWebcam = useRef(null)
    const { messageCard, setMessageCard } = useContext(Context)

    useEffect(()=>{
        videoElement.current = document.querySelector(".webcam")
        webcam.current = document.querySelector(".webcam-button")
    }, [])
    
    const activateWebcam = async () => {
        accessWebcam().then(res => {
            console.log(streamWebcam)
            if (res){
              webcam.current.textContent = res
              setTimeout(() => {togglePictureInPicture()}, 300)
            }
            else {
                webcam.current.textContent = "Activer la webcam"
                console.log("PIP annulé")
            }
        })
    }

    const accessWebcam = async () => {
        webcam.current.textContent = "Chargement..."
        try {
            if (videoElement.current.srcObject){
                streamWebcam.current.getTracks().forEach((track) => {
                    track.stop()
                });
                videoElement.current.srcObject = null
                console.log("webcam")
                return "Activer la webcam"
            } else {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                videoElement.current.srcObject = streamWebcam.current = stream
                if (streamWebcam){
                    return "Désactiver la webcam"
                }
                return false
            }
        }
        catch (err){
            setMessageCard({
                message: err,
                type: "error"
            })
        }
    }

    const togglePictureInPicture = () => {
        console.log("here")
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture(); // Exit PIP mode
        } else {
          videoElement.current.requestPictureInPicture() // Enter PIP mode
            .then(() => {
              console.log("Video entered Picture-in-Picture mode.");
            })
            .catch(error => {
              console.error("Error entering Picture-in-Picture mode:", error);
            });
        }
    }

    return(
        <div>
            <video className="webcam" autoPlay></video>
            <button onClick={activateWebcam} className="webcam-button">Activer la webcam</button>
        </div>
    )
}

export default Webcam