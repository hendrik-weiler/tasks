/**
 * Returns a list of search objects
 *
 * @var searchData
 * @type array
 */
var searchData = [];

/**
 * Sets the searchData variable with given data
 *
 * @param data The base64 encoded, json string
 */
function fillSearchData(data) {
    searchData = JSON.parse(atob(data));
}

window.onload = function () {

    var search = document.getElementById('search');
    search.onkeyup = function (e) {
        if(this.value == '') {
            document.body.classList.remove('search');
            return;
        }
        if(this.value.length < 3) return;
        document.body.classList.add('search');

        var i = 0,
            len = searchData.length,
            dataEntry,
            searchTerm = this.value,
            tmplNode = document.body.querySelector('#searchEntry'),
            sR = document.body.querySelector('.search-results'),
            tmplHTML,
            desc,
            resultCounter = 0;
        sR.innerHTML = '';
        console.log('---- new search='+searchTerm)
        for(i; i < len; ++i) {
            dataEntry = searchData[i];
            if(new RegExp(searchTerm,'i').test(dataEntry.name)
                || new RegExp(searchTerm,'i').test(dataEntry.desc)) {
                tmplHTML = tmplNode.innerHTML.slice(0);
                tmplHTML = tmplHTML.replace('$link', dataEntry.file);
                tmplHTML = tmplHTML.replace('$name', dataEntry.name);
                desc = dataEntry.desc;
                desc = desc.replace(/\n/g,'<br>');
                tmplHTML = tmplHTML.replace('$description', desc);
                sR.innerHTML += tmplHTML;
                ++resultCounter;
            }
        }
        if(resultCounter==0) {
            sR.innerHTML += '<p class="no-results">The search did not yield any results.</p>'
        }
    }

}