const GUARD_PIN = "1234";

let offices = [
    {
        province: "Eastern Cape",
        town: "Lusikisiki",
        department: "Home Affairs",
        name: "Lusikisiki Main Street Branch",
        openingTime: "08:00",
        shelter: "No",
        serving: 105,
        queue: 340,
        firstServed: "08:24"
    }
];

let complaints = [];

/* PAGE OPENING SYSTEM */
function showPage(pageName) {
    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById("page-" + pageName);

    if (!selectedPage) {
        alert("Page not found: " + pageName);
        return;
    }

    selectedPage.classList.add("active");

    if (pageName === "monitor") {
        renderOffices();
    }

    if (pageName === "complaints") {
        fillOfficeDropdowns();
        renderComplaints();
    }

    if (pageName === "guard") {
        fillOfficeDropdowns();
    }

    window.scrollTo(0, 0);
}

/* REGISTRATION STEP SYSTEM */
function changeStep(stepNumber) {
    document.querySelectorAll(".wizard-step").forEach(function (step) {
        step.classList.remove("active");
    });

    const wantedStep = document.getElementById("step-" + stepNumber);

    if (wantedStep) {
        wantedStep.classList.add("active");
    }
}

/* SHOW ALL REGISTERED OFFICES */
function renderOffices() {
    const officeList = document.getElementById("officeList");

    if (!officeList) {
        return;
    }

    officeList.innerHTML = "";

    if (offices.length === 0) {
        officeList.innerHTML = `
            <div class="card">
                <h3>No offices added yet</h3>
                <p>Please use Add Office to create your first queue monitor.</p>
            </div>
        `;
        return;
    }

    offices.forEach(function (office, index) {
        const peopleWaiting = Math.max(0, office.queue - office.serving);
        const estimatedWait = peopleWaiting * 3;
        const noShelter = office.shelter === "No";
        const notMoving = office.queue > 0 && office.serving === 0;
        const needsAttention = noShelter || notMoving;

        const officeCard = document.createElement("div");

        officeCard.className = needsAttention
            ? "office-card warning"
            : "office-card";

        officeCard.innerHTML = `
            <div class="office-header">
                <div>
                    <strong>${office.department}</strong>
                    <small>${office.name}</small>
                </div>

                <span class="badge ${needsAttention ? "warning" : ""}">
                    ${needsAttention ? "ATTENTION" : "LIVE"}
                </span>
            </div>

            <div class="counter-grid">
                <div class="counter-box">
                    <small>NOW SERVING</small>
                    <strong>${office.serving}</strong>
                </div>

                <div class="counter-box">
                    <small>PEOPLE WAITING</small>
                    <strong>${peopleWaiting}</strong>
                </div>
            </div>

            <div class="office-details">
                <strong>Location:</strong> ${office.town}, ${office.province}<br>
                <strong>Office opens:</strong> ${office.openingTime}<br>
                <strong>First person served:</strong> ${office.firstServed || "Not recorded"}<br>
                <strong>Estimated wait:</strong> ${estimatedWait} minutes<br>
                <strong>Queue shelter:</strong> ${office.shelter}
            </div>

            ${noShelter ? `
                <p class="note">
                    ⚠️ Weather warning: people may be waiting outside without shelter.
                </p>
            ` : ""}

            ${notMoving ? `
                <p class="note">
                    ⚠️ Queue has not started moving yet.
                </p>
            ` : ""}

            <button
                type="button"
                class="btn danger full report-office-btn"
                data-office-index="${index}"
            >
                ⚠️ Report a Problem at This Office
            </button>
        `;

        officeList.appendChild(officeCard);
    });

    document.querySelectorAll(".report-office-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const officeIndex = Number(button.dataset.officeIndex);
            const selectedOffice = offices[officeIndex];

            fillOfficeDropdowns();

            const complaintOffice = document.getElementById("complaintOffice");

            if (complaintOffice && selectedOffice) {
                complaintOffice.value = selectedOffice.name;
            }

            showPage("complaints");
        });
    });
}

