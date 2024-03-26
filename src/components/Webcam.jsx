import { useEffect, createContext, useContext, useRef } from "react";
import { Context } from "../App"

const context = createContext()

function Webcam(){
    
    const videoElement = useRef(null)
    const webcam = useRef(null)
    const streamWebcam = useRef(null)
    const card = useRef(null)
    const { messageCard, setMessageCard } = useContext(Context)

    const errorsHandler = (err) => {
        let _err = err.toString()
        switch(_err){
            case _err.includes("Must be handling a user gesture if there isn't already an element in Picture-in-Picture."):
                return "Vérifiez que votre webcam n'est pas déjà en cours d'utilisation et réessayer."
            case "NotReadableError: Device in use":
                return "La webcam est déjà en cours d'utilisation. Fermez l'application qui l'utilise et recommencez."
            case "InvalidStateError: Failed to execute 'requestPictureInPicture' on 'HTMLVideoElement': Metadata for the video element are not loaded yet.":
                return "Une erreur est survenue. Veuillez réessayez ultérieurement."
            case "TypeError: videoElement.current.requestPictureInPicture is not a function":
                return "Votre navigateur ne supporte pas PIP. Nous vous recommandons un autre navigateur comme Chrome, Edge, Opera..."
            case "TypeError: t.current.requestPictureInPicture is not a function":
                return "Votre navigateur ne supporte pas PIP. Nous vous recommandons un autre navigateur comme Chrome, Edge, Opera..."
            default:
                return _err
        }
    }

    useEffect(()=>{
        videoElement.current = document.querySelector(".webcam")
        webcam.current = document.querySelector(".webcam-button")
        card.current = document.querySelector(".card")
    }, [])

    const accessWebcam = async () => {
        webcam.current.textContent = "Chargement..."
        try {
            if (videoElement.current.srcObject){
                streamWebcam.current.getTracks().forEach((track) => {
                    track.stop()
                });
                videoElement.current.srcObject = null
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
            console.log(err)
            setMessageCard({
                message: errorsHandler(err),
                type: "error"
            })

            card.current.classList.add("shown")
            setTimeout(() => {
                card.current.classList.remove("shown")
            }, 5000)

        }
    }

    const togglePictureInPicture = () => {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture(); // Exit PIP mode
          return
        }

        try {
            videoElement.current.requestPictureInPicture() // Enter PIP mode
            .then(() => {
                console.log("Video entered Picture-in-Picture mode.");
            })
            .catch(error => {
                setMessageCard({
                    message: errorsHandler(error),
                    type: "error"
                })
                card.current.classList.add("shown")
                setTimeout(() => {
                    card.current.classList.remove("shown")
                }, 5000)
                console.error("Error entering Picture-in-Picture mode:", error.toString());
                webcam.current.textContent = "Activer la webcam"
            });
        } catch (err){
            console.log(err)
            setMessageCard({
                message: errorsHandler(err),
                type: "error"
            })

            card.current.classList.add("shown")
            setTimeout(() => {
                card.current.classList.remove("shown")
            }, 5000)

            if (videoElement.current.srcObject){
                streamWebcam.current.getTracks().forEach((track) => {
                    track.stop()
                });
                videoElement.current.srcObject = null
                webcam.current.textContent = "Activer la webcam"
            }
        }
    }

    const activateWebcam = async () => {
        accessWebcam().then(res => {
            console.log(streamWebcam)
            if (res){
              webcam.current.textContent = res
              //togglePictureInPicture()
              setTimeout(() => {togglePictureInPicture()}, 300)
            }
            else {
                webcam.current.textContent = "Activer la webcam"
                console.log("PIP annulé")
            }
        })
    }

    return(
        <div>
            <video className="webcam" autoPlay></video>
            <button onClick={activateWebcam} className="webcam-button">Activer la webcam</button>
        </div>
    )
}

export default Webcam