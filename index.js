class CourseSelectView {
    constructor() {
        this.avaiableCourses = document.querySelector(".available-courses-content-container");
        this.selectedCourses = document.querySelector(".selected-courses-content-container");
        this.totalCreditsSelected = document.querySelector(".credit");
        this.selectBtn = document.querySelector(".btn-select");
    }

    renderCourses(courses){
        this.avaiableCourses.innerHTML="";
        courses.forEach((course) => {
            const courseElem = this.createCourseElement(course);
            this.avaiableCourses.appendChild(courseElem);
        })
    }

    renderSelectedCourses(courses){
        this.selectedCourses.innerHTML="";
        courses.forEach((course) => {
            if(course.isSelected){
                const selectedCourseElem = this.createCourseElement(course);
                this.selectedCourses.appendChild(selectedCourseElem);
            }
        })
    }

    createCourseElement(course) {
        const courseElem = document.createElement("div");
        courseElem.classList.add("course-elem");
        courseElem.setAttribute("course-id", course.courseId);

        const {courseId, required} = course;
        if(courseId % 2 === 1){
            courseElem.classList.add("green");
        }

        const courseName=document.createElement("div");
        courseName.classList.add("course__name");
        courseName.innerText=course.courseName;
        // courseName.setAttribute("course-id", course.courseId);

        const courseType=document.createElement("div");
        courseType.classList.add("course__type");
        const typePrefix = "Course Type: ";
        if(required) {
            courseType.innerText = typePrefix + " Compulsory";
        } else {
            courseType.innerText = typePrefix + " Elective";
        }
        // courseType.setAttribute("course-id", course.courseId);
        
        const courseCredit=document.createElement("div");
        courseCredit.classList.add("course__credit");
        const creditPrefix = "Course credit: ";
        courseCredit.innerText=creditPrefix + course.credit;
        // courseCredit.setAttribute("course-id", course.courseId);

        courseElem.appendChild(courseName);
        courseElem.appendChild(courseType);
        courseElem.appendChild(courseCredit);
        return courseElem;
    }

    displaySelectedCourse(courseElem){
        courseElem.classList.add("selected");
    }

    undisplaySelectedCourse(courseElem){
        courseElem.classList.remove("selected");
    }

    displayCreditSelected(totalCredit){
        this.totalCreditsSelected.innerText = totalCredit;
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
        this.courses.forEach(course => {
            course.isSelected = false;
        })
        return courses;
    }

    getCourseById(courseId){
        return this.courses[courseId - 1];
    }

    updateClickedCourses(courseId) {
        console.log("updateClicked: Entered");
        const curCourse = this.courses[courseId - 1];
        console.log(curCourse);
        console.log(curCourse.isSelected)
        if(curCourse.isSelected){
            this.totalCreditsSelected -= curCourse.credit;
            const index = this.selectedCourses.indexOf(curCourse);
            this.selectedCourses.splice(index, 1);
            curCourse.isSelected = false;
        } else {
            if(this.totalCreditsSelected + curCourse.credit > 18) {
                alert("You cannot choose more than 18 credits.")
            } else {
                this.totalCreditsSelected += curCourse.credit;
                this.selectedCourses.push(curCourse);
                curCourse.isSelected = true;
            }
        }
        console.log(this.selectedCourses);
        console.log(this.totalCreditsSelected);
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
        })
        this.setUpClickCourse();
        this.setUpSubmitBtn();
        this.view.displayCreditSelected(this.model.totalCreditsSelected);
    }

    setUpClickCourse() {
        this.view.avaiableCourses.addEventListener("click", (e)=>{
            this.handleClickCourse(e);
        })
    }

    setUpSubmitBtn() {
        this.view.selectBtn.addEventListener("click", () => {
            this.handleSubmitBtn();
        })
    }

    handleClickCourse(e){
        const courseElem = e.target.parentElement;
        const courseId = courseElem.getAttribute("course-id");
        const curCourse = this.model.getCourseById(courseId);
        console.log(e.target.parentElement);
        // console.log(courseId);
        this.model.updateClickedCourses(courseId); 
        if(curCourse.isSelected){
            this.view.displaySelectedCourse(courseElem);
        } else {
            this.view.undisplaySelectedCourse(courseElem);
        }
        this.view.displayCreditSelected(this.model.totalCreditsSelected);
    }

    handleSubmitBtn(){
        const confirmMsg = "You have chosen " + `${this.model.totalCreditsSelected}` + " credits for this semester. You cannot change once you submit. Do you want to confirm?"
        let isConfirmed = confirm(confirmMsg);
        if(isConfirmed) {
            console.log("Selection confirmed!");
            this.view.selectBtn.disabled = true;
            const selectedCourses = this.model.selectedCourses; 
            this.view.renderSelectedCourses(selectedCourses);
        }
        
    }
    
}

const app = new CourseSelectController(new CourseSelectModel(), new CourseSelectView());