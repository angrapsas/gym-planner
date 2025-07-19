"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DebugPanel() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [conditioning, setConditioning] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔍 Debug: Testing Supabase connection...");
      
      // Test routines
      const { data: routinesData, error: routinesError } = await supabase
        .from("routines")
        .select("*");
      
      if (routinesError) {
        console.error("❌ Routines error:", routinesError);
        setError(`Routines error: ${routinesError.message}`);
      } else {
        console.log("✅ Routines data:", routinesData);
        setRoutines(routinesData || []);
      }

      // Test phases
      const { data: phasesData, error: phasesError } = await supabase
        .from("phases")
        .select("*");
      
      if (phasesError) {
        console.error("❌ Phases error:", phasesError);
        setError(prev => prev ? `${prev}; Phases error: ${phasesError.message}` : `Phases error: ${phasesError.message}`);
      } else {
        console.log("✅ Phases data:", phasesData);
        setPhases(phasesData || []);
      }

      // Test conditioning
      const { data: conditioningData, error: conditioningError } = await supabase
        .from("conditioning")
        .select("*");
      
      if (conditioningError) {
        console.error("❌ Conditioning error:", conditioningError);
        setError(prev => prev ? `${prev}; Conditioning error: ${conditioningError.message}` : `Conditioning error: ${conditioningError.message}`);
      } else {
        console.log("✅ Conditioning data:", conditioningData);
        setConditioning(conditioningData || []);
      }

    } catch (err) {
      console.error("❌ General error:", err);
      setError(`General error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔧 Debug Panel
          <Button onClick={fetchData} disabled={loading} size="sm">
            {loading ? "Loading..." : "Refresh Data"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 border rounded">
            <h4 className="font-semibold">Routines</h4>
            <p className="text-sm text-gray-600">Count: {routines.length}</p>
            {routines.length > 0 && (
              <div className="mt-2 text-xs">
                <strong>Sample:</strong>
                <pre className="mt-1 bg-white p-2 rounded border">
                  {JSON.stringify(routines[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-green-50 border rounded">
            <h4 className="font-semibold">Phases</h4>
            <p className="text-sm text-gray-600">Count: {phases.length}</p>
            {phases.length > 0 && (
              <div className="mt-2 text-xs">
                <strong>Sample:</strong>
                <pre className="mt-1 bg-white p-2 rounded border">
                  {JSON.stringify(phases[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-purple-50 border rounded">
            <h4 className="font-semibold">Conditioning</h4>
            <p className="text-sm text-gray-600">Count: {conditioning.length}</p>
            {conditioning.length > 0 && (
              <div className="mt-2 text-xs">
                <strong>Sample:</strong>
                <pre className="mt-1 bg-white p-2 rounded border">
                  {JSON.stringify(conditioning[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-yellow-50 border rounded">
          <h4 className="font-semibold">Events with Dates</h4>
          <div className="text-sm">
            <p>Routines with dates: {routines.filter(r => r.date).length}</p>
            <p>Conditioning with dates: {conditioning.filter(c => c.date).length}</p>
            <p>Total events: {routines.filter(r => r.date).length + conditioning.filter(c => c.date).length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 