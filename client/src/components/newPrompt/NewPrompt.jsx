import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKContext, IKImage } from 'imagekitio-react';
import model from "../../lib/gemini";
import Markdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react'


/*
const [question,setQuestion] = useState("");
  const [answer,setAnswer] = useState("");

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" })
  }, [question,answer,img.dbData])


  const add = async (text) => {
    */


    const NewPrompt = () => {

    const endRef = useRef(null)
    useEffect(() => {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [])


      return (
        <>
        <div className="endChat" ref={endRef}></div>
          <form className="newForm">
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