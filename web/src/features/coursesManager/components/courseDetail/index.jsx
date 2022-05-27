import { ArrowBack, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./courseDetail.module.scss";

function CourseDetail() {
  const navigate = useNavigate();

  const url = window.location.pathname;
  const path = url.split("/").filter((x) => x);

  const courseIndex = useSelector(
    (state) => state.coursesManager.data
  ).findIndex((object) => {
    return object.id === path[2];
  });

  const courseData = useSelector((state) => state.coursesManager.data)[
    courseIndex
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper className={`${styles.coursedetail}`} elevation={3}>
      <Stack direction="column" spacing="8px">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            className={`${styles.backbutton}`}
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => {
              navigate("/coursesmanager/courseslist");
            }}
          >
            Courses list
          </Button>
          <Box>
            <Button
              className={`${styles.button}`}
              variant="text"
              startIcon={<Edit />}
            >
              Edit
            </Button>
            <Button
              className={`${styles.button}`}
              variant="text"
              startIcon={<Delete />}
            >
              Delete
            </Button>
          </Box>
        </Stack>
        <Typography variant="h4" fontWeight="bold">
          {courseData.courseName}
        </Typography>
        <Typography width="67%">{courseData.description}</Typography>
        <Stack padding="12px 0px" spacing="4px">
          <Typography variant="h5" fontWeight="bold">
            Thumbnail
          </Typography>
          <div className={`${styles.thumbnail}`}>
            <img alt="thumbnail" src={courseData.courseImage} />
          </div>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="column" spacing="4px">
            <Typography variant="h5" fontWeight="bold">
              Course content
            </Typography>
            <Typography>{`${courseData.lessons.length} lessons`}</Typography>
          </Stack>
          <Button
            className={`${styles.addbutton}`}
            variant="contained"
            onClick={() => {
              navigate("/coursesmanager/addcourse");
            }}
          >
            Thêm bài học
          </Button>
        </Stack>
        <Stack direction="row" spacing="12px">
          <div className={`${styles.demo}`}>
            <img alt="demo" src={courseData.courseImage} />
          </div>
          <List
            className={`${styles.list}`}
            sx={{ margin: "0px", padding: "0px" }}
          >
            {courseData.lessons.map((item) => {
              return (
                <ListItem>
                  <Paper className={`${styles.listitem}`} elevation={3}>
                    <Stack direction="row" justifyContent="space-between">
                      <img
                        alt="listitemiamge"
                        className={`${styles.listitemimage}`}
                        src={item.video}
                      />

                      <Stack
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="space-evenly"
                      >
                        <Typography fontWeight="bold">
                          {`${item.lessonVolume}. ${item.name}`}
                        </Typography>
                        <Typography>12:25</Typography>
                      </Stack>
                      <IconButton
                        aria-controls={
                          open ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
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
                        <MenuItem onClick={handleClose}>Chỉnh sửa</MenuItem>
                        <MenuItem onClick={handleClose}>Xóa</MenuItem>
                      </Menu>
                    </Stack>
                  </Paper>
                </ListItem>
              );
            })}
          </List>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CourseDetail;
