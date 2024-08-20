
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const BodyShopes = () => {
    const showroomId = localStorage.getItem('showroomId');
    const uid = import.meta.env.VITE_REACT_APP_UID
  const [bookings, setBookings] = useState([]);
  const userName = localStorage.getItem('userName'); // Get driverId from localStorage
  const password = localStorage.getItem('password');
  console.log("first",userName)
  console.log("first",password)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const db = getFirestore();
                const q = query(collection(db, `user/${uid}/bookings`), where('vehicleSection', '==', 'Body Shopes'),
                where('showroomId', '==', showroomId)
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
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        
    
        fetchBookings();
    }, []);
    

    return (
        <div style={{ padding: "30px", overflowX: "auto" }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', color: '#333', textTransform: 'uppercase' }}>Bookings</h2>
      
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', tableLayout: 'fixed' }}>
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
                <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.dateTime}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.fileNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.customerName}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.serviceType}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};



export default BodyShopes;