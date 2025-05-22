import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import temporaryImage from "../../assets/images/temporaryimage.png";
import ClassAnalyticsChart from "../elements/ClassAnalyticsChart";
import CreateClass from "../elements/CreateClass";
import { useEffect } from "react";
import { supabase } from "../../helper/Supabase";
import { userContext } from "../../App";

const ClassManagementPage = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [classes, setClasses] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const handleArchive = (id) => {
    setClasses(
      classes.map((cls) =>
        cls.id === id ? { ...cls, status: "archived" } : cls
      )
    );
    setMenuVisible(null);
    setActiveTab("archived");
  };

  const handleDelete = () => {
    setClasses(classes.filter((cls) => cls.id !== classToDelete));
    setDeleteModalVisible(false);
    setMenuVisible(null);
  };

  const saveNewClass = (newClassData) => {
    const newClass = {
      id: classes.length + 1,
      title: newClassData.title || "Untitled Class",
      desc: newClassData.desc || "No description available",
      status: "active",
      image: newClassData.image || "",
    };
    setClasses([...classes, newClass]);
    setCreateModalVisible(false);
  };

  const filteredClasses = classes.filter((cls) => cls.is_active === true);

  useEffect(() => {
    fetchData();

    const listenTblClass = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_class" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tbl_class")
      .select("*")
      .eq("created_by", user.user_id);

    if (error) {
      console.log("Failed to fetch data:", error);
      return;
    }
    setClasses(data);
  };

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
            <p className="text-gray-600">
              Organize class schedules, assignments, and analytics in one place.
            </p>
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
              onClick={() => setCreateModalVisible(true)}
            >
              Create
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="relative flex items-center bg-yellow-300 rounded-lg p-3 h-30 transition duration-300 ease-in-out hover:from-yellow-500 hover:to-yellow-300"
              >
                <div
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => {
                    console.log("Navigating to class:", cls.id);
                    navigate(`/dashboard/class`, { state: cls });
                  }}
                >
                  <img
                    src={
                      cls.image ||
                      temporaryImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Class"
                    className="w-25 h-15 bg-gray-300 rounded-md object-cover"
                  />
                  <div className="ml-4">
                    <strong>{cls.class_name}</strong>
                    {/* <p className="text-sm text-gray-600">{cls.desc}</p> */}
                  </div>
                </div>
                <div className="relative">
                  <button
                    className="text-gray-600 hover:text-black ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuVisible(menuVisible === cls.id ? null : cls.id);
                    }}
                  >
                    ⋮
                  </button>
                  {menuVisible === cls.id && (
                    <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(cls.id);
                        }}
                      >
                        Archive
                      </button>
                      <button
                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClassToDelete(cls.id);
                          setDeleteModalVisible(true);
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

        <div className="w-1/3 mt-30">
          <ClassAnalyticsChart classes={classes} />
        </div>

        {createModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <CreateClass
                onSave={saveNewClass}
                onCancel={() => setCreateModalVisible(false)}
              />
            </div>
          </div>
        )}

        {deleteModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this class?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
                  onClick={() => setDeleteModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ClassManagementPage;
