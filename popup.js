console.log('Inside popup.js')

/**
//Expected function of formatSeconds
Sample input: 65
Expected output: 1 min, 5 secs
**/
function formatSeconds(secs, includeHours = false) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    var formatString = `${includeHours ? 'h [hrs] ' : ''}m [min], s [secs]`

    return moment.duration(secs, 'seconds').format(formatString)
}

/*
Format of the data being displayed on the new tab.
*/
function displayData() {
    // Get events from local storage
    chrome.storage.local.get('facebookEventsArray', function ({ facebookEventsArray }) {
        // console.log('facebookEventsArray.length: ', facebookEventsArray.length)
        // Display in list

        //https://stackoverflow.com/questions/8667736/what-does-the-sign-mean-in-jquery-or-javascript
        $("#facebookEventsList").empty()
        var list = $("#facebookEventsList").append('<ul></ul>').find('ul');

        _.forEach(facebookEventsArray, function ({ profileName, profilePic, timeSpentOnPage}) {
            // console.log('Handling another event in facebookEventsArray')

            //https://github.com/lukehoban/es6features#let--const
            //https://medium.com/javascript-scene/javascript-es6-var-let-or-const-ba58b8dcde75
            //could probably use var here instead of const too but const is used in the most
            //updated versions of javascript-es6.
            const $newListItem = $('<li></li>')
                .append('<h5>' + profileName + '</h5>')
                .append('<p>' + 'Time spent on page: ' + formatSeconds(timeSpentOnPage) + '</p>')
                .append('<img style="height:75px; width: 75px;" src="' + profilePic + '" />')
                .append('<p></p>')


            // console.log('Appending newListItem')
            list.append($newListItem)
        })

        // Get total time spent on facebook
        //const is the same as var too
        //_.map is lodash to make sure no errors can be thrown
        const allFacebookEventTimes = _.map(facebookEventsArray, ({ timeSpentOnPage }) => timeSpentOnPage)

        //const is the same as var too
        //_.reduce is lodash to make sure no errors can be thrown
        const totalTimeSpentOnFbInSeconds = _.reduce(allFacebookEventTimes, (a, b) => a + b, 0)

        var formattedTotalTimeString = formatSeconds(totalTimeSpentOnFbInSeconds, true)

        $('#totalTimeSpentOnFacebook').text(formattedTotalTimeString)
    })
}

/*
Allows for continuous updating of the new tab page without the need to refresh
facebook.com every time the chrome extension is tested.
*/
function readyFunction() {
    setInterval(displayData, 1000)
}

$(document).ready(readyFunction)
