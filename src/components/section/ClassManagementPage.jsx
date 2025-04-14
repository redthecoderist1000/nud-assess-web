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
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: null, title: "", image: "" });
  const [createModal, setCreateModal] = useState(false);
  const [newClassData, setNewClassData] = useState({
    title: "",
    image: "",
    code: "",
    section: "",
  });
  const [studentCode, setStudentCode] = useState("");

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 8;
    let result = "";
    for (let i = 0; i < codeLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerateStudentCode = () => {
    const randomCode = generateRandomCode();
    setStudentCode(randomCode);
  };

  const handleArchive = (id) => {
    setClasses(classes.map((cls) => (cls.id === id ? { ...cls, status: "archived" } : cls)));
    setMenuVisible(null);
  };

  const handleRecover = (id) => {
    setClasses(classes.map((cls) => (cls.id === id ? { ...cls, status: "active" } : cls)));
    setMenuVisible(null);
  };

  const handleDelete = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id));
    setMenuVisible(null);
  };

  const handleEdit = (cls) => {
    setEditData(cls);
    setEditModal(true);
    setMenuVisible(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = () => {
    setClasses(classes.map((cls) => (cls.id === editData.id ? editData : cls)));
    setEditModal(false);
  };

  const filteredClasses = classes.filter((cls) => cls.status === activeTab);

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex gap-5 p-5"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
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
                className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-lg p-3 h-30 transition duration-300 ease-in-out hover:from-yellow-500 hover:to-yellow-300 cursor-pointer"
                onClick={() => navigate(`/class/${cls.id}`)}
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
                <div className="relative cursor-pointer text-xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuVisible(menuVisible === cls.id ? null : cls.id);
                    }}
                    className="transform transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    ⋮
                  </button>
                  {menuVisible === cls.id && (
                    <div className="absolute right-0 top-0 w-32 bg-white shadow-lg rounded-lg z-50">
                      {cls.status === "active" ? (
                        <>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(cls);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(cls.id);
                            }}
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecover(cls.id);
                            }}
                          >
                            Recover
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(cls.id);
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <ClassAnalyticsChart />
        </div>

        <AnimatePresence>
          {editModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-3">Edit Class</h2>
                <input
                  type="text"
                  className="border p-2 w-full mb-3 rounded-lg"
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
                <label className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer inline-block mb-3 w-full">
                  Select Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <div className="flex justify-between gap-2">
                  <button onClick={saveEdit} className="bg-[#35408E] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                    Save
                  </button>
                  <button onClick={() => setEditModal(false)} className="bg-[#C83B4F] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {createModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
                <h2 className="text-xl font-bold mb-4">Create Class</h2>
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold">Class code</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded-lg"
                    value={newClassData.code || ""}
                    onChange={(e) => setNewClassData({ ...newClassData, code: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold">Class name</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded-lg"
                    value={newClassData.title || ""}
                    onChange={(e) => setNewClassData({ ...newClassData, title: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold">Section</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded-lg"
                    value={newClassData.section || ""}
                    onChange={(e) => setNewClassData({ ...newClassData, section: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">Display picture</label>
                  <label className="border-dashed border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setNewClassData({ ...newClassData, image: URL.createObjectURL(e.target.files[0]) })}
                    />
                    <span className="text-blue-500 cursor-pointer">Click here</span> to upload your file
                  </label>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Add student/s</h3>
                  <div className="flex items-center justify-between gap-4 mt-3">
                    <div className="w-1/2">
                      <label className="block text-gray-700 text-sm mb-1">Generate code to add students</label>
                      <input type="text" className="border p-2 w-full rounded-lg" value={studentCode || ""} readOnly />
                      <button
                        className="bg-[#35408E] text-white w-full mt-2 py-2 rounded-lg hover:scale-105 transition-transform"
                        onClick={handleGenerateStudentCode}
                      >
                        Generate
                      </button>
                    </div>
                    <div className="border-l h-16"></div>
                    <div className="w-1/2">
                      <label className="block text-gray-700 text-sm mb-1">Search student to add in class</label>
                      <input type="text" className="border p-2 w-full rounded-lg" />
                      <button className="bg-[#35408E] text-white w-full mt-2 py-2 rounded-lg hover:scale-105 transition-transform">
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                <hr />
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setCreateModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg w-1/2 mr-2 hover:scale-105 transition-transform"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNewClass}
                    className="bg-[#35408E] text-white px-4 py-2 rounded-lg w-1/2 hover:scale-105 transition-transform"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClassManagementPage;
