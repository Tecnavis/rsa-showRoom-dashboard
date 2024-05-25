import React, { useState } from 'react';
import ServiceCenter from './ServiceCenter/ServiceCenter';
import CompletedBookings from './ServiceCenter/CompletedBookings';
import PendingBookings from './ServiceCenter/PendingBookings';
import { Link } from 'react-router-dom';
import Header from '../../components/Layouts/Header';
import BodyShopes from './BodyShopes/BodyShopes';
import CompletedBodyBookings from './BodyShopes/CompletedBodyBookings';
import PendingBodyBookings from './BodyShopes/PendingBodyBookings';
import BookingsShowRoom from './ShowRoom/BookingsShowRoom';
import CompleteShowRoom from './ShowRoom/CompleteShowRoom';
import PendingBookingsShowRoom from './ShowRoom/PendingBookingShowRoom';

const ShowRm = () => {
  // State to track active tab and selected dropdown option
  const [activeTab, setActiveTab] = useState('serviceCenter');
  const [selectedOption, setSelectedOption] = useState('bookings');
  const userName = localStorage.getItem('userName'); // Get driverId from localStorage
  const password = localStorage.getItem('password');
  const showroomId = localStorage.getItem('showroomId');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <Header />
      <div style={{ textAlign: 'right', marginTop: '20px', marginRight: '20px', padding: '20px' }}>
        <Link to="/addbook">
          <button style={{ padding: '10px 20px', color: '#fff', backgroundColor: '#28a745', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 'bold' }}>
            Add Booking
          </button>
        </Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {['serviceCenter', 'bodyParts', 'showRooms'].map(tab => (
          <button
            key={tab}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              marginBottom: '30px',
              backgroundColor: activeTab === tab ? '#007bff' : '#f0f0f0',
              color: activeTab === tab ? '#ffffff' : '#000000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              transition: 'background-color 0.3s, color 0.3s'
            }}
            onClick={() => handleTabChange(tab)}
          >
            {tab === 'serviceCenter' && 'Service Center'}
            {tab === 'bodyParts' && 'Body Shopes'}
            {tab === 'showRooms' && 'Showrooms'}
          </button>
        ))}
      </div>

      <div className="tab-content" style={{ textAlign: 'center' }}>
        {['serviceCenter', 'bodyParts', 'showRooms'].map(tab => (
          activeTab === tab && (
            <div key={tab} style={{ margin: '20px auto', width: '80%', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px', backgroundColor: '#fff' }}>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  marginRight: '10px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  outline: 'none',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  fontSize: '1rem',
                  width: '200px',
                  textAlign: 'center'
                }}
              >
                <option value="bookings">Bookings</option>
                <option value="completedBookings">Completed Bookings</option>
                <option value="pendingBookings">Pending Bookings</option>
              </select>
              {selectedOption === 'bookings' && tab === 'serviceCenter' && <ServiceCenter />}
              {selectedOption === 'completedBookings' && tab === 'serviceCenter' && <CompletedBookings />}
              {selectedOption === 'pendingBookings' && tab === 'serviceCenter' && <PendingBookings />}
              {selectedOption === 'bookings' && tab === 'bodyParts' && <BodyShopes />}
              {selectedOption === 'completedBookings' && tab === 'bodyParts' && <CompletedBodyBookings />}
              {selectedOption === 'pendingBookings' && tab === 'bodyParts' && <PendingBodyBookings />}
              {selectedOption === 'bookings' && tab === 'showRooms' && <BookingsShowRoom />}
              {selectedOption === 'completedBookings' && tab === 'showRooms' && <CompleteShowRoom />}
              {selectedOption === 'pendingBookings' && tab === 'showRooms' && <PendingBookingsShowRoom />}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ShowRm;
