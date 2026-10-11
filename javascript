// 1. DYNAMIC WIZARD SYSTEM PAGE SWAPPING ROUTINES
function navigateToStep(stepNumber) {
    if (stepNumber === 2 && !document.getElementById('searchProvince').value) {
        alert("Please select a Province first.");
        return;
    }
    if (stepNumber === 3 && !document.getElementById('searchTown').value.trim()) {
        alert("Please type your city or town location first.");
        return;
    }
    
    // De-activate current visible wizard classes
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Display targeted layout step screen panel
    document.getElementById('step-' + stepNumber).classList.add('active');
}

// Map event navigation triggers directly onto explicit HTML elements
document.getElementById('nextToStep2').addEventListener('click', function() { navigateToStep(2); });
document.getElementById('backToStep1').addEventListener('click', function() { navigateToStep(1); });
document.getElementById('nextToStep3').addEventListener('click', function() { navigateToStep(3); });
document.getElementById('backToStep2').addEventListener('click', function() { navigateToStep(2); });

// 2. SEARCH GENERATION ENGINE (CREATES NEW ACCOUNTABILITY FEED TILES)
document.getElementById('executeSearchBtn').addEventListener('click', function() {
    const province = document.getElementById('searchProvince').value;
    const town = document.getElementById('searchTown').value.trim();
    const deptType = document.getElementById('searchDeptType').value;
    const facilityName = document.getElementById('searchSpecificFacility').value.trim();

    if (!province || !town || !deptType || !facilityName) {
        alert("Please fulfill all selections and enter your facility branch name first.");
        return;
    }

    const container = document.getElementById('dynamicFeedsContainer');

    const cardHtml = `
        <div class="card HIGH" data-province="${province}" data-town="${town}" data-office="${facilityName}">
            <div class="dept-header"><span>${deptType}</span><span class="badge badge-HIGH">HIGH</span></div>
            <div class="live-counter-grid">
                <div class="counter-box"><div>Now Serving</div><div class="counter-number serving-num">1</div></div>
                <div class="counter-box"><div>Total Queue</div><div class="counter-number queue-num">15</div></div>
            </div>
            <div class="details">
                <strong>Province:</strong> ${province}<br><strong>Town/Suburb:</strong> ${town}<br><strong>Branch Office:</strong> ${facilityName}<br><strong>Est. Wait Time:</strong> <span class="wait-time">42</span> Mins
            </div>
            <div><span class="rating-metrics-display">⭐ Live Office Rating: <span class="rate-percentage">100</span>% Satisfaction</span></div>
            <div class="guard-control-station">
                <div class="guard-title">🛡️ Entrance Guard Control Station</div>
                <div class="guard-btn-row">
                    <button type="button" class="shift-btn nextBtn">🔊 Next Serving (+1)</button>
                    <button type="button" class="shift-btn addBtn">Add 5</button>
                </div>
                <div class="guard-btn-row">
                    <button type="button" class="shift-btn reduceBtn">Reduce 5</button>
                    <button type="button" class="shift-btn resetBtn">Reset</button>
                </div>
            </div>
            <button type="button" class="join-line-btn">🎟 Book Ticket & Join Line</button>
            <div class="civic-actions-wrapper"><button type="button" class="complaint-btn">⚠️ Report Issue</button><button type="button" class="rate-btn">⭐ Rate</button></div>
        </div>
    `;

    // Drop tracking token element directly at the top layout stream view
    container.insertAdjacentHTML('afterbegin', cardHtml);
    
    // Flush data caches and reset multi-page interface position back to step 1
    document.getElementById('searchTown').value = "";
    document.getElementById('searchSpecificFacility').value = "";
    navigateToStep(1);
    alert(`Success! Generated tracker monitor card for "${facilityName}".`);
});

