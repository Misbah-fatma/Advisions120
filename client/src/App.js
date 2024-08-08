import React from 'react';
import { Helmet } from 'react-helmet';
import './i18n.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import DashBoard from "./pages/DashBoard/Dashboard.js";
import EditMetadataPage from './pages/AdminDashBoard/MetaData/metaData.js';
import AdminRoute from './components/PrivateRoute/AdminRoute.js';
import TeacherRoute from './components/PrivateRoute/TeacherRoute.js';
import StudentRoute from './components/PrivateRoute/StudentRoute.js';
import CourseInfo from "./pages/CourseInfo/CourseInfo.js";
import Login from "./pages/Login/Login.js";
import Register from "./pages/Register/Register.js";
import NotFound from "./pages/404NotFoud/NotFound.js";
import Home from "./pages/LandingPage/Land.js";
import Contact from "./pages/LandingPage/Contact.js";
import About from "./pages/LandingPage/About.js";
import Courses1 from "./pages/LandingPage/Courses.js";
import AddtoCart from "./pages/AddToCart/AddtoCart.js"
import NoticeToggle from "./pages/CourseInfo/NoticeToggle/NoticeToggle.js";
import CheckOut from "./pages/AddToCart/Checkout.js"
import CourseInfo1 from "./pages/LandingPage/CourseInfo.js";
import Blockly from "./pages/Blocky/Blocky.jsx"
import Dashboard3 from "./pages/AdminDashBoard/Dashboard.js"
import CourseDashboardInfo from "./pages/AdminDashBoard/Course Management/CourseInfo.js";
import Category from "./pages/AdminDashBoard/Course Management/Category.js";
import Chapter from "./pages/AdminDashBoard/Course Management/Chapter.js";
import Teacher from "./pages/AdminDashBoard/Enroll Management/Teacher.js";
import Student from "./pages/AdminDashBoard/Enroll Management/Student.js";
import CreateCourse from "./pages/AdminDashBoard/Admin Management/CreateCourse.js";
import CreateDashUser from "./pages/AdminDashBoard/Admin Management/CreateUser.js";
import UpdateDashRole from "./pages/AdminDashBoard/Admin Management/UpdateRole.js";
import UpdateDashCourse from "./pages/AdminDashBoard/Admin Management/UpdateCourse.js";
import SidebarTeacher from "./pages/TeacherDashBoard/SideBar.js";
import TeacherDash from "./pages/TeacherDashBoard/Dashboard.js";
import TeacherCourses from "./pages/TeacherDashBoard/TeacherCourse/TeacherCourse.js";
import NewCourse from "./pages/TeacherDashBoard/TeacherCourse/NewCourse.js";
import Students from './pages/TeacherDashBoard/TeacherCourse/Students.js';
import MyCodeEditor from './pages/CodeEditor/MyCodeEditor.js';
import StudentDashBoard from "./pages/StudentDashBoard/Dashboard.js"
import CourseCategory from './pages/StudentDashBoard/Course/Category.js';
import CoursesInfo from  './pages/StudentDashBoard/Course/CourseInfo.js'
import CourseChapter from './pages/StudentDashBoard/Course/Chapter.js'
import StudentInfo from './pages/StudentDashBoard/StudentsEnrolled/Student.js'
import StudentsDetails from './pages/TeacherDashBoard/TeacherCourse/Students.js';
import TeacherCourse from "./pages/TeacherDashBoard/Course Management/CourseInfo.js"
import TeacherCategory from "./pages/TeacherDashBoard/Course Management/Category.js"
import TeacherChapter from "./pages/TeacherDashBoard/Course Management/Chapter.js"
import UpdatePassword from "./pages/AdminDashBoard/Enroll Management/UpdatePassword.js"
import Yjs from './pages/Yjs/yjs.jsx';
import Blockly2 from "./pages/Blockly2/Blockly.js"
import CreateRole from "./pages/AdminDashBoard/Admin Management/RoleCreate.js"
import CreateLecture from "./pages/TeacherDashBoard/TeacherCourse/CreateLecture.js"
import StudentsDetailsDash from "./pages/StudentDashBoard/StudentsEnrolled/StudentsDetails.js"
import Metadata from "./pages/AdminDashBoard/MetaData/metaData.js"
import TeacherCreateStudent from "./pages/TeacherDashBoard/TeacherCourse/CreateStudent.js"
import AddTerms from './pages/AdminDashBoard/Admin Management/Terms&Condition.js';
import PaymentSuccess from './pages/AddToCart/PaymentSucess.js';
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy.js"
import AdvisionBusinessPrivacy from "./pages/Privacy/AdvisionsBusinessPrivacyStatement.js"
import AdvisionsProTerms from "./pages/Privacy/AdvisionsBusinessProTerms&Conditions.js"
import AffiliateTerms from "./pages/Privacy/AffiliateTerms&Conditions.js"
import InstructorTerms from "./pages/Privacy/InstructorTerms.js"
import MasterServices from './pages/Privacy/MasterServicesAgreement.js';
import PricingPromotional from "./pages/Privacy/Pricing&PromotionPolicy.js"
import TermsofUse from "./pages/Privacy/TermsofUse.js"
import CodeEditorProgramProgress from "./pages/StudentDashBoard/StudentsEnrolled/CodeEditorProgramProgress.js"
import BlocklyProgress from "./pages/StudentDashBoard/StudentsEnrolled/BlocklyProgress.js"
import Rough from "./pages/rough.js"
import Info from "./pages/TeacherDashBoard/TeacherCourse/courseDetails.js"
import AdminLectures from "./pages/AdminDashBoard/Course Management/CreateLectures.js";
import PurchasedCourses from './pages/PurchasedCourse.js';
import Classification from './pages/AI components/Classification/Classification.js';
import Regression from './pages/AI components/Regression/Regression.js';
import Clustering from './pages/AI components/Clustering/Clustering.js';
import PCA from './pages/AI components/PCA/PCA.js';
import SentimentAnalysis from './pages/AI components/SentimentAnalysis/SentimentAnalysis.js';
import CNN from './pages/AI components/CNN/CNN.js';
import NLP from './pages/AI components/NLP/NLP.js';
import TFIDF from './pages/AI components/TFIDF/TFIDF.js';
import ProblemCanvas from './pages/AI components/ProblemCanvas';
import DataVisualization from './pages/AI components/DataVisualization/DataVisualization.js';
import SpeciesIdentifier from './pages/AI components/SpeciesIdentifier/SpeciesIdentifier.js';
import Entrepreneurship from './pages/AI components/Entrepreneurship';
import AIModel from './pages/AI components/AIDashboard.js';
import MLModel from './pages/AI components/MLDashboard.js';
import EntrepreneurshipO from './pages/AI components/EntrepreneurshipO.js';
import PurchasedCourseDetail from "./pages/StudentDashBoard/CourseDetails.js"
import AllUser from './components/PrivateRoute/AllUser.js';
import ClassificationTheory from "./pages/AI components/Classification/ClassificationTheory.js"
import CnnExplanation from './pages/AI components/CNN/CNNTheory.js';
import NLPExplanation from './pages/AI components/NLP/NLPTheory.js';
import SentimentAnalysisExplanation from './pages/AI components/SentimentAnalysis/SentimentAnalysisTheory.js';
import TDIDFAnalysisExplanation from "./pages/AI components/TFIDF/TFIDFTheory.js";
import SpeciesIdentifierExplanation from "./pages/AI components/SpeciesIdentifier/SpeciesIdentifierTheory.js";
import DataVisualizationTheory from './pages/AI components/DataVisualization/DataVisualiazationTheory.js';
import PCATheory from './pages/AI components/PCA/PCATheory.js';
import RegressionTheory from './pages/AI components/Regression/RegressionTheory.js';
import ClusteringTheory from './pages/AI components/Clustering/ClusteringTheory.js';
import PrincipalRoute from "./components/PrivateRoute/PrincipalRoute.js";
import PrincipalDashboard from './pages/PrincipalDashboard/PrincipalDashboard.js';
import CreateTeacherStudent from './pages/PrincipalDashboard/CreateTeacher.js';
import CreateStudent from './pages/PrincipalDashboard/CreateStudents.js';
import EditTeacherStudent from './pages/PrincipalDashboard/EditTeacherStudent.js';
import PlanPage from './pages/PrincipalDashboard/PlanPage.js';
import SchoolRegistrationForm from './pages/PrincipalDashboard/SchoolRegistrationForm.js';
import Plan from "./pages/AdminDashBoard/Admin Management/PlanSubscribe.js";
import ResetPassword from './pages/Login/Resetpassword.js';
import Principal from './pages/AdminDashBoard/Enroll Management/Principal.js';
import JoinUs from "./pages/LandingPage/SchoolRegistration.js";
import SchoolRegistered from './pages/AdminDashBoard/Notifications/SchoolRegistered.js';
import TeacherRegistered from './pages/AdminDashBoard/Notifications/TeacherRegistration.js';
import PrincipalApproval from './pages/PrincipalDashboard/PrincipalApproval.js';

