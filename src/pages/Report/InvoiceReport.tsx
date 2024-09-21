import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconDownload';
import IconPlus from '../../components/Icon/IconPlus';

const InvoiceReport: React.FC = () => {
  const location = useLocation();
  const { bookings } = location.state || { bookings: [] };
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Generate Invoice Number
  const generateInvoiceNumber = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);

    return `INV-${year}${month}${day}-${hours}${minutes}${seconds}`;
  };

  // Handle Print
  const handlePrint = () => {
    const printContent = invoiceRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  // Handle Download as PDF
  const handleDownload = async () => {
    const invoiceContent = invoiceRef.current;
    if (invoiceContent) {
      const canvas = await html2canvas(invoiceContent);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${generateInvoiceNumber()}.pdf`);
    }
  };

  // Calculate total amount
  const totalAmount = bookings.reduce((sum, booking) => sum + parseFloat(booking.amount), 0);
  
  // Define columns
  const columns = [
    { key: 'id', label: 'S.NO' },
    { key: 'dateTime', label: 'Date and Time' },
    { key: 'fileNumber', label: 'File Number', class: 'text-center' },
    { key: 'totalDriverSalary', label: 'Salary', class: 'text-center' },
    { key: 'transferedSalary', label: 'Amount Transferred', class: 'text-center' },
    { key: 'balanceSalary', label: 'Balance', class: 'text-center' },
  ];

  return (
    <div>
      <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
        <button type="button" className="btn btn-info gap-2">
          <IconSend />
          Send Invoice
        </button>

        <button type="button" className="btn btn-primary gap-2" onClick={handlePrint}>
          <IconPrinter />
          Print
        </button>

        <button type="button" className="btn btn-success gap-2" onClick={handleDownload}>
          <IconDownload />
          Download
        </button>

        <Link to="/apps/invoice/add" className="btn btn-secondary gap-2">
          <IconPlus />
          Create
        </Link>
      </div>

      <div className="panel" ref={invoiceRef}>
        <div className="flex justify-between flex-wrap gap-4 px-4">
          <div className="text-2xl font-semibold uppercase">Invoice</div>
          <div className="shrink-0">
            <img
              src="/assets/images/auth/rsa-png.png"
              alt="img"
              className="w-24 ltr:ml-auto rtl:mr-auto"
            />
          </div>
        </div>
        <div className="ltr:text-right rtl:text-left px-4">
          <div className="space-y-1 mt-6 text-white-dark">
            <div>perinthalmanna Road, kerala, 33884, India</div>
            <div>rsa@gmail.com</div>
            <div>+91 9817100100</div>
          </div>
        </div>
        <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
        <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap">
          <div className="flex-1">
            <div className="space-y-1 text-white-dark">
              <div>Issue For:</div>
              <div className="text-black dark:text-white font-semibold">{bookings[0]?.showroomLocation || 'N/A'}</div>
              {/* Additional details can be added here */}
            </div>
          </div>
          <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
            <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Invoice :</div>
                <div>{generateInvoiceNumber()}</div> {/* Display generated invoice number */}
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Issue Date :</div>
                <div>{new Date().toLocaleDateString()}</div>
              </div>
              <div className="flex items-center w-full justify-between mb-2">
                <div className="text-white-dark">Order ID :</div>
                <div>{bookings[0]?.fileNumber || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-6">
          <table className="table-striped">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className={column.class}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                       {/* id: booking.id,
        dateTime: booking.dateTime,
        vehicleSection: booking.vehicleSection,
        vehicleModel: booking.vehicleModel,
        insuranceAmountBody: booking.insuranceAmountBody,
        amount: booking.amount,
        updatedTotalSalary: booking.updatedTotalSalary, */}
                  <td>{index + 1}</td>
                  <td>{booking.dateTime}</td>
                  <td className="text-center">{booking.fileNumber}</td>
                  <td className="text-center">{booking.totalDriverSalary}</td>
                  <td className="text-center">{booking.transferedSalary}</td>
                  <td className="text-center">{booking.updatedTotalSalary}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-4 py-2 text-right font-bold" colSpan={5}>Total Amount</td>
                <td className="px-4 py-2 font-bold">{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReport;
