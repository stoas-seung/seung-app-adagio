var seung = (function(sjs) {

    sjs.w2ui = {
        init    : init,
        _top    : 'top',
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
        'float'    : '^[-]?[0-9]*[\\.]?[0-9]+$',
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
        options = validOption(options);

        //create element
        appendElement(options);

        //resizable
        setResize(options);

        //layout
        w2utils.locale(locale.kr);
        $(options.layout.id).w2layout(options.layout);
        w2ui[options.layout.name].content(seung.w2ui._left, $().w2sidebar(options.sidebar));
        w2ui[options.layout.name].content(seung.w2ui._main, 'MAIN PAGE');

    }//end of init
    
    function validOption(options) {
        options = options || {};
        options.width = options.width || '100%';
        options.height = options.height || '100%';
        options.layout = options.layout || {
            name: 'layout',
            padding: 0,
            panels: [
                {
                    type: 'left',
                    size: 200,
                    resizable: true,
                    mainSize: 120
                },
                {
                    type: 'main',
                    minSize: 550,
                    overflow: 'hidden'
                }
            ]
		};
		if(options.layout.name) options.layout.id = '#' + options.layout.name;
        if(options.contents && options.contents.length > 0) {
            options.sidebar = options.sidebar || {
                name: 'sidebar'
                , img: null
                , nodes: []
                , onClick: function(event) {
                    if(seung.ui.events[event.target]) seung.ui.events[event.target](option.name);
                    //if(w2ui[event.target]) w2ui[option.name].content('main', w2ui[event.target]);
                }
            };
            $.each(options.contents, function(contentNo, content) {
                options.sidebar.nodes.push(content.views);
                $.each(content.views.nodes, function(nodeNo, node) {
                    seung.ui.events[node.id] = content[node.id].html;
                });
            });
        } else {
            options.sidebar = options.sidebar || {
                name: 'sidebar'
                , img: null
                , nodes: [
                    {
                        id: 'm0000'
                        , text: 'MENUS'
                        , img: 'icon-folder'
                        , expanded: true
                        , group: true
                        , nodes: [
                            {
                                id: 'm0100'
                                , text: 'menu here'
                                , icon: 'icon-page'
                            }
                        ]
                    }
                ]
                , onClick: function(event) {
                    w2ui.layout.content('main', 'CONTENS');
                }
            };
        }
        return options;
    }

    function appendElement(option) {
        var el = $('<div/>', {id: option.name});
        el.width(option.width || '100%');
        el.height(!option.height || option.height == '100%' ? $(window).height() : options.height);
        if(!$(option.id).length) {
            $('body').append(el.prop('outerHTML'));
        }
    }
    
    function setResize(option) {
        var el = $(option.id);
        if(option.resize) {
            $(window).resize(function() {
                el.width(option.width);
                el.height(!option.height || option.height == '100%' ? $(window).height() : options.height);
            });
        }
    }
    
    return sjs;
    
})(seung || {});
