import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, DocumentData } from 'firebase/firestore';
import {  IoMdAddCircleOutline, IoMdLogOut, IoMdQrScanner } from "react-icons/io";
import styles from './header.module.css'
import IconCashBanknotes from '../Icon/IconCashBanknotes';
// import { IoLogOut } from 'react-icons/io5';


const Header: React.FC = () => {
    const [tollFreeNumber, setTollFreeNumber] = useState<string>(''); 
    const showroomId = localStorage.getItem('showroomId');
    const uid = import.meta.env.VITE_REACT_APP_UID;
    const navigate = useNavigate()
    const logOut =async()=>{
      navigate('/')
    }

    useEffect(() => {
        const fetchTollFreeNumber = async () => {
            try {
                const db = getFirestore(); 
                if (showroomId) {
                    const showroomDocRef = doc(db, `user/${uid}/showroom`, showroomId);
                    const docSnap = await getDoc(showroomDocRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data() as DocumentData; // Explicitly type as DocumentData
                        setTollFreeNumber(data.tollfree || ''); // Handle the case where tollfree might be undefined
                    } else {
                        console.log('No such document!');
                    }
                }
            } catch (error) {
                console.error('Error fetching toll-free number:', error);
            }
        };

        fetchTollFreeNumber();
    }, [showroomId]);

    return (
        <header>
            <div >
                <div   className={`${styles.main} relative bg-white flex w-full items-center justify-between px-5 py-2.5 dark:bg-black`}>
                   <Link to='/showrm'>
                   <img className="w-32 ltr:-ml-2 rtl:-mr-2 inline" src="/assets/images/auth/rsa-png.png" alt="logo" />
                   </Link>
                        <div className="add-booking">
          
         
          <Link to="/showrm/qr">
              <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="qr-button"><IoMdQrScanner size={20}/> QRCode Login </button>
          </Link>
          <Link to="/addbook">
              <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="add-booking-button"><IoMdAddCircleOutline size={20}/> Add Booking</button>
          </Link>
          <Link to="/cashreport">
              <button style={{display:'flex', alignItems:'center',gap:'10px'}} className="cash-report-button"><IconCashBanknotes /> Cash Report</button>
          </Link>
      </div>
                    <div 
                        className="toll-free-number text-gray-600 dark:text-gray-400" 
                        style={{
                            fontSize: '1.25rem', 
                            fontWeight: 'bold',
                            color: '#FF6347',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'  // Slight shadow for depth
                        }}
                    >
                        Help-Line Number: {tollFreeNumber}
                    </div>
<button onClick={logOut}><IoMdLogOut size={36} color='red'/></button>
                </div>
            </div>
        </header>
    );
};

export default Header;
