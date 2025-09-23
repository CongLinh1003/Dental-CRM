'use client'

import ChatPopup from "@/component/chatbot/ChatPopup";
import Footer from "@/component/footer/page";
import LadingPage from "@/component/lading/page";
import Menu from "@/component/menu/Menu";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarHeart, ChevronUp, MapPin, MessageSquare, MessagesSquare, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {

  const [showTop, setShowTop] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatPopUpOpen, setIsChatPopUpOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
      setShowChat(window.scrollY > 900);

      if (isChatPopUpOpen) {
        setIsChatPopUpOpen(true);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isChatPopUpOpen])


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  const toggleChatPopup = () => {
    setIsChatPopUpOpen(!isChatPopUpOpen);
  }

  return (
    <div className="relative">
      <Menu />
      <LadingPage />
      <Footer />

      {/* Hiển thị chatbot  */}


      {
        showChat && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed top-30 right-8 z-50 bg-purple-400 hover:bg-blue-500 text-white p-4 rounded-xl shadow-xl border-4 border-white animate-bounce-slow transition-all duration-300 flex items-center justify-center group"
            aria-label="Hotline"
            title="Hotline"
            style={{
              boxShadow: "0 4px 24px 0 rgba(255, 193, 7, 0.4)",
            }}
          >
            <PhoneCall size={20} className="group-hover:scale-110 transition-transform duration-300" />

          </motion.button>
        )
      }

      {
        showChat && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed top-50 right-8 z-50 bg-purple-400 hover:bg-blue-500 text-white p-4 rounded-xl shadow-xl border-4 border-white animate-bounce-slow transition-all duration-300 flex items-center justify-center group"
            aria-label="Zalo"
            title="Zalo"
            style={{
              boxShadow: "0 4px 24px 0 rgba(255, 193, 7, 0.4)",
            }}
          >
            <MessagesSquare size={20} className="group-hover:scale-110 transition-transform duration-300" />

          </motion.button>
        )
      }



      {
        showChat && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed top-70 right-8 z-50 bg-purple-400 hover:bg-blue-500 text-white p-4 rounded-xl shadow-xl border-4 border-white animate-bounce-slow transition-all duration-300 flex items-center justify-center group"
            aria-label="Địa chỉ"
            title="Địa chỉ"
            style={{
              boxShadow: "0 4px 24px 0 rgba(255, 193, 7, 0.4)",
            }}
          >
            <MapPin size={20} className="group-hover:scale-110 transition-transform duration-300" />

          </motion.button>
        )
      }

       {
        showChat && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed top-90 right-8 z-50 bg-purple-400 hover:bg-blue-500 text-white p-4 rounded-xl shadow-xl border-4 border-white animate-bounce-slow transition-all duration-300 flex items-center justify-center group"
            aria-label="Địa chỉ"
            title="Địa chỉ"
            style={{
              boxShadow: "0 4px 24px 0 rgba(255, 193, 7, 0.4)",
            }}
          >
            <CalendarHeart size={20} className="group-hover:scale-110 transition-transform duration-300" />

          </motion.button>
        )
      }

      {
        showChat && (
          <button
            onClick={toggleChatPopup}
            className="fixed bottom-30 right-8 z-50 bg-blue-400 hover:bg-blue-500 text-white p-4 rounded-full shadow-xl border-4 border-white animate-bounce-slow transition-all duration-300 flex items-center justify-center group"
            aria-label="Trở về đầu trang"
            style={{
              boxShadow: "0 4px 24px 0 rgba(255, 193, 7, 0.4)",
            }}
          >
            <MessageSquare size={20} className="group-hover:scale-110 transition-transform duration-300" />

          </button>
        )
      }

      <AnimatePresence>
        {
          isChatPopUpOpen && (
            <ChatPopup onClose={toggleChatPopup} />
          )
        }
      </AnimatePresence>

      {/* Hiển thị scroll top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-purple-400 hover:bg-purple-500 text-white p-2 rounded-full shadow-xl border-4 border-white animate-bounce-slow transition-all duration-300 flex items-center justify-center group animate-bounce"
          aria-label="Trở về đầu trang"
          style={{
            boxShadow: "0 4px 24px 0 rgba(255, 193, 7, 0.4)",
          }}
        >
          <ChevronUp size={32} className="group-hover:scale-110 transition-transform duration-300" />

        </button>
      )}
    </div>
  );
}
