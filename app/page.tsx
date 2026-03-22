"use client"
import { Navbar } from "@/components/uiComponents/Navbar";
import { StickyNote, Sparkles, Wand2, Tags, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import Logo from "@/components/uiComponents/Logo";



const features = [
  {
    icon: Sparkles,
    title: "AI Summary",
    description: "Automatically generate concise summaries of your long notes",
    color: "text-ai-summary",
    bgColor: "bg-ai-summary/10",
  },
  {
    icon: Wand2,
    title: "AI Improve",
    description: "Enhance grammar, clarity, and flow with one click",
    color: "text-ai-improve",
    bgColor: "bg-ai-improve/10",
  },
  {
    icon: Tags,
    title: "AI Tags",
    description: "Auto-generate relevant tags for better organization",
    color: "text-ai-tags",
    bgColor: "bg-ai-tags/10",
  },
];


const benefits = [
  "Smart AI-powered features",
  "Clean, distraction-free interface",
  "Dark and light themes",
  "Secure authentication",
  "Fast search functionality",
  "Mobile responsive design",
];


const user = {
  name: "rutika",
  email: "rutika@123@gmail.com",
  password: "1234",
}

const onLogout = () => {
  alert("logout")
}

const onProfile = () => {
  alert("click on profile")
}



export default function Home() {
  const { token } = useAuthStore();
  const router= useRouter();
    useEffect(()=>{
        if(token)
        {
            router.push('/dashboard')
        }
    },[token, router])
  return (
    <div className="min-h-screen flex flex-col bg-">
      {/* Header */}
      {
        token &&
        <header className="sticky top-0 z-40 w-full border-b border-b-white backdrop-blur ">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
             <Logo/>
              <span className="font-display text-xl font-semibold">NoteAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>
      }


      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Note Taking
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Your thoughts,{" "}
              <span className="text-gradient">enhanced by AI</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Take notes with the power of artificial intelligence. Get smart summaries,
              improve your writing, and organize with auto-generated tags.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2  hover:opacity-90 shadow-glow text-lg px-8">
                  Start for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex items-center justify-center py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Powered by AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three powerful AI features to supercharge your note-taking experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="flex items-center justify-center py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Everything you need
                </h2>
                <p className="text-muted-foreground text-lg">
                  A complete note-taking solution with modern features and a beautiful interface.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-card border shadow-lg p-6 flex items-center justify-center">
                  <div className="w-full max-w-xs space-y-4">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse-soft" />
                    <div className="h-3 w-full rounded bg-muted/70" />
                    <div className="h-3 w-5/6 rounded bg-muted/70" />
                    <div className="h-3 w-4/6 rounded bg-muted/70" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-16 rounded-full bg-ai-summary/20" />
                      <div className="h-6 w-20 rounded-full bg-ai-improve/20" />
                      <div className="h-6 w-14 rounded-full bg-ai-tags/20" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-xl bg-gradient-primary opacity-20 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-xl bg-ai-summary opacity-20 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex items-center justify-center py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of users who are already taking smarter notes with AI.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2  hover:opacity-80 shadow-glow text-lg px-8">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-primary">
                <StickyNote className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">NoteAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NoteAI. Built with ❤️ for better note-taking.
            </p>
          </div>
        </div>
      </footer>
    </div>

  );
}







