import "./dashboardPage.css";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import makeAPICall from "../../lib/openai";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (text) => {
      try {
        // Get AI response
        const aiResponse = await makeAPICall(text);
        
        // Create chat with both question and answer
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            title: text.substring(0, 50),
            history: [{
              question: text,
              answer: aiResponse
            }]
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create chat');
        }

        return response.json();
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${data._id}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text.trim()) return;

    mutation.mutate(text);
    e.target.reset();
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>Beacon.ai</h1>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="text" 
            placeholder="Ask me anything..."
            disabled={mutation.isPending} 
          />
          <button disabled={mutation.isPending}>
            {mutation.isPending ? 'Generating...' : <img src="/arrow.png" alt="" />}
          </button>
        </form>
        {mutation.error && <div className="error">{mutation.error.message}</div>}
      </div>
    </div>
  );
};

export default DashboardPage;
