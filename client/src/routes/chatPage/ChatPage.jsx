import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
import React from 'react';

const ChatPage = () => {

  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

console.log(data);

  if (isPending) {
    return <div className="chatPage">Loading...</div>;
  }

  if (error) {
    return <div className="chatPage">Error: {error.message}</div>;
  }

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message"></div>

          {data?.history?.map((message, i) => (
            <React.Fragment key={i}>
              {message.img && (
                <div className="message image">
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height={300}
                    width={400}
                    transformation={[{ width: 400, height: 300 }]}
                    loading="lazy"      // Lazy Loading
                    lqip={{ active: true, quality: 20 }}  // Low Quality Image Placeholder
                  />
                </div>
              )}

              <div className={message.role === "user" ? "message user" : "message"}>
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            </React.Fragment>
          ))}
          {data && <NewPrompt data={data}/>}
        </div>
      </div>
    </div>
  );
}

export default ChatPage