/* PUT OFFICE NAMES INTO COMPLAINT AND GUARD DROPDOWNS */
function fillOfficeDropdowns() {
    const complaintOffice = document.getElementById("complaintOffice");
    const guardOffice = document.getElementById("guardOffice");

    if (!complaintOffice || !guardOffice) {
        return;
    }

    complaintOffice.innerHTML = `<option value="">-- Choose Office --</option>`;
    guardOffice.innerHTML = `<option value="">-- Choose Office --</option>`;

    offices.forEach(function (office) {
        const displayName = `${office.name} — ${office.town}, ${office.province}`;

        const complaintOption = document.createElement("option");
        complaintOption.value = office.name;
        complaintOption.textContent = displayName;
        complaintOffice.appendChild(complaintOption);

        const guardOption = document.createElement("option");
        guardOption.value = office.name;
        guardOption.textContent = displayName;
        guardOffice.appendChild(guardOption);
    });
}

/* SHOW COMPLAINT RECORDS */
function renderComplaints() {
    const complaintList = document.getElementById("complaintList");

    if (!complaintList) {
        return;
    }

    complaintList.innerHTML = "";

    if (complaints.length === 0) {
        complaintList.innerHTML = "<p>No complaints submitted yet.</p>";
        return;
    }

    complaints.forEach(function (complaint) {
        const item = document.createElement("div");

        item.className = "complaint-item";

        item.innerHTML = `
            <strong>${complaint.type}</strong>
            <strong>Reference:</strong> ${complaint.reference}<br>
            <strong>Office:</strong> ${complaint.office}<br>
            <strong>Person affected:</strong> ${complaint.affectedPerson}<br>
            <strong>Reported by:</strong> ${complaint.complainant}, ${complaint.province}<br>
            <strong>Details:</strong> ${complaint.details}<br>
            <strong>Submitted:</strong> ${complaint.submittedAt}
        `;

        complaintList.appendChild(item);
    });
}

