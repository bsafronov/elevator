import { useEffect, useState } from "react";
import "./App.css";
import btnAudio from "./assets/btn_sound.mp3";
import elevatorClose from "./assets/ElevatorClose.wav";
import elevatorContinue from "./assets/ElevatorContinue.wav";
import elevatorOpen from "./assets/ElevatorOpen.wav";
import elevatorStart from "./assets/ElevatorStart.wav";
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
        isManaged: false,
      };

      floors.push(floor);
    }

    setElevators(elevators);
    setFloors(floors);
    document
      .querySelector(".elevators")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const waitingFloor = floors.find(
      floor => floor.isWaiting && !floor.isManaged
    );

    // const availableElevator = elevators.find(item => item.isAvailable);
    if (!waitingFloor) return;

    const availableElevator = searchFitElevator(waitingFloor.level);

    if (availableElevator && waitingFloor) {
      controller(availableElevator, waitingFloor);
    }
  }, [floors, elevators]);

  async function controller(obj: IElevator, waitingFloor: IFloor) {
    const sound = await moveElevator(obj, waitingFloor);
    sound.pause();
    await updateFloor(obj, waitingFloor);
    updateElevator(obj);
  }

  async function moveElevator(obj: IElevator, waitingFloor: IFloor) {
    new Audio(elevatorStart).play();
    const elCont = new Audio(elevatorContinue);
    elCont.loop = true;
    elCont.play();

    waitingFloor.isManaged = true;
    const updatedElevators = elevators.map(item => {
      if (item === obj) {
        item.isAvailable = false;
        item.targetY = waitingFloor.level;
      }

      return item;
    });
    setElevators(updatedElevators);

    const timeInRoad = Math.abs(obj.targetY - obj.y) * 1000;
    await new Promise(res => {
      setTimeout(() => {
        // new Audio(elevatorArrivedAudio).play();
        new Audio(elevatorOpen).play();
        res(true);
      }, timeInRoad);
    });

    return elCont;
  }

  async function updateFloor(obj: IElevator, waitingFloor: IFloor) {
    const updatedFloors = floors.map(item => {
      if (item === waitingFloor) {
        item.isWaiting = false;
        item.isManaged = false;
      }
      return item;
    });

    obj.isResting = true;
    setFloors(updatedFloors);
    await new Promise(res => {
      setTimeout(() => {
        res(true);
      }, 3000);
    });
  }

  async function updateElevator(obj: IElevator) {
    new Audio(elevatorClose).play();

    await new Promise(res => {
      setTimeout(() => {
        res(true);
      }, 1500);
    });
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
    setFloors(floors);
  }

  function callElevator(floor: IFloor) {
    if (floor.isWaiting) return;

    const elevatorsOnFloor = elevators.filter(
      item =>
        (item.y === floor.level && item.isAvailable) ||
        (item.targetY === floor.level && item.isResting)
    );

    if (elevatorsOnFloor.length > 0) return;

    const audio = new Audio(btnAudio);
    audio.play();

    const updatedFloors = floors.map(item => {
      if (item === floor) {
        item.isWaiting = true;
      }

      return item;
    });

    setFloors(updatedFloors);
  }

  function searchFitElevator(level: number) {
    const closestAvailableElevator = elevators
      .filter(item => item.isAvailable && !item.isResting)
      .sort((a, b) => Math.abs(level - a.y) - Math.abs(level - b.y))[0];

    if (closestAvailableElevator) return closestAvailableElevator;

    const avaiableElevator = elevators.find(
      item => item.isAvailable && !item.isResting
    );
    if (avaiableElevator) {
      return avaiableElevator;
    }
    return null;
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
        <div className="elevators">
          {elevators?.map((elevator, index) => (
            <Elevator key={index} elevator={elevator} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
