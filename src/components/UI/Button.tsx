import { FC } from "react";
import { IFloor } from "../../models/IFloor";

interface ButtonProps {
  floor: IFloor;
  callElevator: (floor: IFloor) => void;
}

const Button: FC<ButtonProps> = ({ floor, callElevator }) => {
  return (
    <div
      className={floor.isWaiting ? "button active" : "button"}
      onClick={() => callElevator(floor)}
    >
      <div className="button__inner">
        <div className="button__dot"></div>
      </div>
    </div>
  );
};

export default Button;
