import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const CompletedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const showroomId = localStorage.getItem('showroomId');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        // Ensure showroomId is available
        if (showroomId) {
          // Query to fetch bookings with the required conditions
          const q = query(
            collection(db, 'bookings'),
            where('vehicleSection', '==', 'Service Center'),
            where('showroomId', '==', showroomId),
            where('status', '==', 'Order Completed') // Add this where clause

          );
          const querySnapshot = await getDocs(q);
          const bookingsData = [];
          querySnapshot.forEach((doc) => {
            const booking = doc.data();
            bookingsData.push({
              id: doc.id,
              dateTime: booking.dateTime,
              fileNumber: booking.fileNumber,
              customerName: booking.customerName,
              serviceType: booking.serviceType,
              phoneNumber: booking.phoneNumber,
            });
          });
          setBookings(bookingsData);
        } else {
          console.error('showroomId is not available');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [showroomId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', color: '#333', textTransform: 'uppercase' }}>Bookings</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <thead style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Date & Time</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>File Number</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Customer Name</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Service Type</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Phone/Mobile</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{booking.dateTime}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{booking.fileNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{booking.customerName}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{booking.serviceType}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{booking.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedBookings;
