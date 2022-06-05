import { MoreVert } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCourses, setActiveCourse } from "../../../coursesManagerSlice";
import styles from "./coursesTableContainer.module.scss";

const tableHeadCells = [
  {
    id: "Number",
    label: "Number",
    align: "left",
  },
  {
    id: "ID",
    label: "ID",
    align: "left",
  },
  {
    id: "Course name",
    label: "Course name",
    align: "left",
  },
  {
    id: "Lessons",
    label: "Lessons",
    align: "left",
  },
  {
    id: "Participant",
    label: "Participant",
    align: "left",
  },
  {
    id: "Active",
    label: "Active",
    align: "right",
  },
  {
    id: "",
    label: "",
    align: "right",
  },
];

function CoursesTableContainer({ rowData, page, rowsPerPage }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteAlert, seDeleteAlert] = React.useState(false);

  const handleOpenDeleteDialog = () => {
    seDeleteAlert(true);
  };

  const handleCloseDeleteDialog = () => {
    seDeleteAlert(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [course, setCourse] = React.useState({ isActive: null });

  const open = Boolean(anchorEl);

  const handleClick = (e, item) => {
    setCourse(item);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowData.length) : 0;

  const handleViewCourse = (_id) => {
    navigate("/coursesmanager/coursedetail/" + _id);
  };

  const handleReverseCourse = (course) => {
    let lessons = [];
    course.lessons.forEach((item) => {
      lessons.push(item);
    });
    dispatch(setActiveCourse({ ...course, lessons: lessons, isActive: true }));
    dispatch(getCourses());
    handleClose();
    window.location.reload();
  };

  return (
    <TableContainer>
      <Table size="medium">
        <TableHead>
          <TableRow>
            {tableHeadCells.map((item) => (
              <TableCell key={item.key} align={item.align}>
                {item.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => {
              return (
                <TableRow key={item.courseCode}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.courseCode}</TableCell>
                  <TableCell
                    key={item.courseCode}
                    component="th"
                    scope="row"
                    sx={{ width: "500px" }}
                  >
                    {item.courseName}
                  </TableCell>
                  <TableCell>{item.lessons.length}</TableCell>
                  <TableCell>{"0"}</TableCell>
                  <TableCell align="right">
                    {item.isActive ? "Đang hoạt động" : "Đã khóa"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-controls={open ? "demo-positioned-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={(e) => handleClick(e, item)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      elevation={1}
                    >
                      <MenuItem
                        onClick={
                          course.isActive
                            ? () => {
                                handleViewCourse(course._id);
                              }
                            : () => {
                                handleOpenDeleteDialog();
                              }
                          // : () => handleReverseCourse(course)
                        }
                      >
                        {course.isActive ? "Xem" : "Hoàn tác"}
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 45.51 * emptyRows,
              }}
            >
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog
        open={deleteAlert}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm delete course?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            After delete, the course will be set to be inactive.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            className={`${styles.confirmbutton}`}
            variant="contained"
            onClick={() => handleReverseCourse(course)}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default CoursesTableContainer;
