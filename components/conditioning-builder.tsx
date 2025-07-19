"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ConditioningBuilder() {
  const [conditioning, setConditioning] = useState<{ id: string; name: string; date?: string }[]>([]);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchConditioning() {
      setLoading(true);
      const { data, error } = await supabase.from("conditioning").select("*");
      if (error) {
        console.error(error);
      } else {
        setConditioning((data as { id: string; name: string }[]) || []);
      }
      setLoading(false);
    }
    fetchConditioning();
  }, []);

  async function addConditioning() {
    if (!newName.trim()) return;
    setLoading(true);
    
    const conditioningData: any = { 
      name: newName,
      created_at: new Date().toISOString()
    };
    
    if (newDate) {
      conditioningData.date = newDate;
    }
    
    const { data, error } = await supabase.from("conditioning").insert([conditioningData]).select();
    if (error) {
      console.error(error);
    } else if (data) {
      setConditioning((prev) => [...prev, ...data]);
      setNewName("");
      setNewDate("");
    }
    setLoading(false);
  }

  async function removeConditioning(id: string) {
    setLoading(true);
    const { error } = await supabase.from("conditioning").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setConditioning((prev) => prev.filter((c) => c.id !== id));
    }
    setLoading(false);
  }

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conditioning Builder</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Conditioning Workout</CardTitle>
          <CardDescription>Create and manage your conditioning workouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Workout name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addConditioning()}
                disabled={loading}
              />
              <Button onClick={addConditioning} variant="default" disabled={loading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="date" className="text-sm">Schedule for date (optional)</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {conditioning.map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeConditioning(c.id)} disabled={loading}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 