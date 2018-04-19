const mainView = document.getElementById("main-view");
const singleJobView = document.getElementById("single-job-view");

function fetchStockholmJobs() {
    fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=20")
        .then((response) => response.json())
        .then((jobs) => {
            displayJob(jobs)
            sortAllJobs(jobs)
        })
        .catch((error) => {
            console.log(error)
        });
}

function fetchJobDetails(id) {
    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${id}`)
        .then(response => response.json())
        .then(jobs => displayJobDetails(jobs))
        .catch((error) => {
            console.log(error)
        });
}

/* The 10 latest jobs */
function sortAllJobs(jobs) {
    const jobAdverts = jobs.matchningslista.matchningdata;
    const latestTenJobs = document.getElementById("latest-jobs");

    jobAdverts.sort(function (a, b) {
        const x = a.publiceraddatum;
        const y = b.publiceraddatum;
        if (x < y) { return 1; }
        if (x > y) { return -1; }
        return 0;
    });

    displayTenLatestJobs(jobs);

    function displayTenLatestJobs(jobs) {

        let publishedJobList = `
            <table>
                <tr>
                <th>Titel</th>
                <th>Yrkesbenämning</th>
                <th>Arbetsplats</th>
                <th>Anställningstyp</th>
                <th>Kommun</th>
                <th>Jobblänk</th> 
                <th>Sista ansökningsdatum</th> 
            </tr>`;

        for (const jobAdvert of jobAdverts.slice(0, 10)) {

            publishedJobList += `     
            <tr>
                <td class="moreInfo" data-id="${jobAdvert.annonsid}">
                ${jobAdvert.annonsrubrik}
                </td>
                <td>${jobAdvert.yrkesbenamning}</td>
                <td>${jobAdvert.arbetsplatsnamn}</td>
                <td>${jobAdvert.anstallningstyp}</td>
                <td>${jobAdvert.kommunnamn}</td>
                <td><a href="${jobAdvert.annonsurl}">Gå till annonsen</a></td> 
                <td>${jobAdvert.sista_ansokningsdag}</td> 
            </tr>`;
        }
        publishedJobList += "</table>";
        latestTenJobs.innerHTML = publishedJobList;
        addEventListenerJobTitle();
    }
}

/* All jobs part */
function displayJob(jobs) {
    const allJobs = document.getElementById("all-jobs");
    const totalNumberOfJobs = jobs.matchningslista.antal_platsannonser;
    const job = jobs.matchningslista.matchningdata;
    
    let allJobList = `
    <h2>Antal lediga jobb: ${totalNumberOfJobs}</h2>
        <table>
        <tr>
            <th>Titel</th>
            <th>Yrkesbenämning</th>
            <th>Arbetsplats</th>
            <th>Anställningstyp</th>
            <th>Kommun</th>
            <th>Jobblänk</th> 
            <th>Sista ansökningsdatum</th> 
        </tr>`;

    for (let i = 0; i < job.length; i++) {

        allJobList += ` 
        <tr>
            <td class="moreInfo" data-id="${job[i].annonsid}">
            ${job[i].annonsrubrik}
            </td>
            <td>${job[i].yrkesbenamning} </td>
            <td>${job[i].arbetsplatsnamn} </td>
            <td>${job[i].anstallningstyp} </td>
            <td>${job[i].kommunnamn}</td>
            <td><a href="${job[i].annonsurl}">Gå till annonsen</a> </td> 
            <td>${job[i].sista_ansokningsdag} </td> 
        </tr>`;

    }

    allJobList += "</table>";
    allJobs.innerHTML = allJobList;
    addEventListenerJobTitle();
}

function addEventListenerJobTitle() {
    var moreInfo = document.getElementsByClassName("moreInfo");

    for (let more of moreInfo) {
        more.addEventListener("click", function () {
            fetchJobDetails(this.dataset.id);
            singleJobView.classList.remove("hidden");
            mainView.classList.add("hidden");
        });
    }
}

function displayJobDetails(jobs) {
    let annonsDetaljer = "";
    job = jobs.platsannons.annons;
    conditions = jobs.platsannons.villkor;
    apply = jobs.platsannons.ansokan;
    jobplace = jobs.platsannons.arbetsplats;

    /* following values will return undefined if value is empty: 
    conditions.tilltrade
    apply.epostadress */

    annonsDetaljer += `
            <h2>${job.annonsrubrik}</h2>

            <h3>Om tjänsten</h3>
            <p>Sökes: ${job.yrkesbenamning}</p>
            <p>Anställningstyp: ${job.anstallningstyp}</p>

            <h3>Villkor</h3>
            <p>Varaktighet: ${conditions.varaktighet}</p>
            <p>Arbetstid: ${conditions.arbetstid}</p>
            <p>Tillträde: ${conditions.tilltrade}</p> 
            <p>Lönetyp: ${conditions.lonetyp}</p>
            <p>Löneform: ${conditions.loneform}</p>

            <h3>Ansökan</h3>
            <a target="_blank" href="${apply.webbplats}">Företagets hemsida</a>
            <p>epostadress: ${apply.epostadress}</p>
            <p>sista ansökning: ${apply.sista_ansokningsdag}</p>
            <p>övrigt: ${apply.ovrigt_om_ansokan}</p>

            <h3>Om arbetsplatsen</h3>
            <p>${jobplace.arbetsplatsnamn}</p>
            <p>adress: ${jobplace.postadress}</p>
            <p>besöksadress: ${jobplace.besoksadress}</p>

            <h3>Om tjänsten</h3>
            <p>${job.annonstext}</p>

            <button data-id="${jobs.platsannons.annons.annonsid}" id="saveJobAdButton" name="${jobs.platsannons.annons.annonsrubrik}">Save</button>
        `;

    document.getElementById("annonsdetaljer").innerHTML = annonsDetaljer;

    const backToListButton = document.getElementById("back");

    backToListButton.addEventListener("click", function () {
        mainView.classList.remove("hidden");
        singleJobView.classList.add("hidden");
    });

    const shareUrlButton = document.getElementById("share-url-button");
    const urlDropdown = document.getElementById("url-dropdown");

    shareUrlButton.addEventListener('click', function () {
        if (urlDropdown.classList.contains("hidden")) {
            urlDropdown.classList.remove("hidden")
        }
        else {
            urlDropdown.classList.add("hidden");
        }
    });

    adUrl = document.getElementById("ad-url");
    adUrl.innerHTML = job.platsannonsUrl;
    adUrl.href = job.platsannonsUrl;
    adUrl.target = "_blank";
    urlDropdown.appendChild(adUrl);

    let saveJobAdButton = document.getElementById("saveJobAdButton")

    saveJobAdButton.addEventListener("click", function () {
        var jobAd = {
            title: this.name,
            id: this.dataset.id
        };
        saveJobAd(jobAd);
    });
}

/* Save Job Ad */
function saveJobAd(jobAd) {
    arrayOfSavedJobAd.push(jobAd);
    displaySavedJobAds()
    scroll(0, 0)
    saveJobAdToLocalStorage();
}

function saveJobAdToLocalStorage() {
    let str = JSON.stringify(arrayOfSavedJobAd);
    localStorage.setItem("arrayOfSavedJobAd", str);
}

function getJobAdArrayFromLocalStorage() {
    let array = localStorage.getItem("arrayOfSavedJobAd");
    arrayOfSavedJobAd = JSON.parse(array);
    if (!arrayOfSavedJobAd) {
        arrayOfSavedJobAd = [];
    }
}

function displaySavedJobAds() {
    let savedJobAdOutput = document.getElementById("saved-job-ad-output");
    let savedJobAd = "<h3>Sparade annonser</h3>";

    for (let i = 0; i < arrayOfSavedJobAd.length; i++) {
        savedJobAd += `
            <p data-id="${arrayOfSavedJobAd[i].id}" class="showSavedJobAd">
                ${arrayOfSavedJobAd[i].title}
            </p>`;
    }
    savedJobAdOutput.innerHTML = savedJobAd;

    addEventlistenerToSavedJobAdTitle();
}

function addEventlistenerToSavedJobAdTitle() {
    let showSavedJobAds = document.getElementsByClassName("showSavedJobAd");
    for (let showSavedJobAd of showSavedJobAds) {
        showSavedJobAd.addEventListener("click", function () {
            fetchJobDetails(this.dataset.id);
            singleJobView.classList.remove("hidden");
            mainView.classList.add("hidden");
        })
    }
}

document.getElementById("clear").addEventListener("click", clearLocalStorage);
function clearLocalStorage() {
    localStorage.clear();
    location.reload();
    return false;
}

fetchStockholmJobs();
getJobAdArrayFromLocalStorage();
displaySavedJobAds();
