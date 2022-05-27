import { Paper } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "../../coursesManagerSlice";
import CoursesTableContainer from "../coursesTableContainer";
import CoursesTablePagination from "../coursesTablePagination";
import EnhancedTableToolBar from "../enhancedTableToolbar";
import styles from "./coursesTable.module.scss";

function CoursesTable() {
  const dispatch = useDispatch();

  const rowData = useSelector(state => state.coursesManager.data)
  
  React.useEffect(() => {
    dispatch(getCourses());
  })

  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState([]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = rowData.map((item) => item.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (e, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Paper className={`${styles.coursestable}`} elevation={3}>
      <EnhancedTableToolBar numSelected={selected.length}/>
      <CoursesTableContainer
        rowData={rowData}
        page={page}
        rowsPerPage={10}
        numSelected={selected.length}
        handleSelectAllClick={handleSelectAllClick}
        handleRowClick={handleClick}
        isSelected={isSelected}
      />
      <CoursesTablePagination
        rowCount={rowData.length}
        page={page}
        rowsPerPage={10}
        handleChangePage={handleChangePage}
      />
    </Paper>
  );
}

export default CoursesTable;
