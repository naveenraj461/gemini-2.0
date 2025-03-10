import { createContext, useState } from "react";
import runchat from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setRecentPrompt("");
    setResultData("");
  };

  const onSent = async (prompt) => {
    if (!prompt && !input) return;

    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      const finalPrompt = prompt || input;
      const response = await runchat(finalPrompt);
      setRecentPrompt(finalPrompt);
      setPrevPrompts((prev) => [...prev, finalPrompt]);

      let formattedResponse = response
        .split("**")
        .map((text, i) => (i % 2 === 1 ? `<b>${text}</b>` : text))
        .join("")
        .split("*")
        .join("</br>");

      let newResponseArray = formattedResponse.split("");
      newResponseArray.forEach((char, i) => delayPara(i, char));

    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
