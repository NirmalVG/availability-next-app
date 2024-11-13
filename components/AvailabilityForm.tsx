"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  slots: TimeSlot[];
}

const daysOfWeek = [
  { label: "S", full: "Sunday", id: "SUN" },
  { label: "M", full: "Monday", id: "MON" },
  { label: "T", full: "Tuesday", id: "TUE" },
  { label: "W", full: "Wednesday", id: "WED" },
  { label: "T", full: "Thursday", id: "THU" },
  { label: "F", full: "Friday", id: "FRI" },
  { label: "S", full: "Saturday", id: "SAT" },
];

interface AvailabilityFormProps {
  slug: string;
  data: {
    availability: DayAvailability[];
    selectedDays: string[];
  };
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ slug, data }) => {
  const router = useRouter();
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.availability && data.availability.length > 0) {
      setAvailability(data.availability);
      setSelectedDays(new Set(data.selectedDays));
    } else {
      // If no data, initialize with empty slots for each day
      setAvailability(
        daysOfWeek.map((day) => ({
          day: day.full,
          slots: [{ start: "", end: "" }],
        }))
      );
    }
  }, [data]);

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots[slotIndex][field] = value;
    setAvailability(newAvailability);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.push({ start: "", end: "" });
    setAvailability(newAvailability);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(newAvailability);
  };

  const toggleDaySelection = (dayId: string) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(dayId)) {
      newSelectedDays.delete(dayId);
    } else {
      newSelectedDays.add(dayId);
    }
    setSelectedDays(newSelectedDays);
  };

  const validateAndSave = async () => {
    try {
      for (const day of availability) {
        for (const slot of day.slots) {
          if (!slot.start || !slot.end) continue;
          if (slot.start >= slot.end) {
            setError("Start time must be earlier than end time.");
            return;
          }
        }
      }

      setError(null);

      const response = await fetch(`/api/saveAvailability/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability,
          selectedDays: Array.from(selectedDays),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error saving data.");

      alert("Availability saved successfully!");
      setSelectedDays(new Set(selectedDays));
      router.push(`/user/availability/${slug}`);
    } catch (error) {
      console.error("Error saving availability:", error);
      setError("Failed to save availability. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-around mb-4">
        {daysOfWeek.map((day) => (
          <button
            key={day.id}
            onClick={() => toggleDaySelection(day.id)}
            className={`text-center py-2 px-4 rounded-full ${
              selectedDays.has(day.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-300 focus:outline-none`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {availability.map((day, dayIndex) => (
        <div key={day.day} className="flex items-center mb-2">
          <div className="w-1/4 font-semibold">{day.day}</div>
          <div className="w-3/4">
            {day.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="flex items-center mb-1">
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) =>
                    handleTimeChange(
                      dayIndex,
                      slotIndex,
                      "start",
                      e.target.value
                    )
                  }
                  className="border rounded px-2 py-1 mr-2 w-24"
                />
                <span className="mx-2">to</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) =>
                    handleTimeChange(dayIndex, slotIndex, "end", e.target.value)
                  }
                  className="border rounded px-2 py-1 mr-2 w-24"
                />
                {slotIndex === day.slots.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ➕
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ➖
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && <div className="text-red-500 mt-4">{error}</div>}
      <button
        onClick={validateAndSave}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save Availability
      </button>
    </div>
  );
};

export default AvailabilityForm;
