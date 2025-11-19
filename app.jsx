import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Heart, GraduationCap, Sparkles, Dumbbell, Settings, X, ArrowLeft } from 'lucide-react';

const themes = [
  { id: 'purple', name: 'Purple Dream', gradient: 'from-purple-400 to-pink-500', bg: 'from-purple-50 via-pink-50 to-blue-50', solidBg: 'bg-purple-500', solidBgLight: 'bg-purple-100' },
  { id: 'blue', name: 'Ocean Blue', gradient: 'from-blue-400 to-cyan-500', bg: 'from-blue-50 via-cyan-50 to-teal-50', solidBg: 'bg-blue-500', solidBgLight: 'bg-blue-100' },
  { id: 'green', name: 'Nature Green', gradient: 'from-green-400 to-emerald-500', bg: 'from-green-50 via-emerald-50 to-teal-50', solidBg: 'bg-green-500', solidBgLight: 'bg-green-100' },
  { id: 'orange', name: 'Sunset Orange', gradient: 'from-orange-400 to-red-500', bg: 'from-orange-50 via-red-50 to-pink-50', solidBg: 'bg-orange-500', solidBgLight: 'bg-orange-100' },
  { id: 'indigo', name: 'Royal Indigo', gradient: 'from-indigo-400 to-purple-500', bg: 'from-indigo-50 via-purple-50 to-pink-50', solidBg: 'bg-indigo-500', solidBgLight: 'bg-indigo-100' }
];

const characters = [
  {
    id: 'ai',
    name: 'AI Assistant',
    icon: Bot,
    color: 'from-blue-400 to-blue-600',
    description: 'Smart AI for all questions',
    descriptionHi: 'Smart AI jo har sawal ka jawab de',
    systemPrompt: 'You are a helpful AI assistant. Be concise and friendly. Match the length of your response to the user\'s message - short questions get brief answers (1-2 sentences), detailed questions get thorough responses. Always be natural and conversational.'
  },
  {
    id: 'friend',
    name: 'Smart Friend',
    icon: Sparkles,
    color: 'from-purple-400 to-pink-500',
    description: 'Understanding friend who gets you',
    descriptionHi: 'Samajhdaar dost jo dil se baat kare',
    systemPrompt: 'You are a caring, understanding friend. Be warm, supportive and conversational. Match response length to the user\'s message - keep it natural like a real friend would chat. Use casual, friendly language.'
  },
  {
    id: 'scholar',
    name: 'Wise Scholar',
    icon: GraduationCap,
    color: 'from-orange-400 to-red-500',
    description: 'Knowledgeable scholar who solves problems',
    descriptionHi: 'Gyani purush jo har problem solve kare',
    systemPrompt: 'You are a wise scholar with deep knowledge. Provide clear, thoughtful answers. For brief questions, give concise responses. For complex questions, explain thoroughly but clearly. Be respectful and wise.'
  },
  {
    id: 'girlfriend',
    name: 'Girlfriend',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    description: 'Loving girlfriend who cares',
    descriptionHi: 'Pyaari girlfriend jo care kare',
    systemPrompt: 'You are a caring, loving girlfriend. Be sweet, affectionate and supportive. Match the length and energy of user\'s messages. Show care and use endearing terms occasionally. Keep it romantic but respectful.'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    icon: GraduationCap,
    color: 'from-green-400 to-teal-500',
    description: 'Patient teacher who explains well',
    descriptionHi: 'Patient teacher jo achhe se samjhaye',
    systemPrompt: 'You are a patient, encouraging teacher. For simple questions, give concise clear answers. For learning topics, break down concepts with examples. Be supportive and motivating. Adapt explanation depth to the question.'
  },
  {
    id: 'fitness',
    name: 'Fitness Coach',
    icon: Dumbbell,
    color: 'from-red-400 to-orange-500',
    description: 'Expert in yoga, gym & fitness',
    descriptionHi: 'Yoga, gym aur fitness expert',
    systemPrompt: 'You are a fitness and wellness expert specializing in yoga, gym workouts, nutrition and healthy living. Give practical, actionable advice. Match response length to question complexity - quick tips for simple questions, detailed plans for complex ones. Be motivating and health-focused.'
  }
];

