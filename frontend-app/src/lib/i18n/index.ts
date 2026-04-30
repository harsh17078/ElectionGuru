import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        timeline: "Timeline",
        guide: "Step-by-Step Guide",
        myths: "Myth Buster",
        chat: "Ask AI",
        booth: "Find Booth",
      },
      hero: {
        title: "Your Vote, Your Voice",
        subtitle: "An interactive guide to understanding the Indian election process — from registration to results.",
        cta: "Start Your Journey",
        cta2: "Ask a Question",
      },
      features: {
        timeline: "Election Timeline",
        timelineDesc: "Visualize every phase of the election process on an interactive timeline.",
        guide: "Step-by-Step Guide",
        guideDesc: "Follow a guided wizard to understand registration, nomination, voting & more.",
        myths: "Myth Buster",
        mythsDesc: "Separate fact from fiction with our interactive myth vs fact checker.",
        chat: "AI Assistant",
        chatDesc: "Ask any election-related question and get instant, reliable answers.",
        booth: "Find Your Booth",
        boothDesc: "Locate your nearest polling booth on a map.",
        multilingual: "Multilingual",
        multilingualDesc: "Switch between English and Hindi for full accessibility.",
      },
      timeline_page: {
        title: "Election Timeline",
        subtitle: "Follow the journey of an Indian General Election from start to finish.",
      },
      guide_page: {
        title: "Step-by-Step Election Guide",
        subtitle: "Walk through each phase of the election process interactively.",
        next: "Next Step",
        prev: "Previous",
        finish: "Finish",
        completed: "You've completed the election guide!",
        restart: "Start Over",
      },
      myths_page: {
        title: "Myth vs Fact",
        subtitle: "Tap a card to reveal the truth behind common election myths.",
        myth: "MYTH",
        fact: "FACT",
        reveal: "Tap to reveal fact",
      },
      chat_page: {
        title: "Election AI Assistant",
        subtitle: "Ask me anything about the election process.",
        placeholder: "Type your question...",
        send: "Send",
        suggestions: [
          "How do I register to vote?",
          "What if I lost my voter ID?",
          "How are EVMs secured?",
          "What is NOTA?",
        ],
      },
      booth_page: {
        title: "Find Your Polling Booth",
        subtitle: "Enter your location to find the nearest polling station.",
        search: "Search location...",
        find: "Find Booth",
        note: "Note: Requires Google Maps API key for live results.",
      },
      footer: {
        tagline: "Empowering citizens through election education.",
        rights: "© 2026 Election Assistant. All rights reserved.",
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        timeline: "समयरेखा",
        guide: "चरण-दर-चरण मार्गदर्शिका",
        myths: "मिथक तोड़क",
        chat: "AI से पूछें",
        booth: "बूथ खोजें",
      },
      hero: {
        title: "आपका वोट, आपकी आवाज़",
        subtitle: "भारतीय चुनाव प्रक्रिया को समझने के लिए एक इंटरैक्टिव गाइड — पंजीकरण से परिणाम तक।",
        cta: "अपनी यात्रा शुरू करें",
        cta2: "सवाल पूछें",
      },
      features: {
        timeline: "चुनाव समयरेखा",
        timelineDesc: "चुनाव प्रक्रिया के हर चरण को इंटरैक्टिव समयरेखा पर देखें।",
        guide: "चरण-दर-चरण मार्गदर्शिका",
        guideDesc: "पंजीकरण, नामांकन, मतदान और अधिक को समझने के लिए गाइड का पालन करें।",
        myths: "मिथक तोड़क",
        mythsDesc: "हमारे इंटरैक्टिव मिथक बनाम तथ्य चेकर के साथ तथ्य को कल्पना से अलग करें।",
        chat: "AI सहायक",
        chatDesc: "कोई भी चुनाव-संबंधित प्रश्न पूछें और तुरंत, विश्वसनीय उत्तर पाएं।",
        booth: "अपना बूथ खोजें",
        boothDesc: "मानचित्र पर अपना निकटतम मतदान केंद्र खोजें।",
        multilingual: "बहुभाषी",
        multilingualDesc: "पूर्ण पहुंच के लिए अंग्रेजी और हिंदी के बीच स्विच करें।",
      },
      timeline_page: {
        title: "चुनाव समयरेखा",
        subtitle: "भारतीय आम चुनाव की यात्रा को शुरू से अंत तक देखें।",
      },
      guide_page: {
        title: "चरण-दर-चरण चुनाव मार्गदर्शिका",
        subtitle: "चुनाव प्रक्रिया के प्रत्येक चरण को इंटरैक्टिव रूप से देखें।",
        next: "अगला चरण",
        prev: "पिछला",
        finish: "समाप्त",
        completed: "आपने चुनाव गाइड पूरी कर ली है!",
        restart: "फिर से शुरू करें",
      },
      myths_page: {
        title: "मिथक बनाम तथ्य",
        subtitle: "सामान्य चुनाव मिथकों के पीछे का सच जानने के लिए कार्ड पर टैप करें।",
        myth: "मिथक",
        fact: "तथ्य",
        reveal: "तथ्य जानने के लिए टैप करें",
      },
      chat_page: {
        title: "चुनाव AI सहायक",
        subtitle: "चुनाव प्रक्रिया के बारे में कुछ भी पूछें।",
        placeholder: "अपना प्रश्न टाइप करें...",
        send: "भेजें",
        suggestions: [
          "मैं मतदान के लिए कैसे पंजीकरण करूं?",
          "अगर मेरा वोटर आईडी खो जाए तो?",
          "EVM कैसे सुरक्षित हैं?",
          "NOTA क्या है?",
        ],
      },
      booth_page: {
        title: "अपना मतदान केंद्र खोजें",
        subtitle: "निकटतम मतदान केंद्र खोजने के लिए अपना स्थान दर्ज करें।",
        search: "स्थान खोजें...",
        find: "बूथ खोजें",
        note: "नोट: लाइव परिणामों के लिए Google Maps API कुंजी आवश्यक है।",
      },
      footer: {
        tagline: "चुनाव शिक्षा के माध्यम से नागरिकों को सशक्त बनाना।",
        rights: "© 2026 चुनाव सहायक। सभी अधिकार सुरक्षित।",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
