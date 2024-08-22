import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, DocumentData } from 'firebase/firestore';

const Header: React.FC = () => {
    const [tollFreeNumber, setTollFreeNumber] = useState<string>(''); 
    const showroomId = localStorage.getItem('showroomId');

    useEffect(() => {
        const fetchTollFreeNumber = async () => {
            try {
                const db = getFirestore(); 
                if (showroomId) {
                    const showroomDocRef = doc(db, 'user/V9e4v0UtSzUrPVgxtJzOTkq71do2/showroom', showroomId);
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
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center justify-between px-5 py-2.5 dark:bg-black">
                    <Link to="/" className="main-logo flex items-center shrink-0">
                        <img className="w-32 ltr:-ml-2 rtl:-mr-2 inline" src="/assets/images/auth/rsa-png.png" alt="logo" />
                    </Link>
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
                </div>
            </div>
        </header>
    );
};

export default Header;
