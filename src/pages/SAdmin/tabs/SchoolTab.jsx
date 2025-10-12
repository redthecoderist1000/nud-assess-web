import { useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../helper/Supabase";
import {
  Button,
  IconButton,
  OutlinedInput,
  Paper,
  Stack,
  styled,
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
import { userContext } from "../../../App";
import CreateSchool from "./components/CreateSchool";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import EditSchool from "./components/EditSchool";
import DeleteSchool from "./components/DeleteSchool";

const StyledTableCell = styled(TableCell)(({ theme, bgcolor }) => ({
  background: bgcolor || "inherit",
  fontWeight: 500,
  textAlign: "center",
  borderRight: "1px solid #eee",
  fontSize: "15px",
  padding: "12px 8px",
}));

const headCells = [
  { label: "School Name" },
  { label: "Departments" },
  { label: "Programs" },
  { label: "Action" },
];

const SchoolTab = () => {
  const { setSnackbar } = useContext(userContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const [filter, setFilter] = useState({ search: "" });
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  useEffect(() => {
    fetchData();

    const schoolListener = supabase
      .channel("school-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tbl_school" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(schoolListener);
    };
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("vw_schools").select("*");

    if (error) {
      setSnackbar({
        open: true,
        message: "Error fetching schools",
        severity: "error",
      });
      return;
    }

    setRows(data);
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
          if (filter.search === "") return true;

          const matchName = `${value.school_name} ${value.school_sname}`
            .toLowerCase()
            .includes(filter.search.toLowerCase());

          return matchName;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, rows, filter]
  );

  return (
    <Stack spacing={2}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          School Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-0">Manage schools.</p>
      </div>
      <Stack direction="row" justifyContent={"space-between"}>
        <OutlinedInput
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          placeholder="Search school..."
          size="small"
          fullWidth
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
          New School
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
                      <Tooltip title={row.school_sname} placement="left">
                        {row.school_name}
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell>{row.dept_count}</StyledTableCell>
                    <StyledTableCell>{row.prog_count}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        color="primary"
                        title="Edit"
                        onClick={() => setEditDialog({ open: true, item: row })}
                      >
                        <BorderColorRoundedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        color="error"
                        title="Delete"
                        onClick={() =>
                          setDeleteDialog({ open: true, item: row })
                        }
                      >
                        <DeleteForeverRoundedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
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

      <CreateSchool
        open={createDialog}
        onClose={() => setCreateDialog(false)}
      />

      <EditSchool
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, item: null })}
        item={editDialog.item}
      />

      <DeleteSchool
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        item={deleteDialog.item}
      />
    </Stack>
  );
};

export default SchoolTab;
