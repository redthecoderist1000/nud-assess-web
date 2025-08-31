import React, { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";

const CreateClass = ({ onCancel }) => {
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
    setClassData({ ...classData, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // check if existing anme
    const { data: nameCheck, error: checkError } = await supabase
      .from("tbl_class")
      .select("class_name")
      .eq("created_by", user.user_id)
      .like("class_name", classData.class_name + "%");
    if (checkError) {
      console.log("Failed to check name");
      setLoading(false);
      return;
    }

    const baseName = classData.class_name;
    const pattern = new RegExp(`^${baseName}(?: \\(\\d+\\))?$`);

    const filtered = nameCheck
      .map((item) => item.class_name)
      .filter((name) => pattern.test(name));

    const name =
      filtered.length > 0 ? getNextAvailableName(baseName, filtered) : baseName;

    const { data, error } = await supabase
      .from("tbl_class")
      .insert([{ ...classData, class_name: name }]);

    if (error) {
      console.log("Failed to create class");
      setLoading(false);
      return;
    }

    setLoading(false);
    onCancel();
  };

  function getNextAvailableName(baseName, existingNames) {
    const usedNumbers = new Set();

    existingNames.forEach((name) => {
      const match = name.match(new RegExp(`^${baseName}(?:\\((\\d+)\\))?$`));
      if (match) {
        const num = match[1] ? parseInt(match[1]) : 0;
        usedNumbers.add(num);
      }
    });

    // Find the smallest unused number starting from 0
    let nextNum = 0;
    while (usedNumbers.has(nextNum)) {
      nextNum++;
    }

    return nextNum === 0 ? baseName : `${baseName}(${nextNum})`;
  }
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
