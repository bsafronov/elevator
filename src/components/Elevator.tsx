import { CSSProperties, FC } from "react";
import { IElevator } from "../models/IElevator";

interface ElevatorProps {
  elevator: IElevator;
}

const Elevator: FC<ElevatorProps> = ({ elevator }) => {
  const elPos = elevator.isAvailable
    ? (elevator.y - 1) * 100
    : (elevator.targetY - 1) * 100;
  const timeInRoad = elevator.isAvailable
    ? 0
    : Math.abs(elevator.targetY - elevator.y);

  const style: CSSProperties = {
    transform: `translateY(-${elPos}%)`,
    transition: `transform ${timeInRoad}s linear `,
  };

  return (
    <div
      className={elevator.isResting ? "elevator opacity" : "elevator"}
      style={style}
    >
      {!elevator.isAvailable && (
        <div className="elevator__info">
          <span>
            {elevator.y !== elevator.targetY && elevator.y < elevator.targetY
              ? "🡅"
              : "🡇"}
          </span>
          <span>{elevator.targetY}</span>
        </div>
      )}
    </div>
  );
};

export default Elevator;
