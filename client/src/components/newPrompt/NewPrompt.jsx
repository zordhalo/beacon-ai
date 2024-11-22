import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKContext, IKImage } from 'imagekitio-react';
import model from "../../lib/gemini";
import Markdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react'

    const NewPrompt = () => {

      const [img, setImg] = useState(
        {
        isLoading: false,
        error:"",
        dbData:{}
        }
      )

    const endRef = useRef(null)
    useEffect(() => {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [])

      return (
        <>
        {/* ADD NEW CHAT*/}
        {img.dbData?.filePath && (
          <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          ></IKImage>
        )}
        <div className="endChat" ref={endRef}></div>
          <form className="newForm">
            <Upload setImg={setImg}/>
          <label htmlFor="file">
            <img src="/attachment.png" alt="" />
          </label>
          <input id="file" type="file" multiple={false} hidden />
          <input type="text" placeholder="Type a message" />
          <button>
            <img src="/arrow.png" alt="" /> 
          </button>
        </form> 
      </>
      )
    } 

export default NewPrompt;