"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Minus, 
  ChevronDown, 
  X, 
  Loader2, 
  ChevronLeft, 
  SendHorizontal, 
  MoreVertical,
  Home,
  MessageSquare,
  MessageSquareText,
  HomeIcon,
  MessageSquareIcon,
  ArrowRight,
  ExternalLink,
  Archive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  telephone: z.string().optional(),
  studyLevel: z.enum(["undergraduate", "postgraduate", "phd", "other"]).optional(),
});

type FormPhase = "form" | "otp" | "verified";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

const ChatMessage = ({ content, isUser }: { content: string; isUser: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isUser ? 0 : 1.5 }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src="https://github.com/shadcn.png" alt="Chat Assistant" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex", isUser && "flex justify-end w-full")}>
        <div className={cn(
          "rounded p-3 inline-block",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <p className="text-sm whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const WidgetTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<FormPhase>("form");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showConversation, setShowConversation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      studyLevel: undefined,
    },
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setPhase("otp");
  }

  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      setIsVerifying(true);
      setTimeout(() => {
        setPhase("verified");
      }, 2000);
    }
  }, [otp]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            className="absolute bottom-20 right-0 w-[500px] h-[calc(100vh-104px-24px)] bg-white rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
          >
            {/* Header Section */}
            <div className={cn(
              "relative p-6 bg-gray-950",
              phase === "verified" ? "pb-10" : "pb-12"
            )}>
              {showConversation ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowConversation(false)}
                            className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Back to home</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>More options</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Chat Assistant" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-400">You are speaking with</p>
                      <p className="text-sm font-medium text-white -mt-0.5">Gecko AI</p>
                    </div>
                  </div>

                  <div className="flex">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setIsOpen(false)}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Minimize chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleToggle}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Close chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <Image 
                      src="/gecko.svg" 
                      alt="Gecko Logo" 
                      width={48} 
                      height={48} 
                      className="mb-6"
                    />
                    <div className="flex">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={handleToggle}
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Minimize chat</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <p className="text-sm text-white">
                    Get quick help with any questions you have. Let us guide you through all your inquiries and give you the answers you need.
                  </p>
                </>
              )}
            </div>

            <div className="relative flex-1 bg-white -mt-4 rounded-t-lg overflow-y-auto">
              <AnimatePresence mode="wait">
                {phase === "form" ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name <span aria-hidden="true" className="text-red-600">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address <span aria-hidden="true" className="text-red-600">*</span></FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telephone number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter your telephone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="studyLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Study level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select your study level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                                <SelectItem value="phd">PhD</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" size="lg">
                        Submit
                      </Button>
                    </form>
                  </Form>
                ) : phase === "otp" ? (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-4 p-6"
                  >
                    <div>
                      <Label className="text-lg font-bold">Welcome back Liam!</Label>
                      <p className="text-sm text-muted-foreground">
                        We've sent a verification code to your email. Please enter it below.
                      </p>
                    </div>
                    <div className="space-y-4 p-6 border rounded">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button 
                        className="w-full" 
                        size="lg"
                        disabled={otp.length !== 6}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setPhase("form");
                        setOtp("");
                        setIsVerifying(false);
                      }}
                    >
                      <ChevronLeft />
                      Back
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="verified"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col"
                  >
                    {showConversation ? (
                      <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-6">
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <ChatMessage
                                key={message.id}
                                content={message.content}
                                isUser={message.isUser}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0 p-6 pt-0">
                          <div className="relative w-full flex items-center">
                            <Input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder="Type your message..."
                              className="w-full !h-12 pr-10"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={handleSendMessage}
                              className="absolute right-2"
                            >
                              <SendHorizontal className="h-4 w-4" />
                              <span className="sr-only">Send message</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Tabs defaultValue="home" className="flex flex-col h-full gap-0">
                        <div className="flex-1 overflow-y-auto">
                          <TabsContent value="home" className="mt-0">
                            <div className="space-y-4 p-6">
                              <button 
                                onClick={() => {
                                  setMessages([{
                                    id: "initial",
                                    content: "Hi Liam! How can I help you today?",
                                    isUser: false
                                  }]);
                                  setShowConversation(true);
                                }}
                                className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border"
                              >
                                <div>
                                  <h3 className="font-semibold">Start a conversation</h3>
                                </div>
                                <SendHorizontal className="w-5 h-5 text-primary" />
                              </button>

                              <div className="w-full flex flex-col gap-6 bg-white rounded p-4 text-left border">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-foreground">Submit your application</h3>
                                  <p className="text-sm text-muted-foreground">The deadline for applications is fast approaching. Ensure your place by applying before the 10th of July!</p>
                                </div>
                                <Button variant="secondary">Submit application</Button>
                              </div>

                              <div className="w-full flex flex-col gap-6 bg-white rounded p-4 text-left border">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-foreground">Register for our Open Day</h3>
                                  <p className="text-sm text-muted-foreground">Our Open Day takes place on the 5th of August, reserve your place now to see what Gecko U has to offer!</p>
                                </div>
                                <Button variant="secondary">Reserve your place</Button>
                              </div>

                              <div className="relative w-full aspect-video rounded overflow-hidden">
                                <Image
                                  src="/video.jpg"
                                  alt="Campus Life Video"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-primary border-b-[10px] border-b-transparent ml-1" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border">
                                <div>
                                  <h3 className="font-semibold">Financial aid</h3>
                                </div>
                                <ExternalLink className="w-5 h-5 text-primary" />
                              </button>
                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border">
                                <div>
                                  <h3 className="font-semibold">Accommodation</h3>
                                </div>
                                <ExternalLink className="w-5 h-5 text-primary" />
                              </button>
                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border">
                                <div>
                                  <h3 className="font-semibold">Campus tours</h3>
                                </div>
                                <ExternalLink className="w-5 h-5 text-primary" />
                              </button>

                            </div>
                          </TabsContent>
                          
                          <TabsContent value="conversations">
                            <div className="space-y-2 p-6">
                              <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
                                <MessageSquareText className="w-4 h-4" />
                                Active conversations
                              </h2>

                              <div className="space-y-2">
                                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                  <div className="flex gap-3 overflow-hidden">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="https://github.com/shadcn.png" />
                                      <AvatarFallback>LY</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">Thanks so much for your patience. We'll get back to you as soon as possible.</p>
                                      </div>
                                      <p className="text-sm text-muted-foreground">Liam Young</p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">Now</span>
                                </button>

                                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                  <div className="flex gap-3 overflow-hidden">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="https://github.com/shadcn.png" />
                                      <AvatarFallback>JU</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">Are there any specific questions you need help with?</p>
                                      </div>
                                      <p className="text-sm text-muted-foreground">Jonny Urquhart</p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">2h</span>
                                </button>
                              </div>

                              <h2 className="text-sm font-semibold flex items-center gap-2 mt-8 mb-4">
                                <Archive className="w-4 h-4" />
                                Archived conversations
                              </h2>

                              <div className="space-y-2">
                                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                  <div className="flex gap-3 overflow-hidden">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                                      MC
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className="font-medium truncate">Brilliant thanks Malcolm.</p>
                                      <p className="text-sm text-muted-foreground">Malcolm Christie</p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">2w</span>
                                </button>

                                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                  <div className="flex gap-3 overflow-hidden">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                                      AG
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className="font-medium truncate">If there is anything else we can help with?</p>
                                      <p className="text-sm text-muted-foreground">Amy Gallacher</p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">12w</span>
                                </button>

                                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                  <div className="flex gap-3 overflow-hidden">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="https://github.com/shadcn.png" />
                                      <AvatarFallback>CS</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                      <p className="font-medium truncate">Have a great day!</p>
                                      <p className="text-sm text-muted-foreground">Cheryl Sloan</p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">16w</span>
                                </button>

                                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                  <div className="flex gap-3 overflow-hidden">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="https://github.com/shadcn.png" />
                                      <AvatarFallback>AC</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                      <div>
                                        <p className="font-medium truncate">Whatever Andrew</p>
                                      </div>
                                      <p className="text-sm text-muted-foreground">Andrew Craib</p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">51w</span>
                                </button>
                              </div>
                            </div>
                          </TabsContent>
                        </div>

                        <div className="flex-shrink-0 border-t bg-white p-4">
                          <TabsList className="w-full grid grid-cols-2 h-auto p-0 bg-transparent gap-2">
                            <TabsTrigger 
                              value="home"
                              className="group flex flex-col items-center data-[state=active]:bg-transparent"
                            >
                              <Home className="w-5 h-5 group-data-[state=active]:fill-current" />
                              <span className="text-sm font-medium">Home</span>
                            </TabsTrigger>
                            <TabsTrigger 
                              value="conversations"
                              className="group flex flex-col items-center data-[state=active]:bg-transparent"
                            >
                              <div className="relative">
                                <MessageSquare className="w-5 h-5 group-data-[state=active]:fill-current" />
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] text-white w-4 h-4 flex items-center justify-center rounded-full">2</span>
                              </div>
                              <span className="text-sm font-medium">Conversations</span>
                            </TabsTrigger>
                          </TabsList>
                        </div>
                      </Tabs>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handleToggle}
          size="icon"
          className="w-14 h-14 rounded-full p-0 [&_svg]:!w-7 [&_svg]:!h-7 cursor-pointer"
          aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="chevron"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full h-full"
              >
                <ChevronDown strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full h-full"
              >
                <MessageSquareText strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}; 