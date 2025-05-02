import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

interface Booking {
  id: string;
  dateTime: string;
  fileNumber: string;
  customerName: string;
  serviceType: string;
  phoneNumber: string;
  status: string;
  createdBy?: string;
  distance?: string;
  showroomAmount?:number
}

const Home: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "completed">("bookings");
  const [redeemableDistance, setRedeemableDistance] = useState<number | null>(null);

  const showroomId = localStorage.getItem("showroomId");
  const uid = import.meta.env.VITE_REACT_APP_UID;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        if (showroomId) {
          const bookingQuery = query(
            collection(db, `user/${uid}/bookings`),
            where("showroomId", "==", showroomId)
          );

          const bookingSnapshot = await getDocs(bookingQuery);
          const bookingsData: Booking[] = [];

          bookingSnapshot.forEach((doc) => {
            const booking = doc.data();
            bookingsData.push({
              id: doc.id,
              dateTime: booking.dateTime,
              fileNumber: booking.fileNumber,
              customerName: booking.customerName,
              serviceType: booking.serviceType,
              phoneNumber: booking.phoneNumber,
              status: booking.status,
              distance: booking.distance,
              createdBy: booking.createdBy,
              showroomAmount:booking.showroomAmount,
            });
          });

          setBookings(bookingsData);
        } else {
          console.error("showroomId is not available");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchShowroomData = async () => {
        try {
          const db = getFirestore();
          const docRef = doc(db, `user/${uid}/showroom`, showroomId!);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setRewardPoints(docSnap.data().rewardPoints || 0);
            setRedeemableDistance(docSnap.data().redeemableDistance || 0);
          } else {
            setRewardPoints(0);
            setRedeemableDistance(0);
          }
        } catch (error) {
          console.error("Error fetching showroom data:", error);
        }
      };
  
      fetchBookings();
      fetchShowroomData();
    }, [showroomId, uid]);
    const handleRedeemReward = async (booking: Booking) => {
        try {
          if (!showroomId || rewardPoints === null) {
            alert("Error: Showroom ID or reward points not available.");
            return;
          }
      
          const db = getFirestore();
          const bookingRef = doc(db, `user/${uid}/bookings`, booking.id);
          const showroomRef = doc(db, `user/${uid}/showroom`, showroomId);
          const claimedRewardsRef = collection(db, `user/${uid}/showroom/${showroomId}/claimedRewards`);
      
          // Get current showroom data
          const showroomSnap = await getDoc(showroomRef);
          if (!showroomSnap.exists()) {
            alert("Showroom data not found.");
            return;
          }
          const showroomData = showroomSnap.data();
          const totalRewardPoints = showroomData.rewardPointShowroom ?? 0; // Ensure a valid number
      
          // Calculate half of the showroom amount
          const halfShowroomAmount = (booking.showroomAmount ?? 0) / 2;
      
          if (halfShowroomAmount <= 0) {
            alert("No amount available to redeem.");
            return;
          }
      
          // Determine points to redeem
          const pointsToRedeem = Math.min(rewardPoints, halfShowroomAmount);
      
          // Update showroomAmount in the booking collection
          const updatedShowroomAmount = (booking.showroomAmount ?? 0) - pointsToRedeem;
      
          // Update Firestore: Deduct points from showroomAmount
          await updateDoc(bookingRef, { showroomAmount: updatedShowroomAmount });
      
          // Add the claimed reward record
          await addDoc(claimedRewardsRef, {
            bookingId: booking.id,
            redeemedPoints: pointsToRedeem,
            date: new Date().toISOString(),
          });
      
          // Fetch all claimedRewards to calculate total redeemed points
          const claimedRewardsSnapshot = await getDocs(claimedRewardsRef);
          let totalRedeemedPoints = 0;
      
          claimedRewardsSnapshot.forEach((doc) => {
            totalRedeemedPoints += doc.data().redeemedPoints ?? 0;
          });
      
          // Calculate updated reward points
          const updatedRewardPoints = totalRewardPoints - totalRedeemedPoints;
      
          // Update showroom document with total redeemed points and updated reward points
          await updateDoc(showroomRef, { 
            totalRedeemedPoints, 
            rewardPoints: updatedRewardPoints 
          });
      
          // Update state
          setRewardPoints(updatedRewardPoints);
          setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? { ...b, showroomAmount: updatedShowroomAmount } : b))
          );
      
          alert(`Successfully redeemed ${pointsToRedeem} points for ${booking.customerName}`);
        } catch (error) {
          console.error("Error redeeming reward:", error);
          alert("Failed to redeem reward. Please try again.");
        }
      };
      
  // Filtered bookings
  const activeBookings = bookings.filter((b) => b.status !== "Order Completed");
  const completedBookings = bookings.filter((b) => b.status === "Order Completed");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     
{/* Container for Buttons & Reward Points */}
<div className="flex justify-between items-center mb-6 gap-4">
  {/* Tab Buttons */}
  <div className="flex gap-4">
    <button
      className={`px-6 py-2 rounded-lg text-lg font-semibold transition-all ${
        activeTab === "bookings" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
      }`}
      onClick={() => setActiveTab("bookings")}
    >
    <span className="m-10">Bookings</span>  
    </button>
    <button
      className={`px-6 py-2 rounded-lg text-lg font-semibold transition-all ${
        activeTab === "completed" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
      }`}
      onClick={() => setActiveTab("completed")}
    >
      Completed Bookings
    </button>
  </div>

  {/* Reward Points Card */}
  <div className="relative w-64 bg-gradient-to-r from-[#FFD700] to-[#FFB800] text-white rounded-xl p-5 shadow-xl ml-auto transform transition-all hover:scale-105 hover:shadow-2xl">
    <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md rounded-xl"></div>
    <div className="relative z-10 flex flex-col items-center">
      
      {/* Premium Badge */}
      <div className="absolute -top-3 right-3 bg-white text-yellow-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        PREMIUM
      </div>

      {/* Reward Points Title */}
      <h3 className="text-lg font-semibold tracking-wide uppercase text-center">Reward Points</h3>

      {/* Points Display */}
      <p className="text-4xl font-extrabold mt-2 drop-shadow-lg">
        {rewardPoints !== null ? rewardPoints : "Loading..."}
      </p>
    </div>
  </div>



      </div>
      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center uppercase tracking-wide border-b-4 border-blue-500 pb-2">
          {activeTab === "bookings" ? "Active Bookings" : "Completed Bookings"}
        </h2>


        <div className="overflow-x-auto">
  <table className="w-full border-collapse border border-gray-200">
    <thead>
      <tr className="bg-gray-800 text-gray">
        <th className="p-3 text-left">Date & Time</th>
        <th className="p-3 text-left">File Number</th>
        <th className="p-3 text-left">Customer Name</th>
        <th className="p-3 text-left">Phone/Mobile</th>
                {activeTab === "completed" && <th className="p-3 text-left">Distance (km)</th>}
                {activeTab === "completed" && <th className="p-3 text-left">Amount</th>}
                <th className="p-3 text-right">
                  {activeTab === "bookings" ? "Status" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "bookings" ? activeBookings : completedBookings).map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-100 transition-all">
                  <td className="p-3">{booking.dateTime}</td>
                  <td className="p-3">
                    <Link to={`/showrm/viewmore/${booking.id}`} className="text-blue-600 underline">
                      {booking.fileNumber}
                    </Link>
                  </td>
                  <td className="p-3">{booking.customerName}</td>
                  <td className="p-3">{booking.phoneNumber}</td>
                  {activeTab === "completed" && (
                    <td className="p-3">{booking.distance ?? "N/A"}</td>
                  )}
                   {activeTab === "completed" && (
                    <td className="p-3">{booking.showroomAmount ?? "N/A"}</td>
                  )}
                  <td className="p-3 text-right">
                    {activeTab === "bookings" ? (
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          booking.status === "Order Completed"
                            ? "bg-green-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {booking.status}
                      </span>
                    ) : (
                      redeemableDistance !== null &&
                      booking.distance !== undefined &&
                      Number(booking.distance) > redeemableDistance && (
                        <div className="relative inline-block">
                        <button
                          className="relative flex items-center gap-2 px-5 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out"
                          onClick={() => handleRedeemReward(booking)}
                          >
                          🎁 Redeem Reward
                        </button>
                      
                        {/* Premium Sticker Badge */}
                        <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full shadow-md">
                          ⭐ VIP
                        </span>
                      </div>
                      
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
  </table>
</div>

      </div>
    </div>
  );
};

export default Home;
