import React, { useState, useEffect } from "react";
import Sidebar from '../SideBar';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourseInfo, startLiveClassForStudents } from "../../../redux/course/courseAction";
import TablePagination from "@mui/material/TablePagination";
import LiveClass from "../../LiveClass/LiveClass";

const CourseInfo = ({ course }) => {
    const courseData = useSelector((state) => state.course.courseInfo);
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLive, setIsLive] = useState(false);
    const courseId1 = courseData._id;
    const teacher = courseData.teacher;

    useEffect(() => {
        dispatch(fetchAllCourseInfo());
    }, [course, dispatch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startLiveClass = () => {
        const courseId = {courseId1}; // replace with actual course ID
        const teacherId = {teacher}; // replace with actual teacher ID

        // Notify students by storing the link in the database
        dispatch(startLiveClassForStudents(courseId, teacherId));
        setIsLive(true);
    };

    return (
        <div>
            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
                <div className="app-main">
                    <Sidebar />
                    <div className="app-main-outer">
                        <div className="app-main-inner">
                            <div className="page-title-actions px-3 d-flex">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="/studentDashboard">Dashboard</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Course</li>
                                    </ol>
                                </nav>
                            </div>

                            <div className="row" id="deleteTableItem">
                                <div className="col-md-12">
                                    <div className="card mb-5">
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table id="dataTable" className="table table-responsive-xl">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th><strong>ID</strong></th>
                                                            <th><strong>Course</strong></th>
                                                            <th><strong>Description</strong></th>
                                                            <th><strong>Price</strong></th>
                                                            <th><strong>Instructor</strong></th>
                                                            <th><strong>Course Link</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(courseData) &&
                                                            courseData
                                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                .map((row) => (
                                                                    <tr key={row._id}>
                                                                        <td className="tableId">{row._id}</td>
                                                                        <td className="tableProduct">
                                                                            <div className="listproduct-section">
                                                                                <div className="product-pera">
                                                                                    <p className="priceDis">{row.courseName}</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="tableCustomar">{row.courseName}</td>
                                                                        <td className="tableId">{row.coursePrice}</td>
                                                                        <td className="tableId">{row.teacher}</td>
                                                                        <td className="tableId">{row.courseLink}</td>
                                                                    </tr>
                                                                ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={courseData.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" id="deleteTableItem">
                                <div className="col-md-12">
                                    <div className="card mb-5">
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <button onClick={startLiveClass}>Start Live Class</button>
                                                {isLive && (
        <>
          <LiveClass  />
   
        </>
      )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInfo;
