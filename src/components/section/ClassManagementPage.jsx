import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import temporaryImage from "../../assets/images/temporaryimage.png";
import ClassAnalyticsChart from "../elements/ClassAnalyticsChart";

const ClassManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [classes, setClasses] = useState([
    { id: 1, title: "CCTAPDVL - INF221", desc: "Introduction to Programming", status: "active", image: "" },
    { id: 2, title: "CCTAPDVL - INF222", desc: "Data Structures", status: "active", image: "" },
    { id: 3, title: "CCTAPDVL - INF223", desc: "Web Development", status: "active", image: "" },
  ]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [newClassData, setNewClassData] = useState({
    title: "",
    image: "",
    code: "",
    section: "",
  });

  const handleArchive = (id) => {
    setClasses(classes.map((cls) => (cls.id === id ? { ...cls, status: "archived" } : cls)));
    setMenuVisible(null);
  };

  const handleDelete = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id));
    setMenuVisible(null);
  };

  const saveNewClass = () => {
    const newClass = {
      id: classes.length + 1,
      title: newClassData.title || "Untitled Class",
      desc: newClassData.desc || "No description available",
      status: "active",
      image: newClassData.image || "",
    };
    setClasses([...classes, newClass]);
    setNewClassData({ title: "", image: "", code: "", section: "" });
    setCreateModal(false);
  };

  const filteredClasses = classes.filter((cls) => cls.status === activeTab);

  return (
    <AnimatePresence>
      <motion.div
        className="flex gap-5 p-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-7/10 p-5 rounded-lg">
          <div className="mb-6">
            <h1 className="text-5xl font-semibold mb-2">Class Management</h1>
            <p className="text-gray-600">Organize class schedules, assignments, and analytics in one place.</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <span
                className={`cursor-pointer font-bold ${activeTab === "active" ? "text-yellow-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </span>
              <span
                className={`cursor-pointer font-bold ${activeTab === "archived" ? "text-yellow-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("archived")}
              >
                Archive
              </span>
            </div>
            <button
              className="bg-[#35408E] text-white px-4 py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
              onClick={() => setCreateModal(true)}
            >
              Create
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="relative flex items-center bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-lg p-3 h-30 transition duration-300 ease-in-out hover:from-yellow-500 hover:to-yellow-300 cursor-pointer"
                onClick={() => navigate(`/class/${cls.id}`, { state: cls })}
              >
                <img
                  src={cls.image || temporaryImage || "https://via.placeholder.com/150"}
                  alt="Class"
                  className="w-25 h-15 bg-gray-300 rounded-md object-cover"
                />
                <div className="ml-4 flex-1">
                  <strong>{cls.title}</strong>
                  <p className="text-sm text-gray-600">{cls.desc}</p>
                </div>
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuVisible(menuVisible === cls.id ? null : cls.id);
                    }}
                  >
                    ⋮
                  </button>
                  {menuVisible === cls.id && (
                    <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg z-50">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(cls.id);
                        }}
                      >
                        Archive
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cls.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Align Class Analytics */}
        <div className="w-1/3 mt-30">
          <ClassAnalyticsChart classes={classes} />
        </div>
      </motion.div>

      {/* Create Class Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create Class</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Class Code</label>
              <input
                type="text"
                value={newClassData.code}
                onChange={(e) => setNewClassData({ ...newClassData, code: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter class code"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Class Name</label>
              <input
                type="text"
                value={newClassData.title}
                onChange={(e) => setNewClassData({ ...newClassData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter class name"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Section</label>
              <input
                type="text"
                value={newClassData.section}
                onChange={(e) => setNewClassData({ ...newClassData, section: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter section"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Display Picture</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewClassData({ ...newClassData, image: event.target.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {newClassData.image && (
                <img
                  src={newClassData.image}
                  alt="Preview"
                  className="mt-2 w-32 h-20 object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800"
                onClick={saveNewClass}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClassManagementPage;