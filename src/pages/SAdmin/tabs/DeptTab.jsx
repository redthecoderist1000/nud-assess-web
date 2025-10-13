import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

import { useContext, useEffect, useMemo, useState } from "react";
import { userContext } from "../../../App";
import { supabase } from "../../../helper/Supabase";
import CreateDept from "./components/CreateDept";
import EditDept from "./components/EditDept";
import DeleteDept from "./components/DeleteDept";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

const headCells = [
  { label: "Department Name" },
  { label: "School" },
  { label: "Programs" },
  { label: "Action" },
];

const DeptTab = () => {
  const { setSnackbar } = useContext(userContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const [filter, setFilter] = useState({ search: "", school: "all" });
  const [schoolOption, setSchoolOption] = useState([]);

  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  useEffect(() => {
    fetchData();

    const deptListener = supabase
      .channel("dept-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_department" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(deptListener);
    };
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("vw_departments").select("*");

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching departments",
        severity: "error",
      });
      return;
    }
    setRows(data);

    // get unqie schools
    const schoolMap = new Map();

    data.forEach((item) => {
      if (!schoolMap.has(item.school_name)) {
        schoolMap.set(item.school_name, item.school_name);
      }
    });

    setSchoolOption([...schoolMap.values()]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      [...rows]
        .filter((value) => {
          const searchTerm = filter.search.toLowerCase();
          const schoolFilter = filter.school;

          const matchesSearch =
            searchTerm === "" ||
            `${value.school_name} ${value.school_sname} ${value.dept_name} ${value.dept_sname}`
              .toLowerCase()
              .includes(searchTerm);

          const matchesSchool =
            schoolFilter === "all" || value.school_name === schoolFilter;

          return matchesSearch && matchesSchool;
        })

        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, rows, filter]
  );

  return (
    <Stack spacing={2}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Department Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">Manage departments.</p>
      </div>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction="row" spacing={2}>
          <OutlinedInput
            fullWidth
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="Search department..."
            size="small"
            sx={{ maxWidth: 300 }}
            endAdornment={
              filter.search && (
                <CloseRoundedIcon
                  onClick={() => setFilter({ ...filter, search: "" })}
                  sx={{ cursor: "pointer", color: "grey.500" }}
                />
              )
            }
          />
          <Select
            size="small"
            fullWidth
            defaultValue={"all"}
            value={filter.school}
            sx={{ maxWidth: 300 }}
            onChange={(e) => setFilter({ ...filter, school: e.target.value })}
          >
            <MenuItem value="all">All Schools</MenuItem>
            {schoolOption.map((school, index) => (
              <MenuItem key={index} value={school}>
                {school}
              </MenuItem>
            ))}
          </Select>
          <Tooltip title="Clear Filter" placement="top" arrow>
            <IconButton
              color="error"
              onClick={() => setFilter({ search: "", school: "all" })}
              aria-label="clear filter"
              size="small"
              sx={{ alignSelf: "center" }}
            >
              <RestartAltRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          size="small"
          sx={{
            bgcolor: "#2D3B87",
            "&:hover": { bgcolor: "#3d51c4ff" },
          }}
          onClick={() => setCreateDialog(true)}
        >
          New Department
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: "#f6f7fb" }}>
              {headCells.map((headCell, index) => {
                return (
                  <StyledTableCell key={index}>
                    <b>{headCell.label}</b>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length == 0 ? (
              <TableRow>
                <StyledTableCell colSpan={headCells.length}>
                  no results found
                </StyledTableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, index) => {
                return (
                  <TableRow key={index} tabIndex={-1}>
                    <StyledTableCell component="th" scope="row">
                      <Tooltip title={row.dept_sname} placement="left">
                        {row.dept_name}
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title={row.school_name} placement="left">
                        {row.school_sname}
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>{row.prog_count}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            setEditDialog({ open: true, item: row })
                          }
                        >
                          <BorderColorRoundedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({ open: true, item: row })
                          }
                        >
                          <DeleteForeverRoundedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </TableRow>
                );
              })
            )}
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

      <CreateDept open={createDialog} onClose={() => setCreateDialog(false)} />

      <EditDept
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, item: null })}
        item={editDialog.item}
      />

      <DeleteDept
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        item={deleteDialog.item}
      />
    </Stack>
  );
};

export default DeptTab;
