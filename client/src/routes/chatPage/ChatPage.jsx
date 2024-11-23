import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import React, { useEffect, useState, useRef } from 'react';
import { IKImage } from "imagekitio-react";
import Upload from '../../components/upload/Upload'; // Ensure the path is correct
import makeAPICall from '../../lib/openai'; // Updated after removing backend imports

const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const formRef = useRef(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => {
      if (!id) return null;
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch chat');
        return res.json();
      });
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
    }
  }, [id, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [data?.history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const mutation = useMutation({
    mutationFn: (params) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: params.question,
          answer: params.answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      formRef.current.reset();
      setQuestion("");
      setAnswer("");
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
    },
    onError: (err) => {
      console.log(err);
    },
    retry: 2, // Added retry mechanism
    retryDelay: 1000, // 1 second delay between retries
  });

  const add = async (text, isInitial) => {
    if (!isInitial) {
      setQuestion(text);
      // Immediately add user message to UI
      queryClient.setQueryData(["chat", id], (oldData) => ({
        ...oldData,
        history: [
          ...oldData.history,
          { _id: generateId(), role: "user", parts: [{ text }] },
        ],
      }));
    }

    setIsTyping(true);
    try {
      const aiResponse = await makeAPICall(text);
      if (!aiResponse) {
        setAnswer("AI failed to provide a response.");
      } else {
        setAnswer(aiResponse);
        
        // Then mutate with both messages
        mutation.mutate({
          question: text,
          answer: aiResponse
        });

        // Add AI response to UI
        queryClient.setQueryData(["chat", id], (oldData) => ({
          ...oldData,
          history: [
            ...oldData.history,
            { _id: generateId(), role: "model", parts: [{ text: aiResponse }] },
          ],
        }));
      }
    } catch (err) {
      console.log(err);
      setAnswer("An error occurred while fetching the AI response.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
    e.target.reset();
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, [data]);

  if (isPending) return <div className="chatPage">Loading...</div>;
  if (error) return <div className="chatPage">Error: {error.message}</div>;
  if (!data || !data.history) {
    console.log("No data or history:", data);
    return <div className="chatPage">No chat data available</div>;
  }

  // Add logging to inspect the history data
  console.log("Chat History:", data.history);

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data.history.map((item) => (
            <React.Fragment key={item._id}>
              {item.img && (
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={item.img}
                  height="300"
                  width="400"
                  transformation={[{ height: 300, width: 400 }]}
                  loading="lazy"
                  lqip={{ active: true, quality: 20 }}
                />
              )}
              <div className={`message ${item.role}`}>
                {/* Render all parts of the message */}
                {item.parts && item.parts.length > 0 ? (
                  item.parts.map((part, idx) => (
                    <Markdown key={idx}>{part.text}</Markdown>
                  ))
                ) : (
                  <Markdown>{/* Fallback content */}</Markdown>
                )}
              </div>
            </React.Fragment>
          ))}
          {isTyping && (
            <div className="message typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Say Anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>

      {answer === "AI failed to provide a response." && (
        <div className="error">{answer}</div>
      )}
      {answer === "An error occurred while fetching the AI response." && (
        <div className="error">{answer}</div>
      )}
    </div>
  );
};

export default ChatPage;