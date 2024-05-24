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
    <div>
      <Header/>
       <div style={{ textAlign: 'right', marginTop: '20px', marginRight: '20px',padding:"20px" }}>
       <Link to="/addbook">
  <button className='bg-success' style={{ padding: '10px', color: '#ffffff', border: 'none', borderRadius: '7px' }}>
    Add Booking
  </button>
</Link>

      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          style={{
            padding: '10px',
            margin: '0 10px',
            marginBottom:'30px',
            backgroundColor: activeTab === 'serviceCenter' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'serviceCenter' ? '#ffffff' : '#000000',borderRadius:"5px"
          }}
          onClick={() => handleTabChange('serviceCenter')}
        >
          Service Center
        </button>
        <button
          style={{
            padding: '10px',
            margin: '0 10px',
            marginBottom:'30px',
            backgroundColor: activeTab === 'bodyParts' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'bodyParts' ? '#ffffff' : '#000000',borderRadius:"5px"
          }}
          onClick={() => handleTabChange('bodyParts')}
        >
          Body Shopes
        </button>
        <button
          style={{
            padding: '10px',
            margin: '0 10px',
            marginBottom:'30px',
            backgroundColor: activeTab === 'showRooms' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'showRooms' ? '#ffffff' : '#000000',borderRadius:"5px"
          }}
          onClick={() => handleTabChange('showRooms')}
        >
          Showrooms
        </button>
       
      </div>

      <div className="tab-content">
        {activeTab === 'serviceCenter' && (
          <div style={{ margin: '20px auto'}}>
            <div>
             <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        style={{ padding: '8px', borderRadius: '5px', marginRight: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', outline: 'none', cursor: 'pointer',marginLeft:"30px"  }}
      >
        <option value="bookings">Bookings</option>
        <option value="completedBookings">Completed Bookings</option>
        <option value="pendingBookings">Pending Bookings</option>
      </select>
      {selectedOption === 'bookings' && <ServiceCenter />}
      {selectedOption === 'completedBookings' && <CompletedBookings/>}
      {selectedOption === 'pendingBookings' && <PendingBookings/>}
    </div>
          </div>
        )}
{activeTab === 'bodyParts' && (
          <div style={{ margin: '20px auto'}}>
            <div>
             <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        style={{ padding: '8px', borderRadius: '5px', marginRight: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', outline: 'none', cursor: 'pointer',marginLeft:"30px"  }}
      >
        <option value="bookings">Bookings</option>
        <option value="completedBookings">Completed Bookings</option>
        <option value="pendingBookings">Pending Bookings</option>
      </select>
      {selectedOption === 'bookings' && <BodyShopes/>}
      {selectedOption === 'completedBookings' && <CompletedBodyBookings/>}
      {selectedOption === 'pendingBookings' && <PendingBodyBookings/>}
    </div>
          </div>
        )}
{activeTab === 'showRooms' && (
          <div style={{ margin: '20px auto'}}>
            <div>
             <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        style={{ padding: '8px', borderRadius: '5px', marginRight: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', outline: 'none', cursor: 'pointer',marginLeft:"30px"  }}
      >
        <option value="bookings">Bookings</option>
        <option value="completedBookings">Completed Bookings</option>
        <option value="pendingBookings">Pending Bookings</option>
      </select>
      {selectedOption === 'bookings' && <BookingsShowRoom/>}
      {selectedOption === 'completedBookings' && <CompleteShowRoom/>}
      {selectedOption === 'pendingBookings' && <PendingBookingsShowRoom/>}
    </div>
          </div>
        )}      </div>

      
    </div>
  );
};

export default ShowRm;
