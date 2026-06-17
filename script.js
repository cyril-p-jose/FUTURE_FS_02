/* =========================
   PROTECT DASHBOARD
========================= */

if(
    localStorage.getItem("loggedIn")
    !== "true"
){
    window.location.href =
    "login.html";
}
/* =========================
   LOCAL STORAGE
========================= */

let leads =
JSON.parse(localStorage.getItem("crmLeads")) ||
sampleLeads;

let selectedLeadId = null;

/* =========================
   ELEMENTS
========================= */

const leadTableBody =
document.getElementById("leadTableBody");

const addLeadBtn =
document.getElementById("addLeadBtn");

const leadModal =
document.getElementById("leadModal");

const detailsModal =
document.getElementById("detailsModal");

const closeModal =
document.getElementById("closeModal");

const closeDetails =
document.getElementById("closeDetails");

const leadForm =
document.getElementById("leadForm");

const searchInput =
document.getElementById("searchInput");

const statusFilter =
document.getElementById("statusFilter");

const notesContainer =
document.getElementById("notesContainer");

const leadDetails =
document.getElementById("leadDetails");

const noteInput =
document.getElementById("noteInput");

const addNoteBtn =
document.getElementById("addNoteBtn");

/* =========================
   SAVE DATA
========================= */

function saveLeads(){

    localStorage.setItem(
        "crmLeads",
        JSON.stringify(leads)
    );

}

/* =========================
   DASHBOARD STATS
========================= */

function updateStats(){

    document.getElementById(
        "totalLeads"
    ).textContent = leads.length;

    document.getElementById(
        "newLeads"
    ).textContent =
    leads.filter(
        lead => lead.status === "New"
    ).length;

    document.getElementById(
        "contactedLeads"
    ).textContent =
    leads.filter(
        lead => lead.status === "Contacted"
    ).length;

    document.getElementById(
        "convertedLeads"
    ).textContent =
    leads.filter(
        lead => lead.status === "Converted"
    ).length;

}

/* =========================
   STATUS BADGE
========================= */

function getStatusClass(status){

    if(status === "New"){
        return "new";
    }

    if(status === "Contacted"){
        return "contacted";
    }

    return "converted";
}

/* =========================
   RENDER TABLE
========================= */

function renderLeads(data = leads){

    leadTableBody.innerHTML = "";

    data.forEach((lead) => {

        const row =
        document.createElement("tr");

        row.innerHTML = `

            <td>${lead.name}</td>

            <td>${lead.email}</td>

            <td>${lead.phone}</td>

            <td>${lead.source}</td>

            <td>

                <span class="status ${getStatusClass(lead.status)}">

                    ${lead.status}

                </span>

            </td>

            <td>

                <button
                    class="action-btn view-btn"
                    onclick="viewLead(${lead.id})">

                    View

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteLead(${lead.id})">

                    Delete

                </button>

            </td>

        `;

        leadTableBody.appendChild(row);

    });

    updateStats();

}

/* =========================
   OPEN ADD LEAD MODAL
========================= */

addLeadBtn.addEventListener(
    "click",
    () => {

        leadModal.style.display = "flex";

    }
);

/* =========================
   CLOSE MODALS
========================= */

closeModal.addEventListener(
    "click",
    () => {

        leadModal.style.display = "none";

    }
);

closeDetails.addEventListener(
    "click",
    () => {

        detailsModal.style.display = "none";

    }
);

window.addEventListener(
    "click",
    (e) => {

        if(e.target === leadModal){

            leadModal.style.display =
            "none";

        }

        if(e.target === detailsModal){

            detailsModal.style.display =
            "none";

        }

    }
);

/* =========================
   ADD LEAD
========================= */

leadForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        const lead = {

            id: Date.now(),

            name:
            document.getElementById(
                "leadName"
            ).value,

            email:
            document.getElementById(
                "leadEmail"
            ).value,

            phone:
            document.getElementById(
                "leadPhone"
            ).value,

            source:
            document.getElementById(
                "leadSource"
            ).value,

            status:"New",

            notes:[]
        };

        leads.push(lead);

        saveLeads();

        renderLeads();

        leadForm.reset();

        leadModal.style.display =
        "none";

    }
);

/* =========================
   DELETE LEAD
========================= */

function deleteLead(id){

    const confirmDelete =
    confirm(
        "Delete this lead?"
    );

    if(!confirmDelete){
        return;
    }

    leads =
    leads.filter(
        lead => lead.id !== id
    );

    saveLeads();

    renderLeads();

}

/* =========================
   VIEW LEAD
========================= */

function viewLead(id){

    selectedLeadId = id;

    const lead =
    leads.find(
        lead => lead.id === id
    );

    leadDetails.innerHTML = `

        <p>

            <strong>Name:</strong>

            ${lead.name}

        </p>

        <p>

            <strong>Email:</strong>

            ${lead.email}

        </p>

        <p>

            <strong>Phone:</strong>

            ${lead.phone}

        </p>

        <p>

            <strong>Source:</strong>

            ${lead.source}

        </p>

        <br>

        <label>

            <strong>Status</strong>

        </label>

        <select
            id="statusSelect">

            <option
            ${lead.status==="New"?"selected":""}>
            New
            </option>

            <option
            ${lead.status==="Contacted"?"selected":""}>
            Contacted
            </option>

            <option
            ${lead.status==="Converted"?"selected":""}>
            Converted
            </option>

        </select>

    `;

    renderNotes(lead);

    detailsModal.style.display =
    "flex";

    setTimeout(() => {

        const statusSelect =
        document.getElementById(
            "statusSelect"
        );

        statusSelect.addEventListener(
            "change",
            (e) => {

                lead.status =
                e.target.value;

                saveLeads();

                renderLeads();

            }
        );

    },100);

}

/* =========================
   NOTES
========================= */

function renderNotes(lead){

    notesContainer.innerHTML = "";

    lead.notes.forEach((note) => {

        const div =
        document.createElement("div");

        div.className =
        "note";

        div.innerHTML = `

            ${note.text}

            <small>

                ${note.date}

            </small>

        `;

        notesContainer.appendChild(
            div
        );

    });

}

addNoteBtn.addEventListener(
    "click",
    () => {

        const text =
        noteInput.value.trim();

        if(!text){
            return;
        }

        const lead =
        leads.find(
            lead =>
            lead.id === selectedLeadId
        );

        lead.notes.push({

            text:text,

            date:
            new Date()
            .toLocaleString()

        });

        saveLeads();

        renderNotes(lead);

        noteInput.value = "";

    }
);

/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    filterLeads
);

/* =========================
   FILTER
========================= */

statusFilter.addEventListener(
    "change",
    filterLeads
);

function filterLeads(){

    const search =
    searchInput.value
    .toLowerCase();

    const status =
    statusFilter.value;

    const filtered =
    leads.filter((lead)=>{

        const matchSearch =

        lead.name
        .toLowerCase()
        .includes(search)

        ||

        lead.email
        .toLowerCase()
        .includes(search);

        const matchStatus =

        status === "all"

        ||

        lead.status === status;

        return (
            matchSearch &&
            matchStatus
        );

    });

    renderLeads(filtered);

}

/* =========================
   INITIAL LOAD
========================= */

renderLeads();

