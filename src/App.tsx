import { useEffect, useState } from "react";
import "./App.css";
import Elevator from "./components/Elevator";
import Floor from "./components/Floor";
import DB from "./configuration.json";
import { IElevator } from "./models/IElevator";
import { IFloor } from "./models/IFloor";

const App = () => {
  const [elevators, setElevators] = useState<IElevator[]>([]);
  const [floors, setFloors] = useState<IFloor[]>([]);

  useEffect(() => {
    const elevators: IElevator[] = [];
    const floors: IFloor[] = [];

    for (let i = 1; i <= DB.elevators; i++) {
      const elevator: IElevator = {
        y: 1,
        isAvailable: true,
        targetY: 0,
        isResting: false,
      };

      elevators.push(elevator);
    }

    for (let i = DB.floors; i >= 1; i--) {
      const floor: IFloor = {
        level: i,
        isWaiting: false,
        managedBy: null,
      };

      floors.push(floor);
    }

    setElevators(elevators);
    setFloors(floors);
  }, []);

  useEffect(() => {
    const waitingFloor = floors.find(floor => floor.isWaiting);
    const availableElevator = elevators.find(
      item => item.isAvailable && item === waitingFloor?.managedBy
    );

    if (availableElevator && waitingFloor) {
      moveElevator(availableElevator, waitingFloor);
    }
  }, [floors, elevators]);

  function callElevator(floor: IFloor) {
    if (floor.isWaiting) return;

    const elevatorsOnFloor = elevators.filter(item => item.y === floor.level);

    if (elevatorsOnFloor.length > 0) return;

    // Логика поиска подходящего лифта
    const fitElevator = elevators[0];
    //

    const updatedFloors = floors.map(item => {
      if (item === floor) {
        item.isWaiting = true;
        item.managedBy = fitElevator;
      }

      return item;
    });

    setFloors(updatedFloors);
  }

  function moveElevator(obj: IElevator, waitingFloor: IFloor) {
    const updatedElevators = elevators.map(item => {
      if (item === obj) {
        item.isAvailable = false;
        item.targetY = waitingFloor.level;
      }

      return item;
    });
    setElevators(updatedElevators);

    const timeInRoad = Math.abs(obj.targetY - obj.y) * 1000;

    setTimeout(() => {
      updateFloor(obj, waitingFloor);
    }, timeInRoad);
  }

  function updateFloor(obj: IElevator, waitingFloor: IFloor) {
    const updatedFloors = floors.map(item => {
      if (item === waitingFloor) {
        item.isWaiting = false;
        item.managedBy = null;
      }
      return item;
    });

    obj.isResting = true;

    setTimeout(() => {
      updateElevator(obj);
    }, 3000);

    setFloors(updatedFloors);
  }

  function updateElevator(obj: IElevator) {
    const updatedElevators = elevators.map(item => {
      if (item === obj) {
        item.isAvailable = true;
        item.isResting = false;
        item.y = item.targetY;
        item.targetY = 0;
      }

      return item;
    });

    setElevators(updatedElevators);
  }

  return (
    <div className="app">
      <div className="floors">
        {floors?.map((floor, index) => (
          <Floor
            key={index}
            floor={floor}
            elevators={elevators}
            callElevator={callElevator}
          />
        ))}
      </div>
      <div className="elevators">
        {elevators?.map((elevator, index) => (
          <Elevator key={index} elevator={elevator} />
        ))}
      </div>
    </div>
  );
};

export default App;
