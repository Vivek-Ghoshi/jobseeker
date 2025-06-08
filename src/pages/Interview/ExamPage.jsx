import React from 'react'
import Scorecard from './ScoreCard';
import ProctoringDemo from './ProctoringDemo';
import InterviewQuestions from './InterviewQuestions';
import { useSelector } from 'react-redux';
const questions = {
    "questions": {
        "Basic background and introduction questions": [
            {
                "id": "qs-1",
                "question": "Can you walk me through your journey as a developer and how it has prepared you for a role as an Operation Manager?"
            },
            {
                "id": "qs-2",
                "question": "What motivated you to transition from a technical role focused on React, Express, and MongoDB to an operations management position?"
            }
        ],
        "Education and certifications questions": [
            {
                "id": "qs-3",
                "question": "Can you describe how your educational background has contributed to your technical expertise, particularly in full-stack development?"
            },
            {
                "id": "qs-4",
                "question": "Have you pursued any additional certifications or training related to project management, operations, or technical leadership? If so, how have they influenced your work?"
            }
        ],
        "Work experience and projects questions": [
            {
                "id": "qs-5",
                "question": "Please describe a complex project where you utilized React JS, Express JS, and MongoDB together. What were the key technical challenges, and how did you overcome them?"
            },
            {
                "id": "qs-6",
                "question": "Can you share an example of a time when you optimized a web application’s performance, particularly focusing on front-end animations and back-end API responses?"
            }
        ],
        "Technical and skill-based questions": [
            {
                "id": "qs-7",
                "question": "How do you design a scalable system architecture using Express JS and MongoDB to handle high traffic while ensuring data consistency?"
            },
            {
                "id": "qs-8",
                "question": "Explain your approach to debugging and optimizing a React application that suffers from slow rendering and poor animation performance."
            }
        ],
        "Behavioral and situational questions": [
            {
                "id": "qs-9",
                "question": "Imagine you are managing a cross-functional team where developers and operations staff have conflicting priorities. How would you handle this to ensure project success?"
            },
            {
                "id": "qs-10",
                "question": "Describe a situation where a critical deployment failed. How did you manage the technical troubleshooting and communicate with stakeholders during this incident?"
            }
        ]
    },
    "max_possible_score": 100
}
const ExamPage = () => {
    const {questions} = useSelector(state => state.interview);
    const handleScoreSubmit = (data) => {
     console.log("Submitting to backend:", data);
    // dispatch(submitScoreThunk(data)) or call API
  };
  return (
    <div className='relative'>
        <ProctoringDemo/>
        <InterviewQuestions/>
      {/* {questions && (<Scorecard questions={questions.questions} onSubmit={handleScoreSubmit}/>)} */}
    </div>
  )
}

export default ExamPage



// import Scorecard from "@/components/interview/Scorecard"; // adjust based on your alias/path
// import { useSelector } from "react-redux";

// const InterviewPage = () => {
//   const questions = useSelector((state) => state.interview.questions);

//   const handleScoreSubmit = (data) => {
//     console.log("Submitting to backend:", data);
//     // dispatch(submitScoreThunk(data)) or call API
//   };

//   return (
//     <div>
//       {/* your page layout and video/interview UI */}
      
//       {questions && <Scorecard questions={questions} onSubmit={handleScoreSubmit} />}
//     </div>
//   );
// };
