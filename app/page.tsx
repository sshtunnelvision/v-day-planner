"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InputForm } from "@/components/forms/InputForm";
import { DatePlan } from "@/components/suggestions/DatePlan";
import { GeneratePlanRequest, DatePlan as DatePlanType } from "@/types";
import { generateDatePlan } from "@/lib/api";
import { Heart, Loader2 } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [datePlan, setDatePlan] = useState<DatePlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (data: GeneratePlanRequest) => {
    setIsLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      const response = await generateDatePlan(data);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate date plan");
      }

      setDatePlan(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <div className="flex min-h-screen">
        <motion.div
          animate={{
            width: isExpanded ? "50%" : "100%",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="min-h-screen"
        >
          <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Heart className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                VALENTINES DAY DATE PLANNER
              </h1>
            </motion.header>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-2xl shadow-xl"
            >
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.section>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              exit={{ width: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="fixed top-0 right-0 h-screen border-l border-border"
            >
              <div className="h-full overflow-y-auto">
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center px-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="h-12 w-12 text-primary" />
                    </motion.div>
                    <p className="text-muted-foreground mt-4 text-lg">
                      Crafting your perfect date plan...
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 mx-4 bg-destructive/10 text-destructive rounded-xl shadow-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {datePlan && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="h-full"
                  >
                    <DatePlan plan={datePlan} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
