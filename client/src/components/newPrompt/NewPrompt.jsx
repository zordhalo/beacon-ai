import './newPrompt.css';
import Upload from '../upload/Upload';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';
import { IKContext, IKImage } from 'imagekitio-react';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';

const INITIAL_CHAT_HISTORY = [
  {
    role: "user",
    parts: [{ text: "Hello" }],
  },
  {
    role: "model",
    parts: [{ text: "Great to meet you. What would you like to know?" }],
  },
];

const INITIAL_IMG_STATE = {
  isLoading: false,
  error: "",
  dbData: {},
  aiData: {},
};

const NewPrompt = ({ data }) => {

  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState(INITIAL_IMG_STATE);

  {/* Refs for scrolling to the end of the chat and the form */}
  const endRef = useRef(null);
  const formRef = useRef(null);

  const chat = model.startChat({
    history: INITIAL_CHAT_HISTORY,
    generationConfig: {}
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined ,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).
      then(() => {
        formRef.current.reset();
        setQuestion("");
        setAnswer("");
        setImg(INITIAL_IMG_STATE);
      });
    },
    onError: (error) => {
      console.log("Error adding conversation:", error);
    },
  });


  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
    try {
      const payload = Object.entries(img.aiData).length ? [img.aiData, text] : [text];
      const result = await chat.sendMessageStream(payload);

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      
      mutation.mutate();

    } catch (error) {
      console.error("Error generating content:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text,false);
  };

  {/* ONLY FOR PRODUCTION */}
  {/* CHECKS FOR ALREADY EXISTING CHAT HISTORY */}
  const hasRun = useRef(false);
  useEffect(() => {
    if(!hasRun.current){
    if(data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
    }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width={380}
          transformation={[{ width: 200 }]}
        />
      )}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref = {formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

NewPrompt.propTypes = {
  data: PropTypes.object.isRequired
};

export default NewPrompt;