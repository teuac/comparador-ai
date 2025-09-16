import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend } from "react-icons/fi";
import iconeAC from "./assets/iconeAC.jpg";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center space-x-2"
  >
    <div className="p-3 rounded-lg bg-gray-200 text-ac-texto">
      <motion.div className="flex space-x-1" transition={{ staggerChildren: 0.2 }}>
        {[0,1,2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gray-500 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, delay: i*0.1, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </div>
  </motion.div>
);

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Sou o assistente da AC Engenharia. Como posso ajudar com suas cotações hoje?", sender: "ai" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage = { id: Date.now(), text: inputMessage, sender: "user" };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newUserMessage.text })
      });

      const data = await res.json();
      const aiResponse = { id: Date.now() + 1, text: data.reply, sender: "ai" };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Erro ao conectar com a IA.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-ac-cinza justify-center items-center font-sans">
      <div className="flex flex-col w-full max-w-2xl h-full md:h-[90vh] md:max-h-[700px] bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="bg-ac-azul text-white p-4 flex items-center shadow-md z-10">
          <img src={iconeAC} alt="Logo AC" className="w-8 h-8 mr-3 rounded-full" />
          <div>
            <h1 className="text-xl font-bold">Assistente de Cotações</h1>
            <p className="text-sm text-gray-300">AC Engenharia</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex items-end gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-ac-azul flex items-center justify-center text-ac-amarelo font-bold text-lg flex-shrink-0">A</div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl max-w-md md:max-w-lg shadow-md ${
                    message.sender === "user" ? "bg-ac-amarelo text-ac-azul rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-ac-azul transition-shadow"
              placeholder="Digite sua cotação aqui..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={e => { if (e.key === "Enter") handleSendMessage(); }}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-3 bg-ac-azul text-white rounded-full hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: isLoading ? 1 : 1.1 }}
              whileTap={{ scale: isLoading ? 1 : 0.9 }}
            >
              <FiSend className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
