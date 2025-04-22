"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        body: JSON.stringify({ username, content: message }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.acceptingMessages === false) {
        toast.error(`${username} is not accepting messages at the moment.`);
        return;
      }
      if (data.success) {
        toast.success("Message sent successfully!");
        setMessage("");
        setSuggestedMessages([]);
      } else {
        toast.error(data.error || "Failed to send message") }

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestMessages = async () => {
    setSuggesting(true);
    try {
      const res = await fetch("/api/suggest-messages", {
        method: "POST",
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (!reader) throw new Error("No stream found");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      const questions = result
        .split("||")
        .map((q) => q.trim())
        .filter(Boolean);

      setSuggestedMessages(questions);
    } catch (error) {
      console.error("Suggestion error:", error);
      toast.error("Failed to fetch suggestions");
    } finally {
      setSuggesting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    toast.success("Message added to input!");
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#fefefe] px-4 py-10 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-xl shadow-xl border rounded-2xl p-6 bg-white space-y-4">
        <h1 className="text-3xl font-bold text-center">Public Profile</h1>
        <p className="text-center text-muted-foreground">
          Send an anonymous message to <span className="font-semibold">@{username}</span>
        </p>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your anonymous message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none min-h-[100px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send It"}
          </Button>
          <div className="text-center">
            <Button
              onClick={handleSuggestMessages}
              variant="secondary"
              disabled={suggesting}
            >
              {suggesting ? "Loading Suggestions..." : "Suggest Messages"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <AnimatePresence>
        {suggesting ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 max-w-xl w-full text-center space-y-2"
          >
            <p className="text-muted-foreground mb-2">Generating suggestions...</p>
            <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
            <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
            <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
          </motion.div>
        ) : suggestedMessages.length > 0 && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 max-w-xl w-full text-center"
          >
            <p className="mb-2 text-muted-foreground">
              Click on any message to use it.
            </p>
            <div className="grid gap-2">
              {suggestedMessages.map((msg, index) => (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  key={index}
                  onClick={() => handleSuggestionClick(msg)}
                  className="border px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition w-full"
                >
                  {msg}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
