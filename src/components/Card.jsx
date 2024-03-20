import { createContext, useContext, useEffect } from "react"
import { Context } from "../App"

const context = createContext()

function Card(){
    const { messageCard, setMessageCard } = useContext(Context)

    return(
        <div>
            <div className="card">
                { messageCard.type === "error" ? <p style={{color: "#a70000"}}> {messageCard.message} </p> : <p style={{color: "#30306d"}}> {messageCard.message} </p> }
            </div>
        </div>
    )
}

export default Card