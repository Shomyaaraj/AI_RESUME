const mongoose = require('mongoose');

/**
 * job description:string
 * resume text:string
 * self description:string
 * matchscore:int
 * 
 * technical question:
 *          [{ 
 *              question, :" ",
 *                 intention,:" ",
 *                  answer:" "
 *              }]
 * behavioral question :
 *              [{ 
 *              question, :" ",
 *                 intention,:" ",
 *                  answer:" "
 *              }]
 * skill gaps ;[{
 *          skill :" ",
 *          severity:{
 *              type:string,
 *              enum:["low", "medium", "high"]
 *              }}]
 * preparation plan:[{
 *          day:number,
 *          focus: "String", 
 *          task:"string"
 *          }]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question :{
        type:String, 
        required:[true, "Technical question is required"]
    },
    intention:{
        type:String,
        required:[true, "intention is required"]
    },
    answer:{
        type:String,
        required:[true, "answer is required"]
    }
}, {
    _id:false
})

const behavioralQuestionSchema= new mongoose.Schema({
     question :{
        type:String, 
        required:[true, "Technical question is required"]
    },
    intention:{
        type:String,
        required:[true, "intention is required"]
    },
    answer:{
        type:String,
        required:[true, "answer is required"]
    }
}, {
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        requied:[true, "Skill is required"]
    }, 
    severity:{
        type:String,
        enum:["low", "medium", "high"],
        requied:[true, "severity is required"]
    }
},{
    _id:false
})


const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true, "day is required"]
    },
    focus:{
        type:String,
        required:[true, "focus is required"]
    },
    task:{
        type:String,
        required:[true, "task is required"]
    }
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true, "job description is required"]
    },
    resume:{
        type :String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0, 
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps :[skillGapSchema],
    preparationPlan : [preparationPlanSchema]
},{
    timestamps:true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports=interviewReportModel;