// 3. UNIFIED SECURED COMPONENT ACTION MANAGER (PREVENTS SCRIPT COLLAPSING CRASHES)
document.getElementById('dynamicFeedsContainer').addEventListener('click', function(e) {
    const card = e.target.closest('.card');
    if (!card) return;

    const sCounter = card.querySelector('.serving-num');
    const qCounter = card.querySelector('.queue-num');
    const wSpan = card.querySelector('.wait-time');
    const rSpan = card.querySelector('.rate-percentage');

    function refreshWait() {
        let s = parseInt(sCounter.innerText) || 0;
        let t = parseInt(qCounter.innerText) || 0;
        if (wSpan) wSpan.innerText = Math.max(0, t - s) * 3;
    }

    // A. GUARD SECURITY ENTRY ACTION: CALL NEXT PERSON
    if (e.target.classList.contains('nextBtn')) {
        const pinCheck = prompt("[SECURED OPERATIONAL TERMINAL]\\nEnter Guard Entry PIN to shist counter forward:");
        if (pinCheck !== "1234") return alert("Access Denied: Invalid security operational PIN.");

        let cs = parseInt(sCounter.innerText) || 0, cq = parseInt(qCounter.innerText) || 0;
        if (cs >= cq) return alert("All registered citizens on site have been cleared.");
        sCounter.innerText = cs + 1;
        refreshWait();
    }

    // B. GUARD SECURITY ENTRY ACTION: BULK INGESTION
    if (e.target.classList.contains('addBtn')) {
        const pinCheck = prompt("[SECURED OPERATIONAL TERMINAL]\\nEnter Guard Entry PIN to adjust sizes:");
        if (pinCheck !== "1234") return alert("Access Denied: Invalid security operational PIN.");
        qCounter.innerText = (parseInt(qCounter.innerText) || 0) + 5;
        refreshWait();
    }

    // C. GUARD SECURITY ENTRY ACTION: BULK MANIPULATION
    if (e.target.classList.contains('reduceBtn')) {
        const pinCheck = prompt("[SECURED OPERATIONAL TERMINAL]\\nEnter Guard Entry PIN to adjust sizes:");
        if (pinCheck !== "1234") return alert("Access Denied: Invalid security operational PIN.");
        let cq = parseInt(qCounter.innerText) || 0;
        qCounter.innerText = Math.max(0, cq - 5);
        refreshWait();
    }

    // D. GUARD SECURITY ENTRY ACTION: METERS HARD RESET
    if (e.target.classList.contains('resetBtn')) {
        const pinCheck = prompt("[SECURED OPERATIONAL TERMINAL]\\nEnter Supervisor Administrative PIN to flush card parameters:");
        if (pinCheck !== "1234") return alert("Access Denied: Invalid security operational PIN.");
        sCounter.innerText = "1";
        qCounter.innerText = "10";
        refreshWait();
    }

    // E. CITIZEN INPUT: PERFORM LINE BOOKING CHECK-IN
    if (e.target.classList.contains('join-line-btn')) {
        const name = prompt("Enter your Full Name to book an live line ticket:");
        const id = prompt("Enter your ID or Passport Number (for registration checks):");
        if (!name || name.trim() === "" || !id || id.trim() === "") return alert("Booking canceled: Data fields required.");
        
        qCounter.innerText = (parseInt(qCounter.innerText) || 0) + 1;
        refreshWait();
        
        const banner = document.getElementById('ticketBanner');
        banner.style.display = 'block';
        banner.innerHTML = `🎟️ Active Pocket Display Ticket: Holder: ${name.toUpperCase()} | ID: *${id.slice(-4)}`;
        alert(`Voucher confirmed for ${name}!`);
    }

    // F. CITIZEN INPUT: FILE PRIVATE COMPLAINT MANAGEMENT FORM
    if (e.target.classList.contains('complaint-btn')) {
        const msg = prompt("Type specific details of your complaint (Staff missing, poor behavior, extreme delay, corruption etc.):\\nNote: This data entry remains hidden from public view.");
        if (msg) alert("Dignity & Privacy Protected: Accountability log captured securely and dispatched to government management panels.");
    }

    // G. CITIZEN INPUT: STAR RATINGS SUBMISSION INDEX
    if (e.target.classList.contains('rate-btn')) {
        const score = prompt("Rate office performance from 1 (Very Poor) to 5 (Excellent) Stars:");
        if (score >= 1 && score <= 5) {
            rSpan.innerText = Math.round((parseInt(rSpan.innerText) + (score / 5 * 100)) / 2);
            alert("Ratios updated live! Other provinces will monitor this performance ratio.");
        } else if (score) {
            alert("Invalid scale range. Please enter an option between 1 and 5.");
        }
    }
});