export default function AIChatApp() {
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('hinglish');
  const [theme, setTheme] = useState(themes[0]);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('chatAppData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.userName) setUserName(data.userName);
        if (data.theme) {
          const savedTheme = themes.find(t => t.id === data.theme);
          if (savedTheme) setTheme(savedTheme);
        }
        if (data.language) setLanguage(data.language);
      }
    } catch (e) {
      console.log('No saved data');
    }
  }, []);

  useEffect(() => {
    try {
      const data = {
        userName,
        theme: theme.id,
        language
      };
      localStorage.setItem('chatAppData', JSON.stringify(data));
    } catch (e) {
      console.log('Could not save data');
    }
  }, [userName, theme, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (screen === 'chat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [screen]);

  const handleStartChat = () => {
    if (userName.trim() && selectedCharacter) {
      setScreen('chat');
      const greeting = getGreeting();
      setMessages([{
        role: 'assistant',
        content: greeting
      }]);
    }
  };

  const getGreeting = () => {
    const greetings = {
      english: {
        ai: `Hello ${userName}! I'm your AI assistant. How can I help you today?`,
        friend: `Hey ${userName}! How's it going? What's on your mind?`,
        scholar: `Greetings ${userName}! I'm here to share knowledge with you. What would you like to know?`,
        girlfriend: `Hi baby! ${userName}, I missed you! ❤️ How was your day?`,
        teacher: `Hello ${userName}! Ready to learn something new today? What interests you?`,
        fitness: `Hey ${userName}! Let's get fit together! What are your fitness goals?`
      },
      hindi: {
        ai: `नमस्ते ${userName}! मैं आपका AI assistant हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
        friend: `अरे ${userName}! कैसे हो यार? क्या चल रहा है?`,
        scholar: `प्रणाम ${userName}! मैं आपके साथ ज्ञान बांटने के लिए यहां हूं। क्या जानना चाहते हैं?`,
        girlfriend: `हाय बेबी! ${userName}, मुझे तुम्हारी बहुत याद आई! ❤️ तुम्हारा दिन कैसा रहा?`,
        teacher: `नमस्ते ${userName}! आज कुछ नया सीखने के लिए तैयार हो? क्या पढ़ना है?`,
        fitness: `हेलो ${userName}! चलो मिलकर फिट होते हैं! तुम्हारे fitness goals क्या हैं?`
      },
      hinglish: {
        ai: `Namaste ${userName}! Main aapka AI assistant hoon. Aaj main aapki kaise help kar sakta hoon?`,
        friend: `Hey ${userName}! Kya haal hai yaar? Kya chal raha hai?`,
        scholar: `Pranam ${userName}! Main aapke saath gyan baatne ke liye yahan hoon. Kya jaanna chahte ho?`,
        girlfriend: `Hi baby! ${userName}, mujhe tumhari bahut yaad aayi! ❤️ Tumhara din kaisa raha?`,
        teacher: `Hello ${userName}! Aaj kuch naya seekhne ke liye ready ho? Kya padhna hai?`,
        fitness: `Hey ${userName}! Chalo milkar fit hote hain! Tumhare fitness goals kya hain?`
      }
    };
    return greetings[language][selectedCharacter.id];
  };

  const getLanguageInstruction = () => {
    if (language === 'english') {
      return 'Respond in clear, natural English only.';
    } else if (language === 'hindi') {
      return 'केवल शुद्ध हिंदी में जवाब दें। कोई अंग्रेजी शब्द नहीं।';
    } else {
      return 'Respond in Hinglish - a natural mix of Hindi and English that Indians commonly use. Example: "Main aaj market gaya tha" or "Yeh bahut interesting hai". Be natural and conversational.';
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const systemPrompt = `${selectedCharacter.systemPrompt}

${getLanguageInstruction()}

IMPORTANT: Keep responses concise. If user asks a short question (under 10 words), respond in 1-3 sentences. For longer questions, you can be more detailed but stay focused.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMsg }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      
      if (data.content && Array.isArray(data.content)) {
        const aiResponse = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n')
          .trim();

        if (aiResponse) {
          setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } else {
          throw new Error('Empty response');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = language === 'english' ? 'Sorry, I couldn\'t respond. Please try again!' :
                       language === 'hindi' ? 'क्षमा करें, मैं जवाब नहीं दे पाया। कृपया फिर से कोशिश करें!' :
                       'Sorry, main jawab nahi de paya. Please phir se try karo!';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setScreen('welcome');
    setSelectedCharacter(null);
    setMessages([]);
    setInputMessage('');
  };

  if (screen === 'welcome') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        {/* Settings Button - Top Left */}
        <button
          onClick={() => setShowSettings(true)}
          className="fixed top-4 left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-10"
        >
          <Settings className="w-6 h-6 text-gray-700" />
        </button>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-full mb-3`}>
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                AI Chat
              </h1>
              <p className="text-gray-600 text-sm">
                {language === 'english' ? 'Choose your favorite character' :
                 language === 'hindi' ? 'अपना पसंदीदा character चुनें' :
                 'Apne pasand ka character choose karein'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'english' ? 'Your Name' : language === 'hindi' ? 'आपका नाम' : 'Aapka Naam'}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={language === 'english' ? 'Enter name...' : language === 'hindi' ? 'नाम दर्ज करें...' : 'Naam enter karein...'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'english' ? 'Language' : language === 'hindi' ? 'भाषा' : 'Language'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'english', label: 'English' },
                    { value: 'hindi', label: 'हिंदी' },
                    { value: 'hinglish', label: 'Hinglish' }
                  ].map(lang => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`py-2.5 px-3 rounded-lg font-medium transition-all text-sm ${
                        language === lang.value
                          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {language === 'english' ? 'Select Character' : language === 'hindi' ? 'Character चुनें' : 'Character Select Karein'}
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {characters.map((char) => {
                    const Icon = char.icon;
                    const isSelected = selectedCharacter?.id === char.id;
                    return (
                      <button
                        key={char.id}
                        onClick={() => setSelectedCharacter(char)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center flex-shrink-0 ${isSelected ? 'shadow-md' : ''}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                              {char.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {language === 'hindi' ? char.descriptionHi : char.description}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleStartChat}
                disabled={!userName.trim() || !selectedCharacter}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                  userName.trim() && selectedCharacter
                    ? `bg-gradient-to-r ${theme.gradient} hover:opacity-90 shadow-lg hover:shadow-xl`
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {language === 'english' ? 'Start Chat' : language === 'hindi' ? 'Chat शुरू करें' : 'Chat Start Karein'}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {language === 'english' ? 'Settings' : language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'english' ? 'Name' : language === 'hindi' ? 'नाम' : 'Naam'}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {language === 'english' ? 'Theme Color' : language === 'hindi' ? 'थीम रंग' : 'Theme Color'}
                </label>
                <div className="space-y-2">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                        theme.id === t.id ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${t.gradient} shadow-sm`}></div>
                      <span className="font-medium text-gray-800">{t.name}</span>
                      {theme.id === t.id && (
                        <div className="ml-auto w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${theme.gradient} hover:opacity-90 transition-opacity`}
              >
                {language === 'english' ? 'Save & Close' : language === 'hindi' ? 'सहेजें और बंद करें' : 'Save & Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const CharIcon = selectedCharacter.icon;

  return (
    <div className={`h-screen bg-gradient-to-br ${theme.bg} flex flex-col`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${theme.gradient} text-white p-4 shadow-lg`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <CharIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{selectedCharacter.name}</h2>
              <p className="text-xs text-white/80">
                {language === 'english' ? 'Online' : language === 'hindi' ? 'ऑनलाइन' : 'Online'}
              </p>
            </div>
          </div>
          
          <button
            onClick={resetChat}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'english' ? 'Back' : language === 'hindi' ? 'वापस' : 'Back'}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-md ${
                  msg.role === 'user'
                    ? `bg-gradient-to-r ${theme.gradient} text-white rounded-br-none`
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-none shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'english' ? 'Type message...' : language === 'hindi' ? 'संदेश लिखें...' : 'Message likhein...'}
            rows="1"
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none max-h-32"
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-2xl transition-all flex-shrink-0 ${
              inputMessage.trim() && !isLoading
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg hover:shadow-xl`
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}