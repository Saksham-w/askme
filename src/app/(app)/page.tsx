"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Shield, Sparkles } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { useSession } from "next-auth/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <main className="flex-grow">
          <section className="relative overflow-hidden">
            {/* Background gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />

            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm text-muted-foreground mb-8 animate-fade-in">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  <span>100% Anonymous & Secure</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in text-primary dark:text-foreground">
                  Discover What People{" "}
                  <span className="text-gradient">Really Think</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in">
                  Create your anonymous inbox and receive honest feedback from
                  friends, colleagues, and admirers. Your identity stays
                  hidden—always.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in ">
                  <Link href={session ? "/dashboard" : "/sign-up"}>
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/20 hover:text-foreground px-8 h-12 text-base gap-2 group cursor-pointer"
                    >
                      {session ? "Go to Dashboard" : "Create Your Inbox"}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                  <Link href="/u/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-border hover:bg-primary px-8 h-12 hover:text-white cursor-pointer dark:hover:bg-gray-200 dark:hover:text-black"
                    >
                      Send Anonymous Message
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Message Carousel Section */}
          <section
            className="py-16 md:py-24"
            aria-labelledby="messages-heading"
          >
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2
                  id="messages-heading"
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  Messages People Are Receiving
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  See the kind of feedback our users get. Could be compliments,
                  confessions, or honest opinions.
                </p>
              </div>

              <Carousel
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                className="w-full max-w-3xl mx-auto"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/1 lg:basis-1/1 p-2"
                    >
                      <Card className="glass glow border-glass-border transition-all duration-300 hover:border-primary/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-3 text-base font-medium">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                              <Mail className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <span>{message.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground mb-3 leading-relaxed">
                            "{message.content}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Received {message.received}
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>

          {/* Features Section */}
          <section
            className="py-16 md:py-24 border-t border-border/50"
            aria-labelledby="features-heading"
          >
            <div className="container mx-auto px-4 md:px-6">
              <h2 id="features-heading" className="sr-only">
                Features
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Complete Anonymity",
                    description:
                      "Senders stay 100% anonymous. No way to trace who sent what.",
                  },
                  {
                    icon: Sparkles,
                    title: "AI Suggestions",
                    description:
                      "Stuck? Get AI-powered message suggestions to break the ice.",
                  },
                  {
                    icon: Mail,
                    title: "Instant Delivery",
                    description:
                      "Messages arrive in real-time. No delays, no waiting.",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="text-center p-6 border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary mb-5">
                      <feature.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} AskMe. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
