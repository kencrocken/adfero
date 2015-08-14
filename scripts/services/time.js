timeTracker.factory('time', function(localStorageService){

    // Get data from local storage
    var timeInStore = localStorageService.get('time');

    // Set Time from local storage or set as empty array
    var Time = timeInStore || [];

    // Get a time array for, with hours and minutes, and total in milliseconds
    function getTimeDiff(start, end) {
        var diff = moment(end).diff(moment(start));
        var duration = moment.duration(diff);
        var milliseconds = (duration._milliseconds);
        var tempTime = moment.duration(milliseconds);
        var hours = Math.floor(tempTime.asHours());
        var mins = Math.floor(tempTime.asMinutes()) - hours * 60;
        return {
            duration: [hours,mins,milliseconds]
        }
    }
    
    // Add up the total time for all of our time entries
    function getTotalTime(timeentries) {
        var totalMilliseconds = 0;
        angular.forEach(timeentries, function(key) {
            totalMilliseconds += key.loggedTime.duration[2];
        });

        return {
            hours: Math.floor(moment.duration(totalMilliseconds).asHours()),
            minutes: moment.duration(totalMilliseconds).minutes()
        }
    }

    return {
        persistTime: function(time) {
            Time = time;
            localStorageService.set('time', Time);
        },
        clear: function() {
            Time = [];
            localStorageService.set('time', null);
        },
        getTime: function() {
            return Time;   
        },

        getTimeDiff: getTimeDiff,
        getTotalTime: getTotalTime
    }

});