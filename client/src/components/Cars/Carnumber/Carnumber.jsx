import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import style from "./carnumber.module.css";

function Carnumber() {
    const [number, setNumber] = useState("");
    
    const handleContinue = async () => {
        try {
            const id = localStorage.getItem("ackoid");
            if (!id) {
                console.error("No car ID found in localStorage");
                return;
            }
            
            const data = { number: number };
            await axios.patch(`https://acko.herokuapp.com/cars/${id}`, data);
            console.log("Car number updated successfully");
        } catch (error) {
            console.error("Error updating car number:", error);
        }
    };

    return (
      <div className={style.carnumberContainer}>
        <h2 className={style.title}>Enter your car number</h2>
        <p className={style.subtitle}>This makes your purchase twice as fast</p>
        
        <input
          onChange={(e) => setNumber(e.target.value)}
          className={style.pininput}
          placeholder="TN74AQ5553"
          value={number}
        />
        
        <div className={style.buttonContainer}>
          <Link to="/cars/year">
            <button
              onClick={handleContinue}
              className={style.pinbtn}
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    );
}

export default Carnumber;
