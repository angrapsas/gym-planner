"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

// Types for routines, phases, and conditioning
export interface Routine {
  id: string;
  name: string;
  isTarget?: boolean;
  skills?: Array<{ id: string; name: string; readiness: string }>;
}

export interface Phase {
  id: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  color?: string;
}

export interface Conditioning {
  id: string;
  name: string;
  days: string[];
}

interface GymDataContextType {
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  phases: Phase[];
  setPhases: React.Dispatch<React.SetStateAction<Phase[]>>;
  conditioning: Conditioning[];
  setConditioning: React.Dispatch<React.SetStateAction<Conditioning[]>>;
}

const GymDataContext = createContext<GymDataContextType | undefined>(undefined);

export const GymDataProvider = ({ children }: { children: ReactNode }) => {
  // Initial values can be empty or seeded as needed
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [conditioning, setConditioning] = useState<Conditioning[]>([]);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Load routines
        const { data: routinesData, error: routinesError } = await supabase
          .from("routines")
          .select("*");
        
        if (routinesError) {
          console.error("Error loading routines:", routinesError);
        } else {
          setRoutines(routinesData || []);
        }

        // Load phases
        const { data: phasesData, error: phasesError } = await supabase
          .from("phases")
          .select("*");
        
        if (phasesError) {
          console.error("Error loading phases:", phasesError);
        } else {
          // Convert Supabase data to the expected format
          const formattedPhases = (phasesData || []).map(phase => ({
            id: phase.id,
            name: phase.name,
            type: phase.phase_type,
            startDate: new Date(phase.start_date),
            endDate: new Date(phase.end_date),
            color: phase.color,
          }));
          setPhases(formattedPhases);
        }

        // Load conditioning
        const { data: conditioningData, error: conditioningError } = await supabase
          .from("conditioning")
          .select("*");
        
        if (conditioningError) {
          console.error("Error loading conditioning:", conditioningError);
        } else {
          setConditioning(conditioningData || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  return (
    <GymDataContext.Provider value={{ routines, setRoutines, phases, setPhases, conditioning, setConditioning }}>
      {children}
    </GymDataContext.Provider>
  );
};

export function useGymData() {
  const ctx = useContext(GymDataContext);
  if (!ctx) throw new Error("useGymData must be used within a GymDataProvider");
  return ctx;
} 