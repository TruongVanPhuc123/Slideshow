import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";
import React from "react";

export default function SlideSpeed({ speed, setSpeed, timeUnit, setTimeUnit }) {
  return (
    <div className="flex-1 px-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-primary">Durations:</Label>
        <Button
          variant="default"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() =>
            setTimeUnit(timeUnit === "seconds" ? "minutes" : "seconds")
          }
        >
          <Clock className="h-3 w-3" />
          {timeUnit === "seconds" ? "Change Minutes" : "Change Seconds"}
        </Button>
      </div>

      <div className="space-y-4">
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={1}
          max={timeUnit === "seconds" ? 60 : 30}
          step={1}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>1 {timeUnit === "seconds" ? "giây" : "phút"}</span>
          <span className="px-2 py-1 bg-primary/10 rounded text-primary font-medium">
            {speed} {timeUnit === "seconds" ? "giây" : "phút"}
          </span>
          <span>{timeUnit === "seconds" ? "60 giây" : "30 phút"}</span>
        </div>
      </div>
    </div>
  );
}
