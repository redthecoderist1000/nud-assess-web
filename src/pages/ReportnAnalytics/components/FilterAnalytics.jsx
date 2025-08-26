import React, { useState, useEffect } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import SummarizeIcon from "@mui/icons-material/Summarize";

const defaultClassOptions = ["BSIT 3A", "BSIT 3B", "BSIT 4A"];
const defaultDateOptions = ["Last 7 days", "Last 30 days", "This semester"];

const FilterAnalytics = ({ classOptions, dateOptions }) => {
  // Simulate backend fetch with default data
  const [classes, setClasses] = useState(defaultClassOptions);
  const [dates, setDates] = useState(defaultDateOptions);

  useEffect(() => {
    // If backend data is passed, use it
    if (Array.isArray(classOptions) && classOptions.length > 0) {
      setClasses(classOptions);
    }
    if (Array.isArray(dateOptions) && dateOptions.length > 0) {
      setDates(dateOptions);
    }
    // Example: fetch from backend here in future
    // fetch('/api/classes').then(...)
  }, [classOptions, dateOptions]);

  const [classValue, setClassValue] = useState(classes[0]);
  const [dateValue, setDateValue] = useState(dates[1] || dates[0]);

  useEffect(() => {
    setClassValue(classes[0]);
  }, [classes]);
  useEffect(() => {
    setDateValue(dates[1] || dates[0]);
  }, [dates]);

  return (
    <div
      className="flex flex-wrap items-center w-full justify-between mt-4"
      style={{ minHeight: 32, paddingTop: 8 }}
    >
      {/* Left: Description */}
      <span className="text-[14px] text-gray-600 ml-2 mb-2 sm:mb-0">
        Monitor quiz performance and student engagement
      </span>

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Class Dropdown */}
        <Select
          value={classValue}
          onChange={e => setClassValue(e.target.value)}
          size="small"
          className="bg-gray-100 rounded-md"
          variant="outlined"
          disableUnderline
          style={{
            minWidth: 110,
            height: 36,
            fontSize: 14,
            marginLeft: 4,
            marginRight: 4,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          {classes.map(option => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>

        {/* Date Dropdown */}
        <Select
          value={dateValue}
          onChange={e => setDateValue(e.target.value)}
          size="small"
          className="bg-gray-100 rounded-md"
          variant="outlined"
          disableUnderline
          style={{
            minWidth: 110,
            height: 36,
            fontSize: 14,
            marginLeft: 4,
            marginRight: 4,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          {dates.map(option => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>

        {/* CSV Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon style={{ fontSize: 16 }} />}
          className="bg-white text-black border-gray-300"
          style={{
            minWidth: 0,
            padding: "0 16px",
            height: 36,
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 8,
            marginLeft: 4,
            marginRight: 4,
          }}
        >
          CSV
        </Button>

        {/* Word Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<DescriptionIcon style={{ fontSize: 16 }} />}
          className="bg-white text-black border-gray-300"
          style={{
            minWidth: 0,
            padding: "0 16px",
            height: 36,
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 8,
            marginLeft: 4,
            marginRight: 4,
          }}
        >
          Word
        </Button>

        {/* Quick Summary Button */}
        <Button
          variant="contained"
          size="small"
          startIcon={<SummarizeIcon style={{ fontSize: 16 }} />}
          className="whitespace-nowrap"
          style={{
            backgroundColor: "#35408E",
            color: "#fff",
            minWidth: 0,
            padding: "0 20px",
            height: 36,
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            boxShadow: "none",
            marginLeft: 4,
            marginRight: 4,
          }}
        >
          Quick Summary
        </Button>
      </div>
    </div>
  );
};

export default FilterAnalytics;
