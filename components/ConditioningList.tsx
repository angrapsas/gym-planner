import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Conditioning = { id: string; name: string };

export function ConditioningList() {
  const [conditioning, setConditioning] = useState<Conditioning[]>([]);

  useEffect(() => {
    async function fetchConditioning() {
      const { data, error } = await supabase.from("conditioning").select("*");
      if (error) {
        console.error(error);
      } else {
        setConditioning((data as Conditioning[]) || []);
      }
    }
    fetchConditioning();
  }, []);

  return (
    <ul>
      {conditioning.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
} 