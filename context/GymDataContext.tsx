"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

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