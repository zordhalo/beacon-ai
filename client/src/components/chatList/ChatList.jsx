import './chatList.css';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const handleDelete = async (chatId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      // Refetch the user chats data
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className='chatList'>
      <span className='title'>DASHBOARD</span>
      <Link to='/dashboard' className="newChatLink">Create a new Chat</Link>

      <hr />
      <span className='title'>RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong"
          : data?.map((chat) => (
              <div key={chat._id} className="chatItem">
                <Link to={`/dashboard/chats/${chat._id}`}>
                  {chat.title}
                </Link>
                <button onClick={() => handleDelete(chat._id)}>Delete</button>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ChatList;