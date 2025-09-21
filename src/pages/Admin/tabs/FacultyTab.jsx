import {
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import { userContext } from "../../../App";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";

import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "faculty_name",
    numeric: false,
    disablePadding: false,
    label: "Faculty name",
  },
  {
    id: "subjects",
    numeric: false,
    disablePadding: false,
    label: "Subject/s",
  },
];

const FacultyTab = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("faculty_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    let { data, error } = await supabase
      .from("vw_facultysubject")
      .select("*")
      .eq("department_id", user.department_id);

    if (error) {
      console.log("Failed to fetch data:", error);
      return;
    }

    const result = Object.values(
      data.reduce((acc, item) => {
        acc[item.id] = acc[item.id] || { ...item, id: item.id, subjects: [] };
        if (item.subject_code == null)
          acc[item.id].subjects.push(item.subject_code);
        else
          acc[item.id].subjects.push(
            item.subject_code + " (" + item.name + ")"
          );
        return acc;
      }, {})
    );

    setRows(result);
  };

  useEffect(() => {
    fetchData();

    const faculty_channel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_faculty_subject" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(faculty_channel);
    };
  }, []);

  const visibleFaculty = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .filter((value) => {
          const matchFname = value?.f_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchLname = value?.l_name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchSubject = value?.subjects.includes(search);

          return matchFname || matchLname || matchSubject;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, search, rows]
  );

  const handleSearch = (e) => setSearch(e.target.value);
  const clearSearch = () => setSearch("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onClickRow = (id) => {
    const params = new URLSearchParams({ facultyId: id });

    navigate(`/admin/faculty?${params.toString()}`);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Faculty Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">
          Manage faculty and assign subjects.
        </p>
      </div>
      <Stack direction="row" mt={5} mb={2} justifyContent="space-between">
        <OutlinedInput
          id="search_input"
          size="small"
          placeholder="search faculty name..."
          value={search}
          sx={{ width: "25%" }}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            search == "" ? null : (
              <InputAdornment position="end" onClick={clearSearch}>
                <CloseIcon />
              </InputAdornment>
            )
          }
        />
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f6f7fb" }}>
              {headCells.map((headCell, index) => (
                <StyledTableCell key={index}>
                  <b>{headCell.label}</b>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleFaculty.map((row, index) => {
              const name = row.suffix + " " + row.f_name + " " + row.l_name;
              return (
                <TableRow
                  key={index}
                  hover
                  tabIndex={-1}
                  sx={{ cursor: "pointer" }}
                  onClick={() => onClickRow(row.id)}
                >
                  <StyledTableCell component="th" scope="row">
                    {name}
                  </StyledTableCell>

                  <StyledTableCell>
                    {/* {row.subject} */}
                    <Stack
                      columnGap={4}
                      useFlexGap
                      sx={{ flexWrap: "wrap" }}
                      // width="100%"
                    >
                      {row.subjects.map((data, index) => {
                        return <p key={index}>{data}</p>;
                      })}
                    </Stack>
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default FacultyTab;
