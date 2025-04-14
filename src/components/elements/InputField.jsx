import React from "react";

const InputField = ({ fields = [], onChange, errors, formData }) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {fields.map(({ id, label, type = "text", options = [], placeholder, className }, index) => (
        <div key={index} className={`relative w-full ${className}`}>
          {/* Handling Input Types */}
          {type === "select" ? (
            <select
              id={id}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              onChange={(e) => onChange(id, e.target.value)}
              value={formData[id] || ""}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === "checkbox" ? (
            <div className="flex items-center space-x-2 border border-gray-400 rounded-md p-2">
              <input
                type="checkbox"
                id={id}
                className="w-4 h-4 text-gray-600 focus:ring-gray-600"
                checked={formData[id] || false}
                onChange={(e) => onChange(id, e.target.checked)}
              />
              <label htmlFor={id} className="text-gray-600 flex items-center">
                {placeholder} {/* Original placeholder */}
                <span className="ml-2 text-xs  text-grey">Randomized Question</span> {/* Added "Randomized Question" */}
              </label>
            </div>
          ) : type === "textarea" ? (
            <textarea
              id={id}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 h-32 resize-none peer"
              placeholder=" "
              value={formData[id] || ""}
              onChange={(e) => onChange(id, e.target.value)}
            ></textarea>
          ) : type === "date" ? (
            <input
              type="date"
              id={id}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={formData[id] || ""}
              onChange={(e) => onChange(id, e.target.value)}
            />
          ) : (
            <input
              type={type}
              id={id}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={formData[id] || ""}
              onChange={(e) => onChange(id, e.target.value)}
            />
          )}

          {/* Floating Label */}
          {type !== "checkbox" && (
            <label
              htmlFor={id}
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              {label}
            </label>
          )}

          {/* Show error message */}
          {errors[id] && (
            <span className="text-red-500 text-xs">{errors[id]}</span>
          )}
        </div>
      ))}

      {/* ✅ Full-width <hr> spanning all columns */}
      <hr className="col-span-3 w-full border-gray-400 mb-6" />
    </div>
  );
};

export default InputField;