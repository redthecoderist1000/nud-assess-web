import React, { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { supabase } from "../../helper/Supabase";
import { userContext } from "../../App";

const CreateClass = ({ onSave, onCancel }) => {
  // const { user } = useContext(userContext);
  const { user } = useContext(userContext);

  const [classData, setClassData] = useState({
    class_name: "",
    desc: "",
    created_by: user.user_id,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   setClassData({ ...classData, image: file });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let r = (Math.random() + 1).toString(36).substring(2, 9);

    const { data, error } = await supabase
      .from("tbl_class")
      .insert({ ...classData, join_code: r })
      .select("*")
      .single();

    if (error) {
      console.log("Failed to create class:", error);
      setLoading(false);
      onCancel();
      return;
    }

    setLoading(false);
    onCancel();
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Create Class</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name_input"
          >
            Class Name
          </label>
          <input
            type="text"
            id="name_input"
            name="class_name"
            value={classData.name}
            onChange={handleInputChange}
            placeholder="Enter class name (Introduction to Computing)"
            className="mt-1 p-2 block w-full h-10 border-gray-300 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="desc_input"
          >
            Description <i>(optional)</i>
          </label>
          <input
            id="desc_input"
            type="text"
            name="desc"
            value={classData.desc}
            onChange={handleInputChange}
            placeholder="Enter description...."
            className="mt-1 p-2 block w-full h-10 border-gray-300 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {/* <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Display Picture (Optional)
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {classData.image && (
          <p className="mt-2 text-sm text-gray-500">
            Selected file: {classData.image.name}
          </p>
        )}
      </div> */}
        <div
          className={loading ? "flex justify-center" : "flex justify-between"}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <button
                onClick={onCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                // onClick={handleSubmit}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default CreateClass;
