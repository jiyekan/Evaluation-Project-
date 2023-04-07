class CourseSelectView {
    constructor() {
        this.avaiableCourses = document.querySelector(".available-courses-content-container");
        this.selectedCourses = document.querySelector(".selected-courses-container");
    }

    renderCourses(courses){
        this.avaiableCourses.innerHTML="";
        
        courses.forEach((course) => {
            const courseElem = this.createCourseElement(course);
            this.avaiableCourses.appendChild(courseElem);
        })
    }

    createCourseElement(course) {
        const courseElem = document.createElement("div");
        courseElem.classList.add("course-elem");

        const courseElemBtn = document.createElement("button");
        courseElemBtn.classList.add("course-elem-btn");
        courseElemBtn.setAttribute("course-id", course.courseId);
        courseElemBtn.setAttribute("clicked", "false");

        const {courseId, required} = course;
        if(courseId % 2 === 1){
            courseElemBtn.classList.add("green");
        }

        const courseName=document.createElement("div");
        courseName.classList.add("course__name");
        courseName.innerText=course.courseName;
        courseName.setAttribute("course-id", course.courseId);

        const courseType=document.createElement("div");
        courseType.classList.add("course__type");
        const typePrefix = "Course Type: ";
        if(required) {
            courseType.innerText = typePrefix + " Compulsory";
        } else {
            courseType.innerText = typePrefix + " Elective";
        }
        courseType.setAttribute("course-id", course.courseId);
        
        const courseCredit=document.createElement("div");
        courseCredit.classList.add("course__credit");
        const creditPrefix = "Course credit: ";
        courseCredit.innerText=creditPrefix + course.credit;
        courseCredit.setAttribute("course-id", course.courseId);

        courseElem.appendChild(courseElemBtn);
        courseElemBtn.appendChild(courseName);
        courseElemBtn.appendChild(courseType);
        courseElemBtn.appendChild(courseCredit);
        
        return courseElem;
    }
}

class CourseSelectModel {
    constructor(){
        this.courses=[];
        this.selectedCourses = [];
        this.totalCreditsSelected = 0;
    }

    async fetchCourses() {
        const courses = await API.getCourseList();
        this.courses = courses;
        return courses;
    }

    updateCourseSelection(courseId){
        if(this.selectedCourses.includes(this.courses[parseInt(courseId) - 1])){
            this.avaiableCourses[]
        }
    }
}

class CourseSelectController{
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.init();
    }


    init(){
        this.model.fetchCourses().then(() => {
            const courses = this.model.courses;
            this.view.renderCourses(courses);
            this.setUpSelectedCourse();
        })
    }
}

const app = new CourseSelectController(new CourseSelectModel(), new CourseSelectView());