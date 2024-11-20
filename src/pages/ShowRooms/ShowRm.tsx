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
import { collection, doc, getDoc, getDocs, getFirestore, query, where, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import './ShowRm.css';
import { IoIosGift, IoMdAdd, IoMdAddCircleOutline, IoMdQrScanner } from 'react-icons/io';
import IconCashBanknotes from '../../components/Icon/IconCashBanknotes';

interface RewardItem {
    _id: string;
    name: string;
    description: string;
    points: number;
    price: string;
    category: string;
    percentage: string;
    stock: number;
    image?: string;
}

const ShowRm: React.FC = () => {
    const db = getFirestore();
    const storage = getStorage();
    const uid = import.meta.env.VITE_REACT_APP_UID;
    const [rewards, setRewards] = useState<RewardItem[]>([]);
    const [activeTab, setActiveTab] = useState<'serviceCenter' | 'bodyParts' | 'showRooms'>('serviceCenter');
    const [selectedOption, setSelectedOption] = useState<'bookings' | 'completedBookings' | 'pendingBookings'>('bookings');
    const [rewardPoints, setRewardPoints] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const showroomId = localStorage.getItem('showroomId');

    const handleTabChange = (tabName: 'serviceCenter' | 'bodyParts' | 'showRooms') => {
        setActiveTab(tabName);
    };

    const handleRewardButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [isModalOpen]);

    useEffect(() => {
        async function fetchRewardPoints() {
            try {
                const showroomDocRef = doc(db, `user/${uid}/showroom/${showroomId}`);
                const showroomDoc = await getDoc(showroomDocRef);

                if (showroomDoc.exists()) {
                    setRewardPoints(showroomDoc.data().rewardPoints);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching reward points:', error);
            }
        }

        fetchRewardPoints();
    }, [db, uid, showroomId]);

    const fetchData = async () => {
        try {
            const rewardQuery = query(collection(db, `user/${uid}/rewarditems`), where('category', '==', 'Showroom'));
            const querySnapshot = await getDocs(rewardQuery);
            const rewardsData: RewardItem[] = querySnapshot.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data(),
            })) as RewardItem[];

            setRewards(rewardsData);
        } catch (error) {
            console.error('Error fetching reward items:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClaimReward = async (item: RewardItem) => {
        if (rewardPoints !== null && rewardPoints >= item.points && item.stock > 0) {
            try {
                // Update reward points and stock
                const newRewardPoints = rewardPoints - item.points;
                const newStock = item.stock - 1;

                // Update Firestore for the showroom document
                const showroomDocRef = doc(db, `user/${uid}/showroom/${showroomId}`);
                await setDoc(showroomDocRef, { rewardPoints: newRewardPoints }, { merge: true });

                // Update Firestore for the reward item stock
                const rewardDocRef = doc(db, `user/${uid}/rewarditems/${item._id}`);
                await setDoc(rewardDocRef, { stock: newStock }, { merge: true });

                // Create a new document in the claimed rewards collection
                const claimedRewardData = {
                    rewardId: item._id,
                    rewardName: item.name,
                    claimedAt: new Date(),
                };
                const claimedRewardsRef = collection(db, `user/${uid}/showroom/${showroomId}/claimedRewards`);
                await setDoc(doc(claimedRewardsRef), claimedRewardData);

                alert(`You have claimed the reward: ${item.name}!`);
                setRewardPoints(newRewardPoints); // Update local state
                fetchData(); // Refresh rewards data to reflect updated stock
            } catch (error) {
                console.error('Error claiming reward:', error);
            }
        } else {
            alert('Not enough reward points or item out of stock.');
        }
    };

    return (
        <div className="showrm-container">
            <Header />

            <div className="add-booking">
          
                <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="rewardButton" onClick={handleRewardButtonClick}>
                <IoIosGift  size={20}/>
                 
                </button>
                {/* <Link to="/showrm/qr">
                    <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="qr-button"><IoMdQrScanner size={20}/> QRCode Login </button>
                </Link>
                <Link to="/addbook">
                    <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="add-booking-button"><IoMdAddCircleOutline size={20}/> Add Booking</button>
                </Link>
                <Link to="/cashreport">
                    <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="cash-report-button"><IconCashBanknotes size={20}/> Cash Report</button>
                </Link> */}
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
                        <p style={{ backgroundColor: 'green', padding: '5px', borderRadius: '10px', fontWeight: 'bold', color: 'white' }}>Current Points: {rewardPoints}</p>
                        <div className="rewardProgressCard" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {/* Loop through rewards */}
                            {rewards.map((items, index) => {
                                // Calculate completion percentage based on reward points and target
                                const completionPercentage = Math.min(((rewardPoints ?? 0) / items.points) * 100, 100);

                                // Function to handle reward claim

                                return (
                                    <div key={index} className="container my-2" style={{ backgroundColor: '#b2b2b2', padding: '10px', borderRadius: '10px' }}>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-1/4">
                                                <img style={{ height: '95px', width: '95px', objectFit: 'cover' }} src={items.image} alt="Live from space" className="w-full h-auto rounded" />
                                            </div>
                                            <div className="w-3/4">
                                                <h1 className="text-2xl font-bold">{items.name}</h1>
                                                <p className="text-lg text-gray-700">Price: ₹{items.price}</p>
                                                <p className="text-md text-gray-500">Target: {items.points}</p>
                                                <p className="text-md text-gray-500">Stock available: {items.stock}</p>
                                            </div>
                                        </div>
                                        <ProgressBar completed={completionPercentage} className="mt-4" />

                                        {/* Show Claim or Encouragement Message */}
                                        {completionPercentage === 100 && Number(items.stock) > 0 ? (
                                            <button
                                                onClick={() => handleClaimReward(items)}
                                                style={{
                                                    marginTop: '10px',
                                                    padding: '8px 16px',
                                                    backgroundColor: 'blue',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    width: '100%',
                                                }}
                                            >
                                                Claim Reward
                                            </button>
                                        ) : Number(items.stock) === 0 ? (
                                            <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'red' }}>Out of Stock</p>
                                        ) : (
                                            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Almost there! Keep going to claim your reward!</p>
                                        )}
                                    </div>
                                );
                            })}
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
