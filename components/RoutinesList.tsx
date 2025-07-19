import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Routine = { id: string; name: string };

export function RoutinesList() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    async function fetchRoutines() {
      const { data, error } = await supabase.from("routines").select("*");
      if (error) {
        console.error(error);
      } else {
        setRoutines((data as Routine[]) || []);
      }
    }
    fetchRoutines();
  }, []);

  return (
    <ul>
      {routines.map((routine) => (
        <li key={routine.id}>{routine.name}</li>
      ))}
    </ul>
  );
} 