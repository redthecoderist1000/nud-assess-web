import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const typeColors = {
  "Multiple Choice": "bg-blue-100 text-blue-700",
  Identification: "bg-purple-100 text-purple-700",
  "T/F": "bg-green-100 text-green-700",
};

const bloomColors = {
  Remembering: "bg-blue-50 text-blue-700",
  Understanding: "bg-teal-50 text-teal-700",
  Applying: "bg-green-50 text-green-700",
  Analyzing: "bg-yellow-50 text-yellow-700",
  Creating: "bg-purple-50 text-purple-700",
  Evaluating: "bg-red-50 text-red-700",
};

const statusColors = (rate) => {
  if (rate >= 80) return "bg-blue-100 text-blue-700"; // too easy
  if (rate >= 60) return "bg-green-100 text-green-700"; // good
  return "bg-red-100 text-red-700"; // needs improvement
};

const successColors = (rate) => {
  if (rate >= 80) return "bg-green-100 text-green-700";
  if (rate >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const QuestionTable = ({ detailed_que_analysis }) => {
  const questions = detailed_que_analysis;

  const [levelOptions, setLevelOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    type: "All",
    level: "All",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (questions) {
      const levels = [...new Set(questions.map((q) => q.bloom))];
      const types = [...new Set(questions.map((q) => q.type))];
      setLevelOptions(levels);
      setTypeOptions(types);
    }
  }, [questions]);

  const handleChangeFilter = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  var visibleQuestions = useMemo(
    () =>
      [...questions]
        .filter((q) => {
          const matchesSearch = q.question
            .toLowerCase()
            .includes(filter.search.toLowerCase());
          const matchesType = filter.type === "All" || q.type === filter.type;
          const matchesLevel =
            filter.level === "All" || q.bloom === filter.level;
          return matchesSearch && matchesType && matchesLevel;
        })
        .slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [questions, filter, page, rowsPerPage]
  );

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 w-full"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      {detailed_que_analysis == null ? (
        <Typography>No data available</Typography>
      ) : (
        <>
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <TextField
              size="small"
              value={filter.search}
              name="search"
              onChange={handleChangeFilter}
              variant="outlined"
              label="Search questions"
            />
            <FormControl>
              <InputLabel id="type-label">Types</InputLabel>
              <Select
                label="Types"
                labelId="type-label"
                size="small"
                value={filter.type}
                name="type"
                onChange={handleChangeFilter}
              >
                <MenuItem value="All">All</MenuItem>
                {typeOptions.map((type, idx) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="cognitive-label">Cognitive Level</InputLabel>
              <Select
                label="Cognitive Level"
                labelId="cognitive-label"
                size="small"
                value={filter.level}
                name="level"
                onChange={handleChangeFilter}
              >
                <MenuItem value="All">All</MenuItem>
                {levelOptions.map((level, idx) => (
                  <MenuItem key={idx} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select> */}
          </div>
          {/* Table */}

          <div>
            <h2 className="text-[17px] font-semibold text-gray-900 mb-0">
              Detailed Question Analysis
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Comprehensive performance metrics for individual questions
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-[15px]">
                    <th className="py-2 px-4 font-medium text-left">
                      Question
                    </th>
                    <th className="py-2 px-4 font-medium text-center">Type</th>
                    <th className="py-2 px-4 font-medium text-center">
                      Cognitive Level
                    </th>
                    <th className="py-2 px-4 font-medium text-center">
                      Success Rate
                    </th>
                    <th className="py-2 px-4 font-medium text-center">Usage</th>
                    <th className="py-2 px-4 font-medium text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions.map((q, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-100 text-[15px]"
                    >
                      <td className="py-2 px-4">
                        <div className="font-medium text-gray-900">
                          {q.question}
                        </div>
                        <div className="text-xs text-gray-500">{q.sub}</div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${typeColors[q.type]}`}
                        >
                          {q.type}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${bloomColors[q.bloom]}`}
                        >
                          {q.bloom}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${successColors(q.successRate)}`}
                        >
                          {q.successRate}%
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">{q.usage}</td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${statusColors(q.successRate)}`}
                        >
                          {q.successRate >= 80
                            ? "Too Easy"
                            : q.successRate >= 60
                              ? "Good"
                              : "Needs Improvement"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={questions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionTable;
