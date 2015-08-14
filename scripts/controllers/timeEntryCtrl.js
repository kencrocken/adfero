timeTracker.controller('TimeEntry', ['$scope','time', 'localStorageService', function($scope, time, localStorageService){

    var vm = this;

    vm.timeentries = time.getTime();

    vm.totalTime = {};

    // Initialize the startTime and endTime
    vm.startTime = new Date();
    vm.endTime = new Date();

    // Update total time
    function updateTotalTime(timeentries) {
        vm.totalTime = time.getTotalTime(timeentries);
    }

    // Submit record "Log Time" button click
    vm.logNewTime = function(isValid) {
        $scope.submitted = true;
        if(isValid) {
            // Ends after it starts
            if(vm.endTime < vm.startTime) {
                alert("You can't finish before you start!");
                return;                 
            }

            // Time logged is greater than 0
            if(vm.endTime - vm.startTime === 0) {
                alert("Your time entry has to be greater than zero!");
                return;
            }

            // Update array holding log
            vm.timeentries.push({
                "name":vm.name,
                "start_time":vm.startTime,
                "end_time":vm.endTime,
                "loggedTime": time.getTimeDiff(vm.startTime, vm.endTime),
                "taskDescription":vm.taskDescription
            });

            updateTotalTime(vm.timeentries);

            vm.name = "";
            vm.taskDescription = "";

            // Call time factory to save updated array and render new chart
            $scope.$watch('timeentries', function () {
                time.persistTime(vm.timeentries);
                $scope.timeDescription.$setPristine();
                $scope.submitted = false;
                renderChart();
            }, true);
        }
    }

    vm.removeTimeEntry = function (index) {
      vm.timeentries.splice(index, 1);
      time.persistTime(vm.timeentries);
      renderChart();
    };

    // Clears all time records on click 
    vm.clearTime = function() {
        console.log("CLEAR!!!!");
        vm.timeentries = [];
        time.clear();
        renderChart();
    }

    // Function to render chart
    function renderChart() {
        $scope.labels = [];
        $scope.data = [];
        var label;
        var hours=[];
        var x = time.getDailyTotal(vm.timeentries);
        for (var i = 0; i < x.length; i++) {
            for (var key in x[i]) {
                if(x[i].hasOwnProperty(key)){
                    label = key;
                    hours.push(moment.duration(x[i][key]).asHours());
                }
            }
            $scope.labels.push(label);
        }
        // Push hours outside loop to prevent creating two datasets
        $scope.data.push(hours);
    }

    // Display total time and chart if there is a time log
    updateTotalTime(vm.timeentries);

    if(vm.timeentries.length != 0) {
        renderChart();
    }
    

}]);