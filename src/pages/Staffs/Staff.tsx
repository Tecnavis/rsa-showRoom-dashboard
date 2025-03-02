import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import IconTrash from "../../components/Icon/IconTrash";
import IconEdit from "../../components/Icon/IconEdit";
import { DocumentReference } from "firebase/firestore";

interface Staff {
  id: string;
  name: string;
  phoneNumber: string;
  designation: string;
  whatsappNumber: string;
}

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState({ name: "", phoneNumber: "", designation: "", whatsappNumber: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const showroomId = localStorage.getItem("showroomId");

  const uid = import.meta.env.VITE_REACT_APP_UID;
  const db = getFirestore();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffCollectionRef = collection(db, `user/${uid}/showroomStaff`);
        const staffSnapshot = await getDocs(staffCollectionRef);
        const staffList: Staff[] = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Staff[];
        setStaff(staffList);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, [uid]);

  const deleteStaffMember = async (id: string) => {
    try {
      setLoading((prev) => ({ ...prev, [id]: true }));

      await deleteDoc(doc(db, `user/${uid}/showroomStaff`, id));

      setStaff((prev) => prev.filter((member) => member.id !== id));
      setConfirmOpen(false);
      setStaffToDelete(null);
    } catch (error) {
      console.error("Error deleting staff member:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const addOrUpdateStaffMember = async () => {
    try {
      if (!newStaff.name || !newStaff.phoneNumber || !newStaff.designation || !newStaff.whatsappNumber) {
        alert("All fields are required");
        return;
      }
      if (!showroomId) {
        alert("Showroom ID is missing.");
        return;
      }
  
      let staffDocRef: DocumentReference;
  
      if (selectedStaff) {
        // Updating existing staff member
        staffDocRef = doc(db, `user/${uid}/showroomStaff`, selectedStaff.id);
      } else {
        // Adding new staff member with auto-generated ID
        staffDocRef = doc(collection(db, `user/${uid}/showroomStaff`));
      }
  
      await setDoc(
        staffDocRef,
        { ...newStaff, showroomId }, // Include showroomId
        { merge: true }
      );  
      setStaff((prev) => {
        if (selectedStaff) {
          // Update the existing staff member in the state
          return prev.map((member) =>
            member.id === selectedStaff.id ? { ...newStaff, showroomId, id: selectedStaff.id } : member
          );
        } else {
          // Add new staff member to the state
          return [...prev, { ...newStaff, showroomId, id: staffDocRef.id }];
        }
      });
  
      setIsOpen(false);
      setNewStaff({ name: "", phoneNumber: "", designation: "", whatsappNumber: "" });
      setSelectedStaff(null);
    } catch (error) {
      console.error("Error adding/updating staff member:", error);
    }
  };
  
  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Staff Members</h2>

      <button
        onClick={() => {
          setIsOpen(true);
          setSelectedStaff(null);
        }}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        + Add Staff
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left border-b">Name</th>
              <th className="py-3 px-4 text-left border-b">Phone</th>
              <th className="py-3 px-4 text-left border-b">Designation</th>
              <th className="py-3 px-4 text-left border-b">WhatsApp</th>
              <th className="py-3 px-4 text-center border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">{member.name}</td>
              <td className="py-3 px-4">{member.phoneNumber}</td>
              <td className="py-3 px-4">{member.designation}</td>
              <td className="py-3 px-4">{member.whatsappNumber}</td>
              <td className="py-3 px-4 text-center space-x-2">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedStaff(member);
                    setNewStaff(member);
                  }}
                  className="px-4 py-2 bg-gray-200 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all"
                >
<IconEdit/>                </button>
                {loading[member.id] ? (
                  <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setStaffToDelete(member.id);
                      setConfirmOpen(true);
                    }}
                    className="px-4 py-2 bg-gray-200 text-red-500 rounded-lg hover:bg-red-200 transition-all"
                  >
<IconTrash/>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {confirmOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete this staff member?</p>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => staffToDelete && deleteStaffMember(staffToDelete)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
            ✖
          </button>

          <h3 className="text-xl font-semibold mb-4">{selectedStaff ? "Update Staff" : "Add Staff"}</h3>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded mb-2"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 border rounded mb-2"
            value={newStaff.phoneNumber}
            onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
            />
                <input
        type="text"
        placeholder="Designation"
        className="w-full p-2 border rounded mb-2"
        value={newStaff.designation}
        onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
      />
      <input
        type="text"
        placeholder="WhatsApp Number"
        className="w-full p-2 border rounded mb-2"
        value={newStaff.whatsappNumber}
        onChange={(e) => setNewStaff({ ...newStaff, whatsappNumber: e.target.value })}
      />

          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={addOrUpdateStaffMember}>
            {selectedStaff ? "Update" : "Add"}
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
