/*
TYPE chrome.storage.local.clear() to clear the new tab of existing events!
*/

var timeSpentOnPage = 0
var profileName = 'Homepage'
var profilePic = 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png'

/*
Checks to see if we already have an event created or not. Then updates it. Triggered
by visiting a page on facebook or a person's profile on facebook.
*/
function updateLocalStorage() {
    console.log('Inside updateLocalStorage()')

    // calculate time spent and put data in localstorage

    // - Get name of profile and profile pic
    profileName = $('._2wma, ._2nlw').text() || profileName
    // This may throw an error if there is no profile pic
    // Handle this error
    //default picture goes to whatever var profilePic is assigned to up above
    //_.get lodash method to make sure no errors will be thrown
    //#myId and .myClass in selector notation
    //No id when grabbing the images off facebook so need to use .myClass notation.
    //(ex: ._4jhq.img is the .myClass notation for the image on pages on facebook.)
    var profilePicArray = $('.profilePic.img, ._4jhq.img')
    profilePic = _.get(profilePicArray, '0.src', profilePic)

    // console.log('We are on facebook')
    // console.log('profileName:', profileName)
    // console.log('profilePic:', profilePic)

    newFacebookEvent = {
        profileName,
        profilePic,
        timeSpentOnPage: POLLING_TIME_IN_SECONDS,
    }

    chrome.storage.local.get('facebookEventsArray', function ({ facebookEventsArray }) {
        if (!facebookEventsArray) facebookEventsArray = []

        // Find existing entry for currentPage
        var existingElementIndex = _.findIndex(facebookEventsArray, { profileName })
        // If existing entry
        if (existingElementIndex !== -1) {
            // console.log('We have found an existing entry for ' + profileName)

            existingElement = facebookEventsArray[existingElementIndex]

            newFacebookEvent['timeSpentOnPage'] = existingElement['timeSpentOnPage'] + POLLING_TIME_IN_SECONDS

            facebookEventsArray.splice(existingElementIndex, 1, newFacebookEvent)
        }
        else {
            // console.log('No existing entry for ' + profileName)
            // If the event does not exist then push a new one
            facebookEventsArray.push(newFacebookEvent)
        }


        chrome.storage.local.set({'facebookEventsArray': facebookEventsArray}, function() {
          // Notify that we saved.
          console.log('Facebook events array updated')
        })
    })

}

/*
Check to see if the url currently matches facebook.
Cannot grab any other website url names containing facebook.com.
For ex: cannot grab a url such as ilovefacebook.com.
*/
function isCurrentUrlFacebook() {
    return window.location.host === 'facebook.com' || window.location.host === 'www.facebook.com'
}

var hasThereBeenAnyUserActivityInLastTimePeriod = false


function handleUserActivity() {
    hasThereBeenAnyUserActivityInLastTimePeriod = true
}

// Anytime there is user activity we need to update hasThereBeenAnyUserActivityInLastTimePeriod
document.onmousemove = handleUserActivity
document.onkeypress = handleUserActivity

/**
 * If there has been no user activity in the last time period
 (user activity = mouse or key movement) then don't increment timer
**/
function shouldWeIncrementTimer() {
    var shouldTimerBeIncremented = hasThereBeenAnyUserActivityInLastTimePeriod

    // Reset activity monitor
    hasThereBeenAnyUserActivityInLastTimePeriod = false

    return shouldTimerBeIncremented
}

POLLING_TIME_IN_SECONDS = 5

/*
Function used to check to see if we have entered fb yet or not
*/
function areWeOnFb() {
  console.log('Inside Facebook monitor extension!')

  // If we are on fb
  if (isCurrentUrlFacebook()) {
      console.log('We are on Facebook - monitoring usage activity')

      // - start timer
      setInterval(function() {
          // Every second we are on the page trigger an event to increase the time counter
          if (shouldWeIncrementTimer()) {
              console.log('We are updating timeSpentOnPage')

              updateLocalStorage()
          }
          else {
              console.log('We are NOT updating timeSpentOnPage')
          }
      }, POLLING_TIME_IN_SECONDS * 1000)
  }
}

$(document).ready(areWeOnFb)
