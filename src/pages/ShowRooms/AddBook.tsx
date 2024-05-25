import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Header from '../../components/Layouts/Header';

const AddBook = () => {
    const showroomId = localStorage.getItem('showroomId');
    console.log("first", showroomId);

    const [formData, setFormData] = useState({
        fileNumber: '',
        customerName: '',
        phoneNumber: '',
        vehicleSection: '',
        serviceType: '',
        vehicleNumber: '',
        vehicleModel: '',
        comments: '',
    });

    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState('');
    const [showroomData, setShowroomData] = useState(null);

    useEffect(() => {
        const newBookingId = uuid().substring(0, 4);
        setBookingId(newBookingId);
    }, []);

    useEffect(() => {
        const fetchShowroomData = async () => {
            try {
                const showroomDocRef = doc(db, 'showroom', showroomId);
                const showroomDocSnap = await getDoc(showroomDocRef);
                if (showroomDocSnap.exists()) {
                    const data = showroomDocSnap.data();
                    console.log('Showroom Data:', data);
                    setShowroomData(data);

                    if (data.showroomId) {
                        const updatedFileNumber = `${data.showroomId}${bookingId}`;
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            fileNumber: updatedFileNumber,
                        }));
                    }
                } else {
                    console.log('Showroom document does not exist');
                }
            } catch (error) {
                console.error('Error fetching showroom data:', error);
            }
        };

        fetchShowroomData();
    }, [showroomId, db, bookingId]);

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
                showroomId: showroomId, // Include showroomId in the document
                dateTime: dateTime,
                createdAt: serverTimestamp(),
                bookingStatus: 'ShowRoom Booking',
                status: 'booking added',
                bookingId: bookingId,
                company: 'RSA',
            });
            console.log('Document added successfully with ID:', docRef.id);

            setFormData({
                fileNumber: '',
                customerName: '',
                phoneNumber: '',
                serviceType: '',
                vehicleNumber: '',
                vehicleModel: '',
                vehicleSection: '',
                comments: '',
            });
            navigate('/showrm');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };
    return (
        <div>
                  <Header />

        <div style={{ padding: '1.5rem', flex: 1, marginTop: '2rem', margin: '2rem auto', maxWidth: '800px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)', borderRadius: '10px',  backgroundColor: 'lightblue' }}>
            <h5 className="font-semibold text-lg p-4" style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>Add Bookings</h5>
            <div style={{ padding: '1rem' }}>
            <div className="mb-4" style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif', color: '#333', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
  <strong style={{ fontWeight: 'bold', color: '#007bff', fontSize: '16px' }}>Booking ID: </strong> 
  <span style={{ fontSize: '16px', color: '#333' }}>{bookingId}</span>
</div>

                <div className="mt-4 flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="fileNumber" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>File Number</label>
                    <input
                        id="fileNumber"
                        type="text"
                        name="fileNumber"
                        className="form-input flex-1"
                        placeholder="Enter File Number"
                        value={formData.fileNumber}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('fileNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="vehicleSection" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Vehicle Section</label>
                    <select
                        id="vehicleSection"
                        name="vehicleSection"
                        className="form-select flex-1"
                        value={formData.vehicleSection}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
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
                <div className="mt-4 flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="customerName" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Customer Name</label>
                    <input
                        id="customerName"
                        type="text"
                        name="customerName"
                        className="form-input flex-1"
                        placeholder="Enter Name"
                        value={formData.customerName}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="phoneNumber" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Phone Number</label>
                    <input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        className="form-input flex-1"
                        placeholder="Enter Phone Number"
                        value={formData.phoneNumber}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="serviceType" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Service Type</label>
                    <select
                        id="serviceType"
                        name="serviceType"
                        className="form-select flex-1"
                        value={formData.serviceType}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
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
                <div className="mt-4 flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="vehicleNumber" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Customer Vehicle Number</label>
                    <input
                        id="vehicleNumber"
                        type="text"
                        name="vehicleNumber"
                        className="form-input flex-1"
                        placeholder="Enter vehicle number"
                        value={formData.vehicleNumber}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="vehicleModel" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Brand Name</label>
                    <input
                        id="vehicleModel"
                        name="vehicleModel"
                        className="form-input flex-1"
                        value={formData.vehicleModel}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center" style={{ marginBottom: '1rem' }}>
                    <textarea
                        id="comments"
                        name="comments"
                        className="form-input flex-1"
                        placeholder="Comments"
                        value={formData.comments}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
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
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '0.75rem',
                            width: '100%',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AddBook;
