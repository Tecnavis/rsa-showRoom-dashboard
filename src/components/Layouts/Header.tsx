import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 

const Header = () => {
    const [tollFreeNumber, setTollFreeNumber] = useState(''); 

    useEffect(() => {
        const fetchTollFreeNumber = async () => {
            try {
                const db = getFirestore(); 
                const q = collection(db, 'showroom'); 
                const querySnapshot = await getDocs(q); 
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setTollFreeNumber(data.tollfree); 
                });
            } catch (error) {
                console.error('Error fetching toll-free number:', error);
            }
        };

        fetchTollFreeNumber();
    }, []);

    return (
        <header>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center justify-between px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-32 ltr:-ml-2 rtl:-mr-2 inline" src="/assets/images/auth/rsa-png.png" alt="logo" />
                        </Link>
                    </div>
                    <div className="toll-free-number text-gray-600 dark:text-gray-400">Toll-Free: {tollFreeNumber}</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
