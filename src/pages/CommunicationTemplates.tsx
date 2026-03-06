import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, MessageSquare, Mail, Users, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  {
    icon: Mail,
    label: "Email",
    templates: [
      { title: "Ask for extension", text: "Hi [Name],\n\nI wanted to reach out regarding [assignment/task]. I'm finding it challenging to complete by the current deadline. Would it be possible to have an extension until [date]? I want to make sure I can submit quality work.\n\nThank you for understanding,\n[Your name]" },
      { title: "Follow up", text: "Hi [Name],\n\nI hope you're doing well. I'm following up on [topic] that we discussed on [date]. I wanted to check if there are any updates.\n\nThank you,\n[Your name]" },
    ],
  },
  {
    icon: Users,
    label: "Social",
    templates: [
      { title: "Starting a conversation", text: "Hey! I noticed [something specific about them/situation]. How's your [day/week] going?" },
      { title: "Asking to hang out", text: "Hey [Name], I was thinking about [activity]. Would you want to join sometime this [week/weekend]? No pressure at all!" },
      { title: "Setting a boundary", text: "I appreciate you thinking of me, but I need some time to recharge right now. Can we catch up [later time]?" },
    ],
  },
  {
    icon: HelpCircle,
    label: "Asking for Help",
    templates: [
      { title: "Asking a teacher", text: "Hi [Teacher],\n\nI'm having trouble understanding [topic]. Could we set up a time to go over it? I've tried [what you've attempted] but I'm still stuck on [specific part].\n\nThank you!" },
      { title: "Asking a coworker", text: "Hey [Name], I could use some help with [task]. Do you have a few minutes today? I'm stuck on [specific issue]." },
    ],
  },
];

const CommunicationTemplates = () => {
  const [selectedCat, setSelectedCat] = useState(0);
  const [customText, setCustomText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">Communication Support</h1>
        <p className="text-muted-foreground mt-1">
          Ready-to-use templates for common situations. Customize and copy.
        </p>
      </motion.div>

      {/* Category tabs */}
      <div className="flex gap-2">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCat(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                i === selectedCat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {categories[selectedCat].templates.map((tmpl, i) => (
          <motion.div
            key={tmpl.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-semibold font-display text-foreground">{tmpl.title}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyText(tmpl.text, tmpl.title)}
                className="shrink-0"
              >
                {copied === tmpl.title ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body leading-relaxed">
              {tmpl.text}
            </pre>
          </motion.div>
        ))}
      </div>

      {/* Custom message area */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-semibold font-display text-foreground">Draft your own</h3>
        </div>
        <Textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Write your message here..."
          className="min-h-[100px] rounded-xl"
        />
        <Button
          onClick={() => copyText(customText, "custom")}
          disabled={!customText.trim()}
          className="rounded-xl"
        >
          {copied === "custom" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          Copy to clipboard
        </Button>
      </div>
    </div>
  );
};

export default CommunicationTemplates;
