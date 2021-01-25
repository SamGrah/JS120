// eslint-disable-next-line max-lines-per-function
// Examples of created student objects with grades; methods on the objects are
// not shown here for brevity.
// The following are only showing the properties that aren't methods for the
//three objects
let foo = {
  name: 'foo',
  year: '3rd',
  courses: [
    { name: 'Math', code: 101, grade: 95, },
    { name: 'Advanced Math', code: 102, grade: 90, },
    { name: 'Physics', code: 202, }
  ],
};

let bar =
{
  name: 'bar',
  year: '1st',
  courses: [
    { name: 'Math', code: 101, grade: 91, },
  ],
};

let qux =
{
  name: 'qux',
  year: '2nd',
  courses: [
    { name: 'Math', code: 101, grade: 93, },
    { name: 'Advanced Math', code: 102, grade: 90, },
   ],
};


let school = {
  students: [],

  addStudent: function addStudent(student) {
    if (['1st', '2nd', '3rd', '4th', '5th'].includes(student.year)) {
      this.students.push(student);
      return student;
    }
    return 'Invalid Year';
  },

  enrollStudent: function enrollStudent(student, course) {
    student.courses.push(course);
  },

  addGrade: function addGrade(student, courseCode, grade) {
    student.courses.forEach(course => {
      if (course.code === courseCode) course.grade = grade;
    });
  },

  getReportCard: function getReportCard(student) {
    console.log('');
    student.courses.forEach(course => {
      let grade = course.hasOwnProperty('grade') ? course.grade : 'In Progress';
      console.log(`${course.name} ${grade}`);
    });
  },

  courseReport: function courseReport(courseName) {
    console.log(`\n==${courseName} Grades==`);

    let grades = [];
    this.students.forEach(student => {
      student.courses.forEach(course => {
        if (course.name === courseName) {
          let grade = course.hasOwnProperty('grade') ? course.grade : 'In Progress';
          if (!isNaN(grade)) grades.push(grade);
          console.log(`${student.name}: ${grade}`);
        }
      });
    });

    let average = grades.reduce((acc, val) => acc + val, 0) / grades.length;
    console.log(`Course Average: ${average || 'NA'}`);
  },
};


school.addStudent(foo);
school.addStudent(bar);
school.addStudent(qux);
//school.getReportCard(foo);
// = Math: 95
// = Advanced Math: 90
// = Physics: In progress


school.courseReport('Math');
// = =Math Grades=
// = foo: 95
// = bar: 91
// = qux: 93
// = ---
// = Course Average: 93

school.courseReport('Advanced Math');
// = =Advanced Math Grades=
// = foo: 90
// = qux: 90
// = ---
// = Course Average: 90

school.courseReport('Physics');
// = undefined