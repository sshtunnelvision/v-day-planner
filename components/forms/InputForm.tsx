import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GeneratePlanRequest } from "@/types";
import { validateLocation } from "@/lib/utils";
import { X } from "lucide-react";

const COMMON_INTERESTS = [
  "Reading",
  "Music",
  "Art",
  "Travel",
  "Cooking",
  "Gaming",
  "Sports",
  "Photography",
  "Dance",
  "Movies",
  "Technology",
  "Nature",
  "Fashion",
  "Fitness",
  "Animals",
];

const FOOD_PREFERENCES = [
  "Italian",
  "Japanese",
  "Mexican",
  "Chinese",
  "French",
  "Indian",
  "Thai",
  "Mediterranean",
  "American",
  "Seafood",
  "Vegetarian",
  "Steakhouse",
];

interface InputFormProps {
  onSubmit: (data: GeneratePlanRequest) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [foodPreference, setFoodPreference] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [showBudget, setShowBudget] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCustomCuisine, setShowCustomCuisine] = useState(false);

  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const handleCustomInterests = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newInterests = customInterest
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i && !interests.includes(i));

      if (newInterests.length > 0) {
        setInterests([...interests, ...newInterests]);
        setCustomInterest("");
      }
    }
  };

  const handleCustomCuisine = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cuisine = customCuisine.trim();
      if (cuisine && cuisine !== foodPreference) {
        setFoodPreference(cuisine);
        setCustomCuisine("");
      }
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLocation(location)) {
      alert("Please enter a valid location");
      return;
    }

    const data: GeneratePlanRequest = {
      location,
      ...(interests.length > 0 && { interests }),
      ...(foodPreference && { foodPreference }),
      ...(budget && { budget }),
      ...(preferences && { preferences }),
    };

    onSubmit(data);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-8 max-w-xl mx-auto"
    >
      <div className="space-y-3">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-muted-foreground"
        >
          Location *
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          style={{ transformOrigin: "center" }}
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your city"
          className="w-full px-4 py-3 bg-background/50 border-0 rounded-lg shadow-sm ring-1 ring-border/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-muted-foreground">
          Partner&apos;s Interests
        </label>

        <AnimatePresence>
          {customInterest !== "" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative overflow-hidden rounded-lg p-[1px]">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  style={{ transformOrigin: "center" }}
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={handleCustomInterests}
                  placeholder="Type an interest"
                  className="w-full px-4 py-3 bg-background/50 border-0 shadow-sm ring-1 ring-border/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 pr-20 rounded-lg"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50 bg-background/50 px-2 py-1 rounded-md ring-1 ring-border/50">
                  press enter
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-1.5">
          {COMMON_INTERESTS.filter(
            (interest) => !interests.includes(interest)
          ).map((interest) => (
            <Button
              key={interest}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleAddInterest(interest);
              }}
              variant="ghost"
              className="bg-secondary/50 hover:bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground h-6 px-2 text-xs"
            >
              {interest}
            </Button>
          ))}
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCustomInterest(customInterest === "" ? " " : "");
            }}
            variant="ghost"
            className={
              customInterest !== ""
                ? "bg-primary/10 hover:bg-primary/20 text-primary h-6 px-2 text-xs"
                : "bg-secondary/50 hover:bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground h-6 px-2 text-xs"
            }
          >
            Custom
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {interests.map((interest) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center bg-primary/10 hover:bg-primary/20 text-primary rounded-lg px-3 py-1">
                  <span>{interest}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveInterest(interest);
                    }}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4">
        <label
          htmlFor="foodPreference"
          className="block text-sm font-medium text-muted-foreground"
        >
          Preferred Cuisine
        </label>

        <AnimatePresence>
          {showCustomCuisine && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative overflow-hidden rounded-lg p-[1px]">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  style={{ transformOrigin: "center" }}
                  type="text"
                  value={customCuisine}
                  onChange={(e) => setCustomCuisine(e.target.value)}
                  onKeyDown={handleCustomCuisine}
                  placeholder="Type your cuisine preference"
                  className="w-full px-4 py-3 bg-background/50 border-0 shadow-sm ring-1 ring-border/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 pr-20 rounded-lg"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50 bg-background/50 px-2 py-1 rounded-md ring-1 ring-border/50">
                  press enter
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-1.5">
          {FOOD_PREFERENCES.map((cuisine) => (
            <Button
              key={cuisine}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setFoodPreference(cuisine);
                setCustomCuisine("");
                setShowCustomCuisine(false);
              }}
              variant="ghost"
              className="bg-secondary/50 hover:bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground h-6 px-2 text-xs"
            >
              {cuisine}
            </Button>
          ))}
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowCustomCuisine(!showCustomCuisine);
            }}
            variant="ghost"
            className={
              showCustomCuisine
                ? "bg-primary/10 hover:bg-primary/20 text-primary h-6 px-2 text-xs"
                : "bg-secondary/50 hover:bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground h-6 px-2 text-xs"
            }
          >
            Custom
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {foodPreference && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center bg-primary/10 hover:bg-primary/20 text-primary rounded-lg px-3 py-1">
                  <span>{foodPreference}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      setFoodPreference("");
                      setShowCustomCuisine(false);
                    }}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowBudget(!showBudget)}
          className="w-full bg-background/50 border-0 shadow-sm ring-1 ring-border/50 hover:ring-border/80 transition-shadow text-muted-foreground"
        >
          {showBudget ? "Hide Budget" : "Add Budget (Optional)"}
        </Button>

        <AnimatePresence>
          {showBudget && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <input
                id="budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $200"
                className="w-full px-4 py-3 bg-background/50 border-0 rounded-lg shadow-sm ring-1 ring-border/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreferences(!showPreferences)}
          className="w-full bg-background/50 border-0 shadow-sm ring-1 ring-border/50 hover:ring-border/80 transition-shadow text-muted-foreground"
        >
          {showPreferences ? "Hide Preferences" : "Add Preferences (Optional)"}
        </Button>

        <AnimatePresence>
          {showPreferences && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <textarea
                id="preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Any dietary restrictions, accessibility needs, or other preferences"
                className="w-full px-4 py-3 bg-background/50 border-0 rounded-lg shadow-sm ring-1 ring-border/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                rows={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="pt-4"
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        >
          {isLoading ? "Generating Plan..." : "Generate Date Plan"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