/* START BUTTON ACTIONS ONLY AFTER THE PAGE IS READY */
document.addEventListener("DOMContentLoaded", function () {

    /* HOME BLOCKS AND HOME BUTTONS */
    document.querySelectorAll("[data-page]").forEach(function (button) {
        button.addEventListener("click", function () {
            const pageName = button.dataset.page;
            showPage(pageName);
        });
    });

    /* ADD OFFICE: STEP 1 TO STEP 2 */
    document.getElementById("toStep2").addEventListener("click", function () {
        const province = document.getElementById("officeProvince").value;

        if (!province) {
            alert("Please choose a province first.");
            return;
        }

        changeStep(2);
    });

    /* ADD OFFICE: STEP 2 BACK TO STEP 1 */
    document.getElementById("backToStep1").addEventListener("click", function () {
        changeStep(1);
    });

    /* ADD OFFICE: STEP 2 TO STEP 3 */
    document.getElementById("toStep3").addEventListener("click", function () {
        const town = document.getElementById("officeTown").value.trim();

        if (!town) {
            alert("Please enter the town, township or suburb.");
            return;
        }

        changeStep(3);
    });

    /* ADD OFFICE: STEP 3 BACK TO STEP 2 */
    document.getElementById("backToStep2").addEventListener("click", function () {
        changeStep(2);
    });

    /* SAVE A NEW OFFICE */
    document.getElementById("saveOffice").addEventListener("click", function () {
        const province = document.getElementById("officeProvince").value;
        const town = document.getElementById("officeTown").value.trim();
        const department = document.getElementById("officeDepartment").value;
        const name = document.getElementById("officeName").value.trim();
        const openingTime = document.getElementById("officeOpeningTime").value;
        const shelter = document.getElementById("officeShelter").value;

        if (!province || !town || !department || !name || !openingTime) {
            alert("Please complete all office details.");
            return;
        }

        offices.push({
            province: province,
            town: town,
            department: department,
            name: name,
            openingTime: openingTime,
            shelter: shelter,
            serving: 1,
            queue: 15,
            firstServed: new Date().toTimeString().slice(0, 5)
        });

        document.getElementById("officeProvince").value = "";
        document.getElementById("officeTown").value = "";
        document.getElementById("officeDepartment").value = "";
        document.getElementById("officeName").value = "";
        document.getElementById("officeOpeningTime").value = "08:00";
        document.getElementById("officeShelter").value = "No";

        changeStep(1);
        fillOfficeDropdowns();
        renderOffices();
        showPage("monitor");

        alert("Office registered successfully. You are now viewing the live queue monitor.");
    });

    /* LOAD SELECTED OFFICE DETAILS IN GUARD PORTAL */
    document.getElementById("guardOffice").addEventListener("change", function () {
        const selectedName = this.value;

        const office = offices.find(function (item) {
            return item.name === selectedName;
        });

        if (!office) {
            document.getElementById("guardServing").value = "";
            document.getElementById("guardQueue").value = "";
            document.getElementById("guardFirstServed").value = "";
            return;
        }

        document.getElementById("guardServing").value = office.serving;
        document.getElementById("guardQueue").value = office.queue;
        document.getElementById("guardFirstServed").value = office.firstServed;
    });

    /* GUARD UPDATES QUEUE */
    document.getElementById("updateQueue").addEventListener("click", function () {
        const pin = prompt("Enter Guard PIN:");

        if (pin !== GUARD_PIN) {
            alert("Access denied. The PIN is incorrect.");
            return;
        }

        const selectedOfficeName = document.getElementById("guardOffice").value;
        const serving = Number(document.getElementById("guardServing").value);
        const queue = Number(document.getElementById("guardQueue").value);
        const firstServed = document.getElementById("guardFirstServed").value;

        const office = offices.find(function (item) {
            return item.name === selectedOfficeName;
        });

        if (!office) {
            alert("Please select an office.");
            return;
        }

        if (Number.isNaN(serving) || Number.isNaN(queue) || serving < 0 || queue < 0) {
            alert("Please enter valid queue numbers.");
            return;
        }

        office.serving = serving;
        office.queue = Math.max(queue, serving);
        office.firstServed = firstServed;

        renderOffices();
        showPage("monitor");

        alert("Live queue updated successfully.");
    });

    /* SUBMIT PUBLIC COMPLAINT */
    document.getElementById("submitComplaint").addEventListener("click", function () {
        const complainant = document.getElementById("complainantName").value.trim();
        const province = document.getElementById("complainantProvince").value;
        const affectedPerson = document.getElementById("affectedPerson").value.trim();
        const office = document.getElementById("complaintOffice").value;
        const type = document.getElementById("complaintType").value;
        const details = document.getElementById("complaintDetails").value.trim();

        if (!complainant || !province || !affectedPerson || !office || !type || !details) {
            alert("Please complete every complaint field.");
            return;
        }

        const reference = "MQSA-" + Date.now();

        complaints.unshift({
            reference: reference,
            complainant: complainant,
            province: province,
            affectedPerson: affectedPerson,
            office: office,
            type: type,
            details: details,
            submittedAt: new Date().toLocaleString()
        });

        document.getElementById("complainantName").value = "";
        document.getElementById("complainantProvince").value = "";
        document.getElementById("affectedPerson").value = "";
        document.getElementById("complaintOffice").value = "";
        document.getElementById("complaintType").value = "";
        document.getElementById("complaintDetails").value = "";

        renderComplaints();

        alert(
            "Complaint submitted successfully.

" +
            "Reference number:
" +
            reference
        );
    });

    /*
      TEST MODE:
      The displayed number automatically moves every 10 seconds.
      This is only for your demonstration and testing.
    */
    setInterval(function () {
        offices.forEach(function (office) {
            if (office.serving < office.queue) {
                office.serving += 1;

                if (!office.firstServed) {
                    office.firstServed = new Date().toTimeString().slice(0, 5);
                }
            }
        });

        const monitorPage = document.getElementById("page-monitor");

        if (monitorPage && monitorPage.classList.contains("active")) {
            renderOffices();
        }
    }, 10000);

    /* OPEN WITH HOME PAGE */
    renderOffices();
    fillOfficeDropdowns();
    renderComplaints();
    showPage("home");
});
