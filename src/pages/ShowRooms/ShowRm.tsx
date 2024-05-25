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
import './ShowRm.css'; // Import the CSS file

const ShowRm = () => {
  const [activeTab, setActiveTab] = useState('serviceCenter');
  const [selectedOption, setSelectedOption] = useState('bookings');
  const userName = localStorage.getItem('userName');
  const password = localStorage.getItem('password');
  const showroomId = localStorage.getItem('showroomId');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="showrm-container">
      <Header />
      <div className="add-booking">
        <Link to="/addbook">
          <button className="add-booking-button">Add Booking</button>
        </Link>
      </div>
      <div className="tab-buttons">
        {['serviceCenter', 'bodyParts', 'showRooms'].map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === 'serviceCenter' && 'Service Center'}
            {tab === 'bodyParts' && 'Body Shopes'}
            {tab === 'showRooms' && 'Showrooms'}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {['serviceCenter', 'bodyParts', 'showRooms'].map(tab => (
          activeTab === tab && (
            <div key={tab} className="tab-pane">
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="booking-select"
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
