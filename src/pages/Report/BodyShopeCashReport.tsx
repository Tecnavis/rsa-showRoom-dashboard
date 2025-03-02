
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layouts/Header';
import '../ShowRooms/ShowRm.css';

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



const BodyShopeCashReport: React.FC = () => {
  const showroomId = localStorage.getItem('showroomId');
  const uid = import.meta.env.VITE_REACT_APP_UID;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [viewFilter, setViewFilter] = useState<"monthly" | "yearly" | "all">(
    "monthly"
  );
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [insuranceFilter, setInsuranceFilter] = useState<"all" | "insured" | "non-insured">("all");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];  
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [monthlyTotalAmount, setMonthlyTotalAmount] = useState<number>(0);
  const navigate = useNavigate();
  const [balanceMonthlyTotal, setBalanceMonthlyTotal] = useState<number>(0);
  const [balanceTotal, setBalanceTotal] = useState<number>(0);

  const cardColors = [
    "bg-gradient-to-r from-green-400 to-green-600 text-white",
    "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
    "bg-gradient-to-r from-purple-400 to-purple-600 text-white",
    "bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900",
  ];
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, `user/${uid}/bookings`),
          where('serviceCategory', '==', 'Body Shop'),
          where('showroomId', '==', showroomId),
          where('status', '==', 'Order Completed')
        );
  
        const querySnapshot = await getDocs(q);
        const bookingsData: Booking[] = [];
  
        querySnapshot.forEach((doc) => {
          const booking = doc.data() as Omit<Booking, 'id'>;
          bookingsData.push({ id: doc.id, ...booking });
        });
  
        const now = new Date();
        const filteredBookings = bookingsData.filter(booking => {
          const bookingDate = booking.createdAt.toDate();
  
          // Filter by selected date range
          const isDateMatch =
            viewFilter === "monthly"
              ? bookingDate.getFullYear() === now.getFullYear() && bookingDate.getMonth() === selectedMonth
              : viewFilter === "yearly"
              ? bookingDate.getFullYear() === now.getFullYear()
              : true;
  
          // Filter by insurance
          const isInsuranceMatch =
            insuranceFilter === "insured"
              ? booking.insuranceAmountBody > 0
              : insuranceFilter === "non-insured"
              ? booking.insuranceAmountBody === 0
              : true;
  
          return isDateMatch && isInsuranceMatch;
        });
  
        // Sort by date (newest first)
        const sortedBookingsData = [...filteredBookings].sort(
          (a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        );
  
        // Calculate totals
        const total = bookingsData.reduce((sum, booking) =>
          sum + (Number(booking.insuranceAmountBody) || 0) + (Number(booking.showroomAmount) || 0), 0);
  
        const monthlyTotal = bookingsData
        .filter(booking => {
          const bookingDate = booking.createdAt.toDate();
          return bookingDate.getFullYear() === new Date().getFullYear() &&
                 bookingDate.getMonth() === selectedMonth;
        })
        .reduce((sum, booking) =>
          sum + (Number(booking.balanceshowroom) || 0) + (Number(booking.showroomAmount) || 0), 0);
      
        const balanceTotal = bookingsData.reduce((sum, booking) =>
          sum + (Number(booking.balanceshowroom) || 0), 0);
  
        const balanceMonthlyTotal = sortedBookingsData.reduce((sum, booking) =>
          sum + (Number(booking.balanceshowroom) || 0), 0);
  
        // Update state
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
  }, [showroomId, uid, viewFilter, selectedMonth, insuranceFilter]); // Added `insuranceFilter` dependency
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString("en-GB", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit",
        hour12: true 
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
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
       

    <div className="w-full">
   <h2 className="text-center uppercase text-4xl font-extrabold text-gray-900 p-6 shadow-2xl rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 border border-gray-400 tracking-widest">
  Cash Report
</h2>

{/* Insurance Filter Tabs */}
<div className="flex justify-center border-b border-gray-300 mb-6">
  {["all", "insured", "non-insured"].map((filter) => (
    <div
      key={filter}
      onClick={() => setInsuranceFilter(filter as any)}
      className={`cursor-pointer px-6 py-3 text-lg font-semibold transition-all duration-300 
        ${
          insuranceFilter === filter
            ? "border-b-4 border-green-500 text-green-700 font-bold"
            : "text-gray-600 hover:text-gray-900 hover:border-b-4 hover:border-gray-400"
        }`}
    >
      {filter === "all" ? "Whole Report" : filter === "insured" ? "Insured Report" : "Non-Insured Report"}
    </div>
  ))}
</div>

{/* Tabs for Monthly, Yearly, All */}
<div className="flex justify-center border-b border-gray-300 mb-6">
  {["monthly", "yearly", "all"].map((filter) => (
    <div
      key={filter}
      onClick={() => setViewFilter(filter as any)}
      className={`cursor-pointer px-6 py-3 text-lg font-semibold transition-all duration-300 
        ${
          viewFilter === filter
            ? "border-b-4 border-blue-500 text-blue-700 font-bold"
            : "text-gray-600 hover:text-gray-900 hover:border-b-4 hover:border-gray-400"
        }`}
    >
      {filter.charAt(0).toUpperCase() + filter.slice(1)} View
    </div>
  ))}
</div>

{/* Monthly Tabs */}
{viewFilter === "monthly" && (
  <div className="flex justify-center my-6">
    <div className="relative w-64">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
        className="w-full px-4 py-3 text-md font-semibold rounded-lg border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:shadow-lg"
      >
        {months.map((month, index) => (
          <option key={index} value={index} className="text-lg">
            {month}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
)}



{/* Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-6">
  {[
    {
      label: selectedMonth !== null ? `Monthly Total (${months[selectedMonth]}):` : "Monthly Total:",
      value: monthlyTotalAmount.toFixed(2),
      gradient: "bg-gradient-to-r from-green-300 to-green-500 text-gray-900",
    },
    {
      label: selectedMonth !== null ? `Monthly Balance (${months[selectedMonth]}):` : "Monthly Total Balance:",
      value: balanceMonthlyTotal.toFixed(2),
      gradient: "bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900",
    },
    { label: "Whole Total:", value: totalAmount.toFixed(2), gradient: "bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900" },
    { label: "Whole Balance:", value: balanceTotal.toFixed(2), gradient: "bg-gradient-to-r from-purple-300 to-purple-500 text-gray-900" },
  ].map((item, index) => (
    <div
      key={index}
      className={`shadow-2xl rounded-2xl p-6 border transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${item.gradient}`}
    >
      <h3 className="text-lg font-semibold tracking-wide">{item.label}</h3>
      <p className="text-4xl font-extrabold mt-2">{item.value}</p>
    </div>
  ))}
</div>


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

export default BodyShopeCashReport;