const Routing = () => {
  const isAdmin = true; 
  return (
    <div>
    <Routes>
          <Route exact path="/"  element={<Home />}> 
      </Route>
  
        <Route exact path="/teacher-dashboard" element={<TeacherRoute><TeacherDash /></TeacherRoute>} />

        <Route exact path="/admin-dashboard" element={ <AdminRoute ><Dashboard3 /></AdminRoute>} />
        <Route exact path="/student-dashboard" element={<StudentRoute><StudentDashBoard /></StudentRoute> } />

        <Route exact path="/principal-dashboard" element={<PrincipalRoute><PrincipalDashboard /></PrincipalRoute>} />
        <Route exact path="/principal/edit" element={<PrincipalRoute><EditTeacherStudent /></PrincipalRoute>} />
        <Route exact path="/planPage" element={<PrincipalRoute><PlanPage /></PrincipalRoute>} />
        <Route exact path="/schoolRegistrationForm" element={<PrincipalRoute><SchoolRegistrationForm /></PrincipalRoute>} />
        <Route exact path="/createstudent-teacherPrincipal" element={<PrincipalRoute><CreateTeacherStudent /></PrincipalRoute>} />
        <Route exact path="/createsStudentByPrincipal" element={<PrincipalRoute><CreateStudent /></PrincipalRoute>} />
        <Route exact path="/plan"  element={<Plan />}>
      
      </Route>
      <Route exact path="/studentdashboard"  element={<StudentDashBoard />}>
      
      </Route>

      <Route exact path="/principal"  element={<Principal />}>
      
      </Route>

      <Route path="/principal-approval" element={<PrincipalApproval />} />
      <Route exact path="/joinus"  element={<JoinUs />}>
      
      </Route>

      <Route exact path="/schoolRegistered"  element={<SchoolRegistered />}>
      
      </Route>

      <Route exact path="/teacherRegistered"  element={<TeacherRegistered />}>
      
      </Route>

      <Route exact path="/course/:courseId"  element={<Info />}>
      
      </Route>

      <Route exact path="/resetPassword"  element={<ResetPassword />}>
      
      </Route>

      <Route exact path="/createAdminLectures"  element={<AdminLectures />}>
      
      </Route>

      <Route exact path="/codeEditorProgress"  element={<CodeEditorProgramProgress />}>
      
      </Route>

      <Route exact path="/blocklyProgress"  element={<BlocklyProgress />}>
      
      </Route>

      <Route path="/purchasecourse/:courseId" element={<PurchasedCourseDetail/>} />

      <Route exact path="/checkout" element={<CheckOut />}>
    
      </Route>

      <Route exact path="/metaData" element={<Metadata />}>
    
    </Route>

    <Route exact path="/rough" element={<Rough />}>
    
    </Route>

      <Route exact path="/cart"  element={<AddtoCart />}>
        
          </Route>
          <Route exact path="/privacyPolicy"  element={<PrivacyPolicy />}>
        
        </Route>

        <Route exact path="/advisionbusinessPrivacy"  element={<AdvisionBusinessPrivacy />}>
        
        </Route>
        <Route exact path="/advisionsproterms"  element={<AdvisionsProTerms />}>
        
        </Route>
        <Route exact path="/affiliateterms"  element={<AffiliateTerms />}>
        
        </Route>
        <Route exact path="/cnnExplanation"  element={<CnnExplanation />}>
        
        </Route>

        
        <Route exact path="/regressionTheory"  element={<RegressionTheory />}>
        
        </Route>

        
        <Route exact path="/nlpExplanation"  element={<NLPExplanation />}>
        
        </Route>

        <Route exact path="/clusteringTheory"  element={<ClusteringTheory />}>
        
        </Route>

        <Route exact path="/pcaTheory"  element={<PCATheory />}>
        
        </Route>

        <Route exact path="/sentimentAnalysisExplanation"  element={<SentimentAnalysisExplanation />}>
        
        </Route>
        
        <Route exact path="/tdidfAnalysisExplanation"  element={<TDIDFAnalysisExplanation />}>
        
        </Route>
        
        
        <Route exact path="/dataVisualizationTheory"  element={<DataVisualizationTheory />}>
        
        </Route>
        <Route exact path="/speciesIdentifierExplanation"  element={<SpeciesIdentifierExplanation />}>
        
        </Route>
        
        <Route exact path="/instructorterms"  element={<InstructorTerms />}>
        
        </Route>
        <Route exact path="/masterservices"  element={<MasterServices />}>
        
        </Route>
        <Route exact path="/pricingpromotional"  element={<PricingPromotional />}>
        
        </Route>
        <Route exact path="/termsofuse"  element={<TermsofUse />}>
        
        </Route>
          <Route exact path="/paymentsuccess"  element={<PaymentSuccess />}>
        
        </Route>

          <Route exact path="/teachercreateStudent"  element={<TeacherRoute><TeacherCreateStudent /></TeacherRoute>}>
        
        </Route>
        <Route exact path="/createrole"  element={<AdminRoute ><CreateRole /></AdminRoute>}>
        
        </Route>
        <Route exact path="/studentsdetails"  element={<StudentsDetailsDash />}>
        
        </Route>
          <Route exact path="/blockly"  element={<Blockly />}>
        
        </Route>

        <Route exact path="/createLecture"  element={<CreateLecture />}>
        
        </Route>

        <Route exact path="/addterms"  element={<AddTerms />}>
        
        </Route>

          <Route exact path="/NoticeToggle"  element={<NoticeToggle />}>
   
      </Route>

      <Route exact path="/classificationTheory"  element={<ClassificationTheory />}>
   
   </Route>
      <Route exact path="/CourseInfo"  element={<CourseInfo />}>
      
      </Route>
      <Route exact path="/blockly2"  element={<Blockly2 />}>
      
      </Route>
     
      <Route exact path="/login" element={<Login />}>
        
      </Route>
      <Route exact path="/register"  element={<Register />}>
       
      </Route>

      <Route exact path="/courseInfo1" element={<CourseInfo1 />}>
       
      </Route>
      <Route exact path="/home" element={<Home />}>
       
      </Route>

        <Route exact path="/product" element={<Courses1 />}> 
       
          </Route> 
        <Route exact path="/About"element={<About />} ></Route>


        <Route exact path="/Courses1" element={<Courses1 />}> </Route> 
        <Route exact path="/Contact" element={<Contact />}> </Route>
        

      <Route exact path="/DashBoardCourse"  element={<AdminRoute ><CourseDashboardInfo /></AdminRoute>} />
      <Route exact path="/category"  element={<AdminRoute ><Category /></AdminRoute>}>
   </Route>


   <Route exact path="/chapter"  element={<AdminRoute ><Chapter /></AdminRoute>} />
   <Route exact path="/teacherdash"  element={<AdminRoute ><Teacher /></AdminRoute>} />
   <Route exact path="/studentdash"  element={<AdminRoute ><Student /></AdminRoute>} />
   <Route exact path="/createdashcourse"  element={<AdminRoute ><CreateCourse /></AdminRoute>} />
   <Route exact path="/createdashUser"  element={<AdminRoute ><CreateDashUser /></AdminRoute>} />
   <Route exact path="/updatedashRole"  element={<UpdateDashRole />} />
   <Route exact path="/updatedashCourse"  element={<AdminRoute ><UpdateDashCourse /></AdminRoute>} />
   <Route exact path="/sidebarteacher"  element={<TeacherRoute><SidebarTeacher /></TeacherRoute>} />
   <Route exact path="/updatedashCourse"  element={<AdminRoute ><UpdateDashCourse /></AdminRoute>} />
   <Route exact path="/teacherDashboard"  element={<TeacherRoute><TeacherDash /></TeacherRoute>} />
   <Route exact path="/teachercourses"  element={<TeacherRoute><TeacherCourses /></TeacherRoute>} />
   <Route exact path="/newteachercourses"  element={<TeacherRoute><NewCourse /></TeacherRoute>} />
   <Route exact path="/coursesInfo"  element={<CoursesInfo />} />
   <Route exact path="/CourseChapter"  element={<CourseChapter />} />
   <Route exact path="/CourseCategory"  element={<CourseCategory />} />
   <Route exact path="/codeEditor"  element={<MyCodeEditor />} />
   <Route exact path="/student"  element={<StudentInfo />} />
   <Route exact path="/studentDetails"  element={<TeacherRoute><StudentsDetails /></TeacherRoute>} />
   <Route exact path="/TeacherDashCourse"  element={<TeacherRoute><TeacherCourse /></TeacherRoute>} />
   <Route exact path="/TeacherDashCategory"  element={<TeacherRoute><TeacherCategory /></TeacherRoute>} />
   <Route exact path="/TeacherDashChapter"  element={<TeacherRoute><TeacherChapter /></TeacherRoute>} />
   <Route exact path="/updatePassword"  element={<UpdatePassword />} />
   <Route exact path="/yjseditor"  element={<Yjs />} />

   <Route exact path="/purchaseCourse" element={<PurchasedCourses />}>
    
    </Route>

    <Route path="/entrepreneurship" element={<AllUser><Entrepreneurship /></AllUser>} />  
          <Route path="/classification" element={<AllUser><Classification /></AllUser>} />
          <Route path="/regression" element={<AllUser><Regression /></AllUser>} />
          <Route path="/clustering" element={<AllUser><Clustering /></AllUser>} />
          <Route path="/pca" element={<AllUser><PCA /></AllUser>} />
          <Route path="/sentiment-analysis" element={<AllUser><SentimentAnalysis /></AllUser>} />
          <Route path="/cnn" element={<AllUser><CNN /></AllUser>} />
          <Route path="/nlp" element={<AllUser><NLP /></AllUser>} />
          <Route path="/tfidf" element={<AllUser><TFIDF /></AllUser>} />
          <Route path="/problem-canvas" element={<AllUser><ProblemCanvas /></AllUser>} />
          <Route path="/data-visualization" element={<AllUser><DataVisualization /></AllUser>} />
          <Route path="/species-identifier" element={<AllUser><SpeciesIdentifier /></AllUser>} />
          <Route path="/aiModel" element={<AllUser><AIModel /></AllUser>} />
          <Route path="/mlModel" element={<AllUser><MLModel /></AllUser>} />
          <Route path="/caseStudy" element={<AllUser><EntrepreneurshipO /></AllUser>} />

    <Route  path="*" element={<NotFound />}>
      
    </Route>

     
  
    </Routes>
    </div>
  );
};

function App() {

  return (


    <div>
    
      <Router>
        
        <Routing />
      </Router>
      
    </div>
  );
}

export default App;
