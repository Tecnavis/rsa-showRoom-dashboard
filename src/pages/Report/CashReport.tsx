import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  dateTime: string;
  vehicleSection: string;
  vehicleModel: string;
  showroomLocation: string;
  fileNumber: string;
  insuranceAmountBody: number;
  amount: string;
  updatedTotalSalary: number;
  createdAt: Timestamp;
  showroomAmount: number;
  balanceshowroom: number;
  paidToRSA: boolean;
  status: string;
  approveStatus: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CashReport: React.FC = () => {
  const showroomId = localStorage.getItem('showroomId');
  const uid = import.meta.env.VITE_REACT_APP_UID;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [viewFilter, setViewFilter] = useState<'monthly' | 'yearly' | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [monthlyTotalAmount, setMonthlyTotalAmount] = useState<number>(0);
  const navigate = useNavigate();
  const [balanceMonthlyTotal, setBalanceMonthlyTotal] = useState<number>(0);
  const [balanceTotal, setBalanceTotal] = useState<number>(0);

  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const statusConditions = [
          'booking added', 'Contacted Customer', 'Vehicle Picked',
          'Vehicle Confirmed', 'To DropOff Location', 'Vehicle dropoff', 'Order Completed'
        ];

        const q = query(
          collection(db, `user/${uid}/bookings`),
          where('showroomId', '==', showroomId),
          where('status', 'in', statusConditions)
        );

        const querySnapshot = await getDocs(q);
        const bookingsData: Booking[] = [];

        querySnapshot.forEach((doc) => {
          const booking = doc.data() as Omit<Booking, 'id'>;
          bookingsData.push({
            id: doc.id,
            ...booking,
          });
        });

        const now = new Date();
        const filteredBookings = bookingsData.filter(booking => {
          const bookingDate = booking.createdAt.toDate();
          if (viewFilter === 'monthly') {
            if (selectedMonth === null) return false;
            return bookingDate.getFullYear() === now.getFullYear() && bookingDate.getMonth() === selectedMonth;
          } else if (viewFilter === 'yearly') {
            return bookingDate.getFullYear() === now.getFullYear();
          } else {
            return true;
          }
        });

        const sortedBookingsData = filteredBookings.slice().sort((a, b) => {
          const dateA = a.createdAt.toDate();
          const dateB = b.createdAt.toDate();
          return dateB.getTime() - dateA.getTime();
        });

          // Calculate total and monthly sums (ensure values are treated as numbers and NaN is handled as 0)
const total = bookingsData.reduce((sum, booking) => 
  sum + (Number(booking.insuranceAmountBody) || 0) + (Number(booking.showroomAmount) || 0), 0);

const monthlyTotal = sortedBookingsData.reduce((sum, booking) => 
  sum + (Number(booking.balanceshowroom) || 0) + (Number(booking.showroomAmount) || 0), 0);

const balanceTotal = bookingsData.reduce((sum, booking) => 
  sum + (Number(booking.balanceshowroom) || 0), 0);

const balanceMonthlyTotal = sortedBookingsData.reduce((sum, booking) => 
  sum + (Number(booking.balanceshowroom) || 0), 0);

setBalanceTotal(balanceTotal);
setBalanceMonthlyTotal(balanceMonthlyTotal);

setTotalAmount(total);
setMonthlyTotalAmount(monthlyTotal);
setBookings(sortedBookingsData);

         } catch (error) {
           console.error('Error fetching bookings:', error);
         }
       };

    if (showroomId) {
      fetchBookings();
    } else {
      console.error('showroomId is not available');
    }
  }, [showroomId, uid, viewFilter, selectedMonth]);

  const formatDateTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  return (
    <div className="p-8 overflow-x-auto">
      <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">Cash Report</h2>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
  <button
    onClick={() => setViewFilter('monthly')}
    className={`px-6 py-3 ${viewFilter === 'monthly' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105`}
  >
    Monthly View
  </button>
  <button
    onClick={() => setViewFilter('yearly')}
    className={`ml-2 px-6 py-3 ${viewFilter === 'yearly' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105`}
  >
    Yearly View
  </button>
  <button
    onClick={() => setViewFilter('all')}
    className={`ml-2 px-6 py-3 ${viewFilter === 'all' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105`}
  >
    All
  </button>
</div>
{viewFilter === 'monthly' && (
  <div className="mb-6 flex flex-wrap justify-center gap-2">
    {months.map((month, index) => (
      <button
        key={index}
        onClick={() => setSelectedMonth(index)}
        className={`px-6 py-3 ${selectedMonth === index ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105`}
      >
        {month}
      </button>
    ))}
    <button
      onClick={() => setSelectedMonth(null)}
      className={`ml-2 px-6 py-3 ${selectedMonth === null ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105`}
    >
      All Months
    </button>
  </div>
)}
<thead className="bg-gray-50 border-b border-gray-200">
  <tr className="bg-gray-100">
  <td colSpan={5} className="text-right px-6 py-3 font-medium text-gray-600">
  {selectedMonth !== null ? `Monthly Total (${months[selectedMonth]}):` : "Monthly Total:"}
</td>
<td colSpan={5} className="text-left px-6 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg shadow-sm">
  {monthlyTotalAmount.toFixed(2)}
</td>
  </tr>
 
  <tr className="bg-gray-100">
 <td colSpan={5} className="text-right px-6 py-3 font-medium text-gray-600">
  {selectedMonth !== null ? `Monthly Total Balance (${months[selectedMonth]}):` : "Monthly Total Balance:"}
</td>
    <td colSpan={5} className="text-left px-6 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg shadow-sm">
      {balanceMonthlyTotal.toFixed(2)}
    </td>
  </tr>
  <tr className="bg-gray-100">
    <td colSpan={5} className="text-right px-6 py-3 font-medium text-gray-600">Whole Total:</td>
    <td colSpan={5} className="text-left px-6 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg shadow-sm">
      {totalAmount.toFixed(2)}
    </td>
  </tr>
  <tr className="bg-gray-100">
    <td colSpan={5} className="text-right px-6 py-3 font-medium text-gray-600">Whole Total Balance:</td>
    <td colSpan={5} className="text-left px-6 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg shadow-sm">
      {balanceTotal.toFixed(2)}
    </td>
  </tr>
</thead>


      <table className="w-full border-collapse shadow-md table-fixed">
        <thead className="bg-gray-200 border-b-2 border-gray-300">
          <tr>
            <th>SI No</th>
            <th className="px-4 py-2 text-left font-bold">Date</th>
            <th className="px-4 py-2 text-left font-bold">File Number</th>
            <th className="px-4 py-2 text-left font-bold">Vehicle Section</th>
            <th className="px-4 py-2 text-left font-bold">Vehicle Model</th>
            <th className="px-4 py-2 text-left font-bold">Insurance Amount</th>
            <th className="px-4 py-2 text-left font-bold">Showroom Amount</th>
            <th className="px-4 py-2 text-left font-bold">Total Payable Amount</th>
            <th className="px-4 py-2 text-left font-bold">Balance Payable Amount</th>
            <th className="px-4 py-2 text-left font-bold">Paid/UnPaid</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking.id} className="border-b">
              <td>{index + 1}</td>
              <td className="px-4 py-2">{formatDateTime(booking.createdAt)}</td>
              <td className="px-4 py-2">{booking.fileNumber}</td>
              <td className="px-4 py-2">{booking.vehicleSection}</td>
              <td className="px-4 py-2">{booking.vehicleModel}</td>
              <td className="px-4 py-2">
        {isNaN(booking.insuranceAmountBody) ? '0' : booking.insuranceAmountBody}
      </td>          
      <td className="px-4 py-2">
        {isNaN(booking.showroomAmount) ? '0' : booking.showroomAmount}
      </td>              <td className="px-4 py-2">
        {isNaN(booking.insuranceAmountBody) || isNaN(booking.showroomAmount)
          ? '0'
          : Number(booking.insuranceAmountBody) + Number(booking.showroomAmount)}
      </td>
      <td className="px-4 py-2">
        {isNaN(booking.balanceshowroom) ? '0' : booking.balanceshowroom}
      </td>
              <td className="px-4 py-2">
                <span className={`inline-block px-3 py-1 rounded text-white ${booking.approveStatus === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}>{booking.approveStatus === 'Approved' ? 'Paid' : 'Pending'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      


      </table>
    </div>
  );
};

export default CashReport;
