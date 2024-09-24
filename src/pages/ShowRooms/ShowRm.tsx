import React, { useEffect, useState } from 'react';
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
import ProgressBar from '@ramonak/react-progress-bar';
import Button from '@mui/material/Button';

import './ShowRm.css';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
interface RewardItem {
  _id: string;
  name: string;
  description: string;
  points: string;
  price: string;
  category: string;
  percentage: string;
  stock: string;
  image?: string;
}
const ShowRm: React.FC = () => {
  const db = getFirestore();
  const storage = getStorage();
  const uid = import.meta.env.VITE_REACT_APP_UID;
  const [rewards, setRewards] = useState<RewardItem[]>([]); 
    const [activeTab, setActiveTab] = useState<'serviceCenter' | 'bodyParts' | 'showRooms'>('serviceCenter');
    const [selectedOption, setSelectedOption] = useState<'bookings' | 'completedBookings' | 'pendingBookings'>('bookings');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility

    const handleTabChange = (tabName: 'serviceCenter' | 'bodyParts' | 'showRooms') => {
        setActiveTab(tabName);
    };

    const handleRewardButtonClick = () => {
        setIsModalOpen(true); // Open modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close modal
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [isModalOpen]);

    const fetchData = async () => {
      try {
          const rewardQuery = query(
              collection(db, `user/${uid}/rewarditems`),
              where("category", "==", "Showroom")
          );

          const querySnapshot = await getDocs(rewardQuery);
          const rewardsData: RewardItem[] = querySnapshot.docs.map((doc) => ({
              _id: doc.id,
              ...doc.data(),
          })) as RewardItem[];

          setRewards(rewardsData); // This should now work without errors
      } catch (error) {
          console.error('Error fetching reward items:', error);
      }
  };
  useEffect(() => {
  fetchData();
  }, [])
  

  console.log(rewards,'this si the ')
    return (
        <div className="showrm-container">
            <Header />

            <div className="add-booking">
                <button className="rewardButton" onClick={handleRewardButtonClick}>
                    Rewards
                </button>
                <Link to="/showrm/qr">
                    <button className="qr-button">QRCode Login </button>
                </Link>
                <Link to="/addbook">
                    <button className="add-booking-button">Add Booking</button>
                </Link>
                <Link to="/cashreport">
                    <button className="cash-report-button">Cash Report</button>
                </Link>
            </div>
            <div className="tab-buttons">
                {['serviceCenter', 'bodyParts', 'showRooms'].map((tab) => (
                    <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab as 'serviceCenter' | 'bodyParts' | 'showRooms')}>
                        {tab === 'serviceCenter' && 'Service Center'}
                        {tab === 'bodyParts' && 'Body Shopes'}
                        {tab === 'showRooms' && 'Showrooms'}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {['serviceCenter', 'bodyParts', 'showRooms'].map(
                    (tab) =>
                        activeTab === tab && (
                            <div key={tab} className="tab-pane">
                                <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value as 'bookings' | 'completedBookings' | 'pendingBookings')} className="booking-select">
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
                )}
            </div>

            {/* Modal Implementation */}
            {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rewardProgressCard"  style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {/* First Card */}

              {rewards.map((items,index)=>(
 <div key={index} className="container my-2" style={{ backgroundColor: '#b2b2b2', padding: '10px', borderRadius: '10px' }}>
 <div className="flex items-center space-x-4">
   <div className="w-1/4">
     <img style={{height:'95px', width:'95px', objectFit:'cover'}} src={items.image} alt="Live from space" className="w-full h-auto rounded" />
   </div>
   <div className="w-3/4">
     <h1 className="text-2xl font-bold">{items.name}</h1>
     <p className="text-lg text-gray-700">Price : ₹{items.price}</p>
   </div>
   <div>
   <p className="text-md text-gray-500">Target {items.points}</p>
   </div>
 </div>
 <ProgressBar completed={60} className="mt-4" />
</div>
              ))}
             

            
            </div>

            {/* Close Button */}
            <Button variant="outlined" onClick={handleCloseModal} color="error">
                            Close
                        </Button>
          </div>
        </div>
      )}
        </div>
    );
};

export default ShowRm;
