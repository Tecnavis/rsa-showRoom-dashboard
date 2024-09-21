import React, { useEffect, useState, ChangeEvent } from 'react';
import { addDoc, collection,  getDoc, doc, Timestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Header from '../../components/Layouts/Header';

interface FormData {
    fileNumber: string;
    customerName: string;
    phoneNumber: string;
    vehicleSection: string;
    vehicleNumber: string;
    comments: string;
   
}

const AddBook: React.FC = () => {
    const showroomId = localStorage.getItem('showroomId');
    console.log("first", showroomId);

    const [formData, setFormData] = useState<FormData>({
        fileNumber: '',
        customerName: '',
        phoneNumber: '',
        vehicleSection: '',
        vehicleNumber: '',
        comments: '',
      
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const uid = import.meta.env.VITE_REACT_APP_UID;
    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string>('');
    const [showroomData, setShowroomData] = useState<any>(null);

    useEffect(() => {
        const newBookingId = uuid().substring(0, 4);
        setBookingId(newBookingId);
    }, []);

    useEffect(() => {
        const fetchShowroomData = async () => {
            try {
                const showroomDocRef = doc(db, `user/${uid}/showroom`, showroomId!);
                const showroomDocSnap = await getDoc(showroomDocRef);
                if (showroomDocSnap.exists()) {
                    const data = showroomDocSnap.data();
                    console.log('Showroom Data:', data);
                    setShowroomData(data);

                    if (data.showroomId) {
                        const updatedFileNumber = `${data.showroomId}${bookingId}`;
                        console.log("updatedFileNumber",updatedFileNumber)
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            fileNumber: updatedFileNumber,
                        }));
                        console.log('Updated File Number:', updatedFileNumber);
                    }
                } else {
                    console.log('Showroom document does not exist');
                }
            } catch (error) {
                console.error('Error fetching showroom data:', error);
            }
        };

        fetchShowroomData();
    }, [showroomId, db, bookingId, uid]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value,
        }));
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

     

    const validateForm = (): boolean => {
        const { customerName, phoneNumber, vehicleSection, vehicleNumber } = formData;
        return !!(customerName && phoneNumber && vehicleSection && vehicleNumber);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setError('Please fill in all required fields.');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            const currentDate = new Date();
            const dateTime = currentDate.toLocaleString();
    
            // Create the dropoffLocation object
            const dropoffLocation = {
                lat: showroomData?.locationLatLng?.lat || 0,  // Use fallback if lat is undefined
                lng: showroomData?.locationLatLng?.lng || 0,  // Use fallback if lng is undefined
                name: showroomData?.Location || 'Default Showroom Name', // Adjusted to use showroom name
            };
    
            const docRef = await addDoc(collection(db, `user/${uid}/bookings`), {
                ...formData,
                showroomId: showroomId,
                dateTime: dateTime,
                createdAt: Timestamp.now(),
                bookingStatus: 'ShowRoom Booking',
                status: 'booking added',
                bookingId: bookingId,
                company: 'rsa',
                dropoffLocation: dropoffLocation,
                showroomLocation: dropoffLocation.name,
            });
    
            console.log('Document added successfully with ID:', docRef.id);
    
            // Reset form data
            setFormData({
                fileNumber: '',
                customerName: '',
                phoneNumber: '',
                vehicleNumber: '',
                vehicleSection: '',
                comments: '',
            });
    
            navigate('/showrm');
        } catch (error) {
            console.error('Error adding document: ', error);
            setError('Failed to add booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };
    return (
        <div>
            <Header />
            <div style={{ padding: '1.5rem', flex: 1, marginTop: '2rem', margin: '2rem auto', maxWidth: '800px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)', borderRadius: '10px', backgroundColor: 'lightblue' }}>
                <button
                    onClick={handleBack}
                    style={{
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginBottom: '1rem',
                    }}
                >
                    Back
                </button>                <h5 className="font-semibold text-lg p-4" style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>Add Bookings</h5>
                <div style={{ padding: '1rem' }}>
                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fileNumber', e.target.value)}
                            readOnly
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
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('vehicleSection', e.target.value)}
                        >
                            <option value="">Select Service Section</option>
                            <option value="Service Center">Service Center</option>
                            <option value="Body Shopes">Body Shopes</option>
                            <option value="ShowRooms">ShowRooms</option>

                        </select>
                    </div>
                    <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="customerName" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Customer Name</label>
                        <input
                            id="customerName"
                            type="text"
                            name="customerName"
                            className="form-input flex-1"
                            placeholder="Enter Customer Name"
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('customerName', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center" style={{ marginBottom: '1rem' }}>
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('phoneNumber', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="vehicleNumber" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Vehicle Number</label>
                        <input
                            id="vehicleNumber"
                            type="text"
                            name="vehicleNumber"
                            className="form-input flex-1"
                            placeholder="Enter Vehicle Number"
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('vehicleNumber', e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="comments" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Comments</label>
                        <textarea
                            id="comments"
                            name="comments"
                            className="form-textarea flex-1"
                            placeholder="Enter Comments"
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
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('comments', e.target.value)}
                        />
                    </div>

                    <div className="mt-4 flex justify-center" style={{ marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                backgroundColor: '#007bff',
                                color: '#fff',
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
// ------------------------------------
