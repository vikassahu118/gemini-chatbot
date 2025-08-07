import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from "../components/Loading";
import { IoMdSend } from "react-icons/io";


const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const {
    fetchResponse,
    messages,
    prompt,
    setPrompt,
    newRequestLoading,
    loading,
    chats,
  } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const messagecontainerRef = useRef();

  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white relative overflow-hidden">
      {/* Background tailwind */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col relative z-10">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gradient-to-r from-indigo-800/50 to-purple-800/50 backdrop-blur-sm text-2xl hover:from-indigo-700/60 hover:to-purple-700/60 transition-all duration-200 border-b border-white/10"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex-1 p-6 mb-20 md:mb-0">
          <Header />

          {loading ? (
            <LoadingBig />
          ) : (
            <div
              className="flex-1 p-6 max-h-[600px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar"
              ref={messagecontainerRef}
            >
              {messages && messages.length > 0 ? (
                messages.map((e, i) => (
                  <div key={i} className="space-y-4 mb-6">
                    {/* User Message */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-4 rounded-2xl rounded-tr-md border border-blue-500/30 shadow-lg max-w-[80%]">
                        <p className="text-white">{e.question}</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full shadow-lg flex-shrink-0">
                        <CgProfile className="text-white text-xl" />
                      </div>
                    </div>

                    {/* AI response */}
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-lg flex-shrink-0">
                        <FaRobot className="text-white text-xl" />
                      </div>
                      <div className="backdrop-blur-lg bg-white/10 p-4 rounded-2xl rounded-tl-md border border-white/20 shadow-lg max-w-[80%]">
                        <div 
                          className="text-white prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: e.answer }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="text-6xl text-white/20">
                    <FaRobot />
                  </div>
                  <p className="text-white/60 text-lg">Start a conversation</p>
                  <p className="text-white/40 text-sm">Your messages will appear here</p>
                </div>
              )}

              {newRequestLoading && (
                <div className="flex justify-center">
                  <div className="backdrop-blur-lg bg-white/10 p-4 rounded-2xl border border-white/20">
                    <LoadingSmall />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/*prompt */}
      {(chats && chats.length > 0 && !isOpen) && (
        <div className="fixed bottom-0 right-0 left-auto p-4 w-full md:w-[75%] z-20">
          <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 rounded-2xl border border-white/20 shadow-2xl">
            <form
              onSubmit={submitHandler}
              className="flex items-center p-2"
            >
              <input
                className="flex-grow px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none text-sm"
                type="text"
                placeholder="Type your message here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
              <button 
                type="submit"
                className="ml-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <IoMdSend className="text-lg" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;