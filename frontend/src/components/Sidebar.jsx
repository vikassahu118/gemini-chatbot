import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { chats, createChat, createLod, setSelected, deleteChat } = ChatData();
  const { logoutHandler } = UserData();

  const deleteChatHandler = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat(id);
    }
  };

  const clickEvent = (id) => {
    setSelected(id);
    toggleSidebar();
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 p-4 transition-transform transform flex flex-col justify-between md:relative md:translate-x-0 md:w-1/4 md:block ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="overflow-y-auto flex-1">
        {/* Close button for mobile */}
        <button
          className="md:hidden p-2 mb-4 bg-gray-700 rounded text-2xl"
          onClick={toggleSidebar}
        >
          <IoIosCloseCircle />
        </button>

        <div className="text-2xl font-semibold mb-6">ChatBot</div>

        <div className="mb-4">
          <button
            onClick={createChat}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            {createLod ? <LoadingSpinner /> : "New Chat +"}
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-2">Recent</p>
        <div className="space-y-2">
          {chats && chats.length > 0 ? (
            chats.map((e) => (
              <div
                key={e._id}
                className="w-full text-left py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded flex justify-between items-center cursor-pointer"
                onClick={() => clickEvent(e._id)}
              >
                <span className="truncate max-w-[200px]">
                  {e.latestMessage.slice(0, 38)}...
                </span>
                <span
                  className="bg-red-600 text-white text-xl px-3 py-2 rounded-md hover:bg-red-700"
                  onClick={(event) => deleteChatHandler(e._id, event)}
                >
                  <MdDelete />
                </span>
              </div>
            ))
          ) : (
            <p>No chats yet</p>
          )}
        </div>
      </div>

      {/* Logout button (always at bottom) */}
      <div className="mt-4">
        <button
          className="bg-red-600 text-white text-xl px-3 py-2 rounded-md hover:bg-red-700 w-full"
          onClick={() => {
            if (confirm("Are you sure you want to logout?")) {
              logoutHandler(navigate);
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
