class FetchController {

    fetchStockholmJobs(rows = 10, countyId = 1) {
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=sverige&sida=1&antalrader=1000`)
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
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrken/${searchedInput}`)
            .then(response => response.json())
            .then(jobs => {
                var displayDOM = new DOM();
                displayDOM.displaySearchedJobsByOccupationalTile(jobs)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchJobsByOccupationalId(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=${id}&sida=1&antalrader=1000`)
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
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesomradeid=${id}&sida=1&antalrader=1000`)
            .then(response => response.json())
            .then(jobsByCategories => {
                console.log(jobsByCategories);
                new DOM().displayJob(jobsByCategories);
                new Controller().filterJob(jobsByCategories);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchCounty(){
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan2`)
            .then(response => response.json())
            .then(county => {
                console.log(county);
                new DOM().displayOptionlan(county);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchCommune(countyId){
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=${countyId}`)
            .then(response => response.json())
            .then(commune => {
                console.log(commune);
                new DOM().displayOptionCommune(commune);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}

class DOM {
    displayJob(jobs, amount = 10) {
        paginations(amount, jobs);
        function paginations(perPage, jobs) {
            const totalNumberOfJobs = jobs.matchningslista.antal_platsannonser;
            const thingarray = jobs.matchningslista.matchningdata;
            var list = thingarray;
            var pageList = new Array();
            var currentPage = 1;
            var numberPerPage = perPage;
            var numberOfPages = 0;


            function paginationEventlisteners() {
                var next = document.getElementById('next')
                next.addEventListener('click', function () {
                    currentPage += 1;
                    loadList();
                })

                var previous = document.getElementById('previous')
                previous.addEventListener('click', function () {
                    currentPage -= 1;
                    loadList();
                })

                var first = document.getElementById('first')
                first.addEventListener('click', function () {
                    currentPage = 1;
                    loadList();
                })

                var last = document.getElementById('last')
                last.addEventListener('click', function () {
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

                function filterDate(date) {
                    if (date == undefined) {
                        return "Datum saknas";
                    }
                    else {
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
                    <a href="#/annons/${pageList[i].annonsid}"><button class="blue-button" id="read-more">Läs mer</button></a>
                    <a href="${pageList[i].annonsurl}" target="_blank"><button class="blue-button">Arbetsförmedlingen</button></a> 
                </div>
               `;
               
                }
                allJobList += `
                    </div>
                    <div class="pagination">
                        <button class="pagination-link" id="first"><i class="fa fa-angle-double-left"></i> Första</button>
                        <button class="pagination-link" id="previous"><i class="fa fa-angle-left"></i> Föregånde</button>
                        ${currentPage}
                        <button class="pagination-link" id="next">Nästa <i class="fa fa-angle-right"></i></button>
                        <button class="pagination-link" id="last">Sista <i class="fa fa-angle-double-right"></i></button>
                    </div> 
                `;

                allJobs.innerHTML =  '<div id="copy-url-button-search"></div>' + allJobList;
                new DOM().createCopyUrlButton("copy-url-button-search");
                paginationEventlisteners();
            }

            function check() {
                console.log(currentPage)
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
                <button class="blue-button" data-id="${jobs.platsannons.annons.annonsid}" id="saveJobAdButton" name="${jobs.platsannons.annons.annonsrubrik}">Save</button>
            `;

        document.getElementById("annonsdetaljer").innerHTML = annonsDetaljer;

        const backToListButton = document.getElementById("back");
        backToListButton.addEventListener("click", function () {
            new DOM().showMainView();
            window.location.hash = "";
        });

        new DOM().createCopyUrlButton("copy-ad-url");

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
           <li> 
                <a href="#/kategori/${category[i].namn}/${category[i].id}" 
                data-id="${category[i].id}" class="categoryListObject">${category[i].namn}</a>
           </li>`;
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
    createCopyUrlButton(containerId) {
        const container = document.getElementById(containerId);
        const div = document.createElement("div");

        div.innerHTML = `
            <details class="copy-url-button">
                <summary class="blue-button">Dela</summary>
                <div class="details-inner-container">
                    <input class="ad-url" readonly="readonly">
                    <button class="copy-url blue-button no-margin">Kopiera</button>
                </div>
            </details>
        `;

        const copyButton = div.querySelector(".copy-url");
        const url = div.querySelector(".ad-url");
        url.value = window.location.href;

        copyButton.addEventListener("click", function () {
            url.select();
            document.execCommand("Copy");

            url.value = "kopierad";

            setTimeout(function () {
                url.value = window.location.href;
            }, 1000);
        });
        
        container.innerHTML = "";
        container.appendChild(div);
    }
    displayOptionlan(county){
        const countyJobs = document.getElementById("county-jobs");
        let options = `<option data-placeholder="true"></option>`;
        for(let i = 0; i < county.soklista.sokdata.length; i++){
            options += `
            <option value="${county.soklista.sokdata[i].id}">${county.soklista.sokdata[i].namn}</option>`; 
        }
        countyJobs.innerHTML = options;
    }
    displayOptionCommune(commune){
        let communeDiv = document.getElementById("commune");
        let options = `<label for="commune">Kommun:</label>
                       <select id="communeFilter">
                       <option data-placeholder="true"></option>`;
        for(let i = 0; i < commune.soklista.sokdata.length; i++){
            options += `
            <option value="${commune.soklista.sokdata[i].id}">${commune.soklista.sokdata[i].namn}</option>`; 
        }
        options += `</select>`;
        communeDiv.innerHTML = options;

        new SlimSelect({
            select: '#communeFilter',
            placeholder: 'Filtrera kommun',
            allowDeselect: true,
            showSearch: false,
        })
    }
}

class Controller {
    // routes depending on url in window
    routeUrl() {
        if (window.location.hash.startsWith(`#/annons`)) {
            const adId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobDetails(adId);
            new DOM().showSingleView();
        } else if (window.location.hash.startsWith(`#/sokresultat`)) {
            const occupationalId = window.location.hash.split(`/`).pop();
            console.log(occupationalId);
            new FetchController().fetchJobsByOccupationalId(occupationalId);
        } else if (window.location.hash.startsWith(`#/kategori`)) {
            const categoryId = window.location.hash.split(`/`).pop();
            console.log('id', categoryId);
            new FetchController().fetchJobsByCategories(categoryId);
            new DOM().showMainView();
        } else {
            window.location.hash = '';
            new FetchController().fetchStockholmJobs();
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
        let autocomplete = document.getElementById("searchJobInput");
        autocomplete.addEventListener("keyup", function(){
            let searchJobInput = document.getElementById("searchJobInput").value;
            if(searchJobInput.length >= 3){
                let searchedJobsFetchController = new FetchController();
                searchedJobsFetchController.fetchSearchedJobs(searchJobInput);
            }else{
                let outputSearchedJobs = document.getElementById("output-searched-jobs")
                outputSearchedJobs.innerHTML = '';
            }
        })
          // click on search button
        let searchJobButton = document.getElementById("searchJobButton");
          searchJobButton.addEventListener("click", function () {
          let searchJobInput = document.getElementById("searchJobInput").value;
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
            jobCategory.addEventListener("click", function () {
                const id = this.dataset.id;
                const fetchJobsByCategory = new FetchController();
                fetchJobsByCategory.fetchJobsByCategories(id)
            })
        }
    }
    filterJob(jobs) {
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
            let countyValue = document.getElementById("county-jobs").value;
            if (countyValue != "") {
                let communeValue = document.getElementById("communeFilter").value;
                for (let i = 0; i < jobs.matchningslista.matchningdata.length; i++) {
                    if(communeValue != ""){
                        console.log(jobs.matchningslista.matchningdata[i])
                        if (jobs.matchningslista.matchningdata[i].lanid == countyValue && jobs.matchningslista.matchningdata[i].kommunkod == communeValue) {
                            filteredArray.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                        }
                    }else{
                        if (jobs.matchningslista.matchningdata[i].lanid == countyValue) {
                            filteredArray.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                        }
                    }
                }
                if (numberValue == "") {
                    numberValue = 10
                }
                displayDOM.displayJob(filteredArray, numberValue);
                filteredArray.matchningslista.matchningdata = [];
            }
            else {
                if (numberValue == ""){
                    numberValue = 10;
                    displayDOM.displayJob(jobs, numberValue);
                }
                displayDOM.displayJob(jobs, numberValue);
            }

        })
    }
    sidebarDisplay() {
        var openSidebarButton = document.getElementById('openSidebarButton');
        openSidebarButton.addEventListener("click", function () {
            document.getElementById("aside").style.zIndex = "0";
        });

        var closeSidebarButton = document.getElementById('closeSidebarButton');
        closeSidebarButton.addEventListener("click", function () {
            document.getElementById("aside").style.zIndex = "-2";
        });
    }

    categoriesShowHide() {
        var categoriesButton = document.getElementById('categoriesButton');
        categoriesButton.addEventListener("click", function () {
            var x = document.getElementById("categoryUl");
            if (x.style.display === "block") {
                x.style.display = "none";
                categoriesButton.innerHTML = "Kategorier <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>";
            } else {
                x.style.display = "block";
                categoriesButton.innerHTML = "Kategorier <i class=\"fa fa-chevron-up\" aria-hidden=\"true\"></i>";
            }
        });
    }
    checkCountyChange(){
        const county = document.getElementById("county-jobs");
        county.addEventListener("change", function(){
            new FetchController().fetchCommune(county.value);
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

let fetchCategories = new FetchController();
fetchCategories.fetchCategories();

new FetchController().fetchCounty();

var getJobAdArrayFromLocalStorage = new Utility();
getJobAdArrayFromLocalStorage.getJobAdArrayFromLocalStorage();

var displaySavedJobAds = new DOM();
displaySavedJobAds.displaySavedJobAds();

var controller = new Controller();
controller.routeUrl();
controller.sidebarDisplay();
controller.categoriesShowHide();
controller.checkCountyChange();

var clearLocalStorageController = new Controller();
clearLocalStorageController.addEventListenerClearSavedJob();

var addEventlistenerToSearchJob = new Controller();
addEventlistenerToSearchJob.addEventlistenerToSearchJob();

window.addEventListener('hashchange', event => {
    controller.routeUrl();
});

//this is jquary for select option meny styling
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
