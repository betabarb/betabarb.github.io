angular.module('mboa', ['ui.router', 'ngAnimate', 'ui.bootstrap'])

/********** GLOBAL **********/
.run(function($rootScope, $state, $stateParams, $anchorScroll) {
  $rootScope.SITE = {
    baseUrl: 'https://mboa.netlify.com',
    name: 'My Brain On Anatomy',
    currentYear: new Date()
  };

  var config = {
    apiKey: "AIzaSyDlEcavbDWko-W-ykfmbjrZYZJ_exiAc-I",
    authDomain: "brilliant-heat-5271.firebaseapp.com",
    databaseURL: "https://brilliant-heat-5271.firebaseio.com",
    storageBucket: "brilliant-heat-5271.appspot.com",
  };
  firebase.initializeApp(config);

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if (!error.state || error.state == 404) {
      $state.go('404server');
    }
  });

  $rootScope.$on('$stateChangeSuccess', function() {
    $anchorScroll();
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $.magnificPopup.close();

    var redirectPairs = {
      'a-mysterious-mass': {
        'thymus': '2',
        'primary': '3',
        'epi-cells': '4',
        'adaptive': '5',
        'medulla': '6'
      },
      'a-night-in-the-er': {
        'ur': '2',
        'CTscan': '4',
        'flow3': '5',
        'secondary': '6',
        't-lymph': '7'
      },
      'the-suspicious-lesion': {
        'lymph-node': '2',
        'secondary': '3',
        'type3': '4',
        'axillary': '5',
        'paracortex': '6',
        'flow4': '8',
        'lymphedema': '9',
        'stage2': '10'
      }
    };
    if (toState.name == "histoCase.pageType.page") {
      // Check to make sure the url is applicable
      switch (toParams.caseName) {
        case 'a-mysterious-mass':
        case 'a-night-in-the-er':
        case 'the-suspicious-lesion':
          break;
        default:
          event.preventDefault();
          $state.go('404server');
          break;
      }
      // Check if we're redirecting an 'ans' page to a 'pg' page
      if (toParams.pageType == 'ans') {
        for (var caseName in redirectPairs) {
          if (redirectPairs.hasOwnProperty(caseName)) {
            if (toParams.caseName == caseName) {
              for (var page in redirectPairs[caseName]) {
                if (toParams.pageId == page) {
                  event.preventDefault();
                  $state.go('histoCase.pageType.page', {
                    caseName: fromParams.caseName,
                    pageType: 'pg',
                    pageId: redirectPairs[caseName][page]
                  });
                }
              }
            }
          }
        }
      }
      // Check if we're going from a case page to a case page
      // This will save us from having to include the case name in ui-sref
      if (fromState == "histoCase.pageType.pageId") {
        event.preventDefault();
        $state.go('histoCase.pageType.page', {
          caseName: fromParams.caseName,
          pageType: toParams.pageType,
          pageId: toParams.pageId
        });
      }
    }
  });
});
