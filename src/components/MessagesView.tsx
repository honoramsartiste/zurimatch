import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Ban,
  ArrowLeft,
  CheckCheck,
  Check,
  MapPin,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MessagesView: React.FC = () => {
  const {
    t,
    conversations,
    messages,
    currentUser,
    profiles,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    setReportingUser,
    blockUser,
    setActiveTab,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Filter conversations where currentUser is a participant
  const userConversations = conversations.filter(
    (c) => currentUser && c.participantIds.includes(currentUser.id)
  );

  const activeConv = userConversations.find((c) => c.id === activeConversationId) || userConversations[0];

  const otherUserId = activeConv?.participantIds.find((id) => id !== currentUser?.id);
  const otherUser = profiles.find((p) => p.id === otherUserId);

  const activeMessages = messages.filter((m) => m.conversationId === activeConv?.id);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputVal);
    setInputVal('');
  };

  const sendIcebreaker = (prompt: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, prompt);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden flex flex-col md:flex-row h-[750px]">
        {/* Left Side: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-[#FCFAFD] ${
            activeConv && 'hidden md:flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="font-extrabold text-lg text-gray-900 tracking-tight">
              {t.chat.title}
            </h1>
            <p className="text-xs text-gray-500">
              {userConversations.length} conversation{userConversations.length > 1 ? 's' : ''} active{userConversations.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* List of Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2 space-y-1">
            {userConversations.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.chat.emptyChats}
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Découvrir des profils
                </button>
              </div>
            ) : (
              userConversations.map((c) => {
                const partnerId = c.participantIds.find((id) => id !== currentUser.id);
                const partner = profiles.find((p) => p.id === partnerId);
                const isSelected = c.id === activeConv?.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversationId(c.id)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-purple-100/70 border border-purple-200/80 shadow-2xs'
                        : 'hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={partner?.photos[0]}
                        alt={partner?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 ring-2 ring-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-gray-900 truncate">
                          {partner?.name || 'Membre ZuriMatch'}
                        </span>
                        {c.lastMessage && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {c.lastMessage?.text || 'Commencez la discussion...'}
                      </p>
                    </div>

                    {c.unreadCount && c.unreadCount > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        {activeConv && otherUser ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={otherUser.photos[0]}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 ring-2 ring-white rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-gray-900">
                      {otherUser.name}, {otherUser.age}
                    </h3>
                    {otherUser.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{otherUser.city}, {otherUser.country}</span>
                    <span className="text-emerald-600 font-semibold ml-1">● En ligne</span>
                  </div>
                </div>
              </div>

              {/* Chat Actions: Report & Block */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportingUser(otherUser)}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Signaler ce membre"
                  aria-label="Signaler ce membre"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
                <button
                  onClick={() => blockUser(otherUser.id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  title="Bloquer ce membre"
                  aria-label="Bloquer ce membre"
                >
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FAF7FC]/50"
            >
              {/* Match Notice */}
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-900 text-[11px] font-semibold border border-purple-200/50">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Vous avez matché ! Les messages sont chiffrés et privés.</span>
                </div>
              </div>

              {/* Icebreakers Prompts if few messages */}
              {activeMessages.length <= 2 && (
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 max-w-md mx-auto space-y-2">
                  <span className="text-[11px] font-bold text-purple-900">
                    {t.chat.icebreakersTitle}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[t.chat.ib1, t.chat.ib2, t.chat.ib3].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendIcebreaker(prompt)}
                        className="text-left text-xs p-2 rounded-xl bg-white hover:bg-purple-100/70 text-purple-950 font-medium border border-purple-200/50 transition cursor-pointer"
                      >
                        « {prompt} »
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Bubbles */}
              {activeMessages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={otherUser.photos[0]}
                        alt={otherUser.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                      />
                    )}

                    <div
                      className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-purple-700 to-rose-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <div
                        className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                          isMe ? 'text-purple-200' : 'text-gray-400'
                        }`}
                      >
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && (
                          <span>
                            {m.isRead ? (
                              <CheckCheck className="w-3.5 h-3.5 text-rose-200" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={t.chat.typePlaceholder}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs sm:text-sm text-gray-900 outline-hidden transition"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-3 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white shadow-md shadow-purple-600/20 transition cursor-pointer"
                  title="Envoyer"
                  aria-label="Envoyer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-gray-400 text-xs">
            {t.chat.noConversationSelected}
          </div>
        )}
      </div>
    </div>
  );
};
