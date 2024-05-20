
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Header } from '@mantine/core';

const AddBook = () => {
    const [formData, setFormData] = useState({
        fileNumber: '',
        customerName: '',
        phoneNumber: '',
        vehicleSection:'',

        serviceType: '',
        vehicleNumber: '',
        vehicleModel: '',
        comments: '',
    });
    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string>('');
    
    useEffect(() => {
        const newBookingId = uuid().substring(0, 6);
        setBookingId(newBookingId);
    }, []);
    
    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const currentDate = new Date();
            const dateTime = currentDate.toLocaleString();

            const docRef = await addDoc(collection(db, 'bookings'), {
                ...formData,
                dateTime: dateTime,
                createdAt: serverTimestamp(),
                bookingStatus: 'ShowRoom Booking',
                status: 'booking added',
                bookingId: bookingId, // Include the bookingId in the document
            });
            console.log('Document added successfully with ID:', docRef.id);

            setFormData({
                fileNumber: '',
                customerName: '',
                phoneNumber: '',
                serviceType: '',
                vehicleNumber: '',
                vehicleModel: '',
                vehicleSection:'',
                comments: '',
            });
            navigate('/showrm');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <div style={{ padding: '6px', flex: 1, marginTop: '2rem', marginRight: '6rem', marginLeft: '6rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
           
            <h5 className="font-semibold text-lg dark:text-white-light p-4">Add Bookings</h5>
            <div style={{ padding: '1rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <div className="mb-4">
                    <strong>Booking ID: </strong> {bookingId}
                </div>
                <div className="mt-4 flex items-center">
                    <label htmlFor="fileNumber" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
                        File Number
                    </label>
                    <input
                        id="fileNumber"
                        type="text"
                        name="fileNumber"
                        className="form-input flex-1"
                        placeholder="Enter File Number"
                        value={formData.fileNumber}
                        onChange={(e) => handleInputChange('fileNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center mt-4">
                    <label htmlFor="vehicleSection" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                    Vehicle Section
                    </label>
                    <select
                        id="vehicleSection"
                        name="vehicleSection"
                        className="form-select flex-1"
                        value={formData.vehicleSection}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('vehicleSection', e.target.value)}
                    >
                        <option value="">Select Service Section</option>
                        <option value="Service Center">Service Center</option>
                        <option value="Body Shopes">Body Shopes</option>
                        <option value="ShowRooms">ShowRooms</option>
                       
                    </select>
                </div>
                <div className="mt-4 flex items-center">
                    <label htmlFor="customerName" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
                        Customer Name
                    </label>
                    <input
                        id="customerName"
                        type="text"
                        name="customerName"
                        className="form-input flex-1"
                        placeholder="Enter Name"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center">
                    <label htmlFor="phoneNumber" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
                        Phone Number
                    </label>
                    <input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        className="form-input flex-1"
                        placeholder="Enter Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center mt-4">
                    <label htmlFor="serviceType" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                        Service Type
                    </label>
                    <select
                        id="serviceType"
                        name="serviceType"
                        className="form-select flex-1"
                        value={formData.serviceType}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    >
                        <option value="">Select Service Type</option>
                        <option value="Flat bed">Flat bed</option>
                        <option value="Under Lift">Under Lift</option>
                        <option value="Rsr By Car">Rsr By Car</option>
                        <option value="Rsr By Bike">Rsr By Bike</option>
                        <option value="Custody">Custody</option>
                        <option value="Hydra Crane">Hydra Crane</option>
                        <option value="Jump start">Jump start</option>
                        <option value="Tow Wheeler Fbt">Tow Wheeler Fbt</option>
                        <option value="Zero Digri Flat Bed">Zero Digri Flat Bed</option>
                        <option value="Undet Lift 407">Undet Lift 407</option>
                        <option value="S Lorry Crane Bed">S Lorry Crane Bed</option>
                    </select>
                </div>
                <div className="mt-4 flex items-center">
                    <label htmlFor="vehicleNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                        Customer Vehicle Number
                    </label>
                    <input
                        id="vehicleNumber"
                        type="text"
                        name="vehicleNumber"
                        className="form-input flex-1"
                        placeholder="Enter vehicle number"
                        value={formData.vehicleNumber}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center mt-4">
                    <label htmlFor="vehicleModel" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                        Brand Name
                    </label>
                    <input
                        id="vehicleModel"
                        name="vehicleModel"
                        className="form-input flex-1"
                        value={formData.vehicleModel}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center">
                    <textarea
                        id="reciever-name"
                        name="reciever-name"
                        className="form-input flex-1"
                        placeholder="Comments"
                        value={formData.comments}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('comments', e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            padding: '0.5rem',
                            width: '100%',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
