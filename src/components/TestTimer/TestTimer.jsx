import { useState, useEffect } from "react";
import iconClock from "../../assets/icon-clock.svg"; 

export const TestTimer = ({ initialTime, timeSpentRef, isCompleted }) => {
  const [timeSpent, setTimeSpent] = useState(initialTime);

  useEffect(() => {
    if (isCompleted) return;

    const timerInterval = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        timeSpentRef.current = newTime;
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeSpentRef, isCompleted]);

  useEffect(() => {
    setTimeSpent(initialTime);
  }, [initialTime]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} хв`;
  };

  return (
    <div className="test-header-progress-timer test-header-timer-container">
      <img src={iconClock} alt="Timer" /> {formatTime(timeSpent)}
    </div>
  );
};