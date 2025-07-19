import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Skill = { id: string; name: string };

export function SkillsList() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase.from("skills").select("*");
      if (error) {
        console.error(error);
      } else {
        setSkills((data as Skill[]) || []);
      }
    }
    fetchSkills();
  }, []);

  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill.id}>{skill.name}</li>
      ))}
    </ul>
  );
} 