import { motion } from "framer-motion";
import { DatePlan as DatePlanType } from "@/types";
import { formatTime } from "@/lib/utils";
import { Clock, Utensils, Gift, ExternalLink } from "lucide-react";

interface DatePlanProps {
  plan: DatePlanType;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 },
};

export function DatePlan({ plan }: DatePlanProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative h-full"
    >
      <motion.div
        variants={item}
        className="sticky top-0 bg-background py-4 px-4 z-10 border-b border-border"
      >
        <h2 className="text-2xl font-bold text-primary">Your Date Plan</h2>
      </motion.div>

      <div className="px-4 py-6 space-y-8">
        <motion.section variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Schedule</h3>
          </div>
          <div className="space-y-3">
            {plan.schedule.map((scheduleItem, index) => (
              <motion.div
                key={index}
                variants={item}
                className="p-3 border border-primary/10 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="font-semibold text-primary">
                  {formatTime(scheduleItem.time)} - {scheduleItem.activity}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {scheduleItem.description}
                </p>
                {scheduleItem.location && (
                  <p className="text-muted-foreground/70 text-sm mt-1">
                    {scheduleItem.location}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Restaurant Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {plan.restaurants.map((restaurant, index) => (
              <motion.div
                key={index}
                variants={item}
                className="p-3 border border-primary/10 rounded-lg bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-primary">
                      {restaurant.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {restaurant.cuisine}
                    </p>
                  </div>
                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors p-1 -m-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Visit restaurant website</span>
                    </a>
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground/70">
                  <p>{restaurant.priceRange}</p>
                  <p>{restaurant.location}</p>
                  {restaurant.rating && (
                    <p className="mt-0.5">Rating: {restaurant.rating}/5</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Gift Ideas</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {plan.giftIdeas.map((gift, index) => (
              <motion.div
                key={index}
                variants={item}
                className="p-3 border border-primary/10 rounded-lg bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <h4 className="font-semibold text-primary">{gift.item}</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  {gift.description}
                </p>
                <div className="mt-1 text-sm text-muted-foreground/70">
                  <p className="mt-0.5">Relevance: {gift.relevance}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
