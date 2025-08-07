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
    e.stopPropagation(); // prevent parent click
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
      className={`fixed inset-0 backdrop-blur-xl bg-gradient-to-b from-indigo-950/95 via-purple-950/95 to-pink-950/95 border-r border-white/20 p-6 transition-all duration-300 transform md:relative md:translate-x-0 md:w-1/4 md:block z-30 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-0 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Close button (mobile only) */}
        <button
          className="md:hidden self-end p-2 mb-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-2xl text-white/80 hover:text-white transition-all duration-200 border border-white/20"
          onClick={toggleSidebar}
        >
          <IoIosCloseCircle />
        </button>

        {/* Title */}
        <div className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          ChatBot
        </div>

        {/* New Chat Button */}
        <div className="mb-6">
          <button
            onClick={createChat}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 transform shadow-lg hover:shadow-xl border border-blue-500/30"
          >
            {createLod ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>New Chat</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-white/60 mb-4 font-medium">Recent Conversations</p>
          <div className="max-h-[500px] overflow-y-auto mb-[72px] thin-scrollbar space-y-2">
            {chats && chats.length > 0 ? (
              chats.map((e) => (
                <div
                  key={e._id}
                  className="group w-full text-left py-3 px-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-200 flex justify-between items-center cursor-pointer hover:shadow-lg"
                  onClick={() => clickEvent(e._id)}
                >
                  <span className="text-white/90 group-hover:text-white truncate pr-2 flex-1">
                    {e.latestMessage.slice(0, 32)}...
                  </span>
                  <button
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-2 rounded-lg hover:scale-105 transform transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                    onClick={(event) => deleteChatHandler(e._id, event)}
                  >
                    <MdDelete className="text-sm" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl text-white/20 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-white/60">No conversations yet</p>
                <p className="text-white/40 text-sm mt-1">Start a new chat to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-white/20">
          <button
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-4 py-3 rounded-xl hover:scale-105 transform transition-all duration-200 w-full shadow-lg hover:shadow-xl border border-red-500/30"
            onClick={() => {
              if (confirm("Are you sure you want to logout?")) {
                logoutHandler(navigate);
              }
            }}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;