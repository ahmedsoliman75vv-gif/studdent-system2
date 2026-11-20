 
class Student {
    #name;
    #grade1;
    #grade2;
    #grade3;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {
        this.name = name;
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;
    }

    set name(value) {
        if (!value || value.trim() === "") {
            throw new Error("يجب كتابة اسم الطالب بشكل صحيح ولا يمكن ترك الحقل فارغاً.");
        }
        this.#name = value.trim();
    }
    get name() { return this.#name; }

    set grade1(value) {
        if (value === "" || value === null || isNaN(value)) {
            throw new Error("حقل درجة المادة الأولى لا يمكن أن يكون فارغاً.");
        }
        let num = Number(value);
        if (num < 0 || num > 100) {
            throw new Error("الدرجة يجب أن تكون قيمة صحيحة بين 0 و 100.");
        }
        this.#grade1 = num;
    }
    get grade1() { return this.#grade1; }

    set grade2(value) {
        if (value === "" || value === null || isNaN(value)) {
            throw new Error("حقل درجة المادة الثانية لا يمكن أن يكون فارغاً.");
        }
        let num = Number(value);
        if (num < 0 || num > 100) {
            throw new Error("الدرجة يجب أن تكون قيمة صحيحة بين 0 و 100.");
        }
        this.#grade2 = num;
    }
    get grade2() { return this.#grade2; }

    set grade3(value) {
        if (value === "" || value === null || isNaN(value)) {
            throw new Error("حقل درجة المادة الثالثة لا يمكن أن يكون فارغاً.");
        }
        let num = Number(value);
        if (num < 0 || num > 100) {
            throw new Error("الدرجة يجب أن تكون قيمة صحيحة بين 0 و 100.");
        }
        this.#grade3 = num;
    }
    get grade3() { return this.#grade3; }

    set attendance(value) {
        if (value === "" || value === null || isNaN(value)) {
            throw new Error("حقل نسبة الحضور لا يمكن أن يكون فارغاً.");
        }
        let num = Number(value);
        if (num < 0 || num > 100) {
            throw new Error("نسبة الحضور يجب أن تكون بين 0 و 100.");
        }
        this.#attendance = num;
    }
    get attendance() { return this.#attendance; }

    calculateAverage() {
        return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
    }
}


// --- التفاعل مع الشاشة وامعرفة الأخطاء 
const studentsList = [];

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsContainer = document.getElementById("studentsListContainer");
const mercyReportBox = document.getElementById("mercyReportBox");

function showError(message) {
    if (message) {
        errorBox.textContent = message;
        errorBox.classList.remove("d-none");
    } else {
        errorBox.textContent = "";
        errorBox.classList.add("d-none");
    }
}

function clearInputs() {
    nameInput.value = "";
    grade1Input.value = "";
    grade2Input.value = "";
    grade3Input.value = "";
    attendanceInput.value = "";
}

function renderStudentsList() {
    if (studentsList.length === 0) {
        studentsContainer.innerHTML = `<li class="list-group-item text-muted border-0 bg-transparent">لا توجد بيانات مضافة حتى الآن...</li>`;
        return;
    }

    studentsContainer.innerHTML = "";
    studentsList.forEach((st, index) => {
        let avg = st.calculateAverage().toFixed(1);
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center shadow-sm";
        li.innerHTML = `
            <span><strong>${index + 1}. ${st.name}</strong></span>
            <span class="badge bg-primary rounded-pill">المتوسط: ${avg}</span>
        `;
        studentsContainer.appendChild(li);
    });
}

addBtn.addEventListener("click", function() {
    showError("");

    try {
        let newStudent = new Student(
            nameInput.value,
            grade1Input.value,
            grade2Input.value,
            grade3Input.value,
            attendanceInput.value
        );

        studentsList.push(newStudent);
        renderStudentsList();
        clearInputs();

    } catch (error) {
        showError(error.message);
    }
});


// --- لجنة الرأفة  ---
mercyBtn.addEventListener("click", function() {
    if (studentsList.length === 0) {
        mercyReportBox.innerHTML = `<div class="alert alert-warning mb-0">لا توجد قائمة طلاب لفحصهم في لجنة الرأفة حالياً!</div>`;
        return;
    }

    const strugglingStudents = studentsList.filter(st => {
        let avg = st.calculateAverage();
        return avg >= 40 && avg < 50;
    });

    if (strugglingStudents.length === 0) {
        mercyReportBox.innerHTML = `<div class="alert alert-info mb-0">لا يوجد طلاب متعثرين في الفئة (من 40 إلى 49) لتطبيق الرأفة عليهم.</div>`;
        return;
    }

    const updatedAverages = strugglingStudents.map(st => {
        let oldAvg = st.calculateAverage();
        let newAvg = oldAvg + 5;
        return newAvg > 100 ? 100 : newAvg;
    });

    const sumAverages = updatedAverages.reduce((acc, current) => acc + current, 0);
    const generalAverageAfterMercy = strugglingStudents.length > 0 
        ? (sumAverages / strugglingStudents.length).toFixed(2) 
        : 0;

    let namesListHTML = strugglingStudents.map(st => `<span class="badge bg-secondary ms-1">${st.name}</span>`).join(" ");

    mercyReportBox.innerHTML = `
        <div class="alert alert-success">
            <h5 class="alert-heading">تم تطبيق لجنة الرأفة بنجاح!</h5>
            <hr>
            <p class="mb-2"><strong>عدد الطلاب المتعثرين المستفيدين:</strong> ${strugglingStudents.length}</p>
            <p class="mb-2"><strong>أسماء الطلاب:</strong> ${namesListHTML}</p>
            <p class="mb-0"><strong>المتوسط العام لدرجاتهم بعد الرأفة:</strong> <span class="badge bg-dark">${generalAverageAfterMercy}</span></p>
        </div>
    `;
});