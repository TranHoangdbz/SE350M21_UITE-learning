import { ArrowBack, Edit } from "@mui/icons-material";
import { Button, Paper, Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {  unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourseById, getLessonById, getQuizzByLesson } from "../../coursesManagerSlice";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./lessonDetail.module.scss";
import QuestionInQuizz from "../questionInQuizz";
import CreateQuizz from "../../../create-quizz/components";

function LessonDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  /// Open Modal state and function
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const url = window.location.pathname;
  const path = url.split("/").filter((x) => x);

  const currentLessonData = useSelector(
    (state) => state.coursesManager.currentLesson
  );
  const currentCourseData = useSelector(
    (state) => state.coursesManager.currentCourse
  );

  const [currentLesson, setCurrentLesson] = React.useState({
    _id: "",
    lessonCode: "",
    description: "",
    video: "",
    quizz: [],
    passed: [],
    thumbnail: "",
    name: "",
    lessonVolume: null,
  });


  const [quizList, setQuizList] = React.useState([])


  const [currentCourseName, setCurrentCourseName] = React.useState("");

  if (currentLessonData !== null && currentLesson._id === "") {
    setCurrentLesson(currentLessonData);
  }

  if (currentCourseData !== null && currentCourseName === "") {
    setCurrentCourseName(currentCourseData.courseName);
  }

  const fetchQuizzByLessonId = async () => {
    try {
      const resultAction = await dispatch(getQuizzByLesson(path[3]))
      const originalPromiseResult = unwrapResult(resultAction)
      let tempList = []
      for (let i = 0; i < originalPromiseResult.data.length; i++) {
        tempList.push(originalPromiseResult.data[i])
      }
      setQuizList(tempList)
    } catch (rejectedValueOrSerializedError) {
      alert(rejectedValueOrSerializedError);
    }
  }

  React.useEffect(() => {
    setCurrentLesson({
      _id: "",
      lessonCode: "",
      description: "",
      video: "",
      quizz: [],
      passed: [],
      thumbnail: "",
      name: "",
      lessonVolume: null,
    });
    dispatch(getCourseById(path[2]));
    dispatch(getLessonById(path[3]));
    if (quizList.length === 0) {
      fetchQuizzByLessonId();
    }
  }, []);

  return (
    <Paper className={`${styles.lessondetail}`} elevation={3}>
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
              navigate(-1);
            }}
          >
            Back
          </Button>
          <Button
            className={`${styles.button}`}
            variant="text"
            startIcon={<Edit />}
          >
            Edit Lesson
          </Button>
        </Stack>
        <Stack direction="row" spacing="12px">
          <div className={`${styles.demo}`}>
            <iframe src={currentLesson.video} allowFullScreen />
          </div>
          <Stack
            className={`${styles.detail}`}
            direction="column"
            spacing="12px"
          >
            <Typography variant="h5" fontWeight="bold">
              {currentLesson.name}
            </Typography>
            <div className={`${styles.thumbnail}`}>
              <img src={currentLesson.thumbnail} />
            </div>
            <Typography>
              <b>Course:</b> {currentCourseName}
            </Typography>
            <Typography>
              <b>Video Link:</b> {currentLesson.video}
            </Typography>
            <Typography>
              <b>Thumbnail Link:</b> {currentLesson.thumbnail}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          paddingTop="24px"
          paddingBottom="24px"
          direction="column"
          spacing="4px"
        >
          <Typography variant="h5" fontWeight="bold">
            Description
          </Typography>
          <Typography>{currentLesson.description}</Typography>

          <Button variant="contained" 
          startIcon={<AddCircleOutlineIcon />} 
          sx={{ backgroundColor: '#120752', alignSelf: 'flex-end', '&:hover': { backgroundColor: '#262e60' } }} 
          onClick={handleOpen}
          >
            New Question
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Lesson Quiz:
          </Typography>

          {
            quizList &&
            quizList.map((item, index) => (
              <QuestionInQuizz key={index} item={item} index={index + 1} />
            ))
          }
        </Stack>
        <CreateQuizz
        lessonID={path[3]}
        open={open} 
        handleClose={handleClose} 
        handleOpen={handleOpen}
        fetchNewData={fetchQuizzByLessonId}
        ></CreateQuizz>
      </Stack>
    </Paper>
  );
}

export default LessonDetail;