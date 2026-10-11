document.addEventListener("DOMContentLoaded", function () {

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

    const pages = document.querySelectorAll(".page");

    function showPage(pageId) {
        pages.forEach(function (page) {
            page.classList.remove("active");
        });
        document.getElementById("page-" + pageId).classList.add("active");
        window.scrollTo(0, 0);
    }

    document.querySelectorAll("[data-page]").forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.page);
        });
    });

    // WIZARD NAVIGATION
    document.getElementById("toStep2").addEventListener("click", function () {
        if (!document.getElementById("officeProvince").value) {
            alert("Please choose a province first.");
            return;
        }
        changeStep(2);
    });

    document.getElementById("backToStep1").addEventListener("click", function () {
        changeStep(1);
    });

    document.getElementById("toStep3").addEventListener("click", function () {
        if (!document.getElementById("officeTown").value.trim()) {
            alert("Please enter the town, township or suburb.");
            return;
        }
        changeStep(3);
    });

    document.getElementById("backToStep2").addEventListener("click", function () {
        changeStep(2);
    });

    function changeStep(stepNumber) {
        document.querySelectorAll(".wizard-step").forEach(function (step) {
            step.classList.remove("active");
        });
        document.getElementById("step-" + stepNumber).classList.add("active");
    }

    // SAVE NEW OFFICE
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
            serving: 0,
            queue: 0,
            firstServed: ""
        });

        document.getElementById("officeTown").value = "";
        document.getElementById("officeName").value = "";
        document.getElementById("officeDepartment").value = "";

        changeStep(1);
        showPage("monitor");
        renderOffices();
        fillOfficeDropdowns();
        alert("Office added successfully.");
    });

    // RENDER OFFICES
    function renderOffices() {
        const list = document.getElementById("officeList");
        list.innerHTML = "";

        if (offices.length === 0) {
            list.innerHTML = "<div class='card'>No offices added yet.</div>";
            return;
        }

        offices.forEach(function (office, index) {
            const waiting = Math.max(0, office.queue - office.serving);
            const waitMinutes = waiting * 3;
            const noShelter = office.shelter === "No";
            const staticQueue = office.queue > 0 && office.serving === 0;

            const card = document.createElement("div");
            card.className = "office-card " + (noShelter || staticQueue ? "warning" : "good");

            card.innerHTML = `
                <div class="office-header">
                    <div>
                        <strong>${office.department}</strong><br>
                        <small>${office.name}</small>
                    </div>
                    <span class="badge ${noShelter || staticQueue ? "" : "good"}">
                        ${noShelter || staticQueue ? "ATTENTION" : "ACTIVE"}
                    </span>
                </div>

                <div class="counter-grid">
                    <div class="counter-box">
                        <small>Now Serving</small>
                        <strong>${office.serving}</strong>
                    </div>
                    <div class="counter-box">
                        <small>People Waiting</small>
                        <strong>${waiting}</strong>
                    </div>
                </div>

                <div class="office-details">
                    <strong>Province:</strong> ${office.province}<br>
                    <strong>Town:</strong> ${office.town}<br>
                    <strong>Official opening:</strong> ${office.openingTime}<br>
                    <strong>First person served:</strong> ${office.firstServed || "Not recorded"}<br>
                    <strong>Estimated wait:</strong> ${waitMinutes} minutes<br>
                    <strong>Shelter:</strong> ${office.shelter}
                </div>

                ${noShelter ? "<p class='note'>⚠️ Citizens may be waiting outside without shelter.</p>" : ""}
                ${staticQueue ? "<p class='note'>⚠️ Queue has not started moving yet.</p>" : ""}

                <button class="btn danger full complaint-for-office" data-index="${index}">
                    ⚠️ Report Problem at This Office
                </button>
            `;

            list.appendChild(card);
        });

        document.querySelectorAll(".complaint-for-office").forEach(function (button) {
            button.addEventListener("click", function () {
                const office = offices[button.dataset.index];
                document.getElementById("complaintOffice").value = office.name;
                showPage("complaints");
            });
        });
    }

    // FILL DROPDOWNS
    function fillOfficeDropdowns() {
        const complaintSelect = document.getElementById("complaintOffice");
        const guardSelect = document.getElementById("guardOffice");

        complaintSelect.innerHTML = "<option value=''>-- Choose Office --</option>";
        guardSelect.innerHTML = "<option value=''>-- Choose Office --</option>";

        offices.forEach(function (office) {
            const optionText = office.name + " - " + office.town + ", " + office.province;

            const option1 = document.createElement("option");
            option1.value = office.name;
            option1.textContent = optionText;
            complaintSelect.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = office.name;
            option2.textContent = optionText;
            guardSelect.appendChild(option2);
        });
    }

    // GUARD UPDATE
    document.getElementById("updateQueue").addEventListener("click", function () {
        const pin = prompt("Enter Guard PIN:");
        if (pin !== GUARD_PIN) {
            alert("Access denied.");
            return;
        }

        const officeName = document.getElementById("guardOffice").value;
        const serving = parseInt(document.getElementById("guardServing").value) || 0;
        const queue = parseInt(document.getElementById("guardQueue").value) || 0;
        const firstServed = document.getElementById("guardFirstServed").value;

        const office = offices.find(function (item) {
            return item.name === officeName;
        });

        if (!office) {
            alert("Please choose an office.");
            return;
        }

        office.serving = serving;
        office.queue = queue;
        office.firstServed = firstServed;

        renderOffices();
        showPage("monitor");
        alert("Queue information updated.");
    });

    // SUBMIT COMPLAINT
    document.getElementById("submitComplaint").addEventListener("click", function () {
        const complainant = document.getElementById("complainantName").value.trim();
        const complainantProvince = document.getElementById("complainantProvince").value;
        const affected = document.getElementById("affectedPerson").value.trim();
        const officeName = document.getElementById("complaintOffice").value;
        const type = document.getElementById("complaintType").value;
        const details = document.getElementById("complaintDetails").value.trim();

        if (!complainant || !complainantProvince || !affected || !officeName || !type || !details) {
            alert("Please complete all complaint fields.");
            return;
        }

        const reference = "MQSA-" + Date.now();

        complaints.push({
            reference: reference,
            complainant: complainant,
            complainantProvince: complainantProvince,
            affected: affected,
            office: officeName,
            type: type,
            details: details,
            date: new Date().toLocaleString()
        });

        renderComplaints();

        document.getElementById("complainantName").value = "";
        document.getElementById("affectedPerson").value = "";
        document.getElementById("complaintDetails").value = "";

        alert("Complaint submitted.
Reference: " + reference);
    });

    function renderComplaints() {
        const list = document.getElementById("complaintList");
        list.innerHTML = "";

        if (complaints.length === 0) {
            list.innerHTML = "<p>No complaints submitted yet.</p>";
            return;
        }

        complaints.forEach(function (complaint) {
            const item = document.createElement("div");
            item.className = "complaint-item";
            item.innerHTML = `
                <strong>${complaint.type}</strong>
                Reference: ${complaint.reference}<br>
                Office: ${complaint.office}<br>
                Reported by: ${complaint.complainant} (${complaint.complainantProvince})<br>
                Person affected: ${complaint.affected}<br>
                Details: ${complaint.details}<br>
                Date: ${complaint.date}
            `;
            list.appendChild(item);
        });
    }

    // START APP
    renderOffices();
    fillOfficeDropdowns();
    renderComplaints();
    showPage("home");

});
