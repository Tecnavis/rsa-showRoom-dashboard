import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { IoPersonOutline } from "react-icons/io5";

// Define the Booking and Staff types
interface Booking {
  id: string;
  dateTime: string;
  fileNumber: string;
  customerName: string;
  serviceType: string;
  phoneNumber: string;
  status: string;
  createdBy?: string; 
}

interface Staff {
  id: string;
  name: string;
  position: string;
  phoneNumber: string;
}

const ServiceCenter: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]); // State to hold staff data
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const showroomId = localStorage.getItem('showroomId');
  const uid = import.meta.env.VITE_REACT_APP_UID;
  console.log(bookings,'this is the staff')

  // Fetch bookings and staff data from Firestore
  useEffect(() => {
    const fetchBookingsAndStaff = async () => {
      try {
        const db = getFirestore();
        if (showroomId) {
          // Fetch the showroom document
          const showroomDocRef = doc(db, `user/${uid}/showroom/${showroomId}`);
          const showroomDoc = await getDoc(showroomDocRef);
    
          if (showroomDoc.exists()) {
            const showroomData = showroomDoc.data();
    
            // Fetch staff members from the showroom data
            const staffData: Staff[] = showroomData.staff.map((staffMember: any) => ({
              id: staffMember.phoneNumber, // Assuming phone number is unique
              name: staffMember.name,
              phoneNumber: staffMember.phoneNumber,
            }));
    
            setStaff(staffData);
    
            // Fetch Bookings
            const statusConditions = [
              'booking added', 'Contacted Customer', 'Vehicle Picked',
              'Vehicle Confirmed', 'To DropOff Location', 'Vehicle dropoff'
            ];
    
            const bookingQuery = query(
              collection(db, `user/${uid}/bookings`),
              where('vehicleSection', '==', 'Service Center'),
              where('showroomId', '==', showroomId),
              where('status', 'in', statusConditions)
            );
    
            const bookingSnapshot = await getDocs(bookingQuery);
            const bookingsData: Booking[] = [];
            bookingSnapshot.forEach((doc) => {
              const booking = doc.data();
              const formattedDateTime = new Date(booking.dateTime).toLocaleDateString('en-GB');
              bookingsData.push({
                id: doc.id,
                dateTime: formattedDateTime,
                fileNumber: booking.fileNumber,
                customerName: booking.customerName,
                serviceType: booking.serviceType,
                phoneNumber: booking.phoneNumber,
                status: booking.status,
                createdBy: booking.createdBy
              });
            });
            setBookings(bookingsData);
          } else {
            console.error('Showroom document does not exist');
          }
        } else {
          console.error('showroomId is not available');
        }
      } catch (error) {
        console.error('Error fetching bookings and staff:', error);
      }
    };
    

    fetchBookingsAndStaff();
  }, [showroomId, uid]);

  // Delete a staff member from Firestore
  const deleteStaffMember = async (phoneNumber: string) => {
    try {
      setLoading(prev => ({ ...prev, [phoneNumber]: true })); // Set loading for the specific member
  
      const db = getFirestore();
      const showroomDocRef = doc(db, `user/${uid}/showroom/${showroomId}`);
      const showroomDocSnapshot = await getDoc(showroomDocRef);
      if (!showroomDocSnapshot.exists()) {
        console.error('Showroom does not exist');
        return;
      }
  
      const showroomData = showroomDocSnapshot.data();
      const updatedStaff = showroomData.staff.filter((member: any) => member.phoneNumber !== phoneNumber);
  
      await updateDoc(showroomDocRef, { staff: updatedStaff });
      setStaff(updatedStaff);
      console.log('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff member:', error);
    } finally {
      setLoading(prev => ({ ...prev, [phoneNumber]: false })); // Reset loading for the specific member
    }
  };
  
  
  

  return (
    <div style={{ padding: '30px', overflowX: 'auto' }}>
         <style>
        {`
          .loading-spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-left-color: #fff;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            display: inline-block; /* Aligns with button */
            margin-left: 5px; /* Space between button and spinner */
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', color: '#333', textTransform: 'uppercase' }}>Bookings</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', tableLayout: 'fixed' }}>
        <thead style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Date & Time</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>File Number</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Customer Name</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Phone/Mobile</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.dateTime}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.fileNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{booking.customerName}</td>
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

      <h2 style={{ textAlign: 'center', marginTop: '40px', fontSize: '24px', color: '#333', textTransform: 'uppercase' }}>Staff Members</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', tableLayout: 'fixed', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Phone</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
  {staff.map((member,index) => (
    <tr key={index}>
      <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{member.name}</td>
      <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>{member.phoneNumber}</td>
      <td style={{ padding: '10px', border: '1px solid #ccc', wordWrap: 'break-word' }}>
        <div style={{display:'grid', placeItems:'center'}}>
        {loading[member.phoneNumber] ? (
        <button style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', borderRadius:'5px' }}>
        <div className="loading-spinner"></div> 
        </button>
      ) : (
        <button
          onClick={() => deleteStaffMember(member.phoneNumber)}
          style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer',borderRadius:'5px' }}
        >
          Delete
        </button>
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

export default ServiceCenter;
