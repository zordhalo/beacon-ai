import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
import React, { useEffect } from 'react';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
    }
  }, [id, navigate]);

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

  if (isPending) return <div className="chatPage">Loading...</div>;
  if (error) return <div className="chatPage">Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="chatPage">

      <div className="wrapper">


        <NewPrompt data={data} />
        <div className="chat">
          {data.history?.map((item, index) => 
          (
            <div key={index} className="chatItem">

              <div className="question">{item.question}</div>

              <div className="answer">
                <Markdown>{item.answer}</Markdown>
              </div>

            </div>

            
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;