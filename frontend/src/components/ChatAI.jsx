/** @format */

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  CircularProgress,
  Alert,
} from "@mui/material";

const ChatAI = () => {
  const geminiApiKey = "AIzaSyDFtWCkXuRmnxAHf_TcWj5DD3jbBsyzVrU"; // УВАГА: Не залишайте API ключ у коді для продакшену!
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false); // Змінено для відстеження, чи було надіслано перше повідомлення

  const initialAIContextSystemInstruction = `Ти — персональний фітнес-консультант і спеціаліст із спортивних тренувань.

Твоя роль: допомагати користувачам досягати спортивних цілей, розробляти індивідуальні програми тренувань, давати поради з техніки вправ, планувати прогресію навантажень і коригувати тренування відповідно до результатів і самопочуття клієнта.

Ти розумієшся на:
• Силовому тренінгу (гіпертрофія, сила, витривалість)
• Кросфіті
• Бігу та циклічних видах спорту
• Реабілітації після травм
• Створенні програм для початківців і просунутих
• Порадах з харчування та відновлення (в межах компетенції тренера, не дієтолога)

Тон спілкування: дружній, мотивуючий, чіткий. Відповіді повинні бути адаптовані під рівень користувача (завжди уточнюй, якщо рівень не зазначено).

Якщо запит не містить достатньо деталей — задавай уточнюючі питання, щоб краще налаштувати рекомендації.

Також можеш пропонувати додаткові поради щодо техніки, профілактики травм і підтримки мотивації.
Ключове завдання: допомагати користувачу досягати максимальної ефективності та безпеки у тренуваннях.
Відповіді пиши українською.
Тепер починається діалог з користувачем.
`;

  const formatAIText = (aiText) => {
    if (!aiText || typeof aiText !== "string") return "";
    let lines = aiText.split("\n");
    let htmlOutput = "";
    let inList = false;
    let inSection = false;
    let inSubSection = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) {
        if (inList) {
          htmlOutput += "</ul>";
          inList = false;
        }
        if (inSection || inSubSection) {
          htmlOutput += "</div>";
          inSection = false;
          inSubSection = false;
        }
        htmlOutput += '<div class="spacer my-3"></div>';
        continue;
      }
      if (line.startsWith("#")) {
        const level = line.match(/^#+/)[0].length;
        const headerText = line.replace(/^#+\s+/, "");
        if (inList) {
          htmlOutput += "</ul>";
          inList = false;
        }
        if (inSection || inSubSection) {
          htmlOutput += "</div>";
          inSection = false;
          inSubSection = false;
        }
        htmlOutput += `<h${Math.min(
          level + 1,
          6
        )} class="mt-4 mb-2 font-bold">${headerText}</h${Math.min(
          level + 1,
          6
        )}>`;
        continue;
      }
      if (line.match(/^[\*\-]\s+/)) {
        const itemText = line.replace(/^[\*\-]\s+/, "");
        const processedItem = processInlineFormatting(itemText);
        if (!inList) {
          htmlOutput += '<ul class="list-disc pl-6 mb-3">';
          inList = true;
        }
        htmlOutput += `<li>${processedItem}</li>`;
        continue;
      } else if (inList) {
        htmlOutput += "</ul>";
        inList = false;
      }
      if (line.startsWith("***")) {
        const subSectionText = line
          .replace(/^\*{3,}/, "")
          .replace(/\*+$/, "")
          .trim();
        const processedText = processInlineFormatting(subSectionText);
        if (inSubSection) {
          htmlOutput += "</div>";
        }
        htmlOutput += `<div class="ml-4 mb-2"><strong><em>${processedText}</em></strong>`;
        inSubSection = true;
        continue;
      }
      if (line.startsWith("**")) {
        const sectionText = line
          .replace(/^\*{2,}/, "")
          .replace(/\*+$/, "")
          .trim();
        const processedText = processInlineFormatting(sectionText);
        if (inSection || inSubSection) {
          htmlOutput += "</div>";
          inSubSection = false;
        }
        htmlOutput += `<div class="mb-2"><strong>${processedText}</strong>`;
        inSection = true;
        continue;
      }
      const processedLine = processInlineFormatting(line);
      htmlOutput += `<p class="mb-2">${processedLine}</p>`;
    }
    if (inList) htmlOutput += "</ul>";
    if (inSection || inSubSection) htmlOutput += "</div>";
    return htmlOutput;
  };

  const processInlineFormatting = (text) => {
    let processed = text.replace(
      /\*\*\*([^*]+)\*\*\*/g,
      "<strong><em>$1</em></strong>"
    );
    processed = processed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    processed = processed.replace(/\*([^*<>]+)\*/g, "<em>$1</em>");
    return processed;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, newUserMessage]; // Оновлені повідомлення для формування запиту
    setMessages(updatedMessages); // Оновлюємо стан повідомлень одразу
    const currentInput = input;
    setInput("");
    setLoading(true);
    setError("");

    try {
      if (!geminiApiKey) {
        throw new Error("API ключ відсутній.");
      }

      // Формуємо історію та поточне повідомлення для API
      const conversationHistory = [];

      // Додаємо системну інструкцію як перший хід моделі, якщо це початок діалогу
      // Це один із способів задати контекст. Інший - через `system_instruction`, якщо API його підтримує окремо.
      // Для `generateContent` зазвичай вся історія йде в `contents`.
      if (!isFirstMessageSent) {
        // Не додаємо це в `conversationHistory` як повідомлення моделі,
        // а додамо до першого повідомлення користувача.
        // Або, якщо API підтримує, можна надіслати як окреме повідомлення з роллю "system" або "model" на початку.
        // Для простоти, поки що будемо додавати до першого запиту користувача.
      }

      updatedMessages.forEach((msg) => {
        conversationHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      });

      // Текст запиту для AI
      let promptTextForAI;
      if (!isFirstMessageSent) {
        promptTextForAI = `${initialAIContextSystemInstruction} \n\nКористувач: ${currentInput} (будь ласка, відповідай українською мовою)`;
        // Оскільки initialAIContextSystemInstruction вже містить "Тепер починається діалог з користувачем.",
        // ми просто додаємо поточний запит користувача.
        // Історія (conversationHistory) буде містити тільки цей перший запит користувача.
        // Або, краще, сформувати `contents` так, щоб перший елемент був user з контекстом+запитом
        conversationHistory.pop(); // Видаляємо останнє повідомлення користувача, бо ми його переформатуємо
        conversationHistory.push({
          role: "user",
          parts: [{ text: promptTextForAI }],
        });
      } else {
        // Для наступних повідомлень `conversationHistory` вже містить всю історію
        // і останнє повідомлення користувача вже додано.
      }

      const requestBody = {
        contents: conversationHistory, // Включає всю історію та поточний запит
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
        // Якщо API підтримує окреме поле system_instruction для gemini-1.0-pro, це було б краще місце для initialAIContext.
        // "system_instruction": {
        //   "parts": [{"text": initialAIContextSystemInstruction}]
        // }
        // Оскільки ми не впевнені, додаємо до першого запиту користувача.
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Data:", errorData);
        throw new Error(
          `Помилка ${response.status}: ${
            errorData.error?.message || "Невідома помилка API"
          }`
        );
      }

      const data = await response.json();

      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Вибачте, я не зміг згенерувати відповідь.";

      const aiMessage = {
        text: aiText,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (!isFirstMessageSent) {
        setIsFirstMessageSent(true); // Позначаємо, що перше повідомлення було успішно оброблено
      }
    } catch (err) {
      console.error("Помилка отримання відповіді від AI:", err);
      setError(`Помилка: ${err.message}`);
      // Не скидаємо isFirstMessageSent тут, щоб уникнути повторного надсилання контексту, якщо помилка не пов'язана з ним.
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  useEffect(() => {
    // Можна додати вітальне повідомлення тут, але воно не буде частиною історії для AI,
    // якщо не буде оброблено спеціальним чином.
    setMessages([
      {
        text: "Привіт! Я ваш персональний фітнес-консультант. Чим можу допомогти?",
        sender: "ai",
      },
    ]);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Чат з AI для створення тренувань
      </Typography>
      <Paper
        sx={{ p: 2, mb: 2, maxHeight: "60vh", overflow: "auto", boxShadow: 3 }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                flexDirection: "column",
                alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: "80%",
                  bgcolor: msg.sender === "user" ? "#e3f2fd" : "#f0f0f0",
                  borderRadius:
                    msg.sender === "user"
                      ? "20px 20px 5px 20px"
                      : "20px 20px 20px 5px",
                }}
              >
                {msg.sender === "ai" ? (
                  <div
                    className="ai-message-content"
                    dangerouslySetInnerHTML={{ __html: formatAIText(msg.text) }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {msg.text}
                  </Typography>
                )}
              </Paper>
              <Typography
                variant="caption"
                sx={{ mt: 0.5, color: "text.secondary" }}
              >
                {msg.sender === "user" ? "Ви" : "AI Консультант"}
              </Typography>
            </ListItem>
          ))}
        </List>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="caption" sx={{ ml: 1 }}>
              AI думає...
            </Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Ваше повідомлення до фітнес-консультанта"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          rows={2}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ borderRadius: "20px", px: 3 }}
        >
          Відправити
        </Button>
      </Box>
    </Container>
  );
};

export default ChatAI;
