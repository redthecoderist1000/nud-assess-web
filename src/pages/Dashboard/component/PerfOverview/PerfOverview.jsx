import { useContext, useEffect, useState } from "react";
import PerfGraph from "./PerfGraph";
import PerfBox from "./PerfBox";
import {
  Card,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { supabase } from "../../../../helper/Supabase";
import { userContext } from "../../../../App";
import { useNavigate } from "react-router-dom";

const PerfOverview = () => {
  const navigate = useNavigate();
  const { setSnackbar } = useContext(userContext);
  const [showBoxes, setShowBoxes] = useState(false);
  const [perfOv, setPerfOv] = useState([]);
  const [classOv, setClassOv] = useState([]);

  const fetchClassOv = async () => {
    const { data, error } = await supabase
      .rpc("get_performanceoverview")
      .select("*")
      .single();

    if (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Error fetching data. Please refresh the page.",
        severity: "error",
      });
      return;
    }

    // console.log(data);
    setPerfOv(data.performance);
    setClassOv(data.class);
  };

  useEffect(() => {
    fetchClassOv();
  }, []);

  const onClick = (id) => {
    const params = new URLSearchParams({ class_id: id, tab: 3 });
    navigate(`/class?${params.toString()}`);
  };

  return (
    <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <SchoolRoundedIcon sx={{ color: "#757575ff" }} />
        <Typography variant="h6">Performance Overview per Class</Typography>
      </Stack>
      <Typography variant="caption" color="textSecondary">
        Weekly average scores across all active classes
      </Typography>

      <PerfGraph perfData={perfOv} />
      {/* </div> */}
      {classOv == null ? (
        <></>
      ) : (
        <>
          <Collapse in={showBoxes} unmountOnExit>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {classOv.map((data, idx) => (
                <PerfBox
                  key={idx}
                  data={data}
                  onClick={() => onClick(data.id)}
                />
              ))}
            </div>
          </Collapse>
          <Stack direction="row" justifyContent="center">
            <Tooltip
              title={showBoxes ? "Show Less" : "Show More"}
              placement="top"
              arrow
            >
              <IconButton
                onClick={() => setShowBoxes(!showBoxes)}
                sx={{ mt: 2 }}
              >
                {showBoxes ? (
                  <ExpandLessRoundedIcon />
                ) : (
                  <ExpandMoreRoundedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </>
      )}
    </Card>
  );
};

export default PerfOverview;
