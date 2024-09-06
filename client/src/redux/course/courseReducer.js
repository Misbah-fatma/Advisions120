import { GET__COURSES, UPDATE__COURSE__LIST, START_LIVE_CLASS_FOR_STUDENTS } from "./courseTypes";

const init = {
    courseInfo: [],
    updateCourseList: false,
    liveClassLink: null,
};

const courseReducer = (state = init, action) => {
    switch (action.type) {
        case GET__COURSES:
            return {
                ...state,
                courseInfo: action.payload,
            };

        case UPDATE__COURSE__LIST:
            return {
                ...state,
                updateCourseList: action.payload,
            };

            // case START_LIVE_CLASS:
            //     return {
            //         ...state,
            //         liveClassLink: action.payload.liveClassLink,
            //     };

        default:
            return state;
    }
};

export default courseReducer;
