/**
 * @desc javascript by seung
 */
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		global.numeral = factory();
	}
}(this, function () {
	
	var seung = {
		version: '2019.05.01'
	}
	
	seung = (function(sjs) {
		
		sjs = sjs || {};
		
		var fn = {
			uuid      : uuid,
			guid      : guid,
			endsWith  : endsWith,
			ajax      : ajax,
			ajaxHTML  : ajaxHTML,
			ajaxJSON  : ajaxJSON,
			ajaxSubmit: ajaxSubmit
		};
		
		function uuidRandom() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		
		function uuid(pre, suf) {
			return (pre || '') + uuidRandom() + uuidRandom() + '-' + uuidRandom() + '-' + uuidRandom() + '-' + uuidRandom() + '-' + uuidRandom() + uuidRandom() + uuidRandom() + (suf || '');
		}
		
		function guidRandom() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		
		function guid(pre, suf) {
			return (pre || '') + (guidRandom() + guidRandom() + "-" + guidRandom() + "-4" + guidRandom().substr(0,3) + "-" + guidRandom() + "-" + guidRandom() + guidRandom() + guidRandom()).toLowerCase() + (suf || '');
		}
		
		function endsWith(full, end) {
			if(full.length < end.length) return false;
			return full.lastIndexOf(end) + end.length == full.length;
		}
		
		function jQueryLoaded() {
			return !(!window.jQuery);
		}
		
		function ajax(options) {
			if(jQueryLoaded())
				return $.ajax({
					async      : options.async || false,
					cache      : options.cache || false,
					timeout    : options.timeout || 0,
					url        : options.url,
					type       : options.async || 'GET',
					headers    : options.headers || {},
					contentType: options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
					beforeSend : options.beforeSend || function() {},
					success: function(data, textStatus, jqXHR) {
						if(options.log)     console.log(data);
						if(options.log)     console.log(textStatus);
						if(options.log)     console.log(jqXHR);
						if(options.success) options.success(data);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						if(options.log)   console.log(jqXHR);
						if(options.log)   console.log(textStatus);
						if(options.log)   console.log(errorThrown);
						if(options.error) options.error(jqXHR);
					},
					complete: function(jqXHR, textStatus) {
						if(options.log) console.log(jqXHR);
						if(options.log) console.log(textStatus);
						if(options.log) options.success(jqXHR);
					}
				})
				.done(function(data , textStatus, jqXHR) {})
				.fail(function(jqXHR, textStatus, errorThrown) {})
				/*
				 * args[0] = data or jqXHR
				 * args[1] = textStatus
				 * args[2] = jqXHR or errorThrown
				 */
				.always(function(args) {})
				;
			else
				return {
					done  : function() { console.log('jQuery not loaded.') },
					fail  : function() { console.log('jQuery not loaded.') },
					always: function() { console.log('jQuery not loaded.') }
				}
				;
		}

		function ajaxJSON(option) {
			var json;
			$.ajax({
				async: option.async || false
				, type: option.async || 'GET'
				, url: option.url
				, contentType: 'application/json'
				, success: function(data) {
					json = data;
				}
				, error: function(error) {
					console.log(error);
				}
			});
			return json;
		}
	
		function ajaxHTML(option) {
			var html;
			$.ajax({
				async: option.async || false
				, type: option.async || 'GET'
				, url: option.url
				, contentType: 'text/plain'
				, success: function(data) {
					html = data;
				}
				, error: function(error) {
					console.log(error);
				}
			});
			return html;
		}
		
		function ajaxSubmit(form, event) {
		
			if(event) {
				if(event.keyCode != 13) return false;
				event.preventDefault();
			}
			
			var frm = $(form);
			var data = {}
				, child
				;
			$.each(frm.serializeArray(), function() {
				child = frm.find("[name='" + this.name + "']");
				if(child.attr('data-type') == 'hash') {
					if(!frm.find("[name='" + this.name + "Hash']").length)
						frm.append(
							$('<input/>',{type:'hidden',name:this.name + 'Hash'}).val(CryptoJS.SHA256(this.value).toString())
						);
					child.val('');
				}
			});
			
			$.ajax({
				type: frm.attr('method')
				, url: frm.attr('action')
				, data: frm.serializeArray()
				, success: function(res) {
					if(res.url) {
						location.href = res.url;
					} else {
						alert(res.message);
					}
				}
				, error: function(res) {
					console.log(res);
				}
			});
		}
		
		sjs = fn;
		
		return sjs;
		
	})(seung || {})
	;
	
	seung = (function(sjs) {
		
		sjs.timer = {
			version: '18.07.24'
			/**
			 * author		  : seung
			 * param		   : options(object)
			 * options.log	 : true, false
			 * options.name	: timer id
			 * options.sleep   : 1000 = 1sec
			 * options.maxTimes: max times
			 * options.job	 : to do function
			 * return timer
			 */
			, create: create
		};
		
		var defaultsTimer = (function() {
			return {
				log	   : false
				, name	: sjs.uuid()
				, sleep   : 1000
				, maxTimes: 0
				, runTime : 0
				, job	 : function() { console.log(new Date()); }
			};
		})();
		
		function create(options) {
			
			options = options || {};
			var _timer = sjs.extend(defaultsTimer, options);
			
			_timer.job = function() {
				if(options.job) {
					options.job();
				} else {
					console.log(new Date());
				}
				_timer.runTimes++;
				if(_timer.log) {
					console.log(_timer.runTimes);
				}
				if(_timer.maxTimes == _timer.runTimes) {
					if(_timer.log) {
						console.log('timer end.')
					}
					return clearTimeout(_timer.timer);
				}
				_timer.timer = setTimeout(_timer.job, _timer.sleep);
			}
			_timer.run = function() {
				_timer.runTimes = 0;
				_timer.job();
				return _timer;
			};
			_timer.stop = function() {
				clearTimeout(_timer.timer);
				return _timer;
			};
			return this[_timer.name] = _timer;
		}
		
		return sjs;
		
	})(seung || {})
	;
	
	seung = (function(sjs) {
		
		sjs.w2ui = {
			init	: init,
			_top	: 'top',
			_right  : 'right',
			_bottom : 'bottom',
			_left   : 'left',
			_main   : 'main',
			_txt_c  : 'text-align:center;',
			_txt_l  : 'text-align:left;padding-left:10px;',
			_txt_r  : 'text-align:right;padding-right:10px;',
			_wrapper: '-wrapper',
			_sidebar: '-sidebar',
			events  : {},
			views   : {}
		};
		
		var locale = {};
		locale.kr = {
			'locale': 'ko-KR',
			'dateFormat': 'yyyy-mm-dd',
			'timeFormat': 'h24',
			'currency': '^[\\$]?[-+]?[0-9]*[\\.]?[0-9]+$',
			'currencyPrefix': '',
			'currencySuffix': '원',
			'groupSymbol': ',',
			'float'	: '^[-]?[0-9]*[\\.]?[0-9]+$',
			'shortmonths': ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			'fullmonths': ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			'shortdays': ['월', '화', '수', '목', '금', '토','일'],
			'fulldays': ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일','일요일'],
			'phrases': {
				'Add new record': '레코드 추가',
				'Add New': '추가',
				'All Fields': '모든 필드',
				'Are you sure you want to delete selected records?': '선택한 레코드를 삭제하시겠습니까?',
				'Attach files by dragging and dropping or Click to Select': '파일을 드래그 하세요, 또는 클릭하세요.',
				'begins with': '~로 시작',
				'between': '~ 사이',
				'Confirmation': '확인',
				'contains': '~를 포함',
				'Delete Confirmation': '삭제!',
				'Delete selected records': '선택한 레코드 삭제',
				'Delete': '삭제',
				'ends with': '~로 끝남',
				'Hide': '숨기기',
				'is': '는(은)',
				'Multi Fields': '다중 필드',
				'No items found': '아이템을 찾지 못하였습니다.',
				'No': '아니오',
				'none': '없음',
				'Not a float': '실수(float)가 아닙니다.',
				'Not a hex number': '16진수가 아닙니다.',
				'Not a valid date': '정확한 날짜 형식이 아닙니다.',
				'Not a valid email': '이메일 형식이 아닙니다.',
				'Not alpha-numeric': 'alpha-numeric 문자열이 아닙니다.',
				'Not an integer': '정수(int)가 아닙니다.',
				'Not in money format': '원화 표시가 아닙니다.',
				'Notification': '알림',
				'Ok': '확인',
				'Open Search Fields': '검색 할 필드 열기',
				'Refreshing...': '새로고침중...',
				'Reload data in the list': '새로고침',
				'Remove': '삭제',
				'Required field': '필수 입력',
				'Reset': '재설정',
				'Return data is not in JSON format. See console for more information.': '리턴된 데이타는 JSON 형식이 아닙니다. 자세한 사항은 콘솔을 확인하세요.',
				'Save changed records': '변경된 레코드 저장',
				'Save': '저장',
				'Saving...': '저장중...',
				'Search': '검색',
				'Search...': '검색중...',
				'Select Search Field': '검색 할 필드를 선택하세요.',
				'Show': '보이기',
				'Show/hide columns': '컬럼 보이기/숨기기',
				'Yes': '예',
				'Yesterday': '어제',
				'Save Grid State': '표 저장',
				'Restore Default State': '표 기본으로'
			}
		};
		
		function init(options) {
	
			//set default values
			options = configOptions(options);
	
			//create element
			appendElement(options);
	
			//layout
			w2utils.locale(locale.kr);
			$(options.layout.id).w2layout(options.layout);
			w2ui[options.layout.name].content(seung.w2ui._left, $().w2sidebar(options.sidebar));
			w2ui[options.layout.name].content(seung.w2ui._main, 'MAIN PAGE');
	
		}//end of init
		
		function configOptions(options) {

			options = options || {};
			options.width = options.width || '100%';
			options.height = options.height || '100%';

			if(!options.layout.name) {
				options.layout.name = sjs.uuid();
			}
			options.layout.id = '#' + options.layout.name;
			if(!options.layout.padding) {
				options.layout.padding = 5;
			}
			if(!options.layout.panels) {
				options.layout.panels = [{type:'main',overflow: 'hidden'}];
			}

			if(options.toolbar) {
				options.toolbar.id = '#' + options.toolbar.name;
			}

			return options;
		}
		
		function appendElement(options) {

			if(options.toolbar) {
				var toolbar = $('<div/>', {id: options.toolbar.name, style: options.toolbar.style || ''}).addClass(options.toolbar.theme || '');
				$('body').append(toolbar);
				$(options.toolbar.id).w2toolbar(options.toolbar.content);
			}

			var layout = $('<div/>', {id: options.layout.name, style: options.layout.style || ''});
			layout.width(options.width || '100%');
			layout.height(!options.height || options.height == '100%' ? $(window).height() - (options.toolbar ? 40 : 0) : options.height);
			$('body').append(layout);

			if(options.resize) {
				$(window).resize(function() {
					layout.width(options.width || '100%');
					layout.height(!options.height || options.height == '100%' ? $(window).height() - (options.toolbar ? 40 : 0) : options.height);
				});
			}
		}
		
		return sjs;
		
	})(seung || {});
	
	return seung;
	
}));
