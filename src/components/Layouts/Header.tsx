import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore'; 

const Header = () => {
    const [tollFreeNumber, setTollFreeNumber] = useState(''); 
    const showroomId = localStorage.getItem('showroomId');

    useEffect(() => {
        const fetchTollFreeNumber = async () => {
            try {
                const db = getFirestore(); 
                const showroomDocRef = doc(db, 'showroom', showroomId);
                const docSnap = await getDoc(showroomDocRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTollFreeNumber(data.tollfree); 
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching toll-free number:', error);
            }
        };

        if (showroomId) {
            fetchTollFreeNumber();
        }
    }, [showroomId]);

    return (
        <header>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center justify-between px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-32 ltr:-ml-2 rtl:-mr-2 inline" src="/assets/images/auth/rsa-png.png" alt="logo" />
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
                        Toll-Free: {tollFreeNumber}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
