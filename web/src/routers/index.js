import { Route, Routes, Navigate } from "react-router-dom";
import routes from "../routes";

import React from "react";

// import page
const ExamPage = React.lazy(() => import("../components/exam"));

const HomeCoursePage = React.lazy(() => import("../components/homeCourseList"))

// waiting
const loading = (
    <div>
        <h1>Loading...</h1>
    </div>
);

const Routers = () => {
    return (
        <React.Suspense fallback={loading}>
            <Routes>
                {/* <Route path="/exam" name="Example" element={<ExamPage />} />
                <Route index name="Example" element={<Navigate to="exam" />} /> */}
                <Route path="/homeCourseList" name="HomeCourse" element={<HomeCoursePage />} />
                <Route index name="HomeCourse" element={<Navigate to="homeCourseList" />} />
                {routes.publicRoute.map((route, idx) => {
                    return (
                        route.element && (
                            <Route
                                key={idx}
                                path={route.path}
                                element={route.element}
                            />
                        )
                    );
                })}

            </Routes>
        </React.Suspense>
    );
};

export default Routers;
