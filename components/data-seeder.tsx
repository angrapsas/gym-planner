"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addTestData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      console.log("🔍 Adding test data to Supabase...");
      
      // Clear existing test data first to avoid duplicates
      await supabase.from("routines").delete().neq("id", 0);
      await supabase.from("phases").delete().neq("id", 0);
      await supabase.from("conditioning").delete().neq("id", 0);
      
      // Add test phases
      const { error: phasesError } = await supabase.from("phases").insert([
        {
          name: "Foundation Phase",
          start_date: "2025-07-01",
          end_date: "2025-07-10",
          phase_type: "strength",
          color: "bg-blue-500"
        },
        {
          name: "Progression Phase",
          start_date: "2025-07-11",
          end_date: "2025-07-20",
          phase_type: "skill",
          color: "bg-green-500"
        },
        {
          name: "Peak Phase",
          start_date: "2025-07-21",
          end_date: "2025-07-31",
          phase_type: "competition",
          color: "bg-purple-500"
        }
      ]);

      if (phasesError) {
        console.error("Error adding phases:", phasesError);
        setMessage(`Error adding phases: ${phasesError.message}`);
        return;
      }

      // Add test routines
      const { error: routinesError } = await supabase.from("routines").insert([
        {
          name: "Morning Strength",
          date: "2025-07-05",
          skills: ["Push-ups", "Pull-ups", "Squats"],
          created_at: new Date().toISOString()
        },
        {
          name: "Skill Practice",
          date: "2025-07-12",
          skills: ["Handstand", "Cartwheel", "Bridge"],
          created_at: new Date().toISOString()
        },
        {
          name: "Advanced Routine",
          date: "2025-07-18",
          skills: ["Back handspring", "Round-off", "Front tuck"],
          created_at: new Date().toISOString()
        },
        {
          name: "Competition Prep",
          date: "2025-07-25",
          skills: ["Full routine practice", "Mental preparation"],
          created_at: new Date().toISOString()
        }
      ]);

      if (routinesError) {
        console.error("Error adding routines:", routinesError);
        setMessage(`Error adding routines: ${routinesError.message}`);
        return;
      }

      // Add test conditioning
      const { error: conditioningError } = await supabase.from("conditioning").insert([
        {
          name: "Cardio Session",
          date: "2025-07-03",
          exercises: ["Running", "Jumping jacks", "Burpees"],
          days_of_week: ["Monday", "Wednesday", "Friday"],
          created_at: new Date().toISOString()
        },
        {
          name: "Strength Training",
          date: "2025-07-08",
          exercises: ["Weight training", "Core work"],
          days_of_week: ["Tuesday", "Thursday"],
          created_at: new Date().toISOString()
        },
        {
          name: "Endurance Work",
          date: "2025-07-15",
          exercises: ["Circuit training", "HIIT"],
          days_of_week: ["Monday", "Wednesday", "Friday"],
          created_at: new Date().toISOString()
        },
        {
          name: "Recovery Session",
          date: "2025-07-22",
          exercises: ["Stretching", "Yoga", "Foam rolling"],
          days_of_week: ["Sunday"],
          created_at: new Date().toISOString()
        }
      ]);

      if (conditioningError) {
        console.error("Error adding conditioning:", conditioningError);
        setMessage(`Error adding conditioning: ${conditioningError.message}`);
        return;
      }

      setMessage("✅ Test data added successfully! Refresh the page to see the calendar with events.");
      
    } catch (error) {
      console.error("Error adding test data:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Clear all tables
      const { error: routinesError } = await supabase.from("routines").delete().neq("id", 0);
      const { error: phasesError } = await supabase.from("phases").delete().neq("id", 0);
      const { error: conditioningError } = await supabase.from("conditioning").delete().neq("id", 0);

      if (routinesError || phasesError || conditioningError) {
        setMessage("Error clearing data. Check console for details.");
        return;
      }

      setMessage("🗑️ All data cleared successfully!");
      
    } catch (error) {
      console.error("Error clearing data:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-4">
      <CardHeader>
        <CardTitle>🌱 Data Seeder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button 
            onClick={addTestData} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Adding..." : "Add Test Data"}
          </Button>
          <Button 
            onClick={clearAllData} 
            disabled={loading}
            variant="destructive"
          >
            {loading ? "Clearing..." : "Clear All Data"}
          </Button>
        </div>
        
        {message && (
          <div className={`p-3 rounded border ${
            message.includes("✅") || message.includes("🗑️") 
              ? "bg-green-100 border-green-300 text-green-700" 
              : "bg-red-100 border-red-300 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Test data includes:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>3 phases (Foundation, Progression, Peak)</li>
            <li>4 routines with dates in January-March 2024</li>
            <li>4 conditioning workouts with dates</li>
            <li>All data properly linked with phases and dates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 