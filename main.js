class FetchController {
    fetchStockholmJobs() {
        fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=20")
            .then((response) => response.json())
            .then((jobs) => {
                var displayDOM = new DOM();
                displayDOM.displayJob(jobs)
                displayDOM.sortAllJobs(jobs)
            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchJobDetails(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${id}`)
            .then(response => response.json())
            .then(jobs => {
                var displayDOM = new DOM();
                displayDOM.displayJobDetails(jobs);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchSearchedJobs(searchedInput){
        console.log(searchedInput);
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrken/${searchedInput}`)
        .then(response => response.json())
            .then(jobs => {
                console.log(jobs);
                var displayDOM = new DOM();
                displayDOM.displaySearchedJobsByOccupationalTile(jobs)
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

class DOM {
    sortAllJobs(jobs) {
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
                        <a href="#/annons/${jobAdvert.annonsid}">
                            ${jobAdvert.annonsrubrik}
                        </a>
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
        }
    }
    displayJob(jobs) {
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
    }
    displayJobDetails(jobs) {
        let annonsDetaljer = "";
        const job = jobs.platsannons.annons;
        const conditions = jobs.platsannons.villkor;
        const apply = jobs.platsannons.ansokan;
        const jobplace = jobs.platsannons.arbetsplats;

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
            new DOM().showMainView();
            window.location.hash = "";
        });

        const adUrl = document.getElementById("ad-url");
        adUrl.value = window.location.href;

        const copyUrlButton = document.getElementById("copy-url");
        copyUrlButton.addEventListener("click", function () {
            adUrl.select();
            document.execCommand("Copy");
            let copyConfirmText = document.getElementById("copy-confirm");
            copyConfirmText.classList.remove("hidden");

            setTimeout(function(){
                copyConfirmText.classList.add("hidden");
            }, 1000);
        });

        let saveJobAdButton = document.getElementById("saveJobAdButton")
        saveJobAdButton.addEventListener("click", function () {
            var jobAd = {
                title: this.name,
                id: this.dataset.id
            };
            var saveJobUtility = new Utility();
            saveJobUtility.saveJobAd(jobAd);
        });
    }
    displaySavedJobAds() {
        let savedJobAdOutput = document.getElementById("saved-job-ad-output");
        let savedJobAd = "<h3>Sparade annonser</h3>";

        for (let i = 0; i < arrayOfSavedJobAd.length; i++) {
            savedJobAd += `
                <p data-id="${arrayOfSavedJobAd[i].id}" class="showSavedJobAd">
                    ${arrayOfSavedJobAd[i].title}
                </p>`;
        }
        savedJobAdOutput.innerHTML = savedJobAd;
        var jobAdTitleController = new Controller();
        jobAdTitleController.addEventlistenerToSavedJobAdTitle();
    }

    displaySearchedJobsByOccupationalTile(searchedJobsarray){
        let outputSearchedJobs = document.getElementById("output-searched-jobs");
        var searchedJobs = searchedJobsarray.soklista.sokdata;
        console.log(searchedJobs);
        var searchedJobList = "";
        for (let i = 0; i < searchedJobs.length; i++){
            searchedJobList += `
            <p data-id="${searchedJobs[i].id}">${searchedJobs[i].namn}</p>`;
            console.log(searchedJobs[i].namn)
        }
        outputSearchedJobs.innerHTML = searchedJobList;
    }
    showMainView(){
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        mainView.classList.remove("hidden");
        singleView.classList.add("hidden");
    }
    showSingleView(){
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        singleView.classList.remove("hidden");
        mainView.classList.add("hidden");
    }
}

class Controller {
    checkInputUrl() {
        const annonsId = window.location.hash.split(`/`).pop();
        if (window.location.hash.startsWith(`#/annons`)) {
            new FetchController().fetchJobDetails(annonsId);
            new DOM().showSingleView();
        } else {
            window.location.hash = '';
            new DOM().showMainView();
        }
    }
    addEventlistenerToSavedJobAdTitle() {
        let showSavedJobAds = document.getElementsByClassName("showSavedJobAd");
        for (let showSavedJobAd of showSavedJobAds) {
            showSavedJobAd.addEventListener("click", function () {
                var fetchJobDetails = new FetchController();
                fetchJobDetails.fetchJobDetails(this.dataset.id);
                new DOM().showSingleView();
            });
        }
    }
    addEventListenerClearSavedJob(){
        document.getElementById("clear").addEventListener("click", function(){
            var clearLocalStorageUtility = new Utility(); 
            clearLocalStorageUtility.clearLocalStorage();
        });
    }
    addEventlistenerToSearchJob(){
        let searchJobButton = document.getElementById("searchJobButton");
        searchJobButton.addEventListener("click", function(){
            let searchJobInput = document.getElementById("searchJobInput").value;
            console.log(searchJobInput);
            let searchedJobsFetchController = new FetchController();
            searchedJobsFetchController.fetchSearchedJobs(searchJobInput);
        });
    }
}

class Utility {
    saveJobAd(jobAd) {
        arrayOfSavedJobAd.push(jobAd);
        var displayJobAdsDOM = new DOM();
        displayJobAdsDOM.displaySavedJobAds()
        scroll(0, 0)
        this.saveJobAdToLocalStorage();
    }
    saveJobAdToLocalStorage() {
        let str = JSON.stringify(arrayOfSavedJobAd);
        localStorage.setItem("arrayOfSavedJobAd", str);
    }
    getJobAdArrayFromLocalStorage() {
        let array = localStorage.getItem("arrayOfSavedJobAd");
        arrayOfSavedJobAd = JSON.parse(array);
        if (!arrayOfSavedJobAd) {
            arrayOfSavedJobAd = [];
        }
    }
    clearLocalStorage() {
        localStorage.clear();
        location.reload();
    }
}

arrayOfSavedJobAd = [];

var fetchStockholmJobs = new FetchController();
fetchStockholmJobs.fetchStockholmJobs();

var getJobAdArrayFromLocalStorage = new Utility();
getJobAdArrayFromLocalStorage.getJobAdArrayFromLocalStorage();

var displaySavedJobAds = new DOM();
displaySavedJobAds.displaySavedJobAds();

var controller = new Controller();
controller.checkInputUrl();

var clearLocalStorageController = new Controller();
clearLocalStorageController.addEventListenerClearSavedJob();

var addEventlistenerToSearchJob = new Controller();
addEventlistenerToSearchJob.addEventlistenerToSearchJob();

window.addEventListener('hashchange', event => {
    controller.checkInputUrl();
});
