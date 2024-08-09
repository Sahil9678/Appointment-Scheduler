import React, { useState, useEffect, useRef } from "react";
import "./AppointmentScheduler.css";

function AppointmentScheduler() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const slotsContainerRef = useRef(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  useEffect(() => {
    fetch("/slots.json")
      .then((response) => response.json())
      .then((data) => setSlots(data.dates))
      .catch((error) => console.error("Error fetching slots:", error));
  }, []);

  const dates = Array.from(new Set(slots.map((slot) => slot.displayDate)));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const updateButtonStates = () => {
    if (slotsContainerRef.current) {
      const container = slotsContainerRef.current;
      setIsPrevDisabled(container.scrollLeft === 0);
      setIsNextDisabled(
        container.scrollLeft >= container.scrollWidth - container.clientWidth
      );
    }
  };

  const handlePrevClick = () => {
    if (slotsContainerRef.current) {
      const container = slotsContainerRef.current;
      const slotButton = container.querySelector(".date-button");

      if (slotButton) {
        const slotWidth = slotButton.offsetWidth + 10;
        const newScrollLeft = Math.max(container.scrollLeft - slotWidth, 0);

        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });

        setTimeout(updateButtonStates, 300);
      }
    }
  };

  const handleNextClick = () => {
    if (slotsContainerRef.current) {
      const container = slotsContainerRef.current;
      const slotButton = container.querySelector(".date-button");

      if (slotButton) {
        const slotWidth = slotButton.offsetWidth + 10;
        const newScrollLeft = Math.min(
          container.scrollLeft + slotWidth,
          container.scrollWidth - container.clientWidth
        );

        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });

        setTimeout(updateButtonStates, 300);
      }
    }
  };

  useEffect(() => {
    updateButtonStates();
  }, [slots]);

  return (
    <div className="appointment-scheduler">
      <h2>Pick a date</h2>
      <div className="date-picker">
        <button
          className="carousel-btn prev"
          onClick={handlePrevClick}
          disabled={isPrevDisabled}
        >
          &lt;
        </button>
        <div className="date-picker-slots" ref={slotsContainerRef}>
          {dates.map((date) => (
            <button
              key={date}
              className={`date-button ${
                selectedDate === date ? "selected" : ""
              }`}
              onClick={() => handleDateClick(date)}
            >
              {new Date(date).getDate().toString().padStart(2, "0")} <br />
              {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
            </button>
          ))}
        </div>
        <button
          className="carousel-btn next"
          onClick={handleNextClick}
          disabled={isNextDisabled}
        >
          &gt;
        </button>
      </div>

      {selectedDate && (
        <>
          <h3>Available time slots</h3>
          <div className="time-slots">
            {slots
              .filter((slot) => slot.displayDate === selectedDate)
              .map((slot) => (
                <button
                  key={slot.startTimeUtc}
                  className={`time-slot ${
                    selectedTime === slot.displayTime ? "selected" : ""
                  }`}
                  onClick={() => handleTimeClick(slot.displayTime)}
                >
                  {slot.displayTime}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AppointmentScheduler;
