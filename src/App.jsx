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

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>

        <Route path='/choose-role' element={<ChooseRole/>}/>
        
        <Route path='/signup/employer' element={<EmployerSignup/>}/>
        <Route path='/signup/jobseeker' element={<JobSeekerSignup/>}/>

        <Route path='/dashboard/employer' element={<EmployerDashboard/>}/>
        <Route path='/employer/update-profile' element={<UpdateEmployerProfile/>}/>
        <Route path='/employer/create-openings' element={<CreateJobForm/>}/>
        <Route path='/employer/created-jobs' element={<EmployerCreatedJobs/>}/>
        <Route path='/applications/employer/job/:id' element={<ReceivedApplicationsPage/>}/>
        <Route path='/application/:id' element={<ViewApplicationPage/>}/>
        <Route path='/employer/resume-score' element={<ResumeScoreAnalysis/>}/>
        <Route path='/employer/update-job/:id' element={<UpdateJob/>}/>

        
        <Route path='/resume/builder' element={<ResumeBuilder/>}/>
        <Route path='/all-resumelist' element={<AllResumeList/>}/>

        <Route path='/dashboard/jobseeker' element={<JobseekerDashboard/>}/>
        <Route path='/jobseeker/update-profile' element={<UpdateJobseekerProfile/>}/>
        <Route path='/jobs/all' element={<AllListedJobs/>}/>
        <Route path='/job-application/:id' element={<JobApplicationPage/>}/>
        <Route path='/jobseeker/all-applications' element={<AllApplications/>}/>
        <Route path='/resume-builder/templates/list' element={<ResumeTemplates/>}/>

      </Routes>
      
    </div>
  )
}

export default App
