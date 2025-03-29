"use client";

import Logo from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { montserrat } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Database, Rocket, Search, SettingsIcon, ShieldCheck, TrendingUp } from "lucide-react"; // Relevant icons
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

const staggerChildren = {
  animate: {
    transition: { staggerChildren: 0.2 },
  },
};

const featureVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const heroImageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

// --- Hero Section ---

const Hero = () => (
  <motion.section
    className="py-24 bg-gradient-to-br from-primary/10 to-transparent"
    variants={fadeIn}
    initial="initial"
    animate="animate"
  >
    <div className="container mx-auto px-6 md:px-12 relative">
      <div className="lg:flex lg:items-center lg:justify-between">
        <motion.div className="text-center lg:text-left lg:w-1/2" variants={staggerChildren}>
          <motion.h1
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight mb-6",
              montserrat
            )}
            variants={slideUp}
          >
            Unlock the Power of Your Blockchain Data
          </motion.h1>
          <motion.p className="text-lg text-muted-foreground mb-8" variants={slideUp}>
            SolixDB is a cutting-edge platform for indexing and exploring blockchain data. Connect your database, define indexing parameters, and gain unprecedented insights.
          </motion.p>
          <motion.div className="space-x-4" variants={slideUp}>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/signin">Get Started for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center" variants={heroImageVariants} initial="initial" animate="animate">
          <div className="relative w-80 h-80 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            <Logo width={200} />
          </div>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

const Feature = ({ icon: Icon, title, description }: { icon: React.ComponentType; title: string; description: string }) => (
  <motion.div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-card dark:bg-card-foreground" variants={featureVariants}>
    <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
      <Icon />
    </div>
    <h3 className={cn("text-xl font-semibold text-foreground mb-2", montserrat)}>{title}</h3>
    <p className="text-muted-foreground text-center">{description}</p>
  </motion.div>
);

const Features = () => (
  <motion.section className="py-16 bg-background" variants={fadeIn} initial="initial" animate="animate">
    <div className="container mx-auto px-6 md:px-12">
      <motion.h2
        className={cn("text-3xl font-semibold text-primary tracking-tight text-center mb-10", montserrat)}
        variants={slideUp}
      >
        Key Features
      </motion.h2>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerChildren}>
        <Feature icon={Database} title="Database Connectivity" description="Seamlessly connect to your existing database to index blockchain data." />
        <Feature icon={Search} title="Advanced Indexing" description="Define granular indexing parameters for specific tables, columns, and criteria." />
        <Feature icon={Rocket} title="Real-time Insights" description="Gain up-to-date insights into your blockchain data with efficient indexing." />
        <Feature icon={ShieldCheck} title="Secure & Reliable" description="Your data is handled with the utmost security and reliability on our platform." />
        <Feature icon={TrendingUp} title="Scalable Infrastructure" description="Our infrastructure scales with your data needs, ensuring consistent performance." />
        <Feature icon={SettingsIcon} title="Customizable Configuration" description="Tailor the indexing process to your specific requirements and use cases." />
      </motion.div>
    </div>
  </motion.section>
);

const CTA = () => (
  <motion.section className="py-20 bg-primary/5" variants={fadeIn} initial="initial" animate="animate">
    <div className="container mx-auto px-6 md:px-12 text-center">
      <motion.h2
        className={cn("text-3xl font-semibold text-primary tracking-tight mb-8", montserrat)}
        variants={slideUp}
      >
        Ready to Dive In?
      </motion.h2>
      <motion.p className="text-lg text-muted-foreground mb-10" variants={slideUp}>
        Start indexing your blockchain data today and unlock valuable insights with SolixDB.
      </motion.p>
      <motion.div variants={slideUp}>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/signin">Get Started Now</Link>
        </Button>
      </motion.div>
    </div>
  </motion.section>
);

export default function LandingPage() {
  return (
    <motion.div
      className={cn("min-h-screen bg-background", montserrat)}
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <Hero />
      <Features />
      <CTA />
    </motion.div>
  );
}