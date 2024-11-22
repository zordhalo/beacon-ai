import './newPrompt.css'
import Upload from '../upload/Upload';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';

  {/* IMPORT IMAGE KIT*/}
import { IKContext, IKImage } from 'imagekitio-react';
import { useEffect, useRef, useState } from 'react'

    const NewPrompt = () => {

      {/* STATE FOR QUESTION AND ANSWER*/}
      const [question, setQuestion] = useState("");
      const [answer, setAnswer] = useState("");

      {/* IMAGE UPLOAD STATE FOR UPLOAD COMPONENT*/}
      const [img, setImg] = useState(
        {
        isLoading: false,
        error:"",
        dbData:{}
        }
      )

    {/* SCROLL TO BOTTOM OF CHAT*/}
    const endRef = useRef(null)
    useEffect(() => {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [question, answer, img.dbData]);  {/* SCROLL WHEN QUESTION, ANSWER OR IMAGE IS ADDED*/}

    {/* GENERATE CONTENT FROM MODEL*/}  
    const add = async (text) => {
      try {
        setQuestion(text);

        const result = await model.generateContent(text);
        const response = await result.response;

        setAnswer(response.text());
      } catch (error) {
        console.error("Error generating content:", error); 
      }
    };

    {/* HANDLE FORM SUBMISSION*/}
const handleSubmit = async (e) => {
  e.preventDefault()

  const text = e.target.text.value;
  if(!text) return;

  add(text);
}

{/* RENDER COMPONENTS AND FORM*/}
      return (
        <>
        {/* ADD NEW CHAT*/}
        {img.dbData?.filePath && (
          <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width={380}
          transformation={[{ width: 200 }]}
          />
        )}
        {/* SENDS QUESTION TO MODEL*/}
        {question && <div className='message user'>{question}</div>}
        {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

        {/* FORM TO SEND NEW QUESTION*/}
        <div className="endChat" ref={endRef}></div>
          <form className="newForm" onSubmit={handleSubmit}>
            <Upload setImg={setImg}/>
          <input id="file" type="file" multiple={false} hidden />
          <input type="text" name="text" placeholder="Ask anything..." />
          <button>
            <img src="/arrow.png" alt="" /> 
          </button>
        </form> 

      </>
      )
    } 

export default NewPrompt;