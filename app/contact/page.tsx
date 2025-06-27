"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async () => {
    const toastId = toast.loading("Sending message...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Could not send message", {
          id: toastId,
          description: err.error,
        });
        return;
      }

      toast.success("Message sent successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);
      toast.error("A technical error occurred", {
        id: toastId,
      });
    }
  };

  return (
    <div className="container py-10 pt-20 max-w-xl mx-auto text-white space-y-4">
      <h2 className="text-2xl font-bold mb-6">Contact ISBAD.com</h2>

      <div>
        <Label className="mb-1" htmlFor="name">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label className="mb-1" htmlFor="phone">
          Phone
        </Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+46 701234567"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label className="mb-1" htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@mail.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label className="mb-1" htmlFor="message">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your message here..."
          className="h-48"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <Button
        className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
        size="lg"
        onClick={handleSendMessage}
      >
        Send Message
      </Button>
    </div>
  );
}
