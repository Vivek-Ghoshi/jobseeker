import Login from './pages/auth/Login'
import { Route, Routes } from 'react-router'
import ChooseRole from './components/ChooseRole'
import EmployerSignup from './pages/employer/EmployerSignup'
import JobSeekerSignup from './pages/seeker/JobSeekerSignup'
import Navbar from './components/Navbar'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import JobseekerDashboard from './pages/seeker/JobSeekerDashboard'
import UpdateEmployerProfile from './pages/employer/UpdateEmployerProfile'
import UpdateJobseekerProfile from './pages/seeker/UpdateJobseekerProfile'
import CreateJobForm from './pages/Jobs/CreateJobForm'
import AllListedJobs from './pages/Jobs/AllListedJobs'
import EmployerCreatedJobs from './pages/employer/EmployerCreatedJobs'
import JobApplicationPage from './pages/Jobs/JobApplicationPage'
import AllApplications from './pages/seeker/AllApplications'
import ReceivedApplicationsPage from './pages/Jobs/ReceivedApplicationsPage'
import ViewApplicationPage from './pages/employer/ViewApplicationPage'
import ResumeTemplates from './pages/resume/ResumeTemplates'
import ResumeBuilder from './pages/resume/ResumeBuilder'
import AllResumeList from './pages/resume/AllResumeList'
import ResumeScoreAnalysis from './pages/resume/ResumeScoreAnalysis'
import UpdateJob from './pages/Jobs/UpdateJob'
import NotFound from './pages/auth/NotFound'
import InterviewQuestions from './pages/Interview/InterviewQuestions'
import Unauthorized from './pages/auth/Unauthorized'
import ProtectedRoute from './utils/ProtectedRoute'
import ScheduledInterviews from './pages/Interview/ScheduledInterviewes'
import InterviewReportCard from './pages/Interview/InterviewReportCard'
import AllScoreCards from './pages/Interview/AllScoreCards'
import MeetingDetailsPage from './pages/Interview/MeetingDetailsPage'
import SelectTimeSlots from './pages/timeSlots/SelectTimeSlots'
import InterviewMeeting from './pages/Interview/InterviewMeeting'
import ExamPage from './pages/Interview/ExamPage'

const App = () => {
  return (
       <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/signup/employer" element={<EmployerSignup />} />
        <Route path="/signup/jobseeker" element={<JobSeekerSignup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Employer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
          <Route path="/dashboard/employer" element={<EmployerDashboard />} />
          <Route path="/employer/update-profile" element={<UpdateEmployerProfile />} />
          <Route path="/employer/create-openings" element={<CreateJobForm />} />
          <Route path="/employer/created-jobs" element={<EmployerCreatedJobs />} />
          <Route path="/applications/employer/job/:id" element={<ReceivedApplicationsPage />} />
          <Route path="/application/:id" element={<ViewApplicationPage />} />
          <Route path="/application/report-card/:id" element={<InterviewReportCard/>} />
          <Route path="/applications/report-card/all/:id" element={<AllScoreCards/>} />
          <Route path="/sheduled/interviews" element={<ScheduledInterviews />} />
          
          <Route path="/employer/resume-score" element={<ResumeScoreAnalysis />} />
          <Route path="/employer/update-job/:id" element={<UpdateJob />} />
        </Route>

        {/* Jobseeker Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
          <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} />
          <Route path="/jobseeker/update-profile" element={<UpdateJobseekerProfile />} />
          <Route path="/jobs/all" element={<AllListedJobs />} />
          <Route path="/job-application/:id" element={<JobApplicationPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/jobseeker/all-applications" element={<AllApplications />} />
          <Route path="/select/interview/timeslots" element={<SelectTimeSlots />} />
        </Route>

        {/* Shared Protected Routes (both roles) */}
        <Route element={<ProtectedRoute allowedRoles={['jobseeker', 'employer']} />}>
          <Route path="/interview/questions" element={<InterviewQuestions />} />
          <Route path="/resume/builder" element={<ResumeBuilder />} />
          <Route path="/all-resumelist" element={<AllResumeList />} />
          <Route path="/resume-builder/templates/list" element={<ResumeTemplates />} />
          <Route path="/meeting/details" element={<MeetingDetailsPage />} />
          <Route path="/meeting/page" element={<InterviewMeeting />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    // <div>
    //   <Navbar/>
      
    //   <Routes>
    //     {/* {routes for login & signup} */}
    //     <Route path='/' element={<Login/>}/>
    //     <Route path='/choose-role' element={<ChooseRole/>}/>
    //     <Route path='/signup/employer' element={<EmployerSignup/>}/>
    //     <Route path='/signup/jobseeker' element={<JobSeekerSignup/>}/>
        
    //     {/* {empolyer routes} */}
    //     <Route path='/dashboard/employer' element={<EmployerDashboard/>}/>
    //     <Route path='/employer/update-profile' element={<UpdateEmployerProfile/>}/>
    //     <Route path='/employer/create-openings' element={<CreateJobForm/>}/>
    //     <Route path='/employer/created-jobs' element={<EmployerCreatedJobs/>}/>
    //     <Route path='/applications/employer/job/:id' element={<ReceivedApplicationsPage/>}/>
    //     <Route path='/application/:id' element={<ViewApplicationPage/>}/>
    //     <Route path='/employer/resume-score' element={<ResumeScoreAnalysis/>}/>
    //     <Route path='/employer/update-job/:id' element={<UpdateJob/>}/>
    //     <Route path='/employer/interview/web-cam' element={<ProctoringDemo/>}/>

    //     {/* {comman routes} */}
    //     <Route path='/interview/questions' element={<InterviewQuestions/>}/>
    //     <Route path='/resume/builder' element={<ResumeBuilder/>}/>
    //     <Route path='/all-resumelist' element={<AllResumeList/>}/>
    //     <Route path='/resume-builder/templates/list' element={<ResumeTemplates/>}/>

    //     {/* {jobseeker routes} */}
    //     <Route path='/dashboard/jobseeker' element={<JobseekerDashboard/>}/>
    //     <Route path='/jobseeker/update-profile' element={<UpdateJobseekerProfile/>}/>
    //     <Route path='/jobs/all' element={<AllListedJobs/>}/>
    //     <Route path='/job-application/:id' element={<JobApplicationPage/>}/>
    //     <Route path='/jobseeker/all-applications' element={<AllApplications/>}/>
        

    //     {/* {unauthorised route or error404 route} */}
    //     <Route path='*' element={<NotFound/>}/>

    //   </Routes>
      
    // </div>
  )
}

export default App
