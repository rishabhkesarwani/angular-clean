angular.module('angular-clean', [])
    .directive('capitalize', [function () {
        return {
            priority: 2,
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attributes, controller) {
                var capitalize = function(inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        controller.$setViewValue(capitalized);
                        controller.$render();
                    }
                    return capitalized;
                };
                controller.$parsers.push(capitalize);
                capitalize(scope[attributes.ngModel]); // capitalize initial value
            }
        }
    }])
    .directive('titleCase', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                disable: '=?'
            },
            link: function (scope, element, attributes, controller) {
                if (!scope.disable) {
                    String.prototype.toCamelCase = function() {
                        return this.valueOf()
                            .replace(/\s(.)/g, function($1) {
                                return $1.toUpperCase();
                            })
                            .replace(/\s/g, ' ')
                            .replace(/^(.)/, function($1) {
                                return $1.toUpperCase();
                            });
                    };
                    var convertToTitleCase = function(inputValue) {
                        if (inputValue == undefined) inputValue = '';
                        var titleCased = inputValue.toCamelCase();
                        if (titleCased !== inputValue) {
                            controller.$setViewValue(titleCased);
                            controller.$render();
                        }
                        return titleCased;
                    };
                    controller.$parsers.push(convertToTitleCase);
                    convertToTitleCase(scope[attributes.ngModel]); // capitalize initial value
                }
            }
        }
    }])
    .directive('validateCoupon', [function () {
        return {
            priority: 1,
            restrict: 'A',
            require: 'ngModel',
            scope: {
                couponLength: '=',
                validatingFunction: '='
            },
            link: function(scope, element, attributes, controller) {
                var couponValidator = function (inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (inputValue !== capitalized || capitalized.length > scope.couponLength) {
                        if (capitalized.length > scope.couponLength) {
                            capitalized = capitalized.slice(0, -1);
                        }
                        controller.$setViewValue(capitalized);
                        controller.$render();
                        if (capitalized.length == scope.couponLength) scope.validatingFunction();
                    }
                    return capitalized;
                };
                controller.$parsers.push(couponValidator);
            }
        }
    }])
    .directive('validateNumber', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                prefix: '=?',
                allowedDigits: '=?',
                min: '=?',
                max: '=?'
            },
            link: function(scope, element, attributes, controller) {
                scope.allowedDigits = scope.allowedDigits ? scope.allowedDigits : 100;
                if (scope.ngModel == undefined) scope.ngModel = '';
                if (scope.prefix != undefined && scope.prefix.length != 0) {
                    if (!scope.ngModel.includes(scope.prefix) && scope.ngModel.length != 0) {
                        scope.ngModel = scope.prefix + scope.ngModel;
                    }
                }
                var isWithinRange = function (value) {
                    return (scope.min ? parseInt(value) >= parseInt(scope.min) : true) && (scope.max ? parseInt(value) <= parseInt(scope.max) : true)
                };
                var numberValidator = function (inputValue) {
                    if (scope.prefix != undefined && scope.prefix.length != 0) {
                        var index = inputValue.indexOf(scope.prefix);
                        if (index == -1) {
                            inputValue = scope.prefix + inputValue;
                        } else {
                            inputValue = scope.prefix + inputValue.slice(index + scope.prefix.length);
                        }
                        inputValue = inputValue.split(' ');
                        if (!(/^\d+$/.test(inputValue[1])) || inputValue[1].length > scope.allowedDigits) {
                            inputValue[1] = inputValue[1].slice(0, -1);
                        }
                        if (!isWithinRange(inputValue[1])) {
                            inputValue[1] = inputValue[1].slice(0, -1);
                        }
                        inputValue = inputValue.join(' ');
                    } else {
                        if (!(/^\d+$/.test(inputValue)) || inputValue.length > scope.allowedDigits) {
                            inputValue = inputValue.slice(0, -1);
                        }
                        if (!isWithinRange(inputValue)) {
                            inputValue = inputValue.slice(0, -1);
                        }
                    }
                    controller.$setViewValue(inputValue);
                    controller.$render();
                    return inputValue;
                };
                controller.$parsers.push(numberValidator);
            }
        }
    }])
    .directive('readMore', [function () {
        return {
            restrict: 'A',
            template: '<div ng-bind-html="visibleParagraphHtml">' +
            '</div>' +
            '<a ng-if="visibleShort" ng-click="toggleLength()">read more...</a>' +
            '<a ng-if="!visibleShort && paraArray.length > 0" ng-click="toggleLength()">show less...</a>',
            scope: {
                paragraphHtml: '=',
                wordsVisible: '=?'
            },
            link: function (scope) {

                if (scope.wordsVisible == undefined || scope.wordsVisible < 0) {
                    scope.wordsVisible = 30;
                }

                if (scope.visibleShort = (scope.paraArray = scope.paragraphHtml.split(' ')).length > scope.wordsVisible) {
                    scope.visibleParagraphHtml = scope.paraArray.splice(0, scope.wordsVisible).join(' ');
                } else {
                    scope.visibleParagraphHtml = scope.paraArray.splice(0, scope.wordsVisible).join(' ');
                }

                scope.toggleLength = function () {
                    if (scope.visibleShort) {
                        scope.paraArray = (scope.visibleParagraphHtml = scope.visibleParagraphHtml + ' ' + scope.paraArray.join(' ')).split(' ');
                        scope.visibleShort = false;
                    } else {
                        scope.visibleParagraphHtml = scope.paraArray.splice(0, scope.wordsVisible).join(' ');
                        scope.visibleShort = true;
                    }
                };
            }
        }
    }])
    .directive('underlineAnchor', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                var adjustAnchorClasses = function () {
                    if (window.location.pathname == attributes.href) {
                        element.addClass('active-state-anchor');
                    } else {
                        element.removeClass('active-state-anchor');
                    }
                }
                $rootScope.$on('$stateChangeSuccess', function () {
                    adjustAnchorClasses();
                });
                adjustAnchorClasses();
            }
        }
    }])
    .directive('waveSpinner', [function () {
        return {
            restrict: 'E',
            template: '<div class="vertical-center-container col-md-12 essential-height" ng-if="keepSpinning">' +
            '   <div class="wave-spinner">' +
            '       <div class="rect1"></div>' +
            '       <div class="rect2"></div>' +
            '       <div class="rect3"></div>' +
            '       <div class="rect4"></div>' +
            '       <div class="rect5"></div>' +
            '   </div>' +
            '</div>' +
            '<div ng-if="!keepSpinning" ng-transclude></div>',
            transclude: true,
            scope: {
                watchModel: '='
            },
            link: function (scope) {
                scope.keepSpinning = true;
                var done = scope.$watchCollection('this.watchModel', function (newVal) {
                    if (newVal) {
                        scope.keepSpinning = false;
                        done();
                    }
                });
                scope.$on('$destroy', function () {
                    done();
                })
            }
        }
    }])
    .directive('cleanInput', [function () {
        return {
            restrict: 'E',
            template: '<div class="form-group vertical-center-container mb-16">' +
            '   <label class="form-labels ml-16" ng-transclude></label>' +
            '   <input title-case disable="disableTitleCase" class="form-control" ng-model="model">' +
            '</div>',
            transclude: true,
            scope: {
                model: '=',
                disableTitleCase: '=?'
            }
        }
    }])
    .directive('cleanImage', [function () {
        return {
            restrict: 'E',
            template: '<div class="px-16">' +
            '   <div class="col-md-12 placeholder">' +
            '       <img class="img-small" src="{{srcMobile}}">' +
            '   </div>' +
            '</div>',
            scope: {
                src: '@',
                srcMobile: '@'
            },
            link: function(scope) {
                var placeholder = document.querySelector('.placeholder'),
                    imageSmall = placeholder.querySelector('.img-small');
                var img = new Image();
                img.src = scope.srcMobile;
                img.onload = function () {
                    imageSmall.classList.add('loaded');
                    if (window.innerWidth >= 768) {
                        var imgLarge = new Image();
                        imgLarge.src = scope.src;
                        imgLarge.onload = function () {
                            imgLarge.classList.add('loaded');
                            imageSmall.classList.remove('loaded');
                        };
                        placeholder.appendChild(imgLarge);
                    }
                };
            }
        }
    }])
    .directive('cleanCoupon', [function () {
        return {
            priority: 3,
            restrict: 'E',
            template: '<div class="form-group vertical-center-container mb-16">' +
            '   <label ng-if="!isValidating" class="form-labels ml-16" ng-transclude></label>' +
            '   <wave-spinner class="ml-16" ng-if="isValidating"></wave-spinner>' +
            '   <input validate-coupon is-validating="isValidating" ng-disabled="isValidating" validating-function="validatingFunction" coupon-length="6" class="form-control" ng-model="enteredCoupon">' +
            '</div>',
            transclude: true,
            scope: {
                model: '=',
                validator: '='
            },
            link: function (scope) {
                scope.isValidating = false;
                scope.validatingFunction = function () {
                    scope.isValidating = true;
                    scope.validator(scope.enteredCoupon, function (isSuccess) {
                        scope.isValidating = false;
                        if (isSuccess) {
                            scope.model = scope.enteredCoupon;
                        } else {
                            scope.enteredCoupon = '';
                        }
                    });
                };
            }
        }
    }])
    .directive('cleanNumber', [function () {
        return {
            restrict: 'E',
            template: '<div class="form-group vertical-center-container mb-16">' +
            '   <label class="form-labels ml-16" ng-transclude></label>' +
            '   <input ng-model="model" validate-number min="min" max="max" prefix="prefix" allowed-digits="allowedDigits" class="form-control">' +
            '</div>',
            transclude: true,
            scope: {
                model: '=',
                prefix: '@?',
                allowedDigits: '=?',
                min: '=?',
                max: '=?'
            }
        }
    }])
    .directive('cleanEmail', [function () {
        return {
            restrict: 'E',
            template: '<div class="form-group vertical-center-container mb-16">' +
            '   <label ng-if="!shouldShowSpinner" class="form-labels ml-16" ng-transclude></label>' +
            '   <input type="email" class="form-control" ng-model="model">' +'</div>',
            transclude: true,
            scope: {
                model: '=',
            }
        }
    }])
    .directive('cleanButton', [function () {
        return {
            restrict: 'E',
            template: '<button class="btn btn-cta" ng-disabled="inactive || disabled" ng-click="click()">' +
            '   <wave-spinner ng-if="inactive"></wave-spinner>' +
            '   <div ng-if="!inactive" ng-transclude></div>' +
            '</button>',
            transclude: true,
            scope: {
                trigger: '&',
                watchExpression: '@'
            },
            link: function (scope) {
                scope.inactive = false;
                scope.click = function () {
                    scope.inactive = true;
                    this.trigger();
                };
                if (scope.watchExpression == '') {
                    scope.disabled = true;
                    var done = scope.$watchCollection('this.watchExpression', function (newVal) {
                        scope.disabled = newVal === "";
                    });
                    scope.$on('$destroy', function () {
                        done();
                    })
                }
            }
        }
    }])
    .directive('cleanLink', [function () {
        return {
            restrict: 'E',
            template: '<div class="feature-heading mb-16 text-center" ng-disabled="inactive || disabled" ng-click="click()">' +
            '   <wave-spinner ng-if="inactive"></wave-spinner>' +
            '   <div ng-if="!inactive" ng-transclude></div>' +
            '</div>',
            transclude: true,
            scope: {
                trigger: '&',
                watchExpression: '@'
            },
            link: function (scope) {
                scope.inactive = false;
                scope.click = function () {
                    scope.inactive = true;
                    this.trigger();
                };
                if (scope.watchExpression == '') {
                    scope.disabled = true;
                    var done = scope.$watchCollection('this.watchExpression', function (newVal) {
                        if (newVal) {
                            scope.disabled = false;
                            done();
                        }
                    });
                    scope.$on('$destroy', function () {
                        done();
                    })
                }
            }
        }
    }])
    .directive('cleanFeature', [function () {
        return {
            restrict: 'E',
            template: '<div>' +
            '   <h4 class="px-16" ng-if="detail.icon">' +
            '        <i class="keeper {{detail.icon}}"></i>' +
            '   </h4>' +
            '   <h4 class="feature-heading px-16" ng-if="detail.name">{{detail.name | uppercase}}</h4>' +
            '   <div read-more words-visible="wordsVisible" class="feature-description px-16" ng-if="detail.description" paragraph-html="detail.description"></div>' +
            '</div>',
            scope: {
                detail: '=',
                wordsVisible: '=?'
            }
        }
    }])
    .directive('cleanService', [function () {
        return {
            restrict: 'E',
            template: '<div class="white-smoke-background aqua-bottom-border p-16 mb-16 pointer-cursor" ng-click="select()">' +
            '   <div class="feature-heading">{{detail.name | uppercase}}</div>' +
            '   <div class="feature-description">{{detail.description}}</div>' +
            '</div>',
            scope: {
                detail: '=',
                select: '&'
            }
        }
    }])
    .directive('cleanAddress', [function () {
        return {
            restrict: 'E',
            template: '<div class="white-smoke-background aqua-bottom-border p-16 mb-16 pointer-cursor" ng-click="select()">' +
            '   <div class="container-fluid">' +
            '       <div class="feature-heading col-md-8">{{detail.name | uppercase}}</div>' +
            '       <div class="fa fa-plus col-md-4 text-right" ng-click="edit(); $event.stopPropagation()"></div>' +
            '   </div>' +
            '   <div class="feature-description">{{detail.description}}</div>' +
            '</div>',
            scope: {
                detail: '=',
                select: '&',
                edit: '&'
            }
        }
    }])
    .directive('cleanBooking', [function () {
        return {
            restrict: 'E',
            template: '<div class="white-smoke-background aqua-bottom-border p-16">' +
            '   <div class="feature-description">{{order.service_eta_slot}}</div>' +
            '   <div class="col-md-12">' +
            '       <div class="col-md-8 feature-heading">Order ID: {{order.obfuscated_order_id}}</div>' +
            '       <div class="col-md-4 feature-heading text-right" ng-if="order.order_status == 6 || order.order_status == 4">AED {{order.total_amount}}</div>' +
            '   </div>' +
            '   <div class="feature-description">{{order.service_id}}</div>' +
            '   <div class="feature-description" ng-if="order.coupon_code"><b>Promo code {{order.coupon_code}} applied</b></div>' +
            '   <div class="text-left mt-16" ng-if="order.order_status < 4">' +
            '   <timeline>' +
            '       <timeline-event ng-repeat="event in order.timeline_events" side="right">' +
            '       <timeline-badge class="{{event.badgeClass}}">' +
            '           <i class="glyphicon {{event.badgeIconClass}}"></i>' +
            '       </timeline-badge>' +
            '       <timeline-panel class="{{event.badgeClass}}">' +
            '           <p>{{event.content}} <span class="bill-amount" ng-show="event.type == \'service_completed\'">AED {{order.total_amount}}</span></p>' +
            '           <div>{{event.eventDateTime}}</div>' +
            '       </timeline-panel>' +
            '       </timeline-event>' +
            '   </timeline>' +
            '   </div>' +
            '   <div class="mb-0" ng-if="order.order_status == 5">Cancelled</div>' +
            '</div>',
            scope: {
                order: '='
            }
        }
    }])
    .directive('cleanSuggest', [function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="form-group vertical-center-container mb-16">' +
            '   <label class="form-labels ml-16" ng-transclude></label>' +
            '   <md-autocomplete' +
            '       md-no-cache="true"' +
            '       md-selected-item="selectedItem"' +
            '       md-search-text="searchText"' +
            '       md-items="item in searchFunction(searchText)"' +
            '       md-item-text="item[this.title]"' +
            '       md-min-length="0"' +
            '       md-dropdown-position="bottom"' +
            '       md-clear-button="false">' +
            '       <md-item-template>' +
            '           <span md-highlight-text="searchText">{{item[this.title]}}</span>' +
            '       </md-item-template>' +
            '       <md-not-found ng-if="notFoundHandle">' +
            '           Not found.' +
            '       </md-not-found>' +
            '   </md-autocomplete>' +
            '</div>',
            scope: {
                searchFunction: '=',
                selectedItem: '=',
                notFoundHandle: '&?',
                title: '@'
            }
        }
    }])
    .directive('cleanScheduler', ['HelperService', 'hgScrollEvent', function (HelperService, hgScrollEvent) {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="col-md-12 mb-16 clean-scheduler">' +
            '   <div class="row ml-0 col-md-6 pr-8">' +
            '       <slick class="white-smoke-background aqua-bottom-border p-16" settings="slickConfig">' +
            '           <div ng-repeat="days in slots" class="text-center">' +
            '               <div class="day-of-week feature-heading">{{days.dayOfWeek | uppercase}}</div>' +
            '               <div class="day-of-month">{{days.dayOfMonth}}</div>' +
            '               <div class="month-and-year">{{days.monthAndYear}}</div>' +
            '           </div>' +
            '       </slick>' +
            '       <button type="button" class="slick-right">' +
            '           <span class="fa fa-angle-right"></span>' +
            '       </button>' +
            '       <button type="button" class="slick-left">' +
            '           <span class="fa fa-angle-left"></span>' +
            '       </button>' +
            '   </div>' +
            '   <div class="row mx-0 col-md-6 pr-0 pl-8 slot-list">' +
            '       <ul class="list-group my-0">' +
            '           <li class="list-group-item my-0" ng-class="{\'selected-slot\': slot.service_eta == selectedSlot.service_eta, \'disabled-slot\': !slot.status, \'enabled-slot\': slot.status}" ng-repeat="slot in currentDaySlots" ng-click="selectSlot(slot)">' +
            '               {{slot.label}}' +
            '           </li>' +
            '       </ul>' +
            '   </div>' +
            '</div>',
            scope: {
                slots: '=',
                selectedSlot: '='
            },
            link: function (scope, element) {
                var slotList = element.find('.slot-list');
                var elementHeight = 54;
                scope.slickConfig = {
                    prevArrow: ".slick-left",
                    nextArrow: ".slick-right",
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    event: {
                        afterChange: function (event, slick, currentSlide) {
                            scope.currentDaySlots = scope.slots[currentSlide].slots;
                        },
                        init: function () {
                            scope.currentDaySlots = scope.slots[0].slots;
                        }
                    }
                };
                scope.selectSlot = function (slot) {
                    scope.selectedSlot = slot.status ? slot : undefined;
                    if (!scope.selectedSlot) {
                        HelperService.showToastNotification('error', 'This slot is fully booked', 'top');
                    }
                };
                hgScrollEvent.scrollstop(slotList, function (event) {
                    slotList.animate({
                        scrollTop: Math.round(event.endY / elementHeight) * elementHeight
                    }, 100, 'swing', function () {});
                });
            }
        }
    }]);
