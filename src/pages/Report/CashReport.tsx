import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

const CashReport = () => {
  const showroomId = localStorage.getItem('showroomId');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const statusConditions = ['booking added', 'Contacted Customer', 'Vehicle Picked', 'Vehicle Confirmed', 'To DropOff Location', 'Vehicle dropoff'];
        
        const q = query(
          collection(db, 'bookings'),
          where('showroomId', '==', showroomId),
          where('status', 'in', statusConditions)
        );
        
        const querySnapshot = await getDocs(q);
        const bookingsData = [];
        
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          bookingsData.push({
            id: doc.id,
            dateTime: booking.dateTime,
            vehicleSection: booking.vehicleSection,
            vehicleModel: booking.vehicleModel,
            insuranceAmount: booking.insuranceAmount,
            paidToRSA: booking.paidToRSA || false,
          });
        });

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (showroomId) {
      fetchBookings();
    } else {
      console.error('showroomId is not available');
    }
  }, [showroomId]);

  const handlePayment = async (bookingId) => {
    try {
      const db = getFirestore();
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        paidToRSA: true,
      });

      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, paidToRSA: true };
        }
        return booking;
      });

      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error marking booking as paid:', error);
    }
  };

  return (
    <div className="p-8 overflow-x-auto">
      <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">Cash Report</h2>
      <table className="w-full border-collapse shadow-md table-fixed">
        <thead className="bg-gray-200 border-b-2 border-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-bold min-w-1/4">Date and Time</th>
            <th className="px-4 py-2 text-left font-bold min-w-1/4">Vehicle Section</th>
            <th className="px-4 py-2 text-left font-bold min-w-1/4">Vehicle Model</th>
            <th className="px-4 py-2 text-left font-bold min-w-1/4">Insurance Amount</th>
            <th className="px-4 py-2 text-left font-bold min-w-1/4">Paid/Unpaid</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className={`${booking.paidToRSA ? 'bg-gray-100 opacity-60' : ''}`}>
              <td className="px-4 py-2 border border-gray-300">{booking.dateTime}</td>
              <td className="px-4 py-2 border border-gray-300">{booking.vehicleSection}</td>
              <td className="px-4 py-2 border border-gray-300">{booking.vehicleModel}</td>
              <td className="px-4 py-2 border border-gray-300">{booking.insuranceAmount}</td>
              <td className="px-4 py-2 border border-gray-300">
                {booking.paidToRSA ? (
                  <button className="px-4 py-2 bg-green-500 text-white rounded cursor-not-allowed">Paid</button>
                ) : (
                  <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400" onClick={() => handlePayment(booking.id)}>OK</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashReport;
