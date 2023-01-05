import { FC } from "react";
import { IElevator } from "../models/IElevator";
import { IFloor } from "../models/IFloor";
import Cell from "./Cell";
import Button from "./UI/Button";

interface FloorProps {
  elevators: IElevator[] | null;
  floor: IFloor;
  callElevator: (floor: IFloor) => void;
}

const Floor: FC<FloorProps> = ({ elevators, floor, callElevator }) => {
  return (
    <div className="floor">
      {elevators?.map((cell, index) => (
        <Cell key={index} />
      ))}
      <div className="call__box">
        <h3 className="call__floor">{floor.level}</h3>
        <Button floor={floor} callElevator={callElevator} />
      </div>
    </div>
  );
};

export default Floor;
