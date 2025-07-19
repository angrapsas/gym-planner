import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Phase = { id: string; name: string };

export function PhasesList() {
  const [phases, setPhases] = useState<Phase[]>([]);

  useEffect(() => {
    async function fetchPhases() {
      const { data, error } = await supabase.from("phases").select("*");
      if (error) {
        console.error(error);
      } else {
        setPhases((data as Phase[]) || []);
      }
    }
    fetchPhases();
  }, []);

  return (
    <ul>
      {phases.map((phase) => (
        <li key={phase.id}>{phase.name}</li>
      ))}
    </ul>
  );
} 