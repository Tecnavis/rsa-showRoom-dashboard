import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import Confetti from "react-confetti";
import { GiftIcon } from "@heroicons/react/24/solid";

const Reward = () => {
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [isCelebrating, setIsCelebrating] = useState(false);
        const db = getFirestore();
        const uid = import.meta.env.VITE_REACT_APP_UID;
        const showroomId = localStorage.getItem('showroomId') || '';

  useEffect(() => {
    if (!uid) return;

    const fetchRewardPoints = async () => {
      try {
        const showroomRef = doc(db, `user/${uid}/showroom`,showroomId);
        const showroomSnap = await getDoc(showroomRef);
        
        if (showroomSnap.exists()) {
          const data = showroomSnap.data();
          setRewardPoints(data.rewardPoints || 0);
        }
      } catch (error) {
        console.error("Error fetching reward points:", error);
      }
    };

    fetchRewardPoints();
  }, [uid]);

  useEffect(() => {
    if (rewardPoints > 0) {
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 3000);
    }
  }, [rewardPoints]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-blue-500">
      {isCelebrating && <Confetti />}
      
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center w-96 transform transition-all hover:scale-105">
        <GiftIcon className="text-yellow-500 text-6xl mx-auto mb-4 animate-bounce" />
        
        <h2 className="text-2xl font-bold text-gray-800">Your Rewards</h2>
        <p className="text-gray-600 mt-2">You have earned:</p>

        <div className="text-4xl font-extrabold text-purple-600 mt-2">
          {rewardPoints} Points
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(rewardPoints % 1000) / 10}%` }}
          />
        </div>

        <button className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition">
          Redeem Rewards
        </button>
      </div>
    </div>
  );
};

export default Reward;
