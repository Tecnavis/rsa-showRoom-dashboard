import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { IoPersonOutline } from 'react-icons/io5';

// Define the Booking type
interface Booking {
  id: string;
  dateTime: string;
  fileNumber: string;
  customerName: string;
  serviceType: string;
  phoneNumber: string;
  status?: string; // Optional if not included in the fetched data
  createdBy?: string; 
}

const CompletedBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const showroomId = localStorage.getItem('showroomId');
  const uid = import.meta.env.VITE_REACT_APP_UID;
  const db = getFirestore();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Ensure showroomId is available
        if (showroomId) {
          // Query to fetch bookings with the required conditions
          const q = query(
            collection(db, `user/${uid}/bookings`),
            where('vehicleSection', '==', 'Service Center'),
            where('showroomId', '==', showroomId),
            where('status', '==', 'Order Completed') // Add this where clause
          );
          const querySnapshot = await getDocs(q);
          const bookingsData: Booking[] = [];
          querySnapshot.forEach((doc) => {
            const booking = doc.data();
            bookingsData.push({
              id: doc.id,
              dateTime: booking.dateTime,
              fileNumber: booking.fileNumber,
              customerName: booking.customerName,
              serviceType: booking.serviceType,
              phoneNumber: booking.phoneNumber,
              status: booking.status, // Ensure 'status' is included if needed
              createdBy:booking.createdBy
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
  }, [showroomId, uid]);

  return (
    <div style={{ padding: '30px', overflowX: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', color: '#333', textTransform: 'uppercase' }}>
        Completed Bookings
      </h2>
  
      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', tableLayout: 'fixed' }}>
        <thead style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Date & Time</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>File Number</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Customer Name</th>
            {/* <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Service Type</th> */}
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Phone/Mobile</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Status</th> {/* Add status column */}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.dateTime}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.fileNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.customerName}</td>
              {/* <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.serviceType}</td> */}
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.phoneNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word', background: 'orange' }}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-around'}}>
              <p> {booking.status}</p>  {booking.createdBy === 'showroomStaff' && (
        <IoPersonOutline /> 
        )}
                </div>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedBookings;
