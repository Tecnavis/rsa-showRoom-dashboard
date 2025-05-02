import React from "react";
import { useNavigate } from "react-router-dom";

const CashReport = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Service Center",
      bgColor: "bg-gradient-to-r from-blue-200 to-blue-400 backdrop-blur-md bg-opacity-30",
      btnColor: "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105",
      path: "/serviceCashreport",
    },
    {
      title: "Body Shop",
      bgColor: "bg-gradient-to-r from-green-200 to-green-400 backdrop-blur-md bg-opacity-30",
      btnColor: "bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105",
      path: "/bodyShopeCashreport",
    },
    {
      title: "Showroom",
      bgColor: "bg-gradient-to-r from-purple-200 to-purple-400 backdrop-blur-md bg-opacity-30",
      btnColor: "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:scale-105",
      path: "/showroomCashreport",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header with Animation */}
      <h2 className="text-center uppercase text-4xl font-extrabold text-gray-900 p-6 shadow-xl rounded-xl bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-400 tracking-wider animate-fade-in">
        Showroom Report
      </h2>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`p-8 ${section.bgColor} shadow-lg rounded-xl border border-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
          >
            <h3 className="text-2xl font-bold text-gray-800">{section.title}</h3>
            <button
              onClick={() => navigate(section.path)}
              className={`mt-6 px-5 py-3 text-white text-lg font-semibold rounded-lg transition-all duration-300 ${section.btnColor} shadow-md`}
            >
              Cash Collection Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashReport;
