class FetchController {

    fetchStockholmJobs(rows = 10, countyId = 1) {
        console.log(rows);
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=sverige&sida=1&antalrader=2000`)
            .then((response) => response.json())
            .then((jobs) => {
                var displayDOM = new DOM();
                displayDOM.displayJob(jobs);
                var filterDisplayJobs = new Controller();
                filterDisplayJobs.filterJob(jobs);
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
    fetchSearchedJobs(searchedInput) {
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
    fetchJobsByOccupationalId(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=${id}&sida=1&antalrader=2000`)
            .then(response => response.json())
            .then(jobs => {
                const newJobs = {
                    "matchningslista": {
                        "antal_platsannonser": jobs.matchningslista.antal_platsannonser_exakta,
                        "antal_platsannonser_exakta": jobs.matchningslista.antal_platsannonser_exakta,
                        "antal_platsannonser_narliggande": jobs.matchningslista.antal_platsannonser_narliggande,
                        "antal_platserTotal": jobs.matchningslista.antal_platserTotal,
                        "antal_sidor": jobs.matchningslista.antal_sidor,
                        "matchningdata": []
                    }
                };
                for (let i = 0; i < jobs.matchningslista.antal_platsannonser_exakta; i++) {
                    newJobs.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                }
                var displayDOM = new DOM();
                displayDOM.displayJob(newJobs);
                var filterDisplayJobs = new Controller();
                filterDisplayJobs.filterJob(newJobs);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchCategories() {
        fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden")
            .then((response) => response.json())
            .then((categories) => {
                var displayDOM = new DOM();
                displayDOM.displayCategoriesDOM(categories);

            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchJobsByCategories(id) {
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesomradeid=${id}&sida=1&antalrader=2000`)
            .then(response => response.json())
            .then(jobsByCategories => {
                console.log(jobsByCategories);
                var displayDOM = new DOM();
                displayDOM.displayJob(jobsByCategories);
                var filterDisplayJobs = new Controller();
                filterDisplayJobs.filterJob(jobsByCategories);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}

class DOM {
    displayJob(jobs, amount = 10) {
        paginations(amount, jobs);
        function paginations(perPage, jobs){
            const totalNumberOfJobs = jobs.matchningslista.antal_platsannonser;
            const thingarray = jobs.matchningslista.matchningdata;
            var list = thingarray;
            var pageList = new Array();
            var currentPage = 1;
            var numberPerPage = perPage;
            var numberOfPages = 0;
            
            
            function paginationEventlisteners() {
                var next  = document.getElementById('next')
                next.addEventListener('click', function() {
                    currentPage += 1;
                    loadList();
                })
        
                var previous  = document.getElementById('previous')
                previous.addEventListener('click', function() {
                    currentPage -= 1;
                    loadList();
                })
            
                var first  = document.getElementById('first')
                first.addEventListener('click', function() {    
                    currentPage = 1;
                    loadList();
                })
            
                var last  = document.getElementById('last')
                last.addEventListener('click', function() {
                    currentPage = numberOfPages;
                    loadList();
                })
            }
        
            function loadList() {
            var begin = ((currentPage - 1) * +numberPerPage);
            var end = begin + +numberPerPage;
            pageList = list.slice(begin, end);
            drawList();
            check();
            }
            
            function drawList() {
            numberOfPages = Math.ceil(list.length / +numberPerPage);
            const allJobs = document.getElementById("all-jobs");
            
            function filterDate(date){
                if(date == undefined){
                  return "Datum saknas";  
                }        
                else{
                   return date.slice(0, 10);
                }
            }
        
            let allJobList = `<h2>Antal lediga jobb: ${totalNumberOfJobs}</h2><div class="containerJobs">`;
            for (let i = 0; i < pageList.length; i++) {
                allJobList += ` 
                <div class="jobCard">
                    <h4>${pageList[i].annonsrubrik}</h4>
                    <p>${pageList[i].arbetsplatsnamn}, ${pageList[i].kommunnamn}</p>
                    <p>${pageList[i].yrkesbenamning}, ${pageList[i].anstallningstyp}</p>
                    <p>Sista ansökningsdatum: ${filterDate(pageList[i].sista_ansokningsdag)}</p>
                    <a href="#/annons/${pageList[i].annonsid}"><button>Read more</button></a>
                    <a href="${pageList[i].annonsurl}"><button>Arbetförmedlingen</button></a> 
                </div>
               `;
            }
                allJobList += `
                    </div>
                    <div class="pagination">
                        <input type="button" id="first" value="Första" />
                        <input type="button" id="previous" value="Föregånde" />               
                        ${currentPage}
                        <input type="button" id="next" value="Nästa" />
                        <input type="button" id="last" value="Sista" />
                    </div> 
                `;
            allJobs.innerHTML = allJobList;
                paginationEventlisteners();
            }
            
            function check() {
            document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
            document.getElementById("previous").disabled = currentPage == 1 ? true : false;
            document.getElementById("first").disabled = currentPage == 1 ? true : false;
            document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
            }
            
            loadList();
        }
    }

    displayJobDetails(jobs) {
        let annonsDetaljer = "";
        const job = jobs.platsannons.annons;
        const conditions = jobs.platsannons.villkor;
        const apply = jobs.platsannons.ansokan;
        const jobplace = jobs.platsannons.arbetsplats;

        // cuts out the timestamp
        const sistaAnsokningsdag = apply.sista_ansokningsdag.substring(0, 10);

        // replaces /n/r with linebreak
        const adDescription = job.annonstext.replace(/(?:\r\n|\r|\n)/g, '<br />');

        annonsDetaljer += `
                <h2>${job.annonsrubrik}</h2>
                <h3>Om tjänsten</h3>
                ${job.yrkesbenamning && `<p>Sökes: ${job.yrkesbenamning}</p>`}
                ${job.anstallningstyp && `<p>Anställningstyp: ${job.anstallningstyp}</p>`}
                <h3>Om arbetsplatsen</h3>
                ${jobplace.arbetsplatsnamn && `<p>${jobplace.arbetsplatsnamn}</p>`}
                ${jobplace.besoksadress && `<p>${jobplace.besoksadress}</p>`}
                <h3>Villkor</h3>
                ${conditions.varaktighet && `<p>Varaktighet: ${conditions.varaktighet}</p>`}
                ${conditions.arbetstid && `<p>Arbetstid: ${conditions.arbetstid}</p>`}
                ${conditions.arbetstid && `<p>Löneform: ${conditions.loneform}</p>`}
                <h3>Ansökan</h3>
                ${apply.webbplats && `<a target="_blank" href="${apply.webbplats}">Ansök via företagets hemsida</a>`}
                ${sistaAnsokningsdag && `<p>Sista ansökning: ${sistaAnsokningsdag}</p>`}
                ${apply.ovrigt_om_ansokan && `<p>övrigt: ${apply.ovrigt_om_ansokan}</p>`}
                <h3>Om tjänsten</h3>
                ${job.annonstext && `<p>${adDescription}</p>`}
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
        const copyConfirmText = document.getElementById("copy-confirm");

        copyUrlButton.addEventListener("click", function () {
            adUrl.select();
            document.execCommand("Copy");
            copyConfirmText.classList.remove("hidden");

            setTimeout(function () {
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

    displaySearchedJobsByOccupationalTile(searchedJobsarray) {
        let outputSearchedJobs = document.getElementById("output-searched-jobs");
        var searchedJobs = searchedJobsarray.soklista.sokdata;
        console.log(searchedJobs);
        var searchedJobList = "";
        for (let i = 0; i < searchedJobs.length; i++) {
            if (searchedJobs[i].antal_platsannonser != 0) {
                searchedJobList += `
                <a href="#/sokresultat/${searchedJobs[i].namn}/${searchedJobs[i].id}" data-id="${searchedJobs[i].id}" class="searchOccupationalTile" >
                    ${searchedJobs[i].namn} (${searchedJobs[i].antal_platsannonser})
                </a>`;
            }
        }

        outputSearchedJobs.innerHTML = searchedJobList;
        const searchResultController = new Controller();
        searchResultController.addEventlisterToSearchJobResult();
    }
    displayCategoriesDOM(categories) {
        let categoryOutput = document.getElementById("categoryUl");
        let category = categories.soklista.sokdata;
        let categoryList = "";
        for (let i = 0; i < category.length; i++) {
            categoryList += `
           <li data-id="${category[i].id}" class="categoryListObject">${category[i].namn}</li>`;
        }
        categoryOutput.innerHTML = categoryList;
        let addEventlistenerToCategories = new Controller();
        addEventlistenerToCategories.addEventlisterToCategories();
    }
    showMainView() {
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        mainView.classList.remove("hidden");
        singleView.classList.add("hidden");
    }
    showSingleView() {
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        singleView.classList.remove("hidden");
        mainView.classList.add("hidden");
    }

}

class Controller {
    checkInputUrl() {
        const copySearchContainer = document.getElementById("copy-search-results");

        if (window.location.hash.startsWith(`#/annons`)) {
            const annonsId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobDetails(annonsId);
            new DOM().showSingleView();
        }
        else if (window.location.hash.startsWith(`#/sokresultat`)) {
            copySearchContainer.classList.remove("hidden");
            const yrkesId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobsByOccupationalId(yrkesId);

            const input = document.getElementById("search-ad-url");
            input.value = window.location.href;

            const copyConfirmText = document.getElementById("search-copy-confirm");
            const copyButton = document.getElementById("search-copy-url");

            copyButton.addEventListener("click", function () {
                input.select();
                document.execCommand("Copy");
    
                copyConfirmText.classList.remove("hidden");
    
                setTimeout(function () {
                    copyConfirmText.classList.add("hidden");
                }, 1000);
            });
        }
        else {
            copySearchContainer.classList.add("hidden");
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
    addEventListenerClearSavedJob() {
        document.getElementById("clear").addEventListener("click", function () {
            var clearLocalStorageUtility = new Utility();
            clearLocalStorageUtility.clearLocalStorage();
        });
    }
    addEventlistenerToSearchJob() {
        let searchJobButton = document.getElementById("searchJobButton");
        searchJobButton.addEventListener("click", function () {
            let searchJobInput = document.getElementById("searchJobInput").value;
            console.log(searchJobInput);
            let searchedJobsFetchController = new FetchController();
            searchedJobsFetchController.fetchSearchedJobs(searchJobInput);
        });
    }

    addEventlisterToSearchJobResult() {
        let searchResultTitles = document.getElementsByClassName("searchOccupationalTile");
        console.log(searchResultTitles);
        for (let searchResultTitle of searchResultTitles) {

            searchResultTitle.addEventListener("click", function () {
                const id = this.dataset.id;
                const fetchSearch = new FetchController();
                fetchSearch.fetchJobsByOccupationalId(id)
            })
        }
    }
    addEventlisterToCategories() {
        const jobCategories = document.getElementsByClassName("categoryListObject");
        for (let jobCategory of jobCategories) {
            // console.log(jobCategories[i]);
            jobCategory.addEventListener("click", function () {
                const id = this.dataset.id;
                const fetchJobsByCategory = new FetchController();
                fetchJobsByCategory.fetchJobsByCategories(id)
            })
        }
    }
    filterJob(jobs){
        const filteredArray = {
            "matchningslista": {
                "antal_platsannonser": jobs.matchningslista.antal_platsannonser,
                "antal_platsannonser_exakta": jobs.matchningslista.antal_platsannonser_exakta,
                "antal_platsannonser_narliggande": jobs.matchningslista.antal_platsannonser_narliggande,
                "antal_platserTotal": jobs.matchningslista.antal_platserTotal,
                "antal_sidor": jobs.matchningslista.antal_sidor,
                "matchningdata": []
            }
        };
        let submitNumberButton = document.getElementById("submit-number");
        submitNumberButton.addEventListener("click", function () {
            var displayDOM = new DOM();
            let numberValue = document.getElementById("number-jobs").value;
            let countyValue = document.getElementById("county-jobs").value
            if (countyValue != 0){
                for (let i = 0; i < jobs.matchningslista.matchningdata.length; i++) {
                    
                    if (jobs.matchningslista.matchningdata[i].lanid == countyValue){
                        filteredArray.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                    }
                }
                if(numberValue == ""){
                    numberValue = 10
                }
                displayDOM.displayJob(filteredArray, numberValue);
                filteredArray.matchningslista.matchningdata = [];  
            }
            else{
                displayDOM.displayJob(jobs, numberValue);
            }
              
        })
    }
    sidebarDisplay(){
        var openSidebarButton = document.getElementById('openSidebarButton');
        openSidebarButton.addEventListener("click", function(){
        document.getElementById("aside").style.zIndex = "0";
        });
    
        var closeSidebarButton = document.getElementById('closeSidebarButton');
        closeSidebarButton.addEventListener("click", function(){
        document.getElementById("aside").style.zIndex = "-2";
        });
    }

    categoriesShowHide(){
        var categoriesButton = document.getElementById('categoriesButton');
        categoriesButton.addEventListener("click", function(){
        var x = document.getElementById("categoryUl");
        if (x.style.display === "block") {
            x.style.display = "none";
            categoriesButton.innerHTML = "Categories ↓";
        } else {
            x.style.display = "block";
            categoriesButton.innerHTML = "Categories ↑";
        }
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

let fetchCategories = new FetchController();
fetchCategories.fetchCategories();

var getJobAdArrayFromLocalStorage = new Utility();
getJobAdArrayFromLocalStorage.getJobAdArrayFromLocalStorage();

var displaySavedJobAds = new DOM();
displaySavedJobAds.displaySavedJobAds();

var controller = new Controller();
controller.checkInputUrl();
controller.sidebarDisplay();
controller.categoriesShowHide()

var clearLocalStorageController = new Controller();
clearLocalStorageController.addEventListenerClearSavedJob();

var addEventlistenerToSearchJob = new Controller();
addEventlistenerToSearchJob.addEventlistenerToSearchJob();

window.addEventListener('hashchange', event => {
    controller.checkInputUrl();
});


new SlimSelect({
    select: '#number-jobs',
    placeholder: 'Antal per sida',
    allowDeselect: true,
    showSearch: false,
})

new SlimSelect({
    select: '#county-jobs',
    placeholder: 'Filtrera Län',
    allowDeselect: true,
    showSearch: false